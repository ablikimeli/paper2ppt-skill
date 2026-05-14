# paper2ppt-skill

> 从论文链接/DOI/PMID 自动生成精美学术文献汇报 PPT | Generate academic literature review PPT from paper URL/DOI/PMID

[![Claude Code Skill](https://img.shields.io/badge/Claude%20Code-Skill-1F4E79)](https://claude.ai/code)

一个 **Claude Code Skill**，输入论文链接（或 DOI、PMID、PMCID），自动抓取元数据、影响因子、JCR 分区、论文图片和表格，生成 8 页精美的英文文献汇报 PPT。

---

## 功能

- ✅ 支持 DOI / PMID / PMCID / 论文标题 / 关键词 等多种输入方式
- ✅ 自动从 CrossRef 获取论文元数据（标题、作者、期刊、日期、摘要）
- ✅ 通过 WebSearch 查询 Impact Factor 和 JCR 分区
- ✅ 自动下载论文图片（Figure）和表格
- ✅ 8 页标准文献汇报 PPT（英文）
- ✅ 学术风格设计：深蓝配色、Arial 字体、统一版式
- ✅ 内置容错机制（图片下载失败 → 纯文字版，不报错）

## 安装

```bash
# 进入 Claude Code 的 skills 目录
cd .claude/skills/

# 克隆本仓库
git clone https://github.com/ablikimeli/paper2ppt-skill.git paper2ppt
```

## 依赖

```bash
# PPT 生成
npm install -g pptxgenjs

# 内容质检（可选）
pip install "markitdown[pptx]"

# PDF 下载（可选，用于图片提取失败时的备选方案）
pip install pymupdf
```

## 使用方法

在 Claude Code 中直接调用：

```bash
# 通过 DOI
/paper2ppt 10.1186/s12913-026-14482-6 请给我做出一个文献汇报PPT

# 通过 PMID
/paper2ppt PMID: 13170306

# 通过 PMCID
/paper2ppt PMCID: PMC13170306

# 通过论文链接
/paper2ppt https://doi.org/10.1186/s12913-026-14482-6

# 通过论文标题搜索
/paper2ppt "latent tuberculosis infection cost-effectiveness China"
```

## PPT 结构

| 页码 | 内容 |
|------|------|
| 1 | **标题页** — 论文题目、作者、期刊、IF、JCR 分区、DOI |
| 2 | **目录页** — 6 项内容导航 |
| 3 | **研究背景与目的** — 研究背景、知识空白、研究目标 |
| 4 | **研究方法** — 研究设计、人群、方法、统计分析 |
| 5 | **研究结果** — 关键结果 + 图片/表格 |
| 6 | **讨论与结论** — 主要发现、与既往研究对比、局限性 |
| 7 | **启发** — 临床意义、方法学启示、未来方向 |
| 8 | **结束页** — Thank you / Q&A |

## 文件结构

```
paper2ppt/
├── SKILL.md                          # Skill 入口和工作流（731 行）
├── README.md                         # 本文档
└── references/
    └── publisher_patterns.md         # 各出版商图片/表格提取模式（362 行）
```

## 支持的数据源

| 类型 | 格式示例 | 说明 |
|------|----------|------|
| DOI | `10.1186/s12913-026-14482-6` | 直接使用 |
| PMID | `13170306` / `PMID: 13170306` | 通过 NCBI API 转换 |
| PMCID | `PMC13170306` / `PMCID: PMC13170306` | 通过 NCBI API 转换 |
| 论文链接 | `https://doi.org/...` / PubMed / Springer / etc. | 自动识别 |
| 标题搜索 | `"论文标题"` | 通过 CrossRef / PubMed / Google Scholar 搜索 |

## 设计规范

- **配色：** 深蓝 `1F4E79` 为主色，白色背景，灰色辅助
- **字体：** Arial 统一字体（标题 26pt / 正文 18pt / 引用 11pt）
- **版式：** 0.5" 统一边距，action title + 分割线 + 正文
- **图片：** 左图右文布局，等比缩放，避免拉伸

## 容错机制

| 失败场景 | 恢复策略 |
|----------|----------|
| CrossRef API 不可达 | 换用 NCBI E-utilities → WebSearch |
| 图片下载失败 | 跳过图片，纯文字版布局 |
| PDF 下载失败 | 纯文字版 PPT |
| IF/JCR 查不到 | 显示 "N/A"，绝不伪造 |
| 脚本语法错误 | 根据 Node.js 报错修复后重试 |

## 许可

MIT
