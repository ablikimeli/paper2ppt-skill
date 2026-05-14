---
name: paper2ppt
description: "Use this skill when the user asks to create a literature review PPT, journal club presentation, or paper report presentation. Triggers on: '文献汇报PPT', '文献汇报', 'journal club PPT', 'literature review PPT', 'make a presentation for this paper', '汇报PPT'. Accepts paper URLs (DOI, PubMed, PMC, Springer, ScienceDirect, Wiley) OR direct identifiers (DOI, PMID, PMCID). Can also search by paper title or keywords via Google Scholar / PubMed / CrossRef. This skill handles: paper identification, metadata fetching via CrossRef, Impact Factor and JCR quartile lookup via WebSearch, figure/table extraction from article HTML or PDF, and academic PPTX generation with pptxgenjs. The output PPT is always in English."
license: Proprietary. LICENSE.txt has complete terms
---

# paper2ppt Skill

Generate a professional academic literature review PowerPoint (English PPT) from a paper identifier, URL, or search query.

---

## Language Policy

- **PPT output language:** English only. All slide titles, body text, labels, and citations are in English.
- **Input language:** Accepts Chinese or English input from the user (e.g., "请给我做出一个文献汇报PPT").
- **Paper language:** Works with papers in any language. If the paper is in Chinese, translate extracted content to English for the PPT.
- **Journal name:** Preserve the original journal name (e.g., "中国循证医学杂志" stays as-is), but prefix with English if known.

---

## Robustness Rules (Read First)

These rules apply to every phase below. Follow them strictly.

1. **Every external call must have a timeout.** Use `curl --connect-timeout 10 --max-time 30` for HTTP requests.
2. **Every external call must have a fallback.** If CrossRef fails, try PubMed. If PubMed fails, try WebSearch.
3. **Never leave a slide blank.** If figures are missing, add text content instead. If text is missing, use available metadata.
4. **Never fabricate data.** If IF is not found, show "IF: N/A". If a section cannot be extracted, note "Content not available."
5. **Validate before running.** Check file paths exist, check figure files are non-empty, check the script parses correctly with `node --check`.
6. **Kill long-running processes.** Set `timeout: 60000` on all curl/Node.js calls. If a figure download stalls, skip it.
7. **Handle special characters.** Escape or strip problematic characters in text (HTML entities, math symbols, very long strings).
8. **Check output file.** After generation, verify the .pptx file exists and has non-zero size.

---

## Workflow Overview

```
User provides paper identifier / URL / search query
        │
        ▼
Phase 1: Identify paper → resolve to DOI
        │
        ▼
Phase 2: CrossRef API → metadata (title, authors, journal, date, ISSN, abstract)
        │
        ▼
Phase 3: WebSearch → Impact Factor + JCR quartile
        │
        ▼
Phase 4: Fetch article HTML page → extract figures, tables, sections
        │
        ▼
Phase 5: Plan slide outline → write pptxgenjs script → run → QA → fix loop
```

---

## Phase 1: Paper Identification

### Direct identifiers

| Input Type | Example | Resolution |
|------------|---------|------------|
| DOI | `10.1186/s12913-026-14482-6` | Use directly |
| PMID | `13170306` or `PMID: 13170306` | Convert via NCBI: `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id={PMID}&retmode=json` → DOI field |
| PMCID | `PMC13170306` or `PMCID: PMC13170306` | Convert via NCBI: `https://www.ncbi.nlm.nih.gov/pmc/utils/idconv/v1.0/?ids={PMCID}&format=json` → DOI |

### URL formats

| Type | Example | Pattern |
|------|---------|---------|
| DOI link | `https://doi.org/10.1186/s12913-026-14482-6` | Extract DOI after `/` |
| PubMed | `https://pubmed.ncbi.nlm.nih.gov/12345678/` | Extract PMID → resolve to DOI |
| PMC | `https://www.ncbi.nlm.nih.gov/pmc/articles/PMC13170306/` | Extract PMCID → resolve to DOI |
| Springer | `https://link.springer.com/article/10.1186/s12913-026-14482-6` | Extract DOI from path |
| ScienceDirect | `https://www.sciencedirect.com/science/article/pii/S123456789` | Extract PII |
| Wiley | `https://onlinelibrary.wiley.com/doi/10.1002/xyz.12345` | Extract DOI from path |

### Search by title / keywords

If the user provides a paper title, keywords, or author + year instead of an identifier:

