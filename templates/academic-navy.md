# Template: Academic Navy (Redesigned)

Scholarly style using a color‑blind friendly blue‑orange palette with Georgia serif titles, decorative circular elements, and layered card designs.

```text
Theme ID: academic-navy
Alias:    navy, default, scholarly, bluebook
```

---

## Visual Impression

Deep blue (`0072B2`) primary with warm orange (`E69F00`) accents. Large semi‑transparent circles create depth on dark slides. Content slides use a clean white background with a blue left bar, thin top rule, and a small orange circle as a visual anchor. Highlight cards feature an orange left stripe and a subtle dot accent. Confident, scholarly, accessible.

---

## Color Palette (Color‑Blind Friendly)

Uses the Wong 2011 *Nature Methods* accessible palette — distinguishable by protanopia, deuteranopia, and tritanopia.

```javascript
const C = {
  primary: "0072B2",   // Blue — title bg, accent bars
  primary2:"00508A",   // Darker blue — bottom band
  accent:  "E69F00",   // Orange — highlights, rules, card accents
  accent2: "FFF3E0",   // Light orange — card fill
  accent3: "56B4E9",   // Sky blue — decorative circles, links
  bg:      "FFFFFF",   // White — content bg
  cardBg:  "F8F9FA",   // Cool gray — card background
  body:    "1A1A2E",   // Near-black — body text
  muted:   "6B7280",   // Gray — citations
  rule:    "E5E7EB",   // Light gray — dividers
  white:   "FFFFFF",
};
```

## Typography

