[**中文**](README.zh.md) | [**English**](README.md)

---

# paper2ppt-skill

> Generate academic literature review PPT from paper URL/DOI/PMID

[![Claude Code Skill](https://img.shields.io/badge/Claude%20Code-Skill-1F4E79)](https://claude.ai/code)

A **Claude Code Skill** that generates a professional academic literature review PPT from a paper identifier. Slide count adapts to paper content.

## Features

- **Multiple input formats:** DOI, PMID, PMCID, paper URL, **local PDF path**, title search
- **Paper verification:** Cross-validates between CrossRef and NCBI to avoid wrong papers
- **Auto metadata:** title, authors, journal, date, abstract from CrossRef
- **Impact Factor & JCR quartile:** via WebSearch
- **Figure extraction:** from publisher HTML **or embedded PDF images via PyMuPDF**
- **Table extraction:** pdfplumber structured extraction, screenshot with fallback
- **Hybrid mode:** online metadata + local PDF content (bypasses paywalls)
- **Academically styled:** two-tone navy design, action titles, Arial font
- **Graceful fallbacks:** text-only layout when figures unavailable; never crashes

## Installation

```bash
cd .claude/skills/
git clone https://github.com/ablikimeli/paper2ppt-skill.git paper2ppt
```

## Dependencies

```bash
npm install -g pptxgenjs          # PPT generation
pip install "markitdown[pptx]"    # Content QA (optional)
pip install pymupdf               # PDF fallback (optional)
```

## Usage

Invoke in Claude Code:

```bash
# By DOI
/paper2ppt 10.1186/s12913-026-14482-6 please make a literature review PPT

# By PMID
/paper2ppt PMID: 13170306

# By PMCID
/paper2ppt PMCID: PMC13170306

# By paper URL
/paper2ppt https://doi.org/10.1186/s12913-026-14482-6

# By title search
/paper2ppt "latent tuberculosis infection cost-effectiveness China"
```

## PPT Structure

Slide count adapts to content. These are the required sections:

| Section | Slides | Description |
| :------ | :----- | :---------- |
| Title Slide | 1 | Paper info, IF, JCR quartile, DOI |
| Table of Contents | 1 | Navigation |
| Background & Objectives | 1-2 | Rationale, gap, objectives |
| Methods & Materials | 1-3 | Design, population, analysis |
| Results | 1-4 | Key findings + figures/tables |
| Discussion & Conclusion | 1-2 | Main findings, limitations |
| Inspirations | 1 | Implications & future directions |
| End Page | 1 | Thank you / Q&A |

> Each major finding gets its own slide. Simple papers: 8-9 slides. Complex papers: 15+ slides.

## Input Sources

| Type | Example | Method |
| :--- | :------ | :----- |
| DOI | `10.1186/s12913-026-14482-6` | Direct |
| PMID | `13170306` / `PMID: 13170306` | NCBI API to DOI |
| PMCID | `PMC13170306` / `PMCID: PMC13170306` | NCBI API to DOI |
| URL | `https://doi.org/...` | Auto-detect |
| Title | `"paper title"` | CrossRef / PubMed / Google Scholar |

## File Structure

```text
paper2ppt/
├── SKILL.md                          # Entry point & workflow (731 lines)
├── README.md                         # English readme
├── README.zh.md                      # Chinese readme
└── references/
    └── publisher_patterns.md         # Publisher-specific extraction patterns (362 lines)
```

## Design Standards

| Rule | Detail |
| :--- | :----- |
| Color | Navy `1F4E79` primary, white bg, gray muted |
| Font | Arial throughout (title 26pt / body 18pt / cite 11pt) |
| Layout | 0.5" uniform margin, action title + divider + content |
| Figures | Left-right layout, aspect-ratio preserved |
| Tables | Navy header, alternating row colors, clean border |

## Error Recovery

| Failure | Recovery |
| :------ | :------- |
| CrossRef unreachable | Fallback to NCBI E-utilities / WebSearch |
| Figure download fails | Skip figure, use text-only layout |
| PDF download fails | Text-only PPT |
| IF/JCR not found | Show "N/A", never fabricate |
| Script syntax error | Fix per Node.js error, re-run |

## License

MIT
