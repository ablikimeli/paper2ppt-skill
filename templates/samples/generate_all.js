const pptxgen = require("pptxgenjs");
const path = require("path");

const outDir = __dirname;
const TOTAL = 6;

function addSlideNum(slide, n) {
  slide.addText(`${n} / ${TOTAL}`, {
    x: 8.8, y: 5.2, w: 1.0, h: 0.3,
    fontSize: 9, fontFace: "Arial", color: "999999", align: "right",
  });
}

// ─── SAMPLE DATA ────────────────────────────────────────

const title = "Cost-effectiveness of Latent Tuberculosis Infection Testing and Preventive Treatment Among TB Contacts in China: A Markov Model";
const authors = "G. Kucsko, J. Smith, L. Wang, et al.";
const journal = "BMC Health Services Research";
const dateStr = "January 15, 2026";
const volIssue = "26(1):45-58";
const doi = "10.1186/s12913-026-14482-6";
const ifVal = "2.8";
const quartile = "Q1";
const bullets = [
  "TB remains a major public health challenge in China with high latent infection rates",
  "Current screening and preventive treatment coverage is suboptimal",
  "Limited evidence on cost-effectiveness from Chinese healthcare system perspective",
  "This study evaluates three testing strategies using a Markov model",
];
const sections = ["Background & Objectives","Methods & Materials","Results","Discussion & Conclusion","Inspirations"];

