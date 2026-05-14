# Publisher Patterns for Figure and Table Extraction

This document catalogs proven patterns for extracting figures, tables, and section text from different academic publishers' article pages.

---

## 1. Springer / BMC

**Proven working** — the most reliable source for accessible figures.

### URL patterns
```
https://link.springer.com/article/{DOI}
https://link.springer.com/article/10.1186/s12913-026-14482-6
https://bmchealthservres.biomedcentral.com/articles/{DOI}
```

### Figure extraction

Figures are served from `media.springernature.com`.

**Method 1: Direct HTML search**
```bash
curl -s -L "https://link.springer.com/article/{DOI}" | grep -o 'https://media.springernature.com/[^"]*' | sort -u
```

**Method 2: If the above returns no results**, the page may use JavaScript rendering. Try the `fulltext.html` variant:
```bash
curl -s -L "https://link.springer.com/article/{DOI}?fulltext=true"
```
Or try fetching via the BMC site directly:
```bash
curl -s -L "https://{journal}.biomedcentral.com/articles/{DOI}"
```

**Download pattern:**
```bash
curl -s -o "figures/fig1.jpg" "https://media.springernature.com/..."
```

Most images from `media.springernature.com` are high-resolution JPEGs. Some URLs include sizing parameters — removing `?x64` or similar suffixes can yield larger images.

### Figure caption extraction
Search the HTML for `<figcaption>` elements near the figure images. Also check for `<p class="figcaption">` or `<p><b>Fig. N</b></p>` patterns.

### Section text extraction
Springer HTML pages have clear section IDs:
- `#Abs1` or `#Sec1` — Abstract
- `#Sec2` — Background/Introduction
- `#Sec3` — Methods
- `#Sec4` — Results
- `#Sec5` — Discussion
- `#Sec6` — Conclusion

Use WebFetch on the article URL with a prompt like "extract the Methods section text" to get clean text.

### Table extraction
Tables are rendered as HTML `<table>` elements in the article page. Use WebFetch to extract table data as markdown, then reconstruct with pptxgenjs `addTable()`.

### Example (proven working)
Paper: DOI 10.1186/s12913-026-14482-6
- Figures: Found at `media.springernature.com` — 3 figures + 1 graphical abstract
- Tables: Present as HTML in the page, also check for separate table image downloads
- PDF: Available at `https://link.springer.com/content/pdf/{DOI}.pdf`

---

## 2. PubMed Central (PMC)

### URL pattern
```
https://www.ncbi.nlm.nih.gov/pmc/articles/{PMCID}/
https://pmc.ncbi.nlm.nih.gov/articles/{PMCID}/
```

### Figure extraction

**⚠️ Note:** PMC may be blocked in China. If curl/WebFetch times out, try using the publisher's site (Springer, Elsevier, etc.) via DOI instead.

**Method 1: PMC figure page**
```
https://www.ncbi.nlm.nih.gov/pmc/articles/{PMCID}/figure/
```
This page lists all figures with their download links.

**Method 2: Direct HTML parsing**
```bash
curl -s -L "https://www.ncbi.nlm.nih.gov/pmc/articles/{PMCID}/" | grep -oE 'src="[^"]*\.(jpg|png|gif)"'
```
Images often have paths like:
```
/pmc/articles/PMC{ID}/bin/{filename}.jpg
```
Prepend `https://www.ncbi.nlm.nih.gov` to relative paths.

**Method 3: PMC image archive**
```
https://www.ncbi.nlm.nih.gov/pmc/articles/{PMCID}/bin/
```

### Table extraction
PMC renders tables in the HTML with `class="table"` or inside `<div class="table-wrap">`. Use WebFetch to extract structured table data.

---

## 3. ScienceDirect (Elsevier)

### URL pattern
```
https://www.sciencedirect.com/science/article/pii/{PII}
https://www.sciencedirect.com/science/article/abs/pii/{PII}
```

### Figure extraction

Figures are typically hosted on `ars.els-cdn.com`:

```bash
curl -s -L "https://www.sciencedirect.com/science/article/pii/{PII}" | grep -o 'https://ars.els-cdn.com/[^"]*' | sort -u
```

**Note:** ScienceDirect often requires JavaScript to render the full article. The `abs` (abstract) version may work better for scraping. If the full-text page doesn't load via curl, try:
1. Use the DOI redirect to get the publisher page
2. Try the PDF URL directly: `https://www.sciencedirect.com/science/article/pii/{PII}/pdf`

### PDF fallback
ScienceDirect papers typically have a PDF available at:
```
https://www.sciencedirect.com/science/article/pii/{PII}/pdf
https://pdf.sciencedirect.com/{path}
```

---

## 4. Wiley Online Library

### URL pattern
```
https://onlinelibrary.wiley.com/doi/{DOI}
https://onlinelibrary.wiley.com/doi/full/{DOI}
https://onlinelibrary.wiley.com/doi/abs/{DOI}
```

### Figure extraction
```bash
curl -s -L "https://onlinelibrary.wiley.com/doi/{DOI}" | grep -oE 'src="[^"]*\.(jpg|png)"'
```

Wiley figures are often served through:
- `onlinelibrary.wiley.com/doi/{DOI}/image/`
- `wiley.com/cdn/ff/` or similar CDN paths

### PDF URL pattern
```
https://onlinelibrary.wiley.com/doi/pdf/{DOI}
```

---

## 5. Nature

### URL pattern
```
https://www.nature.com/articles/{DOI_SUFFIX}
https://www.nature.com/articles/s41586-023-06747-5
```

### Figure extraction
Nature uses `media.springernature.com` similar to Springer:
```bash
curl -s -L "https://www.nature.com/articles/{DOI_SUFFIX}" | grep -o 'https://media.springernature.com/[^"]*' | sort -u
```

Nature also has a dedicated figures page:
```
https://www.nature.com/articles/{DOI_SUFFIX}/figures
```

### PDF URL pattern
```
https://www.nature.com/articles/{DOI_SUFFIX}.pdf
```

---

## 6. Oxford Academic (OUP)

### URL pattern
```
https://academic.oup.com/{journal}/article/{volume}/{issue}/{pages}
```

### Figure extraction
Figures are typically on `oup.com` CDN domains. Check the HTML for:
```bash
curl -s -L "https://academic.oup.com/{path}" | grep -oE 'src="[^"]*\.(jpg|png)"'
```

---

## 7. Taylor & Francis

### URL pattern
```
https://www.tandfonline.com/doi/full/{DOI}
https://www.tandfonline.com/doi/abs/{DOI}
```

### Figure extraction
```bash
curl -s -L "https://www.tandfonline.com/doi/full/{DOI}" | grep -oE 'src="[^"]*\.(jpg|png)"'
```

T&F uses `tandfonline.com` CDN for figure hosting.

---

## 8. General HTML Fallback

When the publisher is unknown or not covered above:

```bash
# Step 1: Fetch the article page
curl -s -L "https://doi.org/{DOI}" -o article.html

# Step 2: Extract all image URLs from <figure> elements
grep -oE '<img[^>]*src="([^"]*)"[^>]*>' article.html | grep -oE 'src="([^"]*)"' | grep -oE '"[^"]*"' | tr -d '"'

# Step 3: Filter out icons, logos, and other non-content images
# Keep images that:
# - Are inside <figure> tags
# - Have "fig" in filename or alt text
# - Have width/height > 200px
# - Are .jpg, .png (not .svg, .gif for icons)

# Step 4: Download filtered figures
# curl -s -o "figures/fig1.jpg" "<url>"
```

---

## 9. PDF Fallback (Universal)

When HTML figure extraction fails for any publisher, fall back to PDF rendering with PyMuPDF.

### Download the PDF