1. **Try CrossRef search first:**
   ```bash
   curl -s "https://api.crossref.org/works?query.bibliographic={URL_ENCODED_QUERY}&rows=5"
   ```
   Check results for the best title match, extract its DOI.

2. **Try PubMed search** (for biomedical papers):
   ```bash
   curl -s "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term={URL_ENCODED_QUERY}&retmode=json"
   ```
   Then fetch details for the top result PMID.

3. **Try Google Scholar via WebSearch:**
   Use WebSearch with query: `"{paper title}" scholar`
   Parse results to find DOI or publisher URL.

**Priority:** Given identifier > URL > title/keywords search. Always confirm the matched paper with the user if search was used.

**Error handling:** If no identifier resolved after all attempts, stop and tell the user "Could not find this paper. Please provide a DOI or URL."

---

## Phase 2: CrossRef Metadata Fetching

```bash
curl -s --connect-timeout 10 --max-time 30 \
  "https://api.crossref.org/works/{URL_ENCODED_DOI}?mailto=user@example.com"
```

### Fields to extract

| Field | JSON Path | Usage |
|-------|-----------|-------|
| Title | `message.title[0]` | PPT title |
| Authors | `message.author[]` → `{given} {family}` | Author list on title slide |
| Journal | `message.container-title[0]` | Journal name for title slide |
| Publication date | `message.published.date-parts[0]` → `[year, month, day]` | Date on title slide |
| Volume | `message.volume` | Citation info |
| Issue | `message.issue` | Citation info |
| Pages | `message.page` | Citation info |
| DOI | `message.DOI` | Citation info |
| ISSN | `message.ISSN[0]` | For IF/JCR lookup |
| Abstract | `message.abstract` | Background text (strip HTML tags) |

**Important:** Abstract text often contains HTML tags (`<jats:p>`, `<italic>`, etc.). Strip these before use. Use `sed 's/<[^>]*>//g'` or JavaScript `.replace(/<[^>]*>/g, '')`.

### Author formatting
- List first 3 authors, then "et al." if more than 3
- Format: "Given Family", e.g. "G. Kucsko, J. Smith, et al."
- If author names are in Chinese characters, use the provided romanized form from CrossRef (usually has both)

### Error handling
- If CrossRef returns HTTP 404 or 429, wait 5 seconds and retry once
- If CrossRef is completely unreachable, try the NCBI E-utilities API as fallback:
  ```bash
  curl -s "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&term={DOI}&retmode=json"
  ```
- If both fail, use WebSearch to find the paper title, journal, and authors manually from search snippets. Build the best-effort title slide.

---

## Phase 3: Impact Factor and JCR Quartile Lookup

### Step 1: Prepare search query
```
"[journal name]" "impact factor" 2025
```

### Step 2: Extract IF from search results
Parse the search snippet for numbers like "IF: 2.8", "Impact Factor 3.2", "JIF 4.5", etc. Cross-reference multiple results if available.

### Step 3: Quartile lookup
```
"[journal name]" "JCR quartile" 2025
```
OR
```
"[journal name]" "SCImago" quartile
```

SCImago quartiles (Q1/Q2/Q3/Q4) are freely published. Search for "SCImago Journal Rank [journal name]".

### Error handling
- If WebSearch fails or returns no IF data → show "IF: N/A" and "JCR: N/A" on the title slide. **Never fabricate** an Impact Factor.
- If only one of IF or quartile is found, show the found value and "N/A" for the other.
- ISSN-based lookup is more reliable — use the ISSN from CrossRef to search.

---

## Phase 4: Fetch Article HTML and Extract Figures/Tables

### 4.1 Resolve to article page URL

```bash
# Strategy 1: Try publisher site via Springer link (most reliable for figures)
curl -s -L --connect-timeout 10 --max-time 30 \
  "https://link.springer.com/article/{DOI}" -o article.html

# Strategy 2: Try doi.org redirect
curl -s -L --connect-timeout 10 --max-time 30 \
  "https://doi.org/{DOI}" -o article.html

# Strategy 3: Try PMC if publisher fails (may be blocked in China)
curl -s -L --connect-timeout 10 --max-time 30 \
  "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC{PMCID}/" -o article.html
```

**If all HTTP requests fail** (timeout/blocked), skip HTML figure extraction entirely and go directly to PDF fallback (section 4.2.6).

### 4.2 Extract figures

Try in order. Stop when at least one figure is found.

