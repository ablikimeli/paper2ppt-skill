---
name: paper2ppt
description: "Use this skill when the user asks to create a literature review PPT, journal club presentation, or paper report presentation. Triggers on: '文献汇报PPT', '文献汇报', 'journal club PPT', 'literature review PPT', 'make a presentation for this paper', '汇报PPT'. Accepts paper DOI/PMID/PMCID, URL, local PDF path, or title search. Supports multiple data sources: PubMed, CrossRef, Google Scholar, and local PDF parsing. This skill handles: paper identification with cross-validation, metadata fetching, Impact Factor and JCR quartile lookup, figure extraction from publisher HTML or PDF embedded images, table extraction with pdfplumber, and academic PPTX generation with pptxgenjs. The output PPT is always in English."
license: Proprietary. LICENSE.txt has complete terms
---

# paper2ppt Skill

Generate a professional academic literature review PowerPoint (English PPT) from a paper DOI, PMID, PMCID, URL, local PDF, or search query.

---

## Language Policy

- **PPT output language:** English only. All slide titles, body text, labels, and citations are in English.
- **Input language:** Accepts Chinese or English input from the user.
- **Paper language:** Works with papers in any language. If the paper is in Chinese, translate extracted content to English for the PPT.
- **Journal name:** Preserve the original journal name (e.g., "中国循证医学杂志" stays as-is), prefix with English if known.

---

## Robustness Rules (Read First)

Apply these to every phase.

1. **Every external call must have a timeout.** Use `curl --connect-timeout 10 --max-time 30` for HTTP requests.
2. **Every external call must have a fallback.** If CrossRef fails, try NCBI. If NCBI fails, try WebSearch.
3. **Never leave a slide blank.** If figures are missing, add text content instead. If text is missing, use available metadata.
4. **Never fabricate data.** If IF is not found, show "IF: N/A". Never guess or infer IF.
5. **Validate before running.** Check file paths, check figure files are non-empty, syntax-check the script with `node --check`.
6. **Kill long-running processes.** Set `timeout: 60000` on all curl/Node.js calls.
7. **Handle special characters.** Strip HTML tags, escape problematic characters in text.
8. **Check output file.** Verify the .pptx file exists and has non-zero size.

---

## Workflow Overview

```
User provides paper source (DOI/PMID/PMCID/URL/PDF path/title)
        │
        ▼
Phase 0: Identify paper → cross-validate → confirm → resolve DOI
        │
        ▼
Phase 1: Fetch metadata (CrossRef + NCBI cross-validation)
        │
        ▼
Phase 2: WebSearch → Impact Factor + JCR quartile
        │
        ▼
Phase 3: Extract figures + tables + section text
        │   ├─ 3.1 Online: publisher HTML → figure URLs
        │   ├─ 3.2 PDF available: PyMuPDF embedded images
        │   ├─ 3.3 Tables: pdfplumber → addTable reconstruction
        │   └─ 3.4 Section text: WebFetch / PyMuPDF text extraction
        │
        ▼
Phase 4: Generate PPTX → plan → write script → run → QA → fix loop
```

---

## Phase 0: Paper Identification (with Cross-Validation)

### 0.1 Input Type Detection

| Input | Example | Detection Method |
|-------|---------|-----------------|
| DOI | `10.1186/s12913-026-14482-6` | Regex: `10\.\d{4,}/[^\s]+` |
| PMID | `13170306` or `PMID: 13170306` | Regex: `^\d{8}$` or `PMID:\s*\d+` |
| PMCID | `PMC13170306` | Starts with `PMC` |
| URL | `https://doi.org/...` / `https://pubmed.ncbi.nlm.nih.gov/...` | Starts with `http` |
| Local PDF | `D:/path/to/file.pdf` or `C:\path\to\file.pdf` | Ends with `.pdf` or contains `\` or `/` with `.pdf` |
| Title | `"latent tuberculosis infection China"` | Free text, no identifier pattern |

### 0.2 Local PDF Entry (NEW)

When the user provides a local PDF file path:

```bash
# Verify the file exists
ls -la "{PDF_PATH}"
```

**Step 1 — Extract PDF metadata:**
```python
import fitz
doc = fitz.open("{PDF_PATH}")
meta = doc.metadata  # title, author, subject
first_page = doc[0].get_text()[:2000]  # first page text for DOI/title search
```

**Step 2 — Search for DOI in first page text:**
```python
import re
doi_match = re.search(r'10\.\d{4,}/[^\s\)\]]+', first_page)
doi = doi_match.group(0) if doi_match else None
```

**Step 3 — If DOI found:** Proceed to Phase 0.3 (resolve and verify).
**Step 4 — If no DOI:** Extract the paper title from the first page (usually the first large text block before "Abstract" or authors). Use it to search CrossRef:
```bash
curl -s "https://api.crossref.org/works?query.title={URL_ENCODED_TITLE}&rows=3"
```
Pick the best match by comparing titles. Then proceed to verification.

### 0.3 Resolution to DOI

| Input | Method |
|-------|--------|
| DOI | Use directly |
| PMID | `curl -s "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id={PMID}&retmode=json"` → extract `elocationid` (DOI) |
| PMCID | `curl -s "https://www.ncbi.nlm.nih.gov/pmc/utils/idconv/v1.0/?ids={PMCID}&format=json"` → extract DOI |
| DOI URL | Extract DOI from path after `/` |
| PubMed URL | Extract PMID, then resolve as above |
| PMC URL | Extract PMCID, then resolve as above |
| Publisher URL | Extract DOI from URL path (Springer/Wiley/etc.) |

### 0.4 Paper Verification (CRITICAL — Do Not Skip)

**Never trust a single source without cross-validation.** Wrong papers happen when identifiers are mismatched, search returns the wrong result, or metadata is stale.

**Verification procedure:**

1. **Fetch title from CrossRef** using the resolved DOI:
   ```bash
   curl -s "https://api.crossref.org/works/{DOI}?mailto=user@example.com" | python -c "import sys,json; d=json.load(sys.stdin); print(d['message']['title'][0])"
   ```

2. **Fetch title from NCBI** (if PMID or PMCID was available):
   ```bash
   curl -s "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&term={DOI}&retmode=json" | python -c "import sys,json; d=json.load(sys.stdin); print(d['result'][list(d['result'].keys())[0]]['title'])"
   ```

3. **Compare titles** — if both sources are available, check they refer to the same paper:
   - Extract ~50 chars from each title
   - Compare normalized strings (lowercase, remove punctuation)
   - If match confidence < 80%, **ask the user to confirm**: "I found two candidates: ... Which one is correct?"
   - If only one source is available, show the title to the user and ask: "Is this the correct paper?"

4. **User confirmation:** After verification (successful or single-source), show the user:
   ```
   Paper: {Title}
   Authors: {Authors}
   Journal: {Journal} ({Year})
   DOI: {DOI}
   Proceed? (Y/N)
   ```
   Wait for confirmation. If the user says no, stop and ask for a corrected identifier.

5. **If the user provides a PDF:** Extract the title from the first page and the DOI. Cross-validate them with CrossRef. If they mismatch, warn the user.

**CRITICAL RULE: If you are uncertain about the paper identity (>80% confident), do not proceed. Ask the user.**

---

## Phase 1: Metadata Fetching

### 1.1 Primary: CrossRef API

```bash
curl -s --connect-timeout 10 --max-time 30 \
  "https://api.crossref.org/works/{URL_ENCODED_DOI}?mailto=user@example.com"
