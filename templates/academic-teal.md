# Template: Academic Teal (Redesigned)

Deep purple + pink style with a color‑blind friendly palette. Rounded overlapping elements, pill badges, and decorative diamond accents for a clean clinical feel.

```text
Theme ID: academic-teal
Alias:    teal, medical, health, forest, purple
```

---

## Visual Impression

Deep purple (`5B2C8E`) primary with warm pink (`CC79A7`) accents. Clean sans-serif throughout (Arial). The title slide features overlapping circular shapes in the background for depth. Content slides have a full-width purple header band with a small diamond decoration. Key results in rounded white cards with a pink left border and a small diamond accent. Crisp, clinical, modern, accessible.

---

## Color Palette (Color‑Blind Friendly)

```javascript
const C = {
  primary: "5B2C8E",   // Deep purple — title bg, header band
  primary2:"3B1C6E",   // Darker purple — bottom band
  accent:  "CC79A7",   // Pink — highlights, badges, card accents
  accent2: "FCE4EC",   // Light pink — card fill
  accent3: "E8DAEF",   // Very light purple — decorative circles
  bg:      "FFFFFF",   // White — content bg
  cardBg:  "F5EEF8",   // Light purple — card background
  body:    "1F2937",   // Dark slate — body text
  muted:   "6B7280",   // Gray — citations
  rule:    "D1D5DB",   // Light gray — dividers
  white:   "FFFFFF",
};
```

## Typography