#### 4.2.1 Springer/BMC pattern (proven working)
```bash
grep -oP 'https://media\.springernature\.com/[^"'"'"']+' article.html | sort -u
```
Download each unique figure URL. Remove URL sizing parameters (e.g., `?x64`) for full resolution.

**Note:** Some Springer pages load figures via JavaScript. If the HTML contains figure captions but no image URLs, try the `fulltext.html` variant:
```bash
curl -s -L "https://link.springer.com/article/{DOI}?fulltext=true"
```

#### 4.2.2 PubMed Central (PMC) pattern
```bash
grep -oP 'src="[^"]*\.(jpg|png|gif)"' article.html | grep -v 'logo\|icon\|banner' | sort -u
```
Prepend `https://www.ncbi.nlm.nih.gov` to relative paths.

#### 4.2.3 General HTML pattern
```bash
# Extract figure-like images from article HTML
grep -oP '<img[^>]*src="([^"]*)"[^>]*>' article.html | \
  grep -oP 'src="\K[^"]+' | \
  grep -v -i 'logo\|icon\|banner\|avatar\|button\|spacer\|pixel\|transparent\|arrow\|bullet\|separator' | \
  sort -u
```

#### 4.2.4 WebFetch as fallback
Use the WebFetch tool with the article URL and prompt: "Extract the URLs of all figure images in this article. Return only the direct image URLs."

#### 4.2.5 Download and validate figures

Create a `figures/` directory. For each candidate URL:

```bash
curl -s -o "figures/fig${N}.jpg" --connect-timeout 10 --max-time 30 \
  "https://media.springernature.com/..."
```

After download, validate each file:
```bash
# Check file is non-empty
file "figures/fig1.jpg" | grep -E 'image|PNG|JPEG|GIF' || echo "CORRUPT: fig1.jpg"
```

**Remove corrupt/empty files immediately.** Only keep valid images.

**Limit:** Maximum 5 figures. If more candidates exist, pick the first 5 (typically the most important).

#### 4.2.6 PDF fallback (when HTML extraction fails)

```bash
# Try Springer/Nature PDF URL first
curl -s -L -o "paper.pdf" --connect-timeout 10 --max-time 60 \
  "https://link.springer.com/content/pdf/{DOI}.pdf"
```

If that fails, try the PDF URL via doi.org redirect. If PDF download fails entirely, **skip figures** — the PPT will be text-only (which is acceptable).

### 4.3 Extract tables

**Strategy A:** Look for table images on the article page (same patterns as figures, but with "table" in filename or alt text).

**Strategy B:** Extract table data from HTML `<table>` elements. Use WebFetch tool with prompt: "Extract the data from Table 1 and Table 2 in this article as markdown tables."

**Strategy C:** If PDF is available, render the relevant page and crop the table region as an image.

**IMPORTANT:** If no tables can be extracted at all, **omit them** from the PPT. Never fabricate table data. The results slide can show figures only.

### 4.4 Extract section text

For each section, use WebFetch on the article URL with targeted prompts:

- Background: "Extract the Background/Introduction section from this article. Return 3-5 concise bullet points in English."
- Methods: "Extract the Methods section from this article. Return 3-5 concise bullet points in English."
- Results: "Extract the Results section from this article. Return 3-5 concise bullet points in English."
- Discussion: "Extract the Discussion and Conclusion sections from this article. Return 3-5 concise bullet points in English."

**If WebFetch cannot access the full article** (paywall, JS wall), use the CrossRef abstract as background text, and use WebSearch to find summaries of the paper.

**If PDF is available**, extract text using PyMuPDF:
```python
import fitz
doc = fitz.open("paper.pdf")
for page in doc:
    text = page.get_text()
    # Save and manually extract sections
```

**Fallback:** If no section text can be obtained, the PPT shows only the title slide, a TOC, and a slide saying "Full text not accessible for content extraction."

---

## Phase 5: Generate the PPTX

### 5.1 Slide Structure (Flexible)

Every literature review PPT must include these **core sections** in order. The number of slides per section depends on the paper's content depth.

| Priority | Section | Required | Slides | Notes |
|----------|---------|----------|--------|-------|
| 1 | **Title Slide** | Yes | 1 | Always included |
| 2 | **Table of Contents** | Yes | 1 | Always included |
| 3 | **Background & Objectives** | Yes | 1-2 | Expand if complex background |
| 4 | **Methods & Materials** | Yes | 1-3 | More slides for complex study designs |
| 5 | **Results** | Yes | 1-4 | One slide per major finding or figure |
| 6 | **Discussion & Conclusion** | Yes | 1-2 | Separate if both are substantive |
| 7 | **Inspirations** | Yes | 1 | Always included |
| 8 | **End Page** | Yes | 1 | Always included |