```

**Fields to extract:**

| Field | JSON Path | Usage |
|-------|-----------|-------|
| Title | `message.title[0]` | PPT title |
| Authors | `message.author[]` → `{given} {family}` | Author list |
| Journal | `message.container-title[0]` | Journal name |
| Publication date | `message.published.date-parts[0]` → `[year, month, day]` | Date |
| Volume | `message.volume` | Citation |
| Issue | `message.issue` | Citation |
| Pages | `message.page` | Citation |
| DOI | `message.DOI` | Citation |
| ISSN | `message.ISSN[0]` | IF/JCR lookup |
| Abstract | `message.abstract` | Background (strip HTML tags) |
| URL | `message.URL` | Publisher link |

**Strip HTML tags from abstract:** Use `sed 's/<[^>]*>//g'` or JavaScript `.replace(/<[^>]*>/g, '')`.

**Author formatting:**
- List first 3 authors, then "et al." if more than 3
- Format: "Given Family", e.g. "G. Kucsko, J. Smith, et al."
- If author names are in Chinese characters, use the romanized form from CrossRef.

### 1.2 Fallback: NCBI E-utilities

If CrossRef is unreachable:
```bash
curl -s "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&term={DOI}&retmode=json"
```

Extract: title, authors, journal, date, volume, issue, pages, PMID.

### 1.3 Last Resort: WebSearch

If both CrossRef and NCBI fail, use WebSearch with the DOI or paper title to find the paper info from publisher snippets. Build the best-effort title slide and mark it as "metadata from web search."

---

## Phase 2: Impact Factor and JCR Quartile Lookup

### Step 1: Prepare search query
```
"[journal name]" "impact factor" {year}
```

### Step 2: Extract IF
Parse snippets for "IF: X.X", "Impact Factor X.X", "JIF X.X". Cross-reference.

### Step 3: Quartile lookup
```
"[journal name]" "JCR quartile" {year}
```
OR
```
"[journal name]" "SCImago" quartile
```

**Error handling:**
- If not found → show "IF: N/A" and "JCR: N/A". **Never fabricate.**
- ISSN-based search is more reliable — use the ISSN from CrossRef.

---

## Phase 3: Content Extraction

Content extraction depends on what sources are available. This table shows the priority:

| Source Available | Figures | Tables | Section Text |
|-----------------|---------|--------|-------------|
| DOI + publisher URL | 3.1 Online HTML | 3.3 Tier 1 | 3.4 WebFetch |
| DOI + PDF available | 3.2 PDF embedded | 3.3 Tier 1-2 | 3.4 PDF text |
| DOI + URL + PDF | 3.1 + 3.2 hybrid | 3.3 All tiers | 3.4 Both |
| Local PDF only | 3.2 PDF embedded | 3.3 Tier 1-2 | 3.4 PDF text |
| Nothing accessible | Skip figures | Skip tables | Use abstract only |

---

### 3.1 Online Figure Extraction (Publisher HTML)

#### 3.1.1 Resolve article page URL

```bash
# Strategy 1: Publisher site (Springer/BMC most reliable)
curl -s -L --connect-timeout 10 --max-time 30 \
  "https://link.springer.com/article/{DOI}" -o article.html

