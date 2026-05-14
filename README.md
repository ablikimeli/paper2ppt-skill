# paper2ppt-skill

> 从论文链接/DOI/PMID 自动生成精美学术文献汇报 PPT  
> Generate academic literature review PPT from paper URL/DOI/PMID

[![Claude Code Skill](https://img.shields.io/badge/Claude%20Code-Skill-1F4E79)](https://claude.ai/code)

A **Claude Code Skill** that generates a professional 8-slide academic literature review PPT from a paper identifier — just paste a DOI, PMID, PMCID, or paper URL.

一个 **Claude Code Skill**，输入论文链接（或 DOI、PMID、PMCID），自动抓取元数据、影响因子、JCR 分区、论文图片和表格，生成 8 页精美的英文文献汇报 PPT。

---

## Features / 功能

- **Multiple input formats** / 多种输入方式: DOI, PMID, PMCID, paper URL, title search
- **Auto metadata** / 自动元数据: title, authors, journal, date, abstract from CrossRef
- **Impact Factor & JCR quartile** / IF 与 JCR 分区: via WebSearch
- **Auto figure download** / 自动下载图片: from publisher HTML or PDF fallback
- **8-slide English PPT** / 8 页英文 PPT: academically styled, ready to present
- **Graceful fallbacks** / 容错机制: text-only layout when figures unavailable

## Installation / 安装

```bash
# Enter your Claude Code skills directory
cd .claude/skills/

# Clone this repository
git clone https://github.com/ablikimeli/paper2ppt-skill.git paper2ppt
```

## Dependencies / 依赖

```bash
# PPT generation
npm install -g pptxgenjs

# Content QA (optional)
pip install "markitdown[pptx]"

# PDF fallback (optional, for figure extraction)
pip install pymupdf
```

## Usage / 使用方法

Invoke in Claude Code:

```bash
# By DOI
/paper2ppt 10.1186/s12913-026-14482-6 请给我做出一个文献汇报PPT

# By PMID
/paper2ppt PMID: 13170306

# By PMCID
/paper2ppt PMCID: PMC13170306

# By paper URL
/paper2ppt https://doi.org/10.1186/s12913-026-14482-6

# By title search
/paper2ppt "latent tuberculosis infection cost-effectiveness China"
```

## PPT Structure / PPT 结构

| Slide | Chinese | English |
| :---- | :------ | :------ |
| 1 | 标题页 — 题目、作者、期刊、IF、JCR、DOI | Title — paper info, IF, JCR quartile |
| 2 | 目录页 — 6 项导航 | Table of Contents |
| 3 | 研究背景与目的 | Background & Objectives |
| 4 | 研究方法 | Methods & Materials |
| 5 | 研究结果（含图片/表格） | Results (with figures/tables) |
| 6 | 讨论与结论 | Discussion & Conclusion |
| 7 | 启发与借鉴 | Inspirations |
| 8 | 结束页 — Thank you / Q&A | End Page |

## Input Sources / 支持的数据源

| Type | Example | Method |
| :--- | :------ | :----- |
| DOI | `10.1186/s12913-026-14482-6` | Direct |
| PMID | `13170306` / `PMID: 13170306` | NCBI API to DOI |
| PMCID | `PMC13170306` / `PMCID: PMC13170306` | NCBI API to DOI |
| URL | `https://doi.org/...` / PubMed / Springer / etc. | Auto-detect |
| Title | `"paper title"` | CrossRef / PubMed / Google Scholar |

## File Structure / 文件结构

```
paper2ppt/
├── SKILL.md                          # Entry point & workflow (731 lines)
├── README.md                         # This file
└── references/
    └── publisher_patterns.md         # Publisher-specific extraction patterns (362 lines)
```

## Design Standards / 设计规范

| Rule / 规范 | Detail / 说明 |
| :---------- | :------------- |
| Color / 配色 | Navy `1F4E79` primary, white bg, gray muted |
| Font / 字体 | Arial throughout (title 26pt / body 18pt / cite 11pt) |
| Layout / 版式 | 0.5" uniform margin, action title + divider + content |
| Figures / 图片 | Left-right layout, aspect-ratio preserved |
| Tables / 表格 | Navy header, alternating row colors, clean border |

## Error Recovery / 容错机制

| Failure / 失败场景 | Recovery / 恢复策略 |
| :----------------- | :------------------ |
| CrossRef unreachable | Fallback to NCBI E-utilities → WebSearch |
| Figure download fails | Skip figure, use text-only layout |
| PDF download fails | Text-only PPT |
| IF/JCR not found | Show "N/A", never fabricate |
| Script syntax error | Fix per Node.js error, re-run |

## License / 许可

MIT