**Rules:**
- Each major finding gets its own results slide (do not cram multiple figures onto one slide)
- Complex methods (modeling studies, multi-stage designs) deserve 2-3 methods slides
- Simple papers can stay at 8-9 slides; extensive papers may reach 12-15 slides
- Never add filler slides. Every slide must carry meaningful content.
- Total slides = determined by content, not a fixed number

### 5.2 Design Rules

#### Color Palette (Academic Navy)

```javascript
const C = {
  navy:    "1F4E79",   // Primary — titles, dark bg
  blue:    "2E75B6",   // Accent — highlights, rules
  bg:      "FFFFFF",   // White — content slide background
  body:    "2D2D2D",   // Near-black — body text
  muted:   "666666",   // Gray — citations, slide numbers
  rule:    "CCCCCC",   // Light gray — divider lines
  accent:  "4472C4",   // Mid-blue — callout borders, links
  lightBg: "EBF3FA",   // Light blue — callout fill
  hl:      "FFF2CC",   // Yellow — highlight callout
  white:   "FFFFFF",   // White text on dark bg
  darkBg:  "1A3A5C",   // Slightly lighter navy for title bg variety
};
```

#### Typography

```javascript
const F = {
  face: "Arial",        // Single sans-serif throughout
  title: 26,            // Action titles (24-28 range)
  subtitle: 20,         // Section subtitles
  body: 18,             // Body text / bullets
  small: 14,            // Figure captions, secondary text
  cite: 11,             // Citations, slide numbers
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
Bottom margin: 0.3"  (content height: ~5.1")
Divider line:  y=0.95"
Body area:     y=1.15" to y=5.0"
```

#### Title Slide Design

Dark navy background (`1F4E79`). Sparse, elegant layout:

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  Literature Review  ·  Journal Club                  │  ← y=0.5, 14pt, muted blue
│                                                     │
│  Full Paper Title                                    │  ← y=1.3, 28pt bold, WHITE
│  (2-3 lines max, overflow to smaller)               │
│                                                     │
│  Author1, Author2, Author3, et al.                   │  ← y=2.9, 15pt, light blue
│                                                     │
│  ──── (short accent rule)                            │  ← y=3.3, blue accent
│                                                     │
│  Journal Name                                        │  ← y=3.5, 16pt, accent
│  Published: Month DD, YYYY  |  Vol(Issue):Pages      │
│  IF: X.X  |  JCR Quartile: QX                       │  ← 13pt white
│  DOI: 10.xxxx/xxxx                                   │
│                                                     │
│                                                     │
│  Literature Review Presentation                      │  ← y=5.0, 12pt, muted blue
└─────────────────────────────────────────────────────┘
```

**Title text overflow handling:** If the title is very long (>120 chars), reduce font size to 24pt. If still too long (>160 chars), reduce to 20pt and increase `h` to 2.0. Never let text overflow its box.

#### Content Slide Design (Slides 3-7)

```
┌─────────────────────────────────────────────────────┐
│  Action Title (complete sentence takeaway)           │  ← 26pt bold navy, y=0.2
│  ────────────────────────────────────────────────── │  ← divider at y=0.95
│                                                     │
│  • Bullet point 1 (key finding / statement)          │  ← 18pt, y=1.15
│  • Bullet point 2                                   │
│  • Bullet point 3                                   │
│  • Bullet point 4                                   │
│                                                     │
│  [Figure or table in this region when applicable]    │
│                                                     │
│  Source: (citation)                                  │  ← 11pt muted, bottom
│                                               N / N │  ← slide number
└─────────────────────────────────────────────────────┘
```

#### TOC Slide Design

```
┌─────────────────────────────────────────────────────┐
│  Table of Contents                                   │  ← 26pt bold navy
│  ─────────────────────────────────────────────────  │
│                                                     │
│  01  Background & Objectives                        │  ← 20pt, navy
│  02  Methods & Materials                            │
│  03  Results                                        │
│  04  Discussion & Conclusion                        │
│  05  Inspirations                                   │
│  06  References                                     │
│                                                     │
│  Paper: [Short title]                                │  ← 14pt muted, bottom
└─────────────────────────────────────────────────────┘
```

Each TOC item should be 20pt, with `paraSpaceAfter: 10` between them. Add a small right-aligned section number badge (e.g., "01" in a small navy circle shape) if desired, but keep it minimal.

#### Results Slide with Figures

Two-column layout for figure + interpretation:

```
┌─────────────────────────────────────────────────────┐
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
- If image is very wide (landscape oriented): constrain height, let width fill
- If image is very tall (portrait oriented): constrain width, center horizontally
- Center the image within its bounding box