# Strategy 2: doi.org redirect
curl -s -L --connect-timeout 10 --max-time 30 \
  "https://doi.org/{DOI}" -o article.html

# Strategy 3: PMC (may be blocked in China)
curl -s -L --connect-timeout 10 --max-time 30 \
  "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC{PMCID}/" -o article.html
```

#### 3.1.2 Extract figure URLs from HTML

**Springer/BMC:**
```bash
grep -oP 'https://media\.springernature\.com/[^"'"'"']+' article.html | sort -u
```

**PMC:**
```bash
grep -oP 'src="[^"]*\.(jpg|png|gif)"' article.html | grep -v -i 'logo\|icon\|banner' | sort -u
```

**General:**
```bash
grep -oP '<img[^>]*src="([^"]*)"[^>]*>' article.html | \
  grep -oP 'src="\K[^"]+' | \
  grep -v -i 'logo\|icon\|banner\|avatar\|button\|spacer\|pixel\|transparent\|arrow\|bullet\|separator' | \
  sort -u
```

**WebFetch fallback:** Use the WebFetch tool with prompt: "Extract the URLs of all figure images in this article. Return only direct image URLs."

#### 3.1.3 Download and validate

```bash
mkdir -p figures/
curl -s -o "figures/fig1.jpg" --connect-timeout 10 --max-time 30 "{URL}"

# Validate each downloaded file
file figures/fig1.jpg | grep -E 'image|PNG|JPEG|GIF' || rm figures/fig1.jpg
```

**Limit:** Keep up to 8 valid figures. If more candidates, pick the 8 largest (by file size).

---

### 3.2 PDF Embedded Image Extraction (NEW — PyMuPDF)

**When a PDF is available** (user-provided or downloaded), extract embedded images directly rather than rendering pages.

```python
import fitz, os

doc = fitz.open("paper.pdf")
os.makedirs("figures", exist_ok=True)

image_count = 0

for page_num in range(len(doc)):
    page = doc[page_num]
    images = page.get_images(full=True)

    for img_idx, img in enumerate(images):
        xref = img[0]  # image reference number

        # Get image info before extracting
        base_image = doc.extract_image(xref)
        img_width = base_image["width"]
        img_height = base_image["height"]

        # Filter out small images (icons, logos, decorations)
        if img_width < 100 or img_height < 100:
            continue  # too small, likely an icon

        if img_width < 200 or img_height < 200:
            # Likely a small logo/button — skip
            continue

        # Filter out common non-content image types by size ratio
        # Icons are often square-ish and small
        # Content figures are usually >300px in at least one dimension
        if img_width < 300 and img_height < 300:
            # Check if it looks like an icon (small square)
            aspect = max(img_width, img_height) / min(img_width, img_height)
            if aspect < 2.0:  # nearly square, likely icon/logo
                continue

        # This looks like a content image — extract it
        ext = base_image["ext"]  # "png", "jpg", etc.
        image_bytes = base_image["image"]

        # Save with descriptive filename
        image_count += 1
        fname = f"figures/fig_pdf_{page_num+1}_{img_idx+1}.{ext}"
        with open(fname, "wb") as f:
            f.write(image_bytes)

        if image_count >= 8:  # cap at 8 figures
            break
    if image_count >= 8:
        break

print(f"Extracted {image_count} figures from PDF")
```

**Important notes:**
- PDFs embed images in various formats. PyMuPDF returns the raw bytes in their native format (JPEG, PNG, TIFF, etc.)
- Some PDFs store figures as multiple overlapping images — the extracted individual images may look like fragments. If a figure appears split across images, prefer the largest one.
- Filtering thresholds: 100px minimum to skip icons, 300px minimum for main content. Adjust if needed.
- If a figure is split across multiple extracted images, stitch them conceptually by noting the page number and approximate position. In the PPT, use the largest fragment.

**Fallback if embedded extraction yields poor results:** Use page rendering instead (full page at 300 DPI, then crop figure regions manually).

---

### 3.3 Table Extraction (Three-Tier Strategy — NEW)

#### Tier 1: pdfplumber Structured Extraction (BEST — Preferred)

```python
import pdfplumber, json, re

with pdfplumber.open("paper.pdf") as pdf:
    tables = []
    for page_num, page in enumerate(pdf.pages):
        page_tables = page.extract_tables()

        for table in page_tables:
            # Clean and structure the table
            cleaned = []
            for row in table:
                cleaned_row = []
                for cell in row:
                    if cell is None:
                        cleaned_row.append("")
                    else:
                        # Clean whitespace and newlines
                        cell = re.sub(r'\s+', ' ', cell.strip())
                        cleaned_row.append(cell)
                cleaned.append(cleaned_row)
            tables.append({
                "page": page_num + 1,
                "data": cleaned
            })

    # Output as JSON for easy consumption
    print(json.dumps(tables, ensure_ascii=False, indent=2))
```

**In the generated pptxgenjs script, reconstruct the table:**
- First row → header row (navy background, white text, bold)
- Subsequent rows → data rows (alternating `FFFFFF` and `F5F5F5`)
- Font size: 12-14pt depending on column count
- Border: 0.5pt `CCCCCC`

**If pdfplumber fails** (table detection doesn't work or table spans pages), fall to Tier 2.

#### Tier 2: PDF Page Screenshot (INTERMEDIATE)

Render the table page at 300 DPI, crop to the table region, embed as an image:

```python
import fitz

