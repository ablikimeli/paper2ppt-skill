# Template: Nature Dark (Enhanced)

Premium midnight + gold theme with thin serif titles, generous whitespace, and elegant gold accents. Inspired by high-impact journal aesthetics.

```
Theme ID: nature-dark
Alias:    nature, dark, premium, gold, high-impact
```

---

## Visual Impression

Deep midnight background (`0F0F1A`) with warm gold accents. Georgia serif for the paper title. Extremely clean — no extraneous elements. Content slides use white with a thin gold bar at top. Key findings in dark cards with gold borders. Maximum contrast, minimum clutter. Premium, confident, restrained.

---

## Color Palette

```javascript
const C = {
  primary: "0F0F1A",   // Deep midnight — title bg
  primary2:"1A1A2E",   // Slightly lighter midnight — band
  accent:  "D4A843",   // Gold — highlights, rules, borders
  accent2: "F5E6C8",   // Light gold — card fill
  bg:      "FFFFFF",   // White — content bg
  cardBg:  "FDFBF7",   // Warm white — card background
  body:    "1F1F2E",   // Near-black — body text
  muted:   "6B7280",   // Gray — citations
  rule:    "E5E7EB",   // Light gray — dividers
  white:   "FFFFFF",
};
```

## Typography

```javascript
const F = {
  titleFace: "Georgia",   // Serif for main title slide
  face: "Arial",          // Sans-serif for body
  title: 28,
  subtitle: 20,
  body: 18,
  small: 14,
  cite: 11,
};
```

---

## Slide Designs

---

### Title Slide

Dark midnight with extremely thin gold top bar. Serif title. Very sparse.

```
┌─────────────────────────────────────────────────────┐
│▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁  │  gold hairline (h=0.03)
│                                                     │
│  Literature Review · Journal Club                    │  13pt gold Arial
│                                                     │
│                                                     │
│  Full Paper Title in Georgia Serif                  │  32pt bold white, Georgia
│  (2-3 lines)                                        │  generous top space
│                                                     │
│                                                     │
│  ───                                                 │  gold rule (w=1.0)
│                                                     │
│  Author1, Author2, et al.                            │  14pt warm gray
│                                                     │
│  Journal Name                                        │  12pt white
│  Published: Date  |  Vol(Issue):Pages                │
│  IF: X.X  |  JCR: QX  |  DOI: 10.xxxx/xxxx          │
│                                                     │
│▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁  │  gold hairline bottom
│  Literature Review Presentation                      │  11pt gold
└─────────────────────────────────────────────────────┘
```

```javascript
function titleSlide(title, authors, journal, dateStr, volIssue, doi, ifVal, quartile) {
  const slide = pres.addSlide();
  // Deep midnight base
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: "0F0F1A" },
  });
  // Thin gold top hairline
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.03, fill: { color: "D4A843" },
  });
  // Thin gold bottom hairline
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.35, w: 10, h: 0.03, fill: { color: "D4A843" },
  });
  // Label
  slide.addText("Literature Review  ·  Journal Club", {
    x: 0.8, y: 0.5, w: 8.4, h: 0.4,
    fontSize: 13, fontFace: "Arial", color: "D4A843",
  });
  // Title (SERIF — larger, more space)
  slide.addText(title, {
    x: 0.8, y: 1.4, w: 8.4, h: 1.8,
    fontSize: 32, fontFace: "Georgia", color: "FFFFFF",
    bold: true, valign: "top", margin: 0,
  });
  // Short gold rule
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 3.4, w: 1.0, h: 0.025, fill: { color: "D4A843" },
  });
  // Authors
  slide.addText(authors, {
    x: 0.8, y: 3.6, w: 8.4, h: 0.35,
    fontSize: 14, fontFace: "Arial", color: "9CA3AF",
  });
  // Info block (compact)
  slide.addText(
    `${journal}\n${dateStr}  |  ${volIssue}\nIF: ${ifVal}  |  JCR: ${quartile}\nDOI: ${doi}`,
    { x: 0.8, y: 4.0, w: 8.4, h: 0.55,
      fontSize: 12, fontFace: "Arial", color: "FFFFFF",
      valign: "top", lineSpacingMultiple: 1.2 }
  );
  // Bottom label
  slide.addText("Literature Review Presentation", {
    x: 0.8, y: 5.05, w: 8.4, h: 0.25,
    fontSize: 11, fontFace: "Arial", color: "D4A843",
  });
  return slide;
}
```

