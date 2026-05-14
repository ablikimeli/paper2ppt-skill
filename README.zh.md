[**中文**](README.zh.md) | [**English**](README.md)

---

# paper2ppt-skill

> 从论文链接/DOI/PMID 自动生成精美学术文献汇报 PPT

[![Claude Code Skill](https://img.shields.io/badge/Claude%20Code-Skill-1F4E79)](https://claude.ai/code)

一个 **Claude Code Skill**，输入论文链接（或 DOI、PMID、PMCID），自动抓取元数据、影响因子、JCR 分区、论文图片和表格，生成精美的英文文献汇报 PPT。幻灯片数量根据论文内容自动调整。

## 功能

- **多种输入方式：** DOI、PMID、PMCID、论文链接、**本地 PDF 路径**、标题搜索
- **论文验证：** 交叉核对 CrossRef 和 NCBI，避免找错文献
- **自动获取元数据：** 标题、作者、期刊、日期、摘要（来自 CrossRef）
- **影响因子 & JCR 分区：** 通过 WebSearch 自动查询
- **图片提取：** 出版商页面下载 **或 PDF 内嵌图片提取（PyMuPDF）**
- **表格提取：** pdfplumber 结构化提取 + 截图备选
- **混合模式：** 在线元数据 + 本地 PDF 内容（绕过付费墙）
- **学术风格设计：** 双色深蓝渐变、action title、Arial 字体
- **完善容错机制：** 图片缺失时自动切换纯文字版，绝不崩溃

## 安装

```bash
cd .claude/skills/
git clone https://github.com/ablikimeli/paper2ppt-skill.git paper2ppt
```

## 依赖

```bash
npm install -g pptxgenjs          # PPT 生成
pip install "markitdown[pptx]"    # 内容质检（可选）
pip install pymupdf               # PDF 提取（可选）
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

# 通过标题搜索
/paper2ppt "latent tuberculosis infection cost-effectiveness China"
```

## PPT 结构

幻灯片数量根据内容自动调整。以下是核心模块：

| 模块 | 页数 | 说明 |
| :--- | :--- | :--- |
| 标题页 | 1 | 论文题目、作者、期刊、IF、JCR 分区、DOI |
| 目录页 | 1 | 内容导航 |
| 研究背景与目的 | 1-2 | 背景、知识空白、研究目标 |
| 研究方法 | 1-3 | 研究设计、人群、分析方法 |
| 研究结果 | 1-4 | 关键结果 + 图片/表格 |
| 讨论与结论 | 1-2 | 主要发现、局限性 |
| 启发 | 1 | 临床意义、未来方向 |
| 结束页 | 1 | Thank you / Q&A |

> 每个重要发现独立一页。简单论文 8-9 页，复杂论文可达 15 页以上。

## 支持的数据源

| 类型 | 示例 | 说明 |
| :--- | :--- | :--- |
| DOI | `10.1186/s12913-026-14482-6` | 直接使用 |
| PMID | `13170306` / `PMID: 13170306` | 通过 NCBI API 转换 |
| PMCID | `PMC13170306` / `PMCID: PMC13170306` | 通过 NCBI API 转换 |
| 论文链接 | `https://doi.org/...` | 自动识别 |
| 标题搜索 | `"论文标题"` | CrossRef / PubMed / Google Scholar |

## 设计模板

| 模板 | 别名 | 风格 |
| :--- | :--- | :--- |
| Academic Navy | `navy`（默认） | 蓝 + 橙，装饰圆形，衬线标题，色盲友好 |
| Academic Teal | `teal` | 青绿 + 粉，重叠圆形，菱形装饰，医学 |
| Slate Modern | `slate` | 石板灰 + 朱红，三角切角，折线装饰，科技 |
| Nature Dark | `nature` | 午夜 + 天蓝/橙，几何点线，高端 |

```bash
/paper2ppt -t teal 10.1186/s12913-026-14482-6
```

## 文件结构

```text
paper2ppt/
├── SKILL.md                          # Skill 入口和工作流（890 行）
├── README.md                         # 英文说明
├── README.zh.md                      # 中文说明
├── references/
│   └── publisher_patterns.md         # 各出版商图片/表格提取模式（362 行）
└── templates/
    ├── academic-navy.md              # 蓝 + 橙（色盲友好）
    ├── academic-teal.md              # 青绿 + 粉
    ├── slate-modern.md               # 石板灰 + 朱红，几何风格
    ├── nature-dark.md                # 午夜 + 天蓝/橙，高端
    └── samples/
        ├── generate_all.js           # 示例 PPTX 生成器
        ├── template_navy.pptx
        ├── template_teal.pptx
        ├── template_slate.pptx
        └── template_nature.pptx
```

## 设计规范

| 项目 | 说明 |
| :--- | :--- |
| 配色 | 深蓝 `1F4E79` 为主色，白色背景，灰色辅助 |
| 字体 | Arial 统一字体（标题 26pt / 正文 18pt / 引用 11pt） |
| 版式 | 0.5" 统一边距，action title + 分割线 + 正文 |
| 图片 | 左图右文布局，等比缩放，避免拉伸 |
| 表格 | 深蓝表头，交替行颜色，干净边框 |

## 容错机制

| 失败场景 | 恢复策略 |
| :------- | :------- |
| CrossRef API 不可达 | 换用 NCBI E-utilities / WebSearch |
| 图片下载失败 | 跳过图片，纯文字版布局 |
| PDF 下载失败 | 纯文字版 PPT |
| IF/JCR 查不到 | 显示 "N/A"，绝不伪造 |
| 脚本语法错误 | 根据 Node.js 报错修复后重试 |

## 许可

MIT