page = doc[table_page - 1]

# Estimate table location. Common positions in academic papers:
# Tables are typically in the middle-to-lower portion of result pages.
# A rough heuristic: skip the header (top 15%), skip footer (bottom 10%).
page_height = page.rect.height
page_width = page.rect.width

# Full page with margins cropped
clip_rect = fitz.Rect(
    0,                      # left edge
    page_height * 0.10,     # skip page header area
    page_width,             # right edge
    page_height * 0.90      # skip page footer area
)

pix = page.get_pixmap(dpi=300, clip=clip_rect)
pix.save(f"figures/table_{table_page}.png")
```

**Alternative:** If you know the table's approximate vertical range, crop tighter:
```python
# Example: Table is roughly in the middle third of the page
clip_rect = fitz.Rect(0, page_height * 0.30, page_width, page_height * 0.70)
```

**When embedding in PPT:** Use `sizing: { type: "contain", w: 8.5, h: 3.5 }` to display the table image. If the table is too tall, split across 2 slides using `sizing: { type: "crop" }`.

#### Tier 3: Manual Text Reconstruction (FALLBACK)

If both pdfplumber and screenshot fail:
1. Extract text from the page region containing the table
2. Identify row/column structure from text alignment
3. Manually reconstruct the addTable() call with the parsed data
4. If data is too garbled, **omit the table** rather than fabricating data

**Tier decision rules:**
- Try Tier 1 first. If pdfplumber returns clean structured data → use addTable()
- If Tier 1 fails or table data looks garbled → Tier 2 (screenshot)
- If Tier 2 also fails (can't locate table region) → Tier 3
- If all tiers fail → **omit the table**, never fabricate

---

### 3.4 Section Text Extraction

#### If publisher URL is available (WebFetch):

| Section | WebFetch Prompt |
|---------|-----------------|
| Background | "Extract the Background/Introduction section from this article. Return 3-5 concise bullet points in English." |
| Methods | "Extract the Methods section. Return 3-5 concise bullet points in English." |
| Results | "Extract the Results section. Return 3-5 concise bullet points focusing on key quantitative findings." |
| Discussion | "Extract the Discussion and Conclusion sections. Return 3-5 concise bullet points in English." |

#### If PDF is available:

```python
import fitz
doc = fitz.open("paper.pdf")

# Extract text from all pages
full_text = ""
for page in doc:
    full_text += page.get_text()

# Save for manual section extraction
with open("full_text.txt", "w", encoding="utf-8") as f:
    f.write(full_text)
```

Manually locate section headers ("Introduction", "Methods", "Results", "Discussion", "Conclusion") and extract the paragraphs under each. Condense to 3-5 bullet points per section.

#### Fallback:
- Use the CrossRef abstract for Background content.
- If no text at all is accessible → title-only PPT with note "Content not accessible."

---

### 3.5 User-Provided Supplementary Figure URLs (NEW)

The user may provide additional figure URLs (e.g., `https://www.ncbi.nlm.nih.gov/pmc/articles/PMC13170306/figure/undfig1/`):

1. Accept and validate each URL (check it returns an image)
2. Download to the `figures/` directory:
   ```bash
   curl -s -o "figures/fig_suppl_1.jpg" --connect-timeout 10 --max-time 30 "{USER_URL}"
   ```
3. Integrate with auto-extracted figures on the appropriate results slide
4. If the user says "Figure 1 from PMC page" or similar, resolve the URL to the actual image

---

### 3.6 Hybrid Mode (NEW — Online Metadata + Local PDF Content)

When **both a DOI/URL and a local PDF** are available:

1. **Metadata:** Use CrossRef (online) — provides clean, structured author/journal/date/IF data
2. **Figures:** Try online HTML first (higher quality images). If online fails → extract from PDF using 3.2
3. **Tables:** Use PDF (local) with pdfplumber — more reliable for table structure
4. **Section text:** Use PDF text extraction — bypasses paywalls
5. **Cross-validate:** Check the PDF's first-page title matches CrossRef title. If mismatch, warn.

---

## Phase 4: Generate the PPTX

### 4.0 Choose a Design Template (NEW)

Select a visual theme before generating the PPTX. Default is `academic-navy`.

| Template | Theme ID | Best For | Style |
|----------|----------|----------|-------|
| [Academic Navy](templates/academic-navy.md) | `navy` | General literature review (default) | Deep navy + blue, professional |
| [Academic Teal](templates/academic-teal.md) | `teal` | Medical, health, life sciences | Fresh teal + green, modern |
| [Slate Modern](templates/slate-modern.md) | `slate` | Tech, CS, engineering | Dark slate + indigo, clean |
| [Nature Dark](templates/nature-dark.md) | `nature` | High-impact journal presentations | Midnight + gold, premium |

**User can select a template by saying:**
```
/paper2ppt --template teal 10.1186/s12913-026-14482-6 文献汇报PPT
/paper2ppt -t slate DOI: 10.xxxx/xxxx
/paper2ppt -t nature "paper title"
```

**Template selection rule:**
- If user specifies `--template X` or `-t X` → use that template
- If user says "医学" or "health" or "medical" → default to `teal`
- If user says "tech" or "CS" or "engineering" → default to `slate`
- If user mentions "Nature" or "premium" → default to `nature`
- Otherwise → `navy` (default)

