# Template: Slate Modern (Redesigned)

Slate + vermillion tech style with triangular corner accents, circular stat badges, chevron decorations, and bold typography. Lightened slate background.

```text
Theme ID: slate-modern
Alias:    slate, modern, indigo, tech, cs, engineering
```

---

## Visual Impression

Slate (`3D4F5F`) primary with vibrant vermillion (`D55E00`) accent — a color‑blind friendly combination. The title slide features a large right‑triangle corner element in vermillion. Content slides have a slate left bar ending in a triangular "arrow" shape. Stats are displayed in circular vermillion badges. Sharp, geometric, bold, modern.

---

## Color Palette (Color‑Blind Friendly)

```javascript
const C = {
  primary: "3D4F5F",   // Slate (lighter than before) — title bg
  primary2:"2C3E50",   // Darker slate — bottom band
  accent:  "D55E00",   // Vermillion — highlights, triangles, badges
  accent2: "FDE8D0",   // Light orange — card fill
  accent3: "95A5A6",   // Silver — decorative chevrons
  bg:      "FFFFFF",   // White — content bg
  cardBg:  "F8F9FA",   // Cool gray — card background
  body:    "0F172A",   // Nearly black — body text
  muted:   "64748B",   // Blue-gray — citations
  rule:    "CBD5E1",   // Light slate — dividers
  white:   "FFFFFF",
};
```

## Typography