---

### Content Slide

White with thin gold top bar. Very clean. Maximum whitespace.

```
┌─────────────────────────────────────────────────────┐
│▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁  │  gold hairline (h=0.03)
│                                                     │
│  Action Title 28pt bold midnight                     │
│  ────────────────────────────────────────────────   │  thin gray divider
│                                                     │
│  • Bullet point in Arial 18pt                        │
│  • Second bullet point                               │
│  • Third bullet point                                │
│                                                     │
│  ┌─────────────────────────────────────────┐         │
│  │  Key Finding (warm card, gold border)    │         │
│  │  Minimal, elegant presentation           │         │
│  └─────────────────────────────────────────┘         │
│                                                     │
│                                              N / N   │
└─────────────────────────────────────────────────────┘
```

```javascript
function contentSlide(title, n) {
  const slide = pres.addSlide();
  slide.background = { color: "FFFFFF" };
  // Gold hairline top
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.03, fill: { color: "D4A843" },
  });
  // Title
  slide.addText(title, {
    x: 0.6, y: 0.25, w: 8.8, h: 0.7,
    fontSize: 28, fontFace: "Georgia", color: "0F0F1A",
    bold: true, valign: "top", margin: 0,
  });
  // Divider
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 0.95, w: 8.8, h: 0.02, fill: { color: "E5E7EB" },
  });
  addSlideNum(slide, n);
  return slide;
}
```

---

### Premium Card (for Key Findings)

Warm-toned card with thin gold border. Elegant, understated.

```javascript
function addPremiumCard(slide, text, y) {
  // Card with gold border
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: y, w: 8.8, h: 0.7,
    fill: { color: "FDFBF7" },
    line: { color: "D4A843", width: 0.75 },
    rectRadius: 0.04,
  });
  // Text
  slide.addText(text, {
    x: 0.8, y: y + 0.05, w: 8.4, h: 0.6,
    fontSize: 16, fontFace: "Arial", color: "0F0F1A",
    valign: "middle",
  });
}
```

---

### TOC Slide

Dark midnight, gold hairline. Text only. Maximum restraint.

```javascript
function tocSlide(sections) {
  const slide = pres.addSlide();
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: "0F0F1A" },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.03, fill: { color: "D4A843" },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.35, w: 10, h: 0.03, fill: { color: "D4A843" },
  });
  slide.addText("Table of Contents", {
    x: 0.8, y: 0.6, w: 8.4, h: 0.6,
    fontSize: 28, fontFace: "Georgia", color: "FFFFFF",
    bold: true, margin: 0,
  });
  const items = sections.map((s, i) => ({
    text: s,
    options: { bullet: false, breakLine: i < sections.length - 1 },
  }));
  slide.addText(items, {
    x: 0.8, y: 1.6, w: 8.4, h: 3.0,
    fontSize: 22, fontFace: "Arial", color: "FFFFFF",
    paraSpaceAfter: 14, valign: "top",
  });
  return slide;
}
```

---

### End Slide

```javascript
function endSlide() {
  const slide = pres.addSlide();
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: "0F0F1A" },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.03, fill: { color: "D4A843" },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.35, w: 10, h: 0.03, fill: { color: "D4A843" },
  });
  slide.addText("Thank You", {
    x: 0.8, y: 1.8, w: 8.4, h: 0.8,
    fontSize: 38, fontFace: "Georgia", color: "FFFFFF",
    bold: true, align: "center",
  });
  slide.addText("Questions & Discussion", {
    x: 0.8, y: 2.7, w: 8.4, h: 0.6,
    fontSize: 22, fontFace: "Arial", color: "D4A843",
    align: "center",
  });
  return slide;
}
```