```javascript
const F = {
  face: "Arial",        // Sans-serif throughout (medical standard)
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

Purple background with two overlapping translucent circles (purple and light purple) creating depth. Pink accent bar at top. Pink rule below title area.

```text
┌─────────────────────────────────────────────────────┐
│  ██████████████████████████████████████████████████  │  pink top bar (h=0.06)
│                                                     │
│  ╭────────────╮                                     │
│  │  ○○        │  overlapping decorative circles      │
│  ╰────────────╯                                     │
│  Literature Review · Journal Club                    │
│                                                     │
│  Full Paper Title in Arial Bold                      │
│  (2-3 lines)                                        │
│                                                     │
│  ────  <-- pink rule                                 │
│  Author1, Author2, et al.                            │
│  Journal Name  |  Date  |  IF: X.X                  │
│                                                     │
│──────────────────────────────────────────────────────│  darker purple band
│  Literature Review Presentation                      │
└─────────────────────────────────────────────────────┘
```

```javascript
function titleSlide(title, authors, journal, dateStr, volIssue, doi, ifVal, quartile) {
  const slide = pres.addSlide();
  // Purple base
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: "5B2C8E" },
  });
  // Decorative overlapping circles
  slide.addShape(pres.shapes.OVAL, {
    x: 6.5, y: -0.5, w: 3.5, h: 3.5,
    fill: { color: "3B1C6E", transparency: 50 },
  });
  slide.addShape(pres.shapes.OVAL, {
    x: 7.5, y: 0.5, w: 2.5, h: 2.5,
    fill: { color: "E8DAEF", transparency: 60 },
  });
  // Pink top bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06, fill: { color: "CC79A7" },
  });
  // Bottom band
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 4.2, w: 10, h: 1.425, fill: { color: "3B1C6E" },
  });
  // Label
  slide.addText("Literature Review  ·  Journal Club", {
    x: 0.8, y: 0.5, w: 8.4, h: 0.4,
    fontSize: 14, fontFace: "Arial", color: "E8DAEF",
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
    fontSize: 15, fontFace: "Arial", color: "E8DAEF",
  });
  // Pink rule
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 3.55, w: 1.5, h: 0.03, fill: { color: "CC79A7" },
  });
  // Info
  slide.addText(
    `${journal}\n${dateStr}  |  ${volIssue}\nIF: ${ifVal}  |  JCR: ${quartile}\nDOI: ${doi}`,
    { x: 0.8, y: 3.7, w: 8.4, h: 0.6,
      fontSize: 13, fontFace: "Arial", color: "FFFFFF",
      valign: "top", lineSpacingMultiple: 1.3 }
  );
  // Bottom label
  slide.addText("Literature Review Presentation", {
    x: 0.8, y: 5.0, w: 8.4, h: 0.3,
    fontSize: 12, fontFace: "Arial", color: "CC79A7",
  });
  return slide;
}
```

---

### Content Slide

White with full-width purple header band. Pink pill badge for section labeling. Diamond decorative element.

```text
┌─────────────────────────────────────────────────────┐
│████████████████████████████████████████████████████  │  purple header band (h=0.65)
│  Action Title 28pt bold white                        │
├─────────────────────────────────────────────────────┤
│  ◆  [RESULTS]  ← pink pill badge + diamond icon      │
│                                                     │
│  • Bullet point in Arial 18pt                        │
│  • Second bullet point                               │
│  • Third bullet point                                │
│                                                     │
│  ┌─────────────────────────────────────────┐ ◆     │
│  │  Key Finding Card (white, pink accent)    │       │
│  └─────────────────────────────────────────┘       │
│                                                     │
│                                              N / N  │
└─────────────────────────────────────────────────────┘
```

```javascript
function contentSlide(title, n, badge) {
  const slide = pres.addSlide();
  slide.background = { color: "FFFFFF" };
  // Full-width purple header band
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.65, fill: { color: "5B2C8E" },
  });
  // Small decorative diamond
  slide.addShape(pres.shapes.DIAMOND, {
    x: 9.3, y: 0.15, w: 0.3, h: 0.3,
    fill: { color: "E8DAEF" },
  });
  // Title in header
  slide.addText(title, {
    x: 0.5, y: 0.08, w: 9.0, h: 0.5,
    fontSize: 26, fontFace: "Arial", color: "FFFFFF",
    bold: true, valign: "middle", margin: 0,
  });
  // Optional section badge
  if (badge) {
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.5, y: 0.8, w: 1.3, h: 0.3,
      fill: { color: "CC79A7" },
      rectRadius: 0.04,
    });
    slide.addText(badge, {
      x: 0.5, y: 0.8, w: 1.3, h: 0.3,
      fontSize: 10, fontFace: "Arial", color: "FFFFFF",
      bold: true, align: "center", valign: "middle",
    });
    // Small diamond next to badge
    slide.addShape(pres.shapes.DIAMOND, {
      x: 1.9, y: 0.85, w: 0.18, h: 0.18,
      fill: { color: "5B2C8E" },
    });
  }
  addSlideNum(slide, n);
  return slide;
}
```

---

### Result Card

White rounded card with pink left accent and a small diamond decoration.

```javascript
function addResultCard(slide, text, y) {
  // Card body
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: y, w: 9.0, h: 0.7,
    fill: { color: "FFFFFF" },
    line: { color: "D1D5DB", width: 0.5 },
    rectRadius: 0.06,
  });
  // Pink left accent
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: y, w: 0.06, h: 0.7, fill: { color: "CC79A7" },
  });
  // Small diamond decoration
  slide.addShape(pres.shapes.DIAMOND, {
    x: 9.2, y: y + 0.23, w: 0.18, h: 0.18,
    fill: { color: "E8DAEF" },
  });
  // Text
  slide.addText(text, {
    x: 0.7, y: y + 0.05, w: 8.6, h: 0.6,
    fontSize: 16, fontFace: "Arial", color: "5B2C8E",
    valign: "middle",
  });
}
```

---

### Stat Circle

Use for highlighting a single key number.

```javascript
function addStatCircle(slide, number, label, y) {
  // Large pink circle
  slide.addShape(pres.shapes.OVAL, {
    x: 0.6, y: y, w: 1.0, h: 1.0,
    fill: { color: "CC79A7" },
  });
  // Number inside circle
  slide.addText(number, {
    x: 0.6, y: y, w: 1.0, h: 1.0,
    fontSize: 24, fontFace: "Arial", color: "FFFFFF",
    bold: true, align: "center", valign: "middle",
  });
  // Label
  slide.addText(label, {
    x: 1.8, y: y, w: 7.4, h: 1.0,
    fontSize: 16, fontFace: "Arial", color: "1F2937",
    valign: "middle",
  });
}
```

---

### TOC Slide

Purple background with overlapping circular decorations. Pink top bar.

```javascript
function tocSlide(sections) {
  const slide = pres.addSlide();
  // Purple base
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: "5B2C8E" },
  });
  // Decorative circles
  slide.addShape(pres.shapes.OVAL, {
    x: -1.0, y: 3.0, w: 4.0, h: 4.0,
    fill: { color: "3B1C6E", transparency: 55 },
  });
  slide.addShape(pres.shapes.OVAL, {
    x: 7.5, y: -0.8, w: 3.0, h: 3.0,
    fill: { color: "E8DAEF", transparency: 65 },
  });
  // Pink top bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06, fill: { color: "CC79A7" },
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
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: "5B2C8E" },
  });
  // Overlapping circles
  slide.addShape(pres.shapes.OVAL, {
    x: 6.0, y: 0.5, w: 5.0, h: 5.0,
    fill: { color: "3B1C6E", transparency: 55 },
  });
  slide.addShape(pres.shapes.OVAL, {
    x: -1.0, y: 3.0, w: 3.5, h: 3.5,
    fill: { color: "E8DAEF", transparency: 65 },
  });
  // Bottom band
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 4.2, w: 10, h: 1.425, fill: { color: "3B1C6E" },
  });
  slide.addText("Thank You", {
    x: 0.8, y: 1.8, w: 8.4, h: 0.8,
    fontSize: 38, fontFace: "Arial", color: "FFFFFF",
    bold: true, align: "center",
  });
  slide.addText("Questions & Discussion", {
    x: 0.8, y: 2.7, w: 8.4, h: 0.6,
    fontSize: 22, fontFace: "Arial", color: "CC79A7",
    align: "center",
  });
  return slide;
}
```