**If no figures are available:** Make the bullet column wider (`x: 0.5, w: 9.0`) and add more detail.

**Tables:** Use `addTable()` with clean formatting:
- Header row: navy background (`1F4E79`), white text, bold
- Data rows: alternating white and light gray (`F5F5F5`)
- Border: 0.5pt, `CCCCCC`
- Font size: 12-14pt for table content

#### Inspirations Slide

```
┌─────────────────────────────────────────────────────┐
│  Key Takeaways for Our Research                       │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  ◆  Clinical Implications                            │  ← 20pt bold navy
│     • Bullet describing what this means for practice  │  ← 18pt
│                                                     │
│  ◆  Methodological Insights                          │
│     • What the paper did well methodologically       │
│                                                     │
│  ◆  Future Directions                                │
│     • What we can build on from this work            │
│                                                     │
│                                               N / N │
└─────────────────────────────────────────────────────┘
```

Use a small navy diamond or bullet as section marker (◆), or just bold text headers.

#### End Slide

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│                                                     │
│             Thank You                                │  ← 36pt bold white
│                                                     │  on navy background
│             Questions & Discussion                   │
│                                                     │
│                                                     │
│             Q&A                                      │  ← 24pt accent
│                                                     │
│                                                     │
│                                                     │
│  Your Name (optional)                                │  ← 14pt muted
└─────────────────────────────────────────────────────┘
```

Dark navy background matching title slide. Minimal. Elegant. No decorative elements.

### 5.3 PptxGenJS Implementation Notes

Refer to the **pptx** skill's [pptxgenjs.md](../pptx/pptxgenjs.md) for full API reference.

#### CRITICAL RULES (violations cause file corruption or visual bugs)

1. **NEVER use "#" with hex colors** — `"FF0000"` not `"#FF0000"`.
2. **NEVER reuse option objects across calls** — PptxGenJS mutates objects in-place. Use factory functions:
   ```javascript
   // ❌ WRONG — second call gets mutated values
   const opts = { fill: { color: "1F4E79" }, color: "FFFFFF" };
   // ✅ CORRECT — fresh object each time
   const cellOpts = () => ({ fill: { color: "1F4E79" }, color: "FFFFFF" });
   ```
3. **Use `bullet: true`** — never unicode bullet characters (creates double bullets).
4. **Use `breakLine: true`** between text array items; last item omits it.
5. **Figure directory:** Create `figures/` subfolder in the output directory. Download images BEFORE running the script.
6. **Check file existence** before embedding images in the script. If a file doesn't exist, skip it.

#### Standard Helpers (copy into generated script)

```javascript
const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "paper2ppt";
pres.title = "Literature Review";

const C = {
  navy: "1F4E79", blue: "2E75B6", bg: "FFFFFF",
  body: "2D2D2D", muted: "666666", rule: "CCCCCC",
  accent: "4472C4", lightBg: "EBF3FA", hl: "FFF2CC",
  white: "FFFFFF", darkBg: "1A3A5C",
};
const F = { face: "Arial", title: 26, body: 18, small: 14, cite: 11 };

// TOTAL = number of slides (count dynamically based on content)
// Example: 11 for a paper with 2 methods slides + 3 results slides
const TOTAL = 11;

function addSlideNum(slide, n) {
  slide.addText(`${n} / ${TOTAL}`, {
    x: 8.8, y: 5.2, w: 1.0, h: 0.3,
    fontSize: 9, fontFace: F.face, color: C.muted, align: "right",
  });
}