Try these in order:
```bash
# 1. Direct PDF from DOI (Springer/Nature/Springer Nature)
curl -s -L -o "paper.pdf" "https://link.springer.com/content/pdf/{DOI}.pdf"

# 2. Via doi.org redirect (many publishers)
curl -s -L -o "paper.pdf" "https://doi.org/{DOI}"

# 3. Try PDF URL pattern for the publisher
# Wiley: https://onlinelibrary.wiley.com/doi/pdf/{DOI}
# ScienceDirect: https://www.sciencedirect.com/science/article/pii/{PII}/pdf
# PMC: https://www.ncbi.nlm.nih.gov/pmc/articles/{PMCID}/pdf/
```

### Render pages as images

```python
import fitz
doc = fitz.open("paper.pdf")

for page_num in range(len(doc)):
    page = doc[page_num]
    # Full page render at 300 DPI
    pix = page.get_pixmap(dpi=300)
    pix.save(f"figures/page_{page_num+1}.png")
```

### Extract section text from PDF

```python
import fitz
doc = fitz.open("paper.pdf")
full_text = ""
for page in doc:
    full_text += page.get_text()
# Save to file for reference
with open("paper_text.txt", "w", encoding="utf-8") as f:
    f.write(full_text)
```

### Crop figures from page renders

PyMuPDF coordinates are in points (72 DPI). At 300 DPI:
- `pixel = point * (300 / 72) ≈ point * 4.167`

To crop a specific region (e.g., top half of page 3):
```python
page = doc[2]  # 0-indexed
# Clip rectangle: (x1, y1, x2, y2) in points
# Top half of A4/letter page: (0, 0, width, height/2)
rect = fitz.Rect(0, 0, page.rect.width, page.rect.height * 0.5)
pix = page.get_pixmap(dpi=300, clip=rect)
pix.save("figures/crop_fig1.png")
```

### Crop tables from page renders

Tables are typically in the lower portion of result pages or on dedicated pages:
```python
# Estimate table location (often bottom 60% of page, excluding header/footer)
page = doc[page_num]
margin_top = page.rect.height * 0.15   # Skip title area
margin_bot = page.rect.height * 0.05   # Skip page number area
rect = fitz.Rect(0, margin_top, page.rect.width, page.rect.height - margin_bot)
pix = page.get_pixmap(dpi=300, clip=rect)
pix.save(f"figures/table_crop_page{page_num+1}.png")
```

For splitting tall tables across two slides, render the full page and use `sizing: { type: "crop" }` in pptxgenjs to show different vertical portions.

---

## Publisher Detection Flowchart

```
Given a URL
    │
    ├─ domain contains "springer" or "biomedcentral" or "nature.com"
    │   → Springer/Nature pattern (most reliable figures)
    │
    ├─ domain contains "ncbi.nlm.nih.gov" or "pmc"
    │   → PMC pattern (may be blocked in China → fallback to DOI)
    │
    ├─ domain contains "sciencedirect" or "elsevier"
    │   → ScienceDirect pattern (JS-heavy, may need PDF fallback)
    │
    ├─ domain contains "wiley" or "onlinelibrary"
    │   → Wiley pattern
    │
    ├─ domain contains "oup.com" or "academic.oup"
    │   → Oxford pattern
    │
    ├─ domain contains "tandfonline" or "taylorandfrancis"
    │   → Taylor & Francis pattern
    │
    ├─ domain contains "doi.org"
    │   → Follow redirect → detect publisher → apply specific pattern
    │
    └─ none of the above
        → General HTML fallback → if fails → PDF fallback
```

---

## Known Limitations & Workarounds

1. **PMC blocked in China** → Always prefer the publisher's site (Springer, Elsevier, etc.) via DOI. Use PMC only as a fallback when no other source exists.

2. **JavaScript-rendered pages** → Many sites (ScienceDirect, some Wiley) require JS to show figures. Try `?fulltext=true` parameters, or fall back to the PDF route.

3. **Rate limiting** → Add `sleep(1)` between requests. For CrossRef API, add `mailto` parameter for polite pool.

4. **Subscription paywalls** → The abstract page usually has figures even behind paywalls. If not, try the PMC version or the PDF.

5. **Figure resolution too low** → HTML thumbnails may be low-res. Try removing size parameters from URLs, or use PDF rendering at 300 DPI.