// ═══════════════════════════════════════════════════════════
// TEMPLATE 1: ACADEMIC NAVY (Deep Navy + Gold, decorative circles)
// ═══════════════════════════════════════════════════════════
function generateNavy() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "paper2ppt";
  pres.title = "Literature Review - Navy";

  // ── Title Slide ──
  const s1 = pres.addSlide();
  s1.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:5.625, fill:{color:"1A3A5C"} });
  s1.addShape(pres.shapes.OVAL, { x:7.0, y:-1.0, w:4.0, h:4.0, fill:{color:"2B5A8A", transparency:60} });
  s1.addShape(pres.shapes.OVAL, { x:8.5, y:2.6, w:0.4, h:0.4, fill:{color:"C9A84C", transparency:30} });
  s1.addShape(pres.shapes.RECTANGLE, { x:0, y:4.5, w:10, h:1.125, fill:{color:"2B5A8A"} });
  s1.addShape(pres.shapes.RECTANGLE, { x:0, y:4.5, w:10, h:0.04, fill:{color:"C9A84C"} });
  s1.addText("Literature Review  ·  Journal Club", { x:0.8, y:0.5, w:8.4, h:0.4, fontSize:14, fontFace:"Arial", color:"B8C9E0" });
  s1.addText(title, { x:0.8, y:1.3, w:7.5, h:1.8, fontSize:30, fontFace:"Georgia", color:"FFFFFF", bold:true, valign:"top", margin:0 });
  s1.addShape(pres.shapes.RECTANGLE, { x:0.8, y:3.2, w:1.5, h:0.04, fill:{color:"C9A84C"} });
  s1.addText(authors, { x:0.8, y:3.45, w:8.4, h:0.35, fontSize:15, fontFace:"Arial", color:"B8C9E0" });
  s1.addText(`${journal}\n${dateStr}  |  ${volIssue}\nIF: ${ifVal}  |  JCR: ${quartile}\nDOI: ${doi}`, { x:0.8, y:3.85, w:8.4, h:0.55, fontSize:12, fontFace:"Arial", color:"FFFFFF", valign:"top", lineSpacingMultiple:1.2 });
  s1.addText("Literature Review Presentation", { x:0.8, y:5.1, w:8.4, h:0.25, fontSize:12, fontFace:"Arial", color:"C9A84C" });

  // ── Content Slide ──
  const s2 = pres.addSlide();
  s2.background = { color: "FFFFFF" };
  s2.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.04, fill:{color:"1A3A5C"} });
  s2.addShape(pres.shapes.OVAL, { x:9.2, y:0.15, w:0.35, h:0.35, fill:{color:"C9A84C"} });
  s2.addShape(pres.shapes.RECTANGLE, { x:0, y:0.5, w:0.06, h:4.6, fill:{color:"1A3A5C"} });
  s2.addText("LTBI screening is cost-effective in the Chinese healthcare context", { x:0.4, y:0.2, w:8.8, h:0.7, fontSize:28, fontFace:"Georgia", color:"1A3A5C", bold:true, valign:"top", margin:0 });
  s2.addShape(pres.shapes.RECTANGLE, { x:0.4, y:0.9, w:8.8, h:0.02, fill:{color:"D1D5DB"} });
  addSlideNum(s2, 2);
  const items = bullets.map((b, i) => ({ text: b, options: { bullet: true, breakLine: i < bullets.length - 1 } }));
  s2.addText(items, { x:0.4, y:1.15, w:9.1, h:2.2, fontSize:18, fontFace:"Arial", color:"2D2D2D", paraSpaceAfter:8, valign:"top" });
  // Highlight card with gold accent + navy dot
  s2.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:0.4, y:3.5, w:9.2, h:0.75, fill:{color:"F8F6F0"}, line:{color:"D1D5DB", width:0.5}, rectRadius:0.06 });
  s2.addShape(pres.shapes.RECTANGLE, { x:0.4, y:3.5, w:0.06, h:0.75, fill:{color:"C9A84C"} });
  s2.addShape(pres.shapes.OVAL, { x:9.3, y:3.65, w:0.2, h:0.2, fill:{color:"2B5A8A"} });
  s2.addText("Key Finding: IGRA-based strategy dominated TST across all WTP thresholds", { x:0.65, y:3.55, w:8.5, h:0.65, fontSize:16, fontFace:"Arial", color:"1A3A5C", valign:"middle" });

  // ── TOC Slide ──
  const s3 = pres.addSlide();
  s3.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:5.625, fill:{color:"1A3A5C"} });
  s3.addShape(pres.shapes.OVAL, { x:-1.0, y:3.5, w:3.5, h:3.5, fill:{color:"2B5A8A", transparency:65} });
  s3.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.04, fill:{color:"C9A84C"} });
  s3.addText("Table of Contents", { x:0.8, y:0.5, w:8.4, h:0.6, fontSize:28, fontFace:"Georgia", color:"FFFFFF", bold:true, margin:0 });
  const tocItems = sections.map((s, i) => ({ text: s, options: { bullet: false, breakLine: i < sections.length - 1 } }));
  s3.addText(tocItems, { x:0.8, y:1.5, w:8.4, h:3.0, fontSize:22, fontFace:"Arial", color:"FFFFFF", paraSpaceAfter:14, valign:"top" });

  return pres.writeFile({ fileName: path.join(outDir, "template_navy.pptx") }).then(() => console.log("NAVY done"));
}

