# paper2ppt Skill 改进建议

基于实际使用经验（处理 Redox Biology 2026 PDF + PMC Figure URL），以下是针对PDF格式论文和作者提供图片场景的改进方案。

---

## 改进1：新增 Phase 0 — 接受本地PDF文件

**问题：** 当前skill只接受DOI、URL、PMID等在线标识符。用户有本地PDF时无法直接处理，需要先绕过识别流程。

**建议：** 在Phase 1之前新增检测逻辑：

```markdown
## Phase 0: Detect Input Type

### 0.1 Local PDF file path
If the user provides a local file path ending in `.pdf`:
1. **Validate the file** — check it exists and has non-zero size:
   ```bash
   [ -s "/path/to/paper.pdf" ] || { echo "File not found or empty"; exit 1; }
   ```
2. **Extract DOI from PDF metadata** (PDFs often embed DOI in XMP metadata):
   ```python
   import fitz
   doc = fitz.open(pdf_path)
   metadata = doc.metadata  # may contain 'doi' key
   ```
   If PDF metadata has no DOI, extract the first page text and grep for `10.`:
   ```python
   import re
   text = doc[0].get_text()
   doi_match = re.search(r'10\.\d{4,}/[^\s]+', text)
   doi = doi_match.group(0).rstrip('.')
   ```
3. **Fallback:** If no DOI found, search by title from PDF:
   ```python
   title = doc[0].get_text().split('\n')[0].strip()  # First line = title
   ```
   Then use CrossRef search with this title.

See Phase XX for how to extract figures and tables from the local PDF.
```

**优先级:** 高 — 这是最常见的用户需求。

---

## 改进2：新增 Phase 4.5 — 从PDF提取图片（替代4.2.6弱fallback）

**问题：** 当前4.2.6 PDF fallback 极弱——只尝试下载PDF，失败就完全跳过插图。没有真正的PDF图片提取逻辑。

**建议：** 新增完整的PDF图片提取流程：

```markdown
### 4.5 Extract figures from PDF (using PyMuPDF)

When a PDF is available (downloaded or user-provided), extract embedded images:

#### 4.5.1 Open PDF and extract embedded images

```bash
pip install pymupdf  # Required dependency
```

```python
import fitz, os

doc = fitz.open("paper.pdf")
os.makedirs("figures", exist_ok=True)

fig_count = 0
for page_num in range(doc.page_count):
    page = doc[page_num]
    images = page.get_images(full=True)
    for img_idx, img in enumerate(images):
        xref = img[0]
        base_image = doc.extract_image(xref)
        image_bytes = base_image["image"]
        ext = base_image["ext"]
        width, height = base_image["width"], base_image["height"]

        # Filter out tiny images (icons, logos, buttons)
        if width < 150 or height < 150:
            continue

        # Filter out very small file sizes (icons, spacers)
        if len(image_bytes) < 5000:
            continue

        fname = f"fig_p{page_num+1}_{img_idx+1}.{ext}"
        fpath = os.path.join("figures", fname)
        with open(fpath, "wb") as f:
            f.write(image_bytes)
        fig_count += 1
        print(f"Extracted: {fname} ({width}x{height}, {len(image_bytes)} bytes)")