function contentSlide(title, n) {
  const slide = pres.addSlide();
  slide.background = { color: C.bg };
  slide.addText(title, {
    x: 0.5, y: 0.2, w: 9.0, h: 0.75,
    fontSize: F.title, fontFace: F.face, color: C.navy,
    bold: true, valign: "top", margin: 0,
  });
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

pres.writeFile({ fileName: "Literature_Review.pptx" })
  .then(() => console.log("DONE"))
  .catch(err => console.error("ERROR:", err));
```

### 5.4 Text Content Guidelines

- **Bullet points:** 3-5 per slide. Each bullet is 1-2 lines max. Short, scannable, starts with a strong verb or key noun.
- **No paragraphs.** No walls of text. The presenter speaks; the slide supports.
- **Action titles:** Complete sentence stating the takeaway, not a topic label.
  - ✅ "Treatment was cost-effective across all willingness-to-pay thresholds"
  - ❌ "Results"
- **Citations:** Include `(Author, Year)` on each content slide. Full reference on the references slide.

### 5.5 Script Validation Before Running

Before executing the pptxgenjs script:

1. **Syntax check:** `node --check generate_ppt.js`
2. **Check figure files:** Verify all referenced image paths exist:
   ```bash
   for f in figures/*.jpg figures/*.png; do
     [ -s "$f" ] || echo "MISSING or EMPTY: $f"
   done
   ```
3. **Remove missing references:** If a figure file is missing, remove or comment out its `addImage` call
4. **Run with timeout:**
   ```bash
   timeout 60 node generate_ppt.js
   ```
5. **Verify output:** Check that the .pptx file was created and has size > 0 bytes

---

## Phase 6: Quality Assurance

### Content QA

```bash
python -m markitdown Literature_Review.pptx
```

**Checklist:**
- [ ] All required sections present in correct order (Title → TOC → Background → Methods → Results → Discussion → Inspirations → End)
- [ ] Title slide has correct paper title, authors, journal, IF, quartile
- [ ] Action titles are complete sentences (not topic labels)
- [ ] Bullet points are concise (< 15 words each)
- [ ] No hallucinated data, no fabricated numbers
- [ ] All citations are accurate
- [ ] Slide numbers are sequential
- [ ] No placeholder text or artifacts

### Visual QA

If LibreOffice is available:
```bash
python scripts/office/soffice.py --headless --convert-to pdf Literature_Review.pptx
pdftoppm -jpeg -r 150 Literature_Review.pdf slide
```

**Check for:**
- Text overflow — any content cut off or exceeding its box
- Overlapping elements (figure overlapping text, text through shapes)
- Consistent alignment (all elements share the same left/right margins)
- Figure aspect ratio preserved (not stretched or squashed)
- Color contrast adequate
- Slide numbers correctly positioned

### Fix Loop

1. Identify issues → edit the javascript file → re-run with `node generate_ppt.js`
2. Re-run content QA
3. Re-run visual QA on affected slides
4. Repeat until clean

**Assume there are problems.** Your first render is almost never correct. If you found zero issues, look harder.

---

## Error Recovery Summary

| Failure | Recovery |
|---------|----------|
| CrossRef API unreachable | Try NCBI E-utilities → WebSearch → ask user for metadata |
| Figure download fails | Skip figure, use text-only layout |
| PDF download fails | Skip figures entirely, text-only PPT |
| Section text extraction fails | Use CrossRef abstract for background, omit sections |
| No IF/JCR found | Show "N/A", never fabricate |
| Script syntax error | Fix based on Node.js error message, re-validate |
| PPTX file corrupt | Check hex colors (no `#`), check object reuse, regenerate |

---

## Dependencies

```bash
npm install -g pptxgenjs           # PPT generation
pip install "markitdown[pptx]"     # Content QA
pip install pymupdf                 # PDF fallback (optional)
```

---

## Examples

**User (Chinese input + English DOI):**
```
/paper2ppt 10.1186/s12913-026-14482-6 请给我做出一个文献汇报PPT
```

**User (Chinese input + Chinese search):**
```
/paper2ppt 中国结核病潜伏感染筛查 成本效果分析 文献汇报PPT
```

**User (English input + PMID):**
```
/paper2ppt PMID: 13170306 Make a literature review PPT
```

---

## References

- [Publisher Patterns](references/publisher_patterns.md) — Figure/table extraction per publisher
- [CrossRef API Reference](../paper-lookup/references/crossref.md) — DOI metadata API
- [PptxGenJS Tutorial](../pptx/pptxgenjs.md) — PPT generation API
- [Academic PPTX Design Standards](../academic-pptx/SKILL.md) — Design rules

---

## Skill Location

```
D:/Claude/.claude/skills/paper2ppt/
├── SKILL.md                          ← Entry point + workflow (this file)
└── references/
    └── publisher_patterns.md         ← Extraction patterns
```

To **publish on GitHub**, push the entire `paper2ppt/` folder. Both files are needed. Users clone into their `.claude/skills/` directory.