**Implementation:**
Before writing the pptxgenjs script, read the selected template file from `templates/` and incorporate its color palette, typography, and slide layout code into the generated script. The templates provide code snippets that should be copied verbatim (with variable names adapted to the paper's data).

### 4.1 Slide Structure (Content-Adaptive)

Every literature review PPT must include these **core sections** in order. Number of slides per section adapts to content depth.

| Section | Required | Slides | Notes |
|---------|----------|--------|-------|
| **Title Slide** | Yes | 1 | Paper info, IF, JCR, DOI |
| **Table of Contents** | Yes | 1 | Simple list, no detail |
| **Background & Objectives** | Yes | 1-2 | Rationale, gap, objectives |
| **Methods & Materials** | Yes | 1-3 | Design, population, analysis |
| **Results** | Yes | 1-4 | One finding per slide |
| **Discussion & Conclusion** | Yes | 1-2 | Main findings, limitations |
| **Inspirations** | Yes | 1 | Implications, future directions |
| **End Page** | Yes | 1 | Thank you / Q&A |

**Rules:**
- Each major finding gets its own results slide. Do not cram multiple figures onto one slide.
- Complex methods (modeling studies, multi-stage designs) → 2-3 methods slides.
- Simple papers: 8-9 slides. Complex papers: 12-15 slides.
- Never add filler slides. Every slide must carry meaningful content.

---

### 4.2 Design Rules (Updated)

#### General Approach

No solid single-color backgrounds on any slide. Use subtle layered designs:
- **Title slide:** Dark navy with a subtle gradient (lighter blue section at bottom)
- **Content slides:** White background + colored header band (thin navy strip at top)
- **End slide:** Dark navy gradient matching title slide

#### Color Palette

```javascript
const C = {
  navy:    "1F4E79",   // Primary dark blue
  blue:    "2E75B6",   // Accent blue
  bg:      "FFFFFF",   // Content slide background
  body:    "2D2D2D",   // Body text
  muted:   "666666",   // Secondary text
  rule:    "D0D0D0",   // Divider lines
  accent:  "4472C4",   // Callout borders
  lightBg: "EBF3FA",   // Callout fill
  navyLight:"2B5A8A",  // Lighter navy for gradient
  white:   "FFFFFF",
  headerBg:"F8FAFE",   // Very light blue tint for header area
};
```

#### Typography

```javascript
const F = {
  face: "Arial",
  title: 26,       // Action titles
  subtitle: 20,    // Section subtitles
  body: 18,        // Body text / bullets
  small: 14,       // Captions, labels
  cite: 11,        // Citations, slide numbers
};
```

**Rules:**
- Arial throughout. Never mix fonts.
- Action titles: 26pt bold, complete sentence takeaway.
- Body text: 18pt regular. Never below 16pt for readable content.
- Citations/slide numbers: 11pt muted.
- Line spacing: `paraSpaceAfter: 6` for bullets. Never use `lineSpacing` with bullets.

#### Layout Grid (LAYOUT_16x9, 10" × 5.625")

```
Left margin:   0.5"
Right margin:  0.5"  (content width: 9.0")
Top margin:    0.2"
Bottom margin: 0.3"
```

---

#### Title Slide Design (Updated — Gradient + Accent Band)

Dark navy gradient background (`1F4E79` at top, `2B5A8A` at bottom). An accent band or subtle geometric element adds visual depth.

**Implementation (gradient effect via two rectangles):**
```javascript
// Dark navy base
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: 10, h: 5.625,
  fill: { color: "1F4E79" },
});

// Lighter navy accent band at bottom (creates two-tone effect)
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 4.2, w: 10, h: 1.425,
  fill: { color: "2B5A8A" },
});

// Thin accent stripe
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0.7, y: 3.3, w: 2.0, h: 0.04,
  fill: { color: C.blue },
});
```

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  Literature Review  ·  Journal Club                  │  ← y=0.5, 14pt, light blue
│                                                     │
│  Full Paper Title (bold, ~28pt, white)              │  ← y=1.3
│  May span 2-3 lines                                 │
│                                                     │
│  Author1, Author2, Author3, et al.                   │  ← y=2.9, 15pt, light blue
│                                                     │
│  ──── (short accent rule 2.0" wide)                  │  ← y=3.3
│                                                     │
│  Journal Name                                        │  ← y=3.5, 16pt, accent
│  Published: Month DD, YYYY  |  Vol(Issue):Pages      │
│  IF: X.X  |  JCR Quartile: QX                       │  ← 13pt white
│  DOI: 10.xxxx/xxxx                                   │
│                                                     │
├──────────────────────────────────────────────────────┤  ← y=4.2 (color transition)
│  Literature Review Presentation                      │  ← y=5.0, 12pt, muted
└─────────────────────────────────────────────────────┘
```

---

#### Content Slide Design (Updated — White + Header Band)

White background with a thin navy header band at the very top (y=0 to y=0.08). Creates a subtle visual anchor.

```javascript
// Thin navy header band
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: 10, h: 0.08,
  fill: { color: C.navy },
});
```

**Layout:**
```
┌─────────────────────────────────────────────────────┐  ← y=0, navy band 0.08" high
│  Action Title (complete sentence takeaway)           │  ← y=0.2, 26pt bold navy
│  ────────────────────────────────────────────────── │  ← y=0.95, divider
│                                                     │
│  • Bullet point 1                                    │  ← 18pt, y=1.15
│  • Bullet point 2                                   │
│  • Bullet point 3                                   │
│  • Bullet point 4                                   │
│                                                     │
│  [Figure or table in this region]                    │
│                                                     │
│  Source: (Author, Year)                             │  ← 11pt muted
│                                               N / N │  ← slide number
└─────────────────────────────────────────────────────┘
```

---

#### TOC Slide Design (Updated — Minimal List)

The TOC is a simple signpost. **No dividers, no page numbers, no detailed descriptions.** Just the section list.

```javascript
// TOC slide with navy gradient background (matching title slide)
const tocSlides = pres.addSlide();
tocSlides.background = { color: C.navy };