print(f"Total figures extracted: {fig_count}")
```

#### 4.5.2 Figure validation and filtering

```bash
# Remove corrupt files
for f in figures/*; do
    file "$f" | grep -qE 'image|PNG|JPEG|GIF' || { echo "CORRUPT: $f"; rm "$f"; }
done
```

**Safety Limit:** Maximum 8 figures. If more candidates exist, keep the largest 8 by file size (largest = most likely to be actual figures).

Edge cases to handle:
- Some journals embed figures as multiple overlapping images — in this case, keep all.
- PDFs with vector graphics (no embedded pixel images) — skip extraction, use text-only.
- Some PDFs embed figures as JBIG2 format — PyMuPDF handles this, but verify output opens in standard viewers.
- **Chinese PDFs:** Some Chinese journal PDFs embed images at very low resolution — note this in the caption if quality is poor.

#### 4.5.3 Match figures to captions

Extract figure captions from PDF text to label the extracted images:

```python
for page_num in range(doc.page_count):
    text = doc[page_num].get_text()
    captions = re.findall(r'(Fig(?:ure)?\s*\d+[^.]*\.)', text, re.IGNORECASE)
    for c in captions:
        print(f"Page {page_num+1}: {c}")
```

Use the page number to match extracted images to their captions (Image on page 5 → caption on page 5).
```

**优先级:** 高 — 绝大多数重要数据在PDF中，不是HTML。

---

## 改进3：升级 Phase 4.3 — 从PDF中提取表格

**问题：** 当前4.3的Strategy C ("render the relevant page and crop the table region as an image") 太模糊，没有具体操作步骤。而且缺少结构化表格提取。

**建议：** 将4.3拆分为三个具体层级：

```markdown
### 4.3 Extract tables from PDF

Try in order of quality. Stop when a satisfactory result is obtained.

#### Strategy A: Reconstruct table as pptxgenjs addTable() from text (BEST)

If the PDF text is extractable, parse the table data manually and build it as a formatted table:

```python
import fitz, re

doc = fitz.open("paper.pdf")
# Find pages containing "Table 1", "Table 2" etc.
for i in range(doc.page_count):
    text = doc[i].get_text()
    if "Table 1" in text:
        # Print the page text around the table for manual parsing
        print(f"=== Table 1 found on page {i+1} ===")
        print(text)
```

Then in the pptxgenjs script, use addTable() with proper formatting:

```javascript
// Template for table data
var rows = [
  [{ text: "Header 1", options: { bold: true, color: "FFFFFF", fill: { color: "1F4E79" }, fontSize: 11 } },
   { text: "Header 2", options: { bold: true, color: "FFFFFF", fill: { color: "1F4E79" }, fontSize: 11 } }],
  [{ text: "Row 1 Col 1", options: { fontSize: 11 } },
   { text: "Row 1 Col 2", options: { fontSize: 11, align: "center" } }],
];
slide.addTable(rows, {
  x: 0.3, y: 0.85, w: 9.4,
  colW: [3.0, 2.0],  // Adjust per table
  border: { type: "solid", pt: 0.5, color: "CCCCCC" },
  rowH: 0.3,
  autoPage: false,
});
```

**Pros:** Searchable text, scalable, can be edited. **Cons:** Manual data entry for each table cell.

#### Strategy B: Render table as image from PDF page crop

If the table has complex formatting (merged cells, exotic fonts), render it as an image:

```python
import fitz

doc = fitz.open("paper.pdf")
page = doc[page_number]  # Page containing the table
# Define crop region that tightly bounds the table
# Coordinates (x1, y1, x2, y2) in PDF points (72 dpi)
clip = fitz.Rect(40, 100, 560, 500)  # Adjust per table
mat = fitz.Matrix(3.0, 3.0)  # 3x zoom for ~220 dpi
pix = page.get_pixmap(matrix=mat, clip=clip)
pix.save("figures/table1.png")
```

Then embed in PPT as an image:
```javascript
slide.addImage({
  path: "figures/table1.png",
  x: 0.5, y: 1.2, w: 9.0, h: 3.8,
  sizing: { type: "contain", w: 9.0, h: 3.8 },
});
```

**Pros:** Preserves exact formatting. **Cons:** Not searchable, fixed resolution.

#### Strategy C: pdfplumber for structured table extraction (when available)

For clean PDFs (especially from Nature/Elsevier templates), try automated extraction:

```bash
pip install pdfplumber
```

```python
import pdfplumber

with pdfplumber.open("paper.pdf") as pdf:
    for i, page in enumerate(pdf.pages):
        tables = page.extract_tables()
        for j, table in enumerate(tables):
            print(f"=== Table {j+1} on page {i+1} ===")
            for row in table:
                print(row)
```

**Important:** Always QA the extracted table data against the original PDF. pdfplumber can misinterpret merged cells and multi-line entries.

#### Decision logic

| PDF Quality | Recommended Strategy |
|-------------|---------------------|
| Clean, searchable text | Strategy A (addTable) |
| Complex formatting | Strategy B (image crop) |
| Very large tables (>20 rows) | Strategy B (show simplified version or screenshot of key rows) |
| Scanned/image-based PDF | Strategy B (but may need OCR first) |

**Limit:** Maximum 2 tables per PPT. If more exist, show only the most important (usually Table 1).
```

**优先级:** 高 — 表格展示是文献汇报的核心需求。

---

## 改进4：新增 Phase 4.6 — 处理作者提供的补充图片URL

**问题：** 用户可能提供期刊网站上 supplementary figure / unedited blot 的链接（如 `pmc.ncbi.nlm.nih.gov/articles/PMCxxxxxx/figure/undfig1/`），但当前skill没有专门处理这种情况的路径。

**建议：** 新增专门处理补充图片的模块：

```markdown
### 4.6 Handle user-provided figure URLs / supplementary figure links

Sometimes the user provides supplementary figure URLs after the initial PPT generation.
These often point to:

- PMC figure viewers: `https://pmc.ncbi.nlm.nih.gov/articles/PMCxxxxxx/figure/undfig1/`
- Journal supplementary data pages
- Raw data repositories (Figshare, Zenodo)

#### 4.6.1 Detect supplement figure URLs

Look for these patterns in user input:
- `*/figure/*` — PMC figure viewer
- `*/supplementary/*` — Supplementary data
- `figshare.com/*` — Figshare repository
- `zenodo.org/*` — Zenodo repository

#### 4.6.2 Try multiple methods to access the figure

```bash
# Method 1: Direct download (may be blocked)
curl -s -L -o "supplement.html" "https://pmc.ncbi.nlm.nih.gov/articles/PMCxxxxxx/figure/undfig1/"

# Method 2: Check for redirect to full-resolution image
# Many PMC figure pages redirect to a direct image URL
curl -s -L -o /dev/null -w "%{url_effective}" "https://pmc.ncbi.nlm.nih.gov/articles/PMCxxxxxx/figure/undfig1/" 2>/dev/null

# Method 3: WebFetch to extract image URL from the page
# (Use the WebFetch tool with the figure URL)
```

#### 4.6.3 If PMC blocked (common in China)

Since NCBI sites are often inaccessible from mainland China:

1. Inform the user: "The figure URL appears to be hosted on a site that is not accessible from your network."
2. Suggest alternatives:
   - Load the URL in their browser and save the image locally, then provide the local file path
   - Or skip the supplementary figure and note in the PPT: "Supplementary Figure X is not included"
3. If the figure URL links to a known open-access journal, try fetching via a mirror or alternative domain.

#### 4.6.4 Integrate into existing PPT

When a new figure is successfully obtained through a user-provided URL:

1. Download the image to `figures/` folder
2. Validate the image file
3. Either:
   - Insert a new slide into the PPT (requires regenerating with updated TOTAL and slide numbers)
   - OR note in the output that "Figure X has been saved to figures/filename.ext — insert manually into slide N"
```

**优先级:** 中 — 虽然不常见，但作为鲁棒性要求值得添加。

---

## 改进5：新增 "Hybrid Mode" — 在线元数据 + 本地PDF内容

**问题：** 当前skill的两个路径是割裂的（在线获取元数据和图片 vs. PDF提取）。用户同时拥有DOI/URL和本地PDF时，应该优先结合使用。

**建议：** 新增Hybrid模式流程：

```markdown
## Phase 4.7: Hybrid mode — Combine online metadata with local PDF content

When BOTH an online identifier (DOI/PMID) AND a local PDF are available:

### Workflow

1. **Use online identifier** for:
   - CrossRef metadata (title, authors, journal, date, accurate citation info)
   - IF/JCR lookup (journal-level information)
   
2. **Use local PDF** for:
   - Full text extraction (not subject to paywall restrictions)
   - Embedded figure extraction (more reliable than HTML scraping)
   - Table extraction (can use addTable() reconstruction)
   - Figure caption matching (extract from PDF text)

3. **Cross-validate** the PDF title with CrossRef title to ensure they match

### Implementation

```python
# Step 1: Extract DOI from PDF
doc = fitz.open(local_pdf_path)
page0_text = doc[0].get_text()
doi_from_pdf = re.search(r'10\.\d{4,}/[^\s]+', page0_text)

# Step 2: Verify against provided DOI / fetched CrossRef DOI
if doi_from_pdf and provided_doi:
    if doi_from_pdf.group(0) == provided_doi:
        print("DOI match confirmed — proceeding with hybrid mode")
    else:
        print("WARNING: DOI mismatch between PDF and provided identifier")
        # Ask user which one is correct
```

### Priority

Online metadata > Local PDF text (for metadata)
Local PDF images > Online HTML figures (for figure extraction)
```

**优先级:** 中 — 在用户同时有DOI和PDF时非常有价值。

---

## 改进6：Slide 结构调整 — 表格应有独立Slide的设计规范

**问题：** 当前5.1 Slide Structure中表格没有明确的位置，Results section只说"each major finding gets its own results slide."

**建议：** 在5.1中新增表格slide规范：

```markdown
### 5.1 Slide Structure (Flexible)

| Priority | Section | Required | Slides | Notes |
|----------|---------|----------|--------|-------|
| ... | ... | ... | ... | ... |
| 5.5 | **Table Slide** | Optional | 1 | Only if paper has critical data tables |
| ... | ... | ... | ... | ... |

#### Table Slides

When a paper contains important data tables (e.g., baseline characteristics, regression results):

- Dedicate a **separate slide** to each major table
- Place the table slide immediately after the results slide that references it
- Use `addTable()` for formatted tables (navy header, alternating rows)
- If the table is too large (>15 rows), show a simplified version with the most important variables
- If the table has complex formatting, use the image-crop method (Strategy B in 4.3)
- Always include the table number and a brief action-title summary above the table
- Add a source note below the table: "Table X from (Author, Year)"
```

**优先级:** 低 — 完善现有规范而非新增功能。

---

## 改进7：更新依赖

**问题：** 当前依赖中 `pymupdf` 标注为 "(optional)"，但对于PDF工作流是核心依赖。

**建议：**

```markdown
## Dependencies

```bash
npm install -g pptxgenjs                        # PPT generation
pip install "markitdown[pptx]"                  # Content QA
pip install pymupdf                              # PDF text + figure extraction (REQUIRED for PDF workflow)
pip install pdfplumber                           # Structured table extraction from PDF (optional)
```

Additionally, verify PyMuPDF works correctly for image extraction before running the generation script:

```bash
python3 -c "
import fitz
doc = fitz.open('paper.pdf')
img = doc[0].get_images(full=True)
print(f'PDF loaded: {doc.page_count} pages, {len(img)} embedded images')
"
```
```

**优先级:** 中 — 确保PDF工作流的可重复性。

---

## 改进8：新增 Error Recovery 条目

**问题：** 当前 Error Recovery Summary 表缺少PDF相关错误。

**建议：**

| Failure | Recovery |
|---------|----------|
| PDF file not found | Ask user for correct path; try to find via DOI |
| PDF has no embedded images | Skip figures, use text-only layout |
| PDF image extraction yields only icons | Filter by size >150px; if none remain, use text-only |
| Table text parsing fails | Use image-crop method instead |
| PDF metadata has no DOI | Extract title from first page → CrossRef search |
| Supplementary figure URL blocked | Inform user; suggest browser download or skip |
| PyMuPDF not installed | `pip install pymupdf` and retry |

```

--- 

## 总结

| 改进 | 优先级 | 工作量 | 影响 |
|------|--------|--------|------|
| 1: 接受本地PDF (Phase 0) | 高 | 小 | 覆盖最常见用户场景 |
| 2: PDF图片提取 (4.5) | 高 | 中 | 解决"无图"痛点 |
| 3: PDF表格提取 (4.3升级) | 高 | 中 | 解决"无表"痛点 |
| 4: 补充URL图片 (4.6) | 中 | 小 | 提高鲁棒性 |
| 5: Hybrid模式 (4.7) | 中 | 小 | 提高准确性 |
| 6: Slide规范补充 | 低 | 小 | 完善文档 |
| 7: 依赖更新 | 中 | 小 | 确保可重复性 |
| 8: Error Recovery扩展 | 低 | 小 | 完善文档 |

**建议立即实施：** 改进1、2、3（覆盖核心PDF工作流）
**建议后续实施：** 改进4、5、7（增强鲁棒性和准确性）
**文档性改进：** 改进6、8（随时可做）