// ═══════════════════════════════════════════════════════════
// TEMPLATE 2: ACADEMIC TEAL (Purple + Pink, overlapping circles, diamond accents)
// ═══════════════════════════════════════════════════════════
function generateTeal() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "paper2ppt";
  pres.title = "Literature Review - Teal";

  // ── Title Slide ──
  const s1 = pres.addSlide();
  s1.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:5.625, fill:{color:"5B2C8E"} });
  s1.addShape(pres.shapes.OVAL, { x:6.5, y:-0.5, w:3.5, h:3.5, fill:{color:"3B1C6E", transparency:50} });
  s1.addShape(pres.shapes.OVAL, { x:7.5, y:0.5, w:2.5, h:2.5, fill:{color:"E8DAEF", transparency:60} });
  s1.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.06, fill:{color:"CC79A7"} });
  s1.addShape(pres.shapes.RECTANGLE, { x:0, y:4.2, w:10, h:1.425, fill:{color:"3B1C6E"} });
  s1.addText("Literature Review  ·  Journal Club", { x:0.8, y:0.5, w:8.4, h:0.4, fontSize:14, fontFace:"Arial", color:"E8DAEF" });
  s1.addText(title, { x:0.8, y:1.3, w:8.4, h:1.8, fontSize:30, fontFace:"Arial", color:"FFFFFF", bold:true, valign:"top", margin:0 });
  s1.addText(authors, { x:0.8, y:3.1, w:8.4, h:0.4, fontSize:15, fontFace:"Arial", color:"E8DAEF" });
  s1.addShape(pres.shapes.RECTANGLE, { x:0.8, y:3.55, w:1.5, h:0.03, fill:{color:"CC79A7"} });
  s1.addText(`${journal}\n${dateStr}  |  ${volIssue}\nIF: ${ifVal}  |  JCR: ${quartile}\nDOI: ${doi}`, { x:0.8, y:3.7, w:8.4, h:0.6, fontSize:13, fontFace:"Arial", color:"FFFFFF", valign:"top", lineSpacingMultiple:1.3 });
  s1.addText("Literature Review Presentation", { x:0.8, y:5.0, w:8.4, h:0.3, fontSize:12, fontFace:"Arial", color:"CC79A7" });

  // ── Content Slide with badge ──
  const s2 = pres.addSlide();
  s2.background = { color: "FFFFFF" };
  s2.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.65, fill:{color:"5B2C8E"} });
  s2.addShape(pres.shapes.DIAMOND, { x:9.3, y:0.15, w:0.3, h:0.3, fill:{color:"E8DAEF"} });
  s2.addText("LTBI screening is cost-effective in the Chinese healthcare context", { x:0.5, y:0.08, w:9.0, h:0.5, fontSize:26, fontFace:"Arial", color:"FFFFFF", bold:true, valign:"middle", margin:0 });
  s2.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:0.5, y:0.8, w:1.3, h:0.3, fill:{color:"CC79A7"}, rectRadius:0.04 });
  s2.addText("BACKGROUND", { x:0.5, y:0.8, w:1.3, h:0.3, fontSize:10, fontFace:"Arial", color:"FFFFFF", bold:true, align:"center", valign:"middle" });
  s2.addShape(pres.shapes.DIAMOND, { x:1.9, y:0.85, w:0.18, h:0.18, fill:{color:"5B2C8E"} });
  addSlideNum(s2, 2);
  const items = bullets.map((b, i) => ({ text: b, options: { bullet: true, breakLine: i < bullets.length - 1 } }));
  s2.addText(items, { x:0.5, y:1.3, w:9.0, h:2.0, fontSize:18, fontFace:"Arial", color:"1F2937", paraSpaceAfter:8, valign:"top" });
  s2.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:0.5, y:3.5, w:9.0, h:0.7, fill:{color:"FFFFFF"}, line:{color:"D1D5DB", width:0.5}, rectRadius:0.06 });
  s2.addShape(pres.shapes.RECTANGLE, { x:0.5, y:3.5, w:0.06, h:0.7, fill:{color:"CC79A7"} });
  s2.addShape(pres.shapes.DIAMOND, { x:9.2, y:3.73, w:0.18, h:0.18, fill:{color:"E8DAEF"} });
  s2.addText("Finding: IGRA strategy cost-effective at $30,000/QALY threshold", { x:0.7, y:3.55, w:8.6, h:0.6, fontSize:16, fontFace:"Arial", color:"5B2C8E", valign:"middle" });

  // ── TOC Slide ──
  const s3 = pres.addSlide();
  s3.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:5.625, fill:{color:"5B2C8E"} });
  s3.addShape(pres.shapes.OVAL, { x:-1.0, y:3.0, w:4.0, h:4.0, fill:{color:"3B1C6E", transparency:55} });
  s3.addShape(pres.shapes.OVAL, { x:7.5, y:-0.8, w:3.0, h:3.0, fill:{color:"E8DAEF", transparency:65} });
  s3.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.06, fill:{color:"CC79A7"} });
  s3.addText("Table of Contents", { x:0.8, y:0.5, w:8.4, h:0.6, fontSize:28, fontFace:"Arial", color:"FFFFFF", bold:true, margin:0 });
  const tocItems = sections.map((s, i) => ({ text: s, options: { bullet: false, breakLine: i < sections.length - 1 } }));
  s3.addText(tocItems, { x:0.8, y:1.5, w:8.4, h:3.0, fontSize:22, fontFace:"Arial", color:"FFFFFF", paraSpaceAfter:14, valign:"top" });

  return pres.writeFile({ fileName: path.join(outDir, "template_teal.pptx") }).then(() => console.log("TEAL done"));
}