// Bottom accent band
tocSlides.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 4.2, w: 10, h: 1.425,
  fill: { color: "2B5A8A" },
});

// Title
tocSlides.addText("Table of Contents", {
  x: 0.7, y: 0.5, w: 8.6, h: 0.6,
  fontSize: 28, fontFace: F.face, color: C.white,
  bold: true, margin: 0,
});

// Section list (no numbers, no dividers)
const sections = [
  "Background & Objectives",
  "Methods & Materials",
  "Results",
  "Discussion & Conclusion",
  "Inspirations",
];

const tocItems = sections.map((s, i) => ({
  text: s,
  options: { bullet: false, breakLine: i < sections.length - 1 },
}));

tocSlides.addText(tocItems, {
  x: 0.7, y: 1.5, w: 8.6, h: 3.0,
  fontSize: 22, fontFace: F.face, color: C.white,
  paraSpaceAfter: 12, valign: "top",
});
```

**Visual:**
```
┌─────────────────────────────────────────────────────┐  ← navy background
│  Table of Contents                                   │  ← 28pt bold white
│                                                     │
│  Background & Objectives                            │  ← 22pt white
│  Methods & Materials                                │
│  Results                                            │
│  Discussion & Conclusion                            │
│  Inspirations                                       │
│                                                     │
├──────────────────────────────────────────────────────┤  ← y=4.2, color transition
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

#### Results Slide with Figures

Two-column layout (figure left, bullets right):

```
┌─ (navy header band) ────────────────────────────────┐
│  Action Title: Key result described here              │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  ┌───────────────────┐  • Finding bullet 1          │
│  │                   │  • Finding bullet 2          │
│  │    FIGURE IMAGE   │  • Finding bullet 3          │
│  │     (w: 5.0)      │  • Finding bullet 4          │
│  │                   │                             │
│  └───────────────────┘    (w: 3.5, x: 6.0)          │
│  Fig. 1 Caption  ← 12pt                              │
│                                                     │
│                                               N / N │
└─────────────────────────────────────────────────────┘
```

**Figure sizing:**
- Figure area: `x: 0.5, w: 5.0, y: 1.2, h: 3.5`
- Use `sizing: { type: "contain", w: 5.0, h: 3.5 }` to preserve aspect ratio
- Center the image within its bounding box

**If no figures are available:** Make the bullet column wider (`x: 0.5, w: 9.0`).

**Tables:** Reconstructed with `addTable()`:
- Header: navy `1F4E79`, white text, bold
- Rows: alternating `FFFFFF` / `F5F5F5`
- Border: 0.5pt `CCCCCC`
- Font: 12-14pt

---

#### Inspirations Slide

```
┌─ (navy header band) ────────────────────────────────┐
│  Key Takeaways for Our Research                       │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  Clinical Implications                               │  ← 20pt bold navy
│  • What this means for practice                      │  ← 18pt
│                                                     │
│  Methodological Insights                             │
│  • What the paper did well methodologically         │
│                                                     │
│  Future Directions                                   │
│  • What we can build on from this work              │
│                                                     │
│                                               N / N │
└─────────────────────────────────────────────────────┘
```

---

#### End Slide

Dark navy gradient matching title slide:

```javascript
const endSlide = pres.addSlide();
endSlide.background = { color: C.navy };
endSlide.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 4.2, w: 10, h: 1.425,
  fill: { color: "2B5A8A" },
});
endSlide.addText("Thank You", {
  x: 0.7, y: 1.8, w: 8.6, h: 0.8,
  fontSize: 36, fontFace: F.face, color: C.white,
  bold: true, align: "center",
});
endSlide.addText("Questions & Discussion", {
  x: 0.7, y: 2.7, w: 8.6, h: 0.6,
  fontSize: 22, fontFace: F.face, color: C.blue,
  align: "center",
});
```

---

### 4.3 PptxGenJS Critical Rules

1. **NEVER use "#" with hex colors** — causes file corruption. Use `"FF0000"` not `"#FF0000"`.
2. **NEVER reuse option objects across calls** — PptxGenJS mutates in-place. Use factory functions:
   ```javascript
   const cellOpts = () => ({ fill: { color: "1F4E79" }, color: "FFFFFF" });
   ```
3. **Use `bullet: true`** — never unicode bullet characters (creates double bullets).
4. **Use `breakLine: true`** between text array items; last item omits it.
5. **Figure directory:** Create `figures/` subdir. Download images BEFORE running the script.
6. **Check file existence** before embedding. If missing, skip.

### 4.4 Standard Helpers