```javascript
const F = {
  titleFace: "Georgia",   // Serif for main title and slide titles
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

Blue background with a large translucent sky‑blue circle in the upper‑right and a small orange dot. Orange accent line below the title area. Darker band at the bottom with an orange separator.

```text
┌─────────────────────────────────────────────────────┐
│                                           ╭────╮    │
│                                          ╱      ╲   │  large translucent circle
│  Literature Review · Journal Club        │  ○   │   │  + small orange dot
│                                          ╲      ╱   │
│  Full Paper Title in Georgia Serif        ╰────╯    │
│  (2-3 lines)                                         │
│                                                     │
│  ────  <-- orange rule                               │
│  Author1, Author2, et al.                            │
│  Journal Name  |  Date  |  IF: X.X                  │
│  DOI: 10.xxxx/xxxx                                   │
│──────────────────────────────────────────────────────│  orange line
│  Literature Review Presentation                      │  darker blue band
└─────────────────────────────────────────────────────┘
```

```javascript
function titleSlide(title, authors, journal, dateStr, volIssue, doi, ifVal, quartile) {
  const slide = pres.addSlide();
  // Deep blue base
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: "0072B2" },
  });
  // Large translucent decorative circle (top-right)
  slide.addShape(pres.shapes.OVAL, {
    x: 7.0, y: -1.0, w: 4.0, h: 4.0,
    fill: { color: "56B4E9", transparency: 70 },
  });
  // Small orange decorative dot
  slide.addShape(pres.shapes.OVAL, {
    x: 8.5, y: 2.6, w: 0.4, h: 0.4,
    fill: { color: "E69F00", transparency: 30 },
  });
  // Darker bottom band
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 4.5, w: 10, h: 1.125, fill: { color: "00508A" },
  });
  // Orange separator line
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 4.5, w: 10, h: 0.04, fill: { color: "E69F00" },
  });
  // Label
  slide.addText("Literature Review  ·  Journal Club", {
    x: 0.8, y: 0.5, w: 8.4, h: 0.4,
    fontSize: 14, fontFace: "Arial", color: "B3D4F0",
  });
  // Title (SERIF)
  slide.addText(title, {
    x: 0.8, y: 1.3, w: 7.5, h: 1.8,
    fontSize: 32, fontFace: "Georgia", color: "FFFFFF",
    bold: true, valign: "top", margin: 0,
  });
  // Orange accent rule
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 3.2, w: 1.5, h: 0.04, fill: { color: "E69F00" },
  });
  // Authors
  slide.addText(authors, {
    x: 0.8, y: 3.45, w: 8.4, h: 0.35,
    fontSize: 15, fontFace: "Arial", color: "B3D4F0",
  });
  // Info block
  slide.addText(
    `${journal}\n${dateStr}  |  ${volIssue}\nIF: ${ifVal}  |  JCR: ${quartile}\nDOI: ${doi}`,
    { x: 0.8, y: 3.85, w: 8.4, h: 0.55,
      fontSize: 12, fontFace: "Arial", color: "FFFFFF",
      valign: "top", lineSpacingMultiple: 1.2 }
  );
  // Bottom label
  slide.addText("Literature Review Presentation", {
    x: 0.8, y: 5.1, w: 8.4, h: 0.25,
    fontSize: 12, fontFace: "Arial", color: "E69F00",
  });
  return slide;
}
```

---

### Content Slide

White background. Thin blue top bar. Small orange circle top-right as a visual anchor. Blue left accent bar. Georgia title with light gray divider.

```
┌─────────────────────────────────────────────────────┐
│█                                            ●       │  blue bar + orange dot
│█  Action Title in Georgia Serif, 28pt bold blue     │
│█  ────────────────────────────────────────────────  │
│█                                                     │
│█  • Bullet point text in Arial 18pt                  │
│█  • Second bullet point                              │
│█  • Third bullet point                               │
│█                                                     │
│█  ┌─────────────────────────────────────────┐ ●     │
│█  │  Key Finding Card (gray, orange accent)  │       │
│█  └─────────────────────────────────────────┘       │
│█                                                     │
│█                                              N / N  │
└─────────────────────────────────────────────────────┘
```

```javascript
function contentSlide(title, n) {
  const slide = pres.addSlide();
  slide.background = { color: "FFFFFF" };
  // Thin blue top bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.04, fill: { color: "0072B2" },
  });
  // Small orange decorative dot (top-right)
  slide.addShape(pres.shapes.OVAL, {
    x: 9.2, y: 0.15, w: 0.35, h: 0.35,
    fill: { color: "E69F00" },
  });
  // Blue left accent bar (starts below top bar)
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0.5, w: 0.06, h: 4.6, fill: { color: "0072B2" },
  });
  // Title
  slide.addText(title, {
    x: 0.4, y: 0.2, w: 8.8, h: 0.7,
    fontSize: 28, fontFace: "Georgia", color: "0072B2",
    bold: true, valign: "top", margin: 0,
  });
  // Divider
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 0.9, w: 8.8, h: 0.02, fill: { color: "E5E7EB" },
  });
  addSlideNum(slide, n);
  return slide;
}
```

---

### Highlight Card

Rounded card with an orange left accent stripe and a small sky‑blue dot in the top‑right corner. Use for key findings.

```javascript
function addHighlightCard(slide, text, y) {
  // Card body
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.4, y: y, w: 9.2, h: 0.75,
    fill: { color: "F8F9FA" },
    line: { color: "E5E7EB", width: 0.5 },
    rectRadius: 0.06,
  });
  // Orange left accent
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: y, w: 0.06, h: 0.75, fill: { color: "E69F00" },
  });
  // Small blue decorative dot on card
  slide.addShape(pres.shapes.OVAL, {
    x: 9.3, y: y + 0.15, w: 0.2, h: 0.2,
    fill: { color: "56B4E9" },
  });
  // Text
  slide.addText(text, {
    x: 0.65, y: y + 0.05, w: 8.5, h: 0.65,
    fontSize: 16, fontFace: "Arial", color: "1A1A2E",
    valign: "middle",
  });
}
```

---

### Stat / Callout Box

Use for a large number or result with a description.

```javascript
function addStatBox(slide, number, label, y) {
  // Sky blue circle behind number
  slide.addShape(pres.shapes.OVAL, {
    x: 0.5, y: y + 0.05, w: 0.9, h: 0.9,
    fill: { color: "56B4E9", transparency: 80 },
  });
  // The large number
  slide.addText(number, {
    x: 0.5, y: y + 0.05, w: 0.9, h: 0.9,
    fontSize: 28, fontFace: "Arial", color: "0072B2",
    bold: true, align: "center", valign: "middle",
  });
  // Description
  slide.addText(label, {
    x: 1.6, y: y + 0.05, w: 7.8, h: 0.9,
    fontSize: 16, fontFace: "Arial", color: "1A1A2E",
    valign: "middle",
  });
}
```

---

### TOC Slide

Blue background with a large semi‑transparent circle sweeping in from the bottom‑left. Orange top bar. White text.

```javascript
function tocSlide(sections) {
  const slide = pres.addSlide();
  // Blue base
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: "0072B2" },
  });
  // Large decorative circle bottom-left
  slide.addShape(pres.shapes.OVAL, {
    x: -1.0, y: 3.5, w: 3.5, h: 3.5,
    fill: { color: "56B4E9", transparency: 75 },
  });
  // Orange top bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.04, fill: { color: "E69F00" },
  });
  // Title
  slide.addText("Table of Contents", {
    x: 0.8, y: 0.5, w: 8.4, h: 0.6,
    fontSize: 28, fontFace: "Georgia", color: "FFFFFF",
    bold: true, margin: 0,
  });
  const items = sections.map((s, i) => ({
    text: s,
    options: { bullet: false, breakLine: i < sections.length - 1 },
  }));
  slide.addText(items, {
    x: 0.8, y: 1.5, w: 8.4, h: 3.0,
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
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: "0072B2" },
  });
  // Decorative circle
  slide.addShape(pres.shapes.OVAL, {
    x: 6.0, y: 0.5, w: 5.0, h: 5.0,
    fill: { color: "56B4E9", transparency: 80 },
  });
  // Bottom band
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 4.5, w: 10, h: 1.125, fill: { color: "00508A" },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 4.5, w: 10, h: 0.04, fill: { color: "E69F00" },
  });
  slide.addText("Thank You", {
    x: 0.8, y: 1.8, w: 8.4, h: 0.8,
    fontSize: 38, fontFace: "Georgia", color: "FFFFFF",
    bold: true, align: "center",
  });
  slide.addText("Questions & Discussion", {
    x: 0.8, y: 2.7, w: 8.4, h: 0.6,
    fontSize: 22, fontFace: "Arial", color: "E69F00",
    align: "center",
  });
  return slide;
}
```