// ═══════════════════════════════════════════════════════════
// TEMPLATE 3: SLATE MODERN (Slate + Vermillion, triangles, chevrons)
// ═══════════════════════════════════════════════════════════
function generateSlate() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "paper2ppt";
  pres.title = "Literature Review - Slate";

  // ── Title Slide ──
  const s1 = pres.addSlide();
  s1.background = { color: "3D4F5F" };
  s1.addShape(pres.shapes.RIGHT_TRIANGLE, { x:7.5, y:0, w:2.5, h:2.5, fill:{color:"D55E00"} });
  s1.addShape(pres.shapes.RECTANGLE, { x:0, y:5.3, w:10, h:0.325, fill:{color:"D55E00"} });
  s1.addText("Literature Review  ·  Journal Club", { x:0.8, y:0.5, w:8.4, h:0.4, fontSize:14, fontFace:"Arial", color:"D55E00" });
  s1.addText(title, { x:0.8, y:1.3, w:7.0, h:1.8, fontSize:30, fontFace:"Arial", color:"FFFFFF", bold:true, valign:"top", margin:0 });
  s1.addText(authors, { x:0.8, y:3.1, w:8.4, h:0.4, fontSize:15, fontFace:"Arial", color:"95A5A6" });
  s1.addShape(pres.shapes.RECTANGLE, { x:0.8, y:3.55, w:1.5, h:0.03, fill:{color:"D55E00"} });
  s1.addText(`${journal}\n${dateStr}  |  ${volIssue}\nIF: ${ifVal}  |  JCR: ${quartile}\nDOI: ${doi}`, { x:0.8, y:3.7, w:8.4, h:0.6, fontSize:13, fontFace:"Arial", color:"CBD5E1", valign:"top", lineSpacingMultiple:1.3 });

  // ── Content Slide ──
  const s2 = pres.addSlide();
  s2.background = { color: "FFFFFF" };
  s2.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:0.06, h:5.2, fill:{color:"D55E00"} });
  s2.addShape(pres.shapes.RIGHT_TRIANGLE, { x:0, y:5.2, w:0.35, h:0.425, fill:{color:"D55E00"} });
  s2.addShape(pres.shapes.CHEVRON, { x:9.1, y:0.15, w:0.5, h:0.3, fill:{color:"3D4F5F", transparency:20} });
  s2.addText("LTBI screening is cost-effective in the Chinese healthcare context", { x:0.4, y:0.2, w:9.1, h:0.75, fontSize:28, fontFace:"Arial", color:"3D4F5F", bold:true, valign:"top", margin:0 });
  s2.addShape(pres.shapes.RECTANGLE, { x:0.4, y:0.95, w:9.1, h:0.025, fill:{color:"CBD5E1"} });
  addSlideNum(s2, 2);
  const items = bullets.map((b, i) => ({ text: b, options: { bullet: true, breakLine: i < bullets.length - 1 } }));
  s2.addText(items, { x:0.4, y:1.15, w:9.1, h:2.0, fontSize:18, fontFace:"Arial", color:"0F172A", paraSpaceAfter:8, valign:"top" });
  s2.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:0.5, y:3.3, w:9.0, h:0.85, fill:{color:"F8F9FA"}, line:{color:"CBD5E1", width:0.5}, rectRadius:0.06 });
  s2.addShape(pres.shapes.OVAL, { x:0.6, y:3.38, w:0.7, h:0.7, fill:{color:"D55E00"} });
  s2.addText("87%", { x:0.6, y:3.38, w:0.7, h:0.7, fontSize:22, fontFace:"Arial", color:"FFFFFF", bold:true, align:"center", valign:"middle" });
  s2.addText("Probability of cost-effectiveness at $30,000/QALY threshold", { x:1.6, y:3.35, w:7.6, h:0.75, fontSize:16, fontFace:"Arial", color:"3D4F5F", valign:"middle" });
  s2.addShape(pres.shapes.RIGHT_TRIANGLE, { x:9.0, y:3.65, w:0.4, h:0.4, fill:{color:"D55E00", transparency:70} });

  // ── TOC Slide ──
  const s3 = pres.addSlide();
  s3.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:5.625, fill:{color:"3D4F5F"} });
  s3.addShape(pres.shapes.RIGHT_TRIANGLE, { x:8.5, y:0, w:1.5, h:1.5, fill:{color:"D55E00", transparency:50} });
  s3.addShape(pres.shapes.RECTANGLE, { x:0, y:5.3, w:10, h:0.325, fill:{color:"D55E00"} });
  s3.addText("Table of Contents", { x:0.8, y:0.5, w:8.4, h:0.6, fontSize:28, fontFace:"Arial", color:"FFFFFF", bold:true, margin:0 });
  const tocItems = sections.map((s, i) => ({ text: s, options: { bullet: false, breakLine: i < sections.length - 1 } }));
  s3.addText(tocItems, { x:0.8, y:1.5, w:8.4, h:3.0, fontSize:22, fontFace:"Arial", color:"FFFFFF", paraSpaceAfter:14, valign:"top" });

  return pres.writeFile({ fileName: path.join(outDir, "template_slate.pptx") }).then(() => console.log("SLATE done"));
}

