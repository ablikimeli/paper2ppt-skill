# Template: Nature Dark (Redesigned)

Premium warm ivory + muted blue/gold style with thin geometric line art, subtle circular accents, and refined typography. Light, elegant background (no black).

```text
Theme ID: nature-dark
Alias:    nature, dark, premium, high-impact, aurora
```

---

## Visual Impression

Warm ivory (`F5F0E8`) background with muted blue (`4A6FA5`) and dark gold (`B8860B`) accents — no black or dark backgrounds. The title slide features thin geometric line art (fine rectangles forming a subtle pattern) and small circular dots as decoration. Content slides are white with a delicate top border line and a small gold circle accent. Premium cards have gold borders with a muted blue accent bar. Elegant, refined, confident, restrained — inspired by high‑impact journal aesthetics.

---

## Color Palette

```javascript
const C = {
  primary: "F5F0E8",   // Warm ivory — title bg (no black)
  primary2:"EDE6D8",   // Slightly darker ivory — band
  accent:  "4A6FA5",   // Muted blue — highlights, rules, geometric lines
  accent2: "B8860B",   // Dark gold — secondary accents, card dots
  bg:      "FFFFFF",   // White — content bg
  cardBg:  "F5F0E8",   // Warm ivory — card background
  body:    "2D2D2D",   // Dark — body text
  muted:   "6B7280",   // Gray — citations
  rule:    "D1D5DB",   // Light gray — dividers
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

Warm ivory background with thin geometric line art (two fine horizontal lines). Muted blue and dark gold dots as decorative accents. All text in dark tones for contrast.

```text
┌─────────────────────────────────────────────────────┐
│  ···       ···       ···        ···        ···      │  dotted line pattern
│─────────────────────────────────────────────────────│  thin blue line (h=0.01)
│                                                     │
│  Literature Review · Journal Club                  ● │  ● = small gold dot
│                                                     │
│  Full Paper Title in Georgia Serif                  │
│  (2-3 lines)                                       │
│                                                     │
│  ────                                               │  thin blue rule
│  Author1, Author2, et al.                           │
│  Journal Name  |  Date  |  IF: X.X                 │
│                                                     │
│─────────────────────────────────────────────────────│  thin gold line
│  ···       ···       ···        ···        ···      │  dotted pattern
│  Literature Review Presentation                     │
└─────────────────────────────────────────────────────┘
```

```javascript
function titleSlide(title, authors, journal, dateStr, volIssue, doi, ifVal, quartile) {
  const slide = pres.addSlide();
  // Warm ivory base (no black)
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: "F5F0E8" },
  });
  // Geometric line art — thin muted-blue line near top
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0.15, w: 10, h: 0.01, fill: { color: "4A6FA5" },
  });
  // Three small dots along the top line
  slide.addShape(pres.shapes.OVAL, {
    x: 0.8, y: 0.12, w: 0.06, h: 0.06,
    fill: { color: "4A6FA5" },
  });
  slide.addShape(pres.shapes.OVAL, {
    x: 5.0, y: 0.12, w: 0.06, h: 0.06,
    fill: { color: "4A6FA5" },
  });
  slide.addShape(pres.shapes.OVAL, {
    x: 9.2, y: 0.12, w: 0.06, h: 0.06,
    fill: { color: "4A6FA5" },
  });
  // Small gold dot (right side)
  slide.addShape(pres.shapes.OVAL, {
    x: 8.8, y: 0.55, w: 0.12, h: 0.12,
    fill: { color: "B8860B" },
  });
  // Label
  slide.addText("Literature Review  ·  Journal Club", {
    x: 0.8, y: 0.5, w: 8.4, h: 0.4,
    fontSize: 13, fontFace: "Arial", color: "4A6FA5",
  });
  // Title (SERIF)
  slide.addText(title, {
    x: 0.8, y: 1.4, w: 8.4, h: 1.8,
    fontSize: 32, fontFace: "Georgia", color: "2D2D2D",
    bold: true, valign: "top", margin: 0,
  });
  // Short muted-blue rule
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 3.4, w: 1.0, h: 0.025, fill: { color: "4A6FA5" },
  });
  // Authors
  slide.addText(authors, {
    x: 0.8, y: 3.6, w: 8.4, h: 0.35,
    fontSize: 14, fontFace: "Arial", color: "6B7280",
  });
  // Info block
  slide.addText(
    `${journal}\n${dateStr}  |  ${volIssue}\nIF: ${ifVal}  |  JCR: ${quartile}\nDOI: ${doi}`,
    { x: 0.8, y: 4.0, w: 8.4, h: 0.55,
      fontSize: 12, fontFace: "Arial", color: "2D2D2D",
      valign: "top", lineSpacingMultiple: 1.2 }
  );
  // Geometric line art — thin gold line near bottom
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.15, w: 10, h: 0.01, fill: { color: "B8860B" },
  });
  // Three dots along bottom line
  slide.addShape(pres.shapes.OVAL, {
    x: 0.8, y: 5.12, w: 0.06, h: 0.06,
    fill: { color: "B8860B" },
  });
  slide.addShape(pres.shapes.OVAL, {
    x: 5.0, y: 5.12, w: 0.06, h: 0.06,
    fill: { color: "B8860B" },
  });
  slide.addShape(pres.shapes.OVAL, {
    x: 9.2, y: 5.12, w: 0.06, h: 0.06,
    fill: { color: "B8860B" },
  });
  // Bottom label
  slide.addText("Literature Review Presentation", {
    x: 0.8, y: 5.25, w: 8.4, h: 0.25,
    fontSize: 11, fontFace: "Arial", color: "4A6FA5",
  });
  return slide;
}
```

---

### Content Slide

White with a thin muted-blue top line and small gold dot accent. Very clean.

```text
┌─────────────────────────────────────────────────────┐
│  ················································   │  thin blue line + dot
│                                                     │
│  Action Title 28pt bold dark                         │
│  ────────────────────────────────────────────────   │  thin gray divider
│                                                     │
│  • Bullet point in Arial 18pt                        │
│  • Second bullet point                               │
│  • Third bullet point                                │
│                                                     │
│  ┌─────────────────────────────────────────┐        │
│  │  Key Finding (warm card, gold border)    │  ●    │
│  │  Premium elegant presentation            │       │
│  └─────────────────────────────────────────┘       │
│                                                     │
│                                              N / N  │
└─────────────────────────────────────────────────────┘
```

```javascript
function contentSlide(title, n) {
  const slide = pres.addSlide();
  slide.background = { color: "FFFFFF" };
  // Thin muted-blue top line
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.02, fill: { color: "4A6FA5" },
  });
  // Small gold dot accent
  slide.addShape(pres.shapes.OVAL, {
    x: 9.2, y: 0, w: 0.08, h: 0.08,
    fill: { color: "B8860B" },
  });
  // Title
  slide.addText(title, {
    x: 0.6, y: 0.25, w: 8.8, h: 0.7,
    fontSize: 28, fontFace: "Georgia", color: "2D2D2D",
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

### Premium Card

Warm-toned card with a muted-blue left accent and a gold dot decoration.

```javascript
function addPremiumCard(slide, text, y) {
  // Card
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: y, w: 8.8, h: 0.75,
    fill: { color: "F5F0E8" },
    line: { color: "B8860B", width: 0.75 },
    rectRadius: 0.04,
  });
  // Muted-blue left accent
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: y, w: 0.05, h: 0.75,
    fill: { color: "4A6FA5" },
  });
  // Gold dot decoration on card
  slide.addShape(pres.shapes.OVAL, {
    x: 9.2, y: y + 0.15, w: 0.16, h: 0.16,
    fill: { color: "B8860B" },
  });
  // Text
  slide.addText(text, {
    x: 0.85, y: y + 0.05, w: 8.3, h: 0.65,
    fontSize: 16, fontFace: "Arial", color: "2D2D2D",
    valign: "middle",
  });
}
```

---

### Stat Callout

Large muted-blue number with a thin gold underline.

```javascript
function addStatCallout(slide, number, label, y) {
  // Large number
  slide.addText(number, {
    x: 0.6, y: y, w: 2.0, h: 0.7,
    fontSize: 36, fontFace: "Georgia", color: "4A6FA5",
    bold: true, valign: "middle",
  });
  // Thin gold underline
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: y + 0.65, w: 1.5, h: 0.02,
    fill: { color: "B8860B" },
  });
  // Label
  slide.addText(label, {
    x: 2.8, y: y, w: 6.6, h: 0.7,
    fontSize: 16, fontFace: "Arial", color: "2D2D2D",
    valign: "middle",
  });
}
```

---

### TOC Slide

Warm ivory background with geometric dots. Muted-blue line near top and gold line near bottom.

```javascript
function tocSlide(sections) {
  const slide = pres.addSlide();
  // Warm ivory base
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: "F5F0E8" },
  });
  // Bottom band (slightly darker ivory)
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 4.8, w: 10, h: 0.825, fill: { color: "EDE6D8" },
  });
  // Muted-blue line near top
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0.15, w: 10, h: 0.01, fill: { color: "4A6FA5" },
  });
  // Gold line near bottom
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 4.8, w: 10, h: 0.01, fill: { color: "B8860B" },
  });
  // Dots
  slide.addShape(pres.shapes.OVAL, {
    x: 0.8, y: 0.12, w: 0.06, h: 0.06,
    fill: { color: "4A6FA5" },
  });
  slide.addShape(pres.shapes.OVAL, {
    x: 9.2, y: 0.12, w: 0.06, h: 0.06,
    fill: { color: "4A6FA5" },
  });
  slide.addText("Table of Contents", {
    x: 0.8, y: 0.5, w: 8.4, h: 0.6,
    fontSize: 28, fontFace: "Georgia", color: "2D2D2D",
    bold: true, margin: 0,
  });
  const items = sections.map((s, i) => ({
    text: s,
    options: { bullet: false, breakLine: i < sections.length - 1 },
  }));
  slide.addText(items, {
    x: 0.8, y: 1.5, w: 8.4, h: 3.0,
    fontSize: 22, fontFace: "Arial", color: "2D2D2D",
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
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: "F5F0E8" },
  });
  // Geometric lines
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0.15, w: 10, h: 0.01, fill: { color: "4A6FA5" },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.15, w: 10, h: 0.01, fill: { color: "B8860B" },
  });
  // Dots
  slide.addShape(pres.shapes.OVAL, {
    x: 5.0, y: 0.12, w: 0.06, h: 0.06,
    fill: { color: "4A6FA5" },
  });
  slide.addShape(pres.shapes.OVAL, {
    x: 5.0, y: 5.12, w: 0.06, h: 0.06,
    fill: { color: "B8860B" },
  });
  // Gold dot accent
  slide.addShape(pres.shapes.OVAL, {
    x: 8.5, y: 2.5, w: 0.15, h: 0.15,
    fill: { color: "B8860B" },
  });
  slide.addText("Thank You", {
    x: 0.8, y: 1.8, w: 8.4, h: 0.8,
    fontSize: 38, fontFace: "Georgia", color: "2D2D2D",
    bold: true, align: "center",
  });
  slide.addText("Questions & Discussion", {
    x: 0.8, y: 2.7, w: 8.4, h: 0.6,
    fontSize: 22, fontFace: "Arial", color: "4A6FA5",
    align: "center",
  });
  return slide;
}
```
