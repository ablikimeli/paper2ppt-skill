# Template: Slate Modern (Enhanced)

Dark slate + emerald tech style with sharp geometric dividers, stat cards, and bold typography.

```
Theme ID: slate-modern
Alias:    slate, modern, indigo, tech, cs, engineering
```

---

## Visual Impression

Dark slate primary with vibrant emerald accent. Clean sans-serif throughout. Content slides feature a geometric left accent triangle/trapezoid shape. Stats and key numbers displayed in large emerald callouts. Sharp, confident, modern — suited for tech, CS, and engineering presentations.

---

## Color Palette

```javascript
const C = {
  primary: "1E293B",   // Dark slate — title bg
  primary2:"334155",   // Lighter slate — gradient band
  accent:  "10B981",   // Emerald — highlights, callouts
  accent2: "D1FAE5",   // Light emerald — card fill
  bg:      "FFFFFF",   // White — content bg
  cardBg:  "F8FAFC",   // Cool gray — card background
  body:    "0F172A",   // Nearly black — body text
  muted:   "64748B",   // Blue-gray — citations
  rule:    "CBD5E1",   // Light slate — dividers
  white:   "FFFFFF",
};
```

## Typography

```javascript
const F = {
  face: "Arial",        // Clean sans-serif
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

Dark slate + emerald. Geometric left accent shape (large rectangle creates visual depth).

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  ██  Literature Review · Journal Club               │  ██ = emerald left bar
│  ██                                                 │
│  ██  Full Paper Title                               │  30pt bold white
│  ██  (2-3 lines)                                   │
│  ██                                                 │
│  ██  ————                                           │  emerald rule
│  ██                                                 │
│  ██  Author1, Author2, et al.                       │
│  ██  Journal Name  |  Date  |  IF: X.X             │
│  ██                                                 │
│  ██  DOI: 10.xxxx/xxxx                              │
│                                                     │
│  ██████████████████████████████████████████████████  │  emerald bottom bar
└─────────────────────────────────────────────────────┘
```

```javascript
function titleSlide(title, authors, journal, dateStr, volIssue, doi, ifVal, quartile) {
  const slide = pres.addSlide();
  // Dark slate base
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: "1E293B" },
  });
  // Emerald left vertical accent bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.06, h: 5.625, fill: { color: "10B981" },
  });
  // Emerald bottom bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.3, w: 10, h: 0.325, fill: { color: "10B981" },
  });
  // Label with emerald left marker
  slide.addText("Literature Review  ·  Journal Club", {
    x: 0.8, y: 0.5, w: 8.4, h: 0.4,
    fontSize: 14, fontFace: "Arial", color: "10B981",
  });
  // Title
  slide.addText(title, {
    x: 0.8, y: 1.3, w: 8.4, h: 1.8,
    fontSize: 30, fontFace: "Arial", color: "FFFFFF",
    bold: true, valign: "top", margin: 0,
  });
  // Authors
  slide.addText(authors, {
    x: 0.8, y: 3.1, w: 8.4, h: 0.4,
    fontSize: 15, fontFace: "Arial", color: "94A3B8",
  });
  // Emerald rule
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 3.55, w: 1.5, h: 0.03, fill: { color: "10B981" },
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

White background with emerald left accent bar. Geometric thin divider.

```
┌─────────────────────────────────────────────────────┐
│█                                                     │
│█  Action Title 28pt bold slate                       │  █ = emerald left bar
│█  ────────────────────────────────────────────────  │
│█                                                     │
│█  • Bullet point in Arial 18pt                       │
│█  • Second bullet point                              │
│█  • Third bullet point                               │
│█                                                     │
│█  ┌─────────────────────────────────────────┐        │
│█  │  ██  Key Result: 85% improvement         │        │
│█  │       with emerald left accent            │        │
│█  └─────────────────────────────────────────┘        │
│█                                                     │
│█                                              N / N  │
└─────────────────────────────────────────────────────┘
```

```javascript
function contentSlide(title, n) {
  const slide = pres.addSlide();
  slide.background = { color: "FFFFFF" };
  // Emerald left bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.06, h: 5.625, fill: { color: "10B981" },
  });
  // Title
  slide.addText(title, {
    x: 0.4, y: 0.2, w: 9.1, h: 0.75,
    fontSize: 28, fontFace: "Arial", color: "1E293B",
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

### Stat Card (for Key Numbers)

Large emerald number + description. Use for highlighting key quantitative findings.

```javascript
function addStatCard(slide, number, label, y) {
  // Card background
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: y, w: 9.0, h: 0.85,
    fill: { color: "F8FAFC" },
    line: { color: "CBD5E1", width: 0.5 },
    rectRadius: 0.06,
  });
  // Emerald left accent
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: y, w: 0.06, h: 0.85, fill: { color: "10B981" },
  });
  // Large number
  slide.addText(number, {
    x: 0.7, y: y + 0.05, w: 1.5, h: 0.75,
    fontSize: 28, fontFace: "Arial", color: "10B981",
    bold: true, valign: "middle",
  });
  // Description
  slide.addText(label, {
    x: 2.2, y: y + 0.05, w: 7.0, h: 0.75,
    fontSize: 16, fontFace: "Arial", color: "1E293B",
    valign: "middle",
  });
}
```

---

### TOC Slide

```javascript
function tocSlide(sections) {
  const slide = pres.addSlide();
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: "1E293B" },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.06, h: 5.625, fill: { color: "10B981" },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.3, w: 10, h: 0.325, fill: { color: "10B981" },
  });
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
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: "1E293B" },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.06, h: 5.625, fill: { color: "10B981" },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.3, w: 10, h: 0.325, fill: { color: "10B981" },
  });
  slide.addText("Thank You", {
    x: 0.8, y: 1.8, w: 8.4, h: 0.8,
    fontSize: 38, fontFace: "Arial", color: "FFFFFF",
    bold: true, align: "center",
  });
  slide.addText("Questions & Discussion", {
    x: 0.8, y: 2.7, w: 8.4, h: 0.6,
    fontSize: 22, fontFace: "Arial", color: "10B981",
    align: "center",
  });
  return slide;
}
```