// ═══════════════════════════════════════════════════════════
// TEMPLATE 4: NATURE DARK (Warm Ivory + Muted Blue/Gold, geometric dots & lines)
// ═══════════════════════════════════════════════════════════
function generateNature() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "paper2ppt";
  pres.title = "Literature Review - Nature";

  // ── Title Slide (warm ivory, no black) ──
  const s1 = pres.addSlide();
  s1.background = { color: "F5F0E8" };
  s1.addShape(pres.shapes.RECTANGLE, { x:0, y:0.15, w:10, h:0.01, fill:{color:"4A6FA5"} });
  s1.addShape(pres.shapes.OVAL, { x:0.8, y:0.12, w:0.06, h:0.06, fill:{color:"4A6FA5"} });
  s1.addShape(pres.shapes.OVAL, { x:5.0, y:0.12, w:0.06, h:0.06, fill:{color:"4A6FA5"} });
  s1.addShape(pres.shapes.OVAL, { x:9.2, y:0.12, w:0.06, h:0.06, fill:{color:"4A6FA5"} });
  s1.addShape(pres.shapes.OVAL, { x:8.8, y:0.55, w:0.12, h:0.12, fill:{color:"B8860B"} });
  s1.addText("Literature Review  ·  Journal Club", { x:0.8, y:0.5, w:8.4, h:0.4, fontSize:13, fontFace:"Arial", color:"4A6FA5" });
  s1.addText(title, { x:0.8, y:1.4, w:8.4, h:1.8, fontSize:32, fontFace:"Georgia", color:"2D2D2D", bold:true, valign:"top", margin:0 });
  s1.addShape(pres.shapes.RECTANGLE, { x:0.8, y:3.4, w:1.0, h:0.025, fill:{color:"4A6FA5"} });
  s1.addText(authors, { x:0.8, y:3.6, w:8.4, h:0.35, fontSize:14, fontFace:"Arial", color:"6B7280" });
  s1.addText(`${journal}\n${dateStr}  |  ${volIssue}\nIF: ${ifVal}  |  JCR: ${quartile}\nDOI: ${doi}`, { x:0.8, y:4.0, w:8.4, h:0.55, fontSize:12, fontFace:"Arial", color:"2D2D2D", valign:"top", lineSpacingMultiple:1.2 });
  s1.addShape(pres.shapes.RECTANGLE, { x:0, y:5.15, w:10, h:0.01, fill:{color:"B8860B"} });
  s1.addShape(pres.shapes.OVAL, { x:0.8, y:5.12, w:0.06, h:0.06, fill:{color:"B8860B"} });
  s1.addShape(pres.shapes.OVAL, { x:5.0, y:5.12, w:0.06, h:0.06, fill:{color:"B8860B"} });
  s1.addShape(pres.shapes.OVAL, { x:9.2, y:5.12, w:0.06, h:0.06, fill:{color:"B8860B"} });
  s1.addText("Literature Review Presentation", { x:0.8, y:5.25, w:8.4, h:0.25, fontSize:11, fontFace:"Arial", color:"4A6FA5" });

  // ── Content Slide ──
  const s2 = pres.addSlide();
  s2.background = { color: "FFFFFF" };
  s2.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.02, fill:{color:"4A6FA5"} });
  s2.addShape(pres.shapes.OVAL, { x:9.2, y:0, w:0.08, h:0.08, fill:{color:"B8860B"} });
  s2.addText("LTBI screening is cost-effective in the Chinese healthcare context", { x:0.6, y:0.25, w:8.8, h:0.7, fontSize:28, fontFace:"Georgia", color:"2D2D2D", bold:true, valign:"top", margin:0 });
  s2.addShape(pres.shapes.RECTANGLE, { x:0.6, y:0.95, w:8.8, h:0.02, fill:{color:"E5E7EB"} });
  addSlideNum(s2, 2);
  const items = bullets.map((b, i) => ({ text: b, options: { bullet: true, breakLine: i < bullets.length - 1 } }));
  s2.addText(items, { x:0.6, y:1.2, w:8.8, h:2.0, fontSize:18, fontFace:"Arial", color:"2D2D2D", paraSpaceAfter:8, valign:"top" });
  s2.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:0.6, y:3.4, w:8.8, h:0.75, fill:{color:"F5F0E8"}, line:{color:"B8860B", width:0.75}, rectRadius:0.04 });
  s2.addShape(pres.shapes.RECTANGLE, { x:0.6, y:3.4, w:0.05, h:0.75, fill:{color:"4A6FA5"} });
  s2.addShape(pres.shapes.OVAL, { x:9.2, y:3.55, w:0.16, h:0.16, fill:{color:"B8860B"} });
  s2.addText("Key Finding: IGRA-based strategy cost-effective at $30,000/QALY threshold", { x:0.85, y:3.45, w:8.3, h:0.65, fontSize:16, fontFace:"Arial", color:"2D2D2D", valign:"middle" });

  // ── TOC Slide ──
  const s3 = pres.addSlide();
  s3.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:5.625, fill:{color:"F5F0E8"} });
  s3.addShape(pres.shapes.RECTANGLE, { x:0, y:0.15, w:10, h:0.01, fill:{color:"4A6FA5"} });
  s3.addShape(pres.shapes.RECTANGLE, { x:0, y:5.15, w:10, h:0.01, fill:{color:"B8860B"} });
  s3.addShape(pres.shapes.OVAL, { x:0.8, y:0.12, w:0.06, h:0.06, fill:{color:"4A6FA5"} });
  s3.addShape(pres.shapes.OVAL, { x:9.2, y:0.12, w:0.06, h:0.06, fill:{color:"4A6FA5"} });
  s3.addText("Table of Contents", { x:0.8, y:0.5, w:8.4, h:0.6, fontSize:28, fontFace:"Georgia", color:"2D2D2D", bold:true, margin:0 });
  const tocItems = sections.map((s, i) => ({ text: s, options: { bullet: false, breakLine: i < sections.length - 1 } }));
  s3.addText(tocItems, { x:0.8, y:1.5, w:8.4, h:3.0, fontSize:22, fontFace:"Arial", color:"2D2D2D", paraSpaceAfter:14, valign:"top" });

  return pres.writeFile({ fileName: path.join(outDir, "template_nature.pptx") }).then(() => console.log("NATURE done"));
}

// Run all
Promise.all([
  generateNavy(),
  generateTeal(),
  generateSlate(),
  generateNature(),
]).then(() => console.log("ALL DONE"));