```javascript
const F = {
  face: "Arial",        // Clean sans-serif throughout
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

Slate background with a large vermillion right‑triangle cutting into the top‑right corner. Vermillion accent bar and bottom bar.

```text
┌──────────────────────────────────────────────────────┐
│                                                     ╱│
│  Literature Review · Journal Club                  ╱ │
│                                                  ╱  │  large vermillion triangle
│  Full Paper Title in Arial Bold                 ╱   │  (right-triangle corner)
│  (2-3 lines)                                   ╱    │
│                                               ╱     │
│  ────  <-- vermillion rule                  ╱      │
│  Author1, Author2, et al.                  ╱       │
│  Journal Name  |  Date  |  IF: X.X       ╱        │
│                                         ╱         │
│                                       ╱          │
│  ███████████████████████████████████              │  vermillion bottom bar
└──────────────────────────────────────────────────────┘
```

```javascript
function titleSlide(title, authors, journal, dateStr, volIssue, doi, ifVal, quartile) {
  const slide = pres.addSlide();
  // Slate base
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: "3D4F5F" },
  });
  // Vermillion right-triangle corner accent
  slide.addShape(pres.shapes.RIGHT_TRIANGLE, {
    x: 7.5, y: 0, w: 2.5, h: 2.5,
    fill: { color: "D55E00" },
  });
  // Vermillion bottom bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.3, w: 10, h: 0.325, fill: { color: "D55E00" },
  });
  // Label
  slide.addText("Literature Review  ·  Journal Club", {
    x: 0.8, y: 0.5, w: 8.4, h: 0.4,
    fontSize: 14, fontFace: "Arial", color: "D55E00",
  });
  // Title
  slide.addText(title, {
    x: 0.8, y: 1.3, w: 7.0, h: 1.8,
    fontSize: 30, fontFace: "Arial", color: "FFFFFF",
    bold: true, valign: "top", margin: 0,
  });
  // Authors
  slide.addText(authors, {
    x: 0.8, y: 3.1, w: 8.4, h: 0.4,
    fontSize: 15, fontFace: "Arial", color: "95A5A6",
  });
  // Vermillion rule
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 3.55, w: 1.5, h: 0.03, fill: { color: "D55E00" },
  });
  // Info
  slide.addText(
    `${journal}\n${dateStr}  |  ${volIssue}\nIF: ${ifVal}  |  JCR: ${quartile}\nDOI: ${doi}`,
    { x: 0.8, y: 3.7, w: 8.4, h: 0.6,
      fontSize: 13, fontFace: "Arial", color: "CBD5E1",
      valign: "top", lineSpacingMultiple: 1.3 }
  );
  return slide;
}
```

---

### Content Slide

White background. Vermillion left accent bar with a triangular base (chevron effect). Thin divider under title. Small chevron at top‑right.

```text
┌──────────────────────────────────────────────────────┐
│█                                                    ▷│  ▷ = small chevron
│█  Action Title 28pt bold slate                        │
│█  ────────────────────────────────────────────────   │
│█                                                      │
│█  • Bullet point in Arial 18pt                        │
│█  • Second bullet point                               │
│█  • Third bullet point                                │
│█                                                      │
│█  ┌─────────────────────────────────────────┐        │
│█  │  ██  Key Result: 87% improvement         │        │
│█  │       with slate accent bar               │        │
│█  └─────────────────────────────────────────┘        │
│█                                              N / N  │
└──────────────────────────────────────────────────────┘
```

```javascript
function contentSlide(title, n) {
  const slide = pres.addSlide();
  slide.background = { color: "FFFFFF" };
  // Vermillion left accent bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.06, h: 5.2, fill: { color: "D55E00" },
  });
  // Triangular accent at bottom of left bar
  slide.addShape(pres.shapes.RIGHT_TRIANGLE, {
    x: 0, y: 5.2, w: 0.35, h: 0.425,
    fill: { color: "D55E00" },
  });
  // Small decorative chevron top-right
  slide.addShape(pres.shapes.CHEVRON, {
    x: 9.1, y: 0.15, w: 0.5, h: 0.3,
    fill: { color: "3D4F5F", transparency: 20 },
  });
  // Title
  slide.addText(title, {
    x: 0.4, y: 0.2, w: 9.1, h: 0.75,
    fontSize: 28, fontFace: "Arial", color: "3D4F5F",
    bold: true, valign: "top", margin: 0,
  });
  // Divider
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 0.95, w: 9.1, h: 0.025, fill: { color: "CBD5E1" },
  });
  addSlideNum(slide, n);
  return slide;
}
```

---

### Stat Card

Large vermillion number in a circle, followed by a description.

```javascript
function addStatCard(slide, number, label, y) {
  // Card background
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: y, w: 9.0, h: 0.85,
    fill: { color: "F8F9FA" },
    line: { color: "CBD5E1", width: 0.5 },
    rectRadius: 0.06,
  });
  // Vermillion circle behind number
  slide.addShape(pres.shapes.OVAL, {
    x: 0.6, y: y + 0.08, w: 0.7, h: 0.7,
    fill: { color: "D55E00" },
  });
  // The number (white on vermillion)
  slide.addText(number, {
    x: 0.6, y: y + 0.08, w: 0.7, h: 0.7,
    fontSize: 22, fontFace: "Arial", color: "FFFFFF",
    bold: true, align: "center", valign: "middle",
  });
  // Description
  slide.addText(label, {
    x: 1.6, y: y + 0.05, w: 7.6, h: 0.75,
    fontSize: 16, fontFace: "Arial", color: "3D4F5F",
    valign: "middle",
  });
  // Small triangular accent on card
  slide.addShape(pres.shapes.RIGHT_TRIANGLE, {
    x: 9.0, y: y + 0.35, w: 0.4, h: 0.4,
    fill: { color: "D55E00", transparency: 70 },
  });
}
```

---

### TOC Slide

Slate with vermillion triangle corner. Vermillion bottom bar.

```javascript
function tocSlide(sections) {
  const slide = pres.addSlide();
  // Slate base
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: "3D4F5F" },
  });
  // Decorative triangle
  slide.addShape(pres.shapes.RIGHT_TRIANGLE, {
    x: 8.5, y: 0, w: 1.5, h: 1.5,
    fill: { color: "D55E00", transparency: 50 },
  });
  // Bottom bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.3, w: 10, h: 0.325, fill: { color: "D55E00" },
  });
  // Title
  slide.addText("Table of Contents", {
    x: 0.8, y: 0.5, w: 8.4, h: 0.6,
    fontSize: 28, fontFace: "Arial", color: "FFFFFF",
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
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: "3D4F5F" },
  });
  // Triangle accent
  slide.addShape(pres.shapes.RIGHT_TRIANGLE, {
    x: 8.0, y: 0, w: 2.0, h: 2.0,
    fill: { color: "D55E00", transparency: 60 },
  });
  // Bottom bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.3, w: 10, h: 0.325, fill: { color: "D55E00" },
  });
  slide.addText("Thank You", {
    x: 0.8, y: 1.8, w: 8.4, h: 0.8,
    fontSize: 38, fontFace: "Arial", color: "FFFFFF",
    bold: true, align: "center",
  });
  slide.addText("Questions & Discussion", {
    x: 0.8, y: 2.7, w: 8.4, h: 0.6,
    fontSize: 22, fontFace: "Arial", color: "D55E00",
    align: "center",
  });
  return slide;
}
```