```javascript
const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "paper2ppt";
pres.title = "Literature Review";

const C = {
  navy: "1F4E79", blue: "2E75B6", bg: "FFFFFF",
  body: "2D2D2D", muted: "666666", rule: "D0D0D0",
  accent: "4472C4", lightBg: "EBF3FA", navyLight: "2B5A8A",
  white: "FFFFFF", headerBg: "F8FAFE",
};
const F = { face: "Arial", title: 26, body: 18, small: 14, cite: 11 };

// Count total slides for numbering
const TOTAL = [...]; // set dynamically

function addSlideNum(slide, n) {
  slide.addText(`${n} / ${TOTAL}`, {
    x: 8.8, y: 5.2, w: 1.0, h: 0.3,
    fontSize: 9, fontFace: F.face, color: C.muted, align: "right",
  });
}

// Content slide with navy header band
function contentSlide(title, n) {
  const slide = pres.addSlide();
  slide.background = { color: C.bg };
  // Header band
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.08,
    fill: { color: C.navy },
  });
  // Action title
  slide.addText(title, {
    x: 0.5, y: 0.2, w: 9.0, h: 0.75,
    fontSize: F.title, fontFace: F.face, color: C.navy,
    bold: true, valign: "top", margin: 0,
  });
  // Divider line
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 0.95, w: 9.0, h: 0.025,
    fill: { color: C.rule },
  });
  addSlideNum(slide, n);
  return slide;
}

function addBullets(slide, items, opts = {}) {
  const bulletItems = items.map((item, i) => ({
    text: item,
    options: { bullet: true, breakLine: i < items.length - 1 },
  }));
  slide.addText(bulletItems, {
    x: opts.x || 0.5, y: opts.y || 1.15, w: opts.w || 9.0,
    h: opts.h || 3.8, fontSize: opts.fontSize || F.body,
    fontFace: F.face, color: C.body, paraSpaceAfter: 6, valign: "top",
  });
}

function addCallout(slide, text, opts = {}) {
  const x = opts.x || 1.0, y = opts.y || 1.3;
  const w = opts.w || 8.0, h = opts.h || 1.2;
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h,
    fill: { color: C.lightBg }, line: { color: C.blue, pt: 1 },
    rectRadius: 0.08,
  });
  slide.addText(text, {
    x: x + 0.15, y: y + 0.1, w: w - 0.3, h: h - 0.2,
    fontSize: opts.fontSize || 17, fontFace: F.face, color: C.navy,
    align: "center", valign: "middle",
  });
}

// Title slide with two-tone gradient
function titleSlide(title, authors, journal, date, vol, issue, pages, doi, ifVal, quartile) {
  const slide = pres.addSlide();
  // Dark navy base
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625,
    fill: { color: C.navy },
  });
  // Lighter accent band at bottom
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 4.2, w: 10, h: 1.425,
    fill: { color: C.navyLight },
  });
  // "Literature Review" label
  slide.addText("Literature Review  ·  Journal Club", {
    x: 0.7, y: 0.5, w: 8.6, h: 0.4,
    fontSize: 14, fontFace: F.face, color: C.blue,
  });
  // Paper title
  slide.addText(title, {
    x: 0.7, y: 1.3, w: 8.6, h: 1.6,
    fontSize: 28, fontFace: F.face, color: C.white,
    bold: true, valign: "top", margin: 0,
  });
  // Authors
  slide.addText(authors, {
    x: 0.7, y: 2.9, w: 8.6, h: 0.4,
    fontSize: 15, fontFace: F.face, color: "CADCFC",
  });
  // Accent rule
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 3.3, w: 2.0, h: 0.03,
    fill: { color: C.blue },
  });
  // Journal info
  const infoLines = [
    `${journal}`,
    `Published: ${date}  |  ${vol}(${issue}):${pages}`,
    `IF: ${ifVal}  |  JCR Quartile: ${quartile}`,
    `DOI: ${doi}`,
  ].join("\n");
  slide.addText(infoLines, {
    x: 0.7, y: 3.5, w: 8.6, h: 0.7,
    fontSize: 13, fontFace: F.face, color: C.white,
    valign: "top", lineSpacingMultiple: 1.3,
  });
  // Bottom label
  slide.addText("Literature Review Presentation", {
    x: 0.7, y: 5.0, w: 8.6, h: 0.3,
    fontSize: 12, fontFace: F.face, color: "8899BB",
  });
  return slide;
}

// TOC slide with navy background
function tocSlide(sections) {
  const slide = pres.addSlide();
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625,
    fill: { color: C.navy },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 4.2, w: 10, h: 1.425,
    fill: { color: C.navyLight },
  });
  slide.addText("Table of Contents", {
    x: 0.7, y: 0.5, w: 8.6, h: 0.6,
    fontSize: 28, fontFace: F.face, color: C.white,
    bold: true, margin: 0,
  });
  const tocItems = sections.map((s, i) => ({
    text: s,
    options: { bullet: false, breakLine: i < sections.length - 1 },
  }));
  slide.addText(tocItems, {
    x: 0.7, y: 1.5, w: 8.6, h: 3.0,
    fontSize: 22, fontFace: F.face, color: C.white,
    paraSpaceAfter: 12, valign: "top",
  });
  return slide;
}

// End slide
function endSlide() {
  const slide = pres.addSlide();
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625,
    fill: { color: C.navy },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 4.2, w: 10, h: 1.425,
    fill: { color: C.navyLight },
  });
  slide.addText("Thank You", {
    x: 0.7, y: 1.8, w: 8.6, h: 0.8,
    fontSize: 36, fontFace: F.face, color: C.white,
    bold: true, align: "center",
  });
  slide.addText("Questions & Discussion", {
    x: 0.7, y: 2.7, w: 8.6, h: 0.6,
    fontSize: 22, fontFace: F.face, color: C.blue,
    align: "center",
  });
  return slide;
}

pres.writeFile({ fileName: "Literature_Review.pptx" })
  .then(() => console.log("DONE"))
  .catch(err => console.error("ERROR:", err));
```

