# Template: Academic Navy (Redesigned)

Scholarly style using deep navy + white with gold accents, decorative circular elements, and layered card designs.

```text
Theme ID: academic-navy
Alias:    navy, default, scholarly, bluebook
```

---

## Visual Impression

Deep navy (`1A3A5C`) primary with warm gold (`C9A84C`) accents and pure white content backgrounds. Large translucent circles create depth on title slides. Content slides use a clean white background with a navy left bar and a small gold circle as a visual anchor. Highlight cards feature a gold left stripe and a subtle dot accent. Confident, scholarly, accessible.

---

## Color Palette

```javascript
const C = {
  primary: "1A3A5C",   // Deep navy — title bg, accent bars
  primary2:"2B5A8A",   // Lighter navy — bottom band, decorative circles
  accent:  "C9A84C",   // Gold — highlights, rules, card accents
  accent2: "F8F6F0",   // Warm off-white — card background
  accent3: "2B5A8A",   // Light navy — decorative circles, links
  bg:      "FFFFFF",   // White — content bg
  body:    "2D2D2D",   // Near-black — body text
  muted:   "6B7280",   // Gray — citations
  rule:    "D1D5DB",   // Light gray — dividers
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

Deep navy background with a large translucent lighter-navy circle in the upper-right and a small gold dot. Gold accent line below the title area. Lighter band at the bottom with a gold separator.

```text
┌─────────────────────────────────────────────────────┐
│                                           ╭────╮    │
│                                          ╱      ╲   │  large translucent circle
│  Literature Review · Journal Club        │  ○   │   │  + small gold dot
│                                          ╲      ╱   │
│  Full Paper Title in Georgia Serif        ╰────╯    │
│  (2-3 lines)                                         │
│                                                     │
│  ────  <-- gold rule                                 │
│  Author1, Author2, et al.                            │
│  Journal Name  |  Date  |  IF: X.X                  │
│  DOI: 10.xxxx/xxxx                                   │
│──────────────────────────────────────────────────────│  gold line
│  Literature Review Presentation                      │  lighter navy band
└─────────────────────────────────────────────────────┘
```

```javascript
function titleSlide(title, authors, journal, dateStr, volIssue, doi, ifVal, quartile) {
  const slide = pres.addSlide();
  // Deep navy base
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: "1A3A5C" },
  });
  // Large translucent decorative circle (top-right)
  slide.addShape(pres.shapes.OVAL, {
    x: 7.0, y: -1.0, w: 4.0, h: 4.0,
    fill: { color: "2B5A8A", transparency: 60 },
  });
  // Small gold decorative dot
  slide.addShape(pres.shapes.OVAL, {
    x: 8.5, y: 2.6, w: 0.4, h: 0.4,
    fill: { color: "C9A84C", transparency: 30 },
  });
  // Lighter bottom band
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 4.5, w: 10, h: 1.125, fill: { color: "2B5A8A" },
  });
  // Gold separator line
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 4.5, w: 10, h: 0.04, fill: { color: "C9A84C" },
  });
  // Label
  slide.addText("Literature Review  ·  Journal Club", {
    x: 0.8, y: 0.5, w: 8.4, h: 0.4,
    fontSize: 14, fontFace: "Arial", color: "B8C9E0",
  });
  // Title (SERIF)
  slide.addText(title, {
    x: 0.8, y: 1.3, w: 7.5, h: 1.8,
    fontSize: 32, fontFace: "Georgia", color: "FFFFFF",
    bold: true, valign: "top", margin: 0,
  });
  // Gold accent rule
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 3.2, w: 1.5, h: 0.04, fill: { color: "C9A84C" },
  });
  // Authors
  slide.addText(authors, {
    x: 0.8, y: 3.45, w: 8.4, h: 0.35,
    fontSize: 15, fontFace: "Arial", color: "B8C9E0",
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
    fontSize: 12, fontFace: "Arial", color: "C9A84C",
  });
  return slide;
}
```

---

### Content Slide

White background. Thin navy top bar. Small gold circle top-right as a visual anchor. Navy left accent bar. Georgia title with light gray divider.

```text
┌─────────────────────────────────────────────────────┐
│█                                            ●       │  navy bar + gold dot
│█  Action Title in Georgia Serif, 28pt bold navy     │
│█  ────────────────────────────────────────────────  │
│█                                                     │
│█  • Bullet point text in Arial 18pt                  │
│█  • Second bullet point                              │
│█  • Third bullet point                               │
│█                                                     │
│█  ┌─────────────────────────────────────────┐ ●     │
│█  │  Key Finding Card (warm, gold accent)    │       │
│█  └─────────────────────────────────────────┘       │
│█                                                     │
│█                                              N / N  │
└─────────────────────────────────────────────────────┘
```

```javascript
function contentSlide(title, n) {
  const slide = pres.addSlide();
  slide.background = { color: "FFFFFF" };
  // Thin navy top bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.04, fill: { color: "1A3A5C" },
  });
  // Small gold decorative dot (top-right)
  slide.addShape(pres.shapes.OVAL, {
    x: 9.2, y: 0.15, w: 0.35, h: 0.35,
    fill: { color: "C9A84C" },
  });
  // Navy left accent bar (starts below top bar)
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0.5, w: 0.06, h: 4.6, fill: { color: "1A3A5C" },
  });
  // Title
  slide.addText(title, {
    x: 0.4, y: 0.2, w: 8.8, h: 0.7,
    fontSize: 28, fontFace: "Georgia", color: "1A3A5C",
    bold: true, valign: "top", margin: 0,
  });
  // Divider
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 0.9, w: 8.8, h: 0.02, fill: { color: "D1D5DB" },
  });
  addSlideNum(slide, n);
  return slide;
}
```

---

### Highlight Card

Rounded card with a gold left accent stripe and a small navy-blue dot in the top-right corner.

```javascript
function addHighlightCard(slide, text, y) {
  // Card body
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.4, y: y, w: 9.2, h: 0.75,
    fill: { color: "F8F6F0" },
    line: { color: "D1D5DB", width: 0.5 },
    rectRadius: 0.06,
  });
  // Gold left accent
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: y, w: 0.06, h: 0.75, fill: { color: "C9A84C" },
  });
  // Small navy decorative dot on card
  slide.addShape(pres.shapes.OVAL, {
    x: 9.3, y: y + 0.15, w: 0.2, h: 0.2,
    fill: { color: "2B5A8A" },
  });
  // Text
  slide.addText(text, {
    x: 0.65, y: y + 0.05, w: 8.5, h: 0.65,
    fontSize: 16, fontFace: "Arial", color: "1A3A5C",
    valign: "middle",
  });
}
```

---

### Stat / Callout Box

Use for a large number or result with a description.

```javascript
function addStatBox(slide, number, label, y) {
  // Lighter navy circle behind number
  slide.addShape(pres.shapes.OVAL, {
    x: 0.5, y: y + 0.05, w: 0.9, h: 0.9,
    fill: { color: "2B5A8A", transparency: 70 },
  });
  // The large number
  slide.addText(number, {
    x: 0.5, y: y + 0.05, w: 0.9, h: 0.9,
    fontSize: 28, fontFace: "Arial", color: "1A3A5C",
    bold: true, align: "center", valign: "middle",
  });
  // Description
  slide.addText(label, {
    x: 1.6, y: y + 0.05, w: 7.8, h: 0.9,
    fontSize: 16, fontFace: "Arial", color: "2D2D2D",
    valign: "middle",
  });
}
```

---

### TOC Slide

Deep navy background with a large semi-transparent circle sweeping in from the bottom-left. Gold top bar.

```javascript
function tocSlide(sections) {
  const slide = pres.addSlide();
  // Navy base
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: "1A3A5C" },
  });
  // Large decorative circle bottom-left
  slide.addShape(pres.shapes.OVAL, {
    x: -1.0, y: 3.5, w: 3.5, h: 3.5,
    fill: { color: "2B5A8A", transparency: 65 },
  });
  // Gold top bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.04, fill: { color: "C9A84C" },
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
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: "1A3A5C" },
  });
  // Decorative circle
  slide.addShape(pres.shapes.OVAL, {
    x: 6.0, y: 0.5, w: 5.0, h: 5.0,
    fill: { color: "2B5A8A", transparency: 70 },
  });
  // Bottom band
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 4.5, w: 10, h: 1.125, fill: { color: "2B5A8A" },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 4.5, w: 10, h: 0.04, fill: { color: "C9A84C" },
  });
  slide.addText("Thank You", {
    x: 0.8, y: 1.8, w: 8.4, h: 0.8,
    fontSize: 38, fontFace: "Georgia", color: "FFFFFF",
    bold: true, align: "center",
  });
  slide.addText("Questions & Discussion", {
    x: 0.8, y: 2.7, w: 8.4, h: 0.6,
    fontSize: 22, fontFace: "Arial", color: "C9A84C",
    align: "center",
  });
  return slide;
}
```