---

### 4.5 Text Content Guidelines

- **Bullet points:** 3-5 per slide. Each bullet is 1-2 lines max. Short, scannable.
- **No paragraphs.** No walls of text. The presenter speaks; the slide supports.
- **Action titles:** Complete sentence stating the takeaway, not a topic label.
  - ✅ "Treatment was cost-effective across all willingness-to-pay thresholds"
  - ❌ "Results"
- **Citations:** Include `(Author, Year)` on each content slide.

### 4.6 Script Validation Before Running

1. **Syntax check:** `node --check generate_ppt.js`
2. **Check figure files:**
   ```bash
   for f in figures/*.jpg figures/*.png figures/*.tif; do
     [ -s "$f" ] || echo "MISSING: $f"
   done
   ```
3. **Remove missing references** from the script
4. **Run with timeout:** `timeout 60 node generate_ppt.js`
5. **Verify output:** .pptx exists and has size > 0 bytes

---

## Phase 5: Quality Assurance

### Content QA

```bash
python -m markitdown Literature_Review.pptx
```

**Checklist:**
- [ ] Required sections in correct order (Title → TOC → Background → Methods → Results → Discussion → Inspirations → End)
- [ ] Title slide has correct paper info, IF, quartile, DOI
- [ ] Action titles are complete sentences (not topic labels)
- [ ] Bullet points are concise (< 15 words each)
- [ ] No hallucinated data, no fabricated numbers
- [ ] All citations accurate
- [ ] Slide numbers sequential
- [ ] No placeholder text

### Visual QA

If LibreOffice available:
```bash
python scripts/office/soffice.py --headless --convert-to pdf Literature_Review.pptx
pdftoppm -jpeg -r 150 Literature_Review.pdf slide
```

**Check for:**
- Text overflow
- Overlapping elements
- Consistent alignment
- Figure aspect ratio preserved
- Color contrast adequate

### Fix Loop

1. Identify issues → edit JS → re-run `node generate_ppt.js`
2. Re-run content QA
3. Repeat until clean

**Your first render is almost never correct. Look harder.**

---

## Error Recovery Summary

| Failure | Recovery |
|---------|----------|
| CrossRef API unreachable | NCBI E-utilities → WebSearch → ask user |
| Paper identity uncertain | Show user for confirmation before proceeding |
| Wrong paper detected | Stop. Ask user for correct identifier |
| Figure download fails (online) | Extract embedded images from PDF |
| PDF embedded extraction yields bad images | Page render + crop (300 DPI) |
| pdfplumber table extraction fails | Screenshot + crop → embed as image |
| No tables at all | Omit tables, show only figures |
| No figures at all | Text-only layout, wider content area |
| PDF not available / can't download | Use online HTML only |
| IF/JCR not found | Show "IF: N/A", never fabricate |
| Script syntax error | Fix per Node error, re-validate |
| PPTX file corrupt | Check hex colors, check object reuse |

---

## Dependencies

```bash
# PPT generation
npm install -g pptxgenjs

# Content QA
pip install "markitdown[pptx]"

# PDF figure extraction (REQUIRED for PDF support)
pip install pymupdf

# Table extraction (REQUIRED for table support)
pip install pdfplumber
```

---

## Examples

**Local PDF:**
```
/paper2ppt D:/Papers/paper.pdf 请给我做出一个文献汇报PPT
```

**DOI + PDF for hybrid:**
```
/paper2ppt 10.1186/s12913-026-14482-6 PDF在 D:/Papers/paper.pdf
```

**PMID:**
```
/paper2ppt PMID: 13170306
```

**Title search:**
```
/paper2ppt Make a literature review PPT for latent TB infection cost-effectiveness in China
```

---

## References

- [Design Templates](templates/) — Color palettes, typography, and slide layouts
- [Publisher Patterns](references/publisher_patterns.md) — Figure/table extraction per publisher
- [CrossRef API Reference](../paper-lookup/references/crossref.md) — DOI metadata API
- [PptxGenJS Tutorial](../pptx/pptxgenjs.md) — PPT generation API
- [Academic PPTX Design Standards](../academic-pptx/SKILL.md) — Design rules

---

## Skill Location

```
D:/Claude/.claude/skills/paper2ppt/
├── SKILL.md                          ← Entry point + workflow (this file)
├── README.md                         ← English readme
├── README.zh.md                      ← Chinese readme
├── templates/                        ← Design templates
│   ├── academic-navy.md              ←   Navy blue (default)
│   ├── academic-teal.md              ←   Teal green (medical)
│   ├── slate-modern.md               ←   Slate indigo (tech)
│   └── nature-dark.md                ←   Midnight gold (premium)
└── references/
    └── publisher_patterns.md         ← Extraction patterns
```
