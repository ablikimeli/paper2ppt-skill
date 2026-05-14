# Template: Academic Teal (Enhanced)

Fresh teal + coral medical style with card layouts, color-coded section badges, and rounded corner elements.

```
Theme ID: academic-teal
Alias:    teal, medical, health
```

---

## Visual Impression

Teal primary with warm coral accent. Clean sans-serif throughout (Arial). Content slides feature a full-width teal header band with white text. Key results in rounded white cards with coral left border. Section badges (colored pills) for method/result/discussion labels. Crisp, clinical, modern.

---

## Color Palette

```javascript
const C = {
  primary: "0D7377",   // Deep teal — title bg, header band
  primary2:"14A39A",   // Lighter teal — gradient band
  accent:  "E8636D",   // Coral — highlights, badges
  accent2: "FDE8E8",   // Light coral — card fill
  bg:      "FFFFFF",   // White — content bg
  cardBg:  "F0FDFA",   // Very light teal — card background
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
  body: 18,
  small: 14,
  cite: 11,
};
```

---

## Slide Designs

---

### Title Slide

Teal gradient with coral accent elements.

```
┌─────────────────────────────────────────────────────┐
│  ██████████████████████████████████████████████████  │  coral top bar (h=0.06)
│                                                     │
│  Literature Review  ·  Journal Club                  │  14pt Arial light teal
│                                                     │
│  Full Paper Title in Arial                           │  30pt bold white
│  (2-3 lines)                                        │
│                                                     │
│  ────                                                │  coral rule (w=1.5)
│                                                     │
│  Author1, Author2, et al.                            │  15pt light teal
│                                                     │
│  Journal Name                                        │  13pt white
│  Published: Date  |  Vol(Issue):Pages                │
│  IF: X.X  |  JCR: QX  |  DOI: 10.xxxx/xxxx          │
│                                                     │
├──────────────────────────────────────────────────────┤  lighter teal band y=4.2
│  Literature Review Presentation                      │  12pt coral
└─────────────────────────────────────────────────────┘
```

```javascript
function titleSlide(title, authors, journal, dateStr, volIssue, doi, ifVal, quartile) {
  const slide = pres.addSlide();
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: "0D7377" },
  });
  // Coral top bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06, fill: { color: "E8636D" },
  });
  // Bottom band
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 4.2, w: 10, h: 1.425, fill: { color: "14A39A" },
  });
  slide.addText("Literature Review  ·  Journal Club", {
    x: 0.8, y: 0.5, w: 8.4, h: 0.4,
    fontSize: 14, fontFace: "Arial", color: "99F6E4",
  });
  slide.addText(title, {
    x: 0.8, y: 1.3, w: 8.4, h: 1.8,
    fontSize: 30, fontFace: "Arial", color: "FFFFFF",
    bold: true, valign: "top", margin: 0,
  });
  slide.addText(authors, {
    x: 0.8, y: 3.1, w: 8.4, h: 0.4,
    fontSize: 15, fontFace: "Arial", color: "A7F3D0",
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 3.55, w: 1.5, h: 0.03, fill: { color: "E8636D" },
  });
  slide.addText(
    `${journal}\n${dateStr}  |  ${volIssue}\nIF: ${ifVal}  |  JCR: ${quartile}\nDOI: ${doi}`,
    { x: 0.8, y: 3.7, w: 8.4, h: 0.6,
      fontSize: 13, fontFace: "Arial", color: "FFFFFF",
      valign: "top", lineSpacingMultiple: 1.3 }
  );
  slide.addText("Literature Review Presentation", {
    x: 0.8, y: 5.0, w: 8.4, h: 0.3,
    fontSize: 12, fontFace: "Arial", color: "E8636D",
  });
  return slide;
}
```

---

### Content Slide

White with full-width teal header band. Section pill badge.

```
┌─────────────────────────────────────────────────────┐
│████████████████████████████████████████████████████  │  teal header band (h=0.65)
│  Action Title 28pt bold white                        │
├─────────────────────────────────────────────────────┤
│  [RESULTS]  ← coral pill badge (small rounded rect)  │
│                                                     │
│  • Bullet point in Arial 18pt                        │
│  • Second bullet point                               │
│  • Third bullet point                                │
│                                                     │
│  ┌─────────────────────────────────────────┐        │
│  │  Key Finding Card (white, coral border)   │        │
│  │  Highlighted takeaway                     │        │
│  └─────────────────────────────────────────┘        │
│                                                     │
│                                              N / N  │
└─────────────────────────────────────────────────────┘
```

```javascript
function contentSlide(title, n, badge) {
  const slide = pres.addSlide();
  slide.background = { color: "FFFFFF" };
  // Full-width teal header band with white title
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.65, fill: { color: "0D7377" },
  });
  slide.addText(title, {
    x: 0.5, y: 0.08, w: 9.0, h: 0.5,
    fontSize: 26, fontFace: "Arial", color: "FFFFFF",
    bold: true, valign: "middle", margin: 0,
  });
  // Optional section badge (e.g., "METHODS", "RESULTS")
  if (badge) {
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.5, y: 0.8, w: 1.2, h: 0.3,
      fill: { color: "E8636D" },
      rectRadius: 0.04,
    });
    slide.addText(badge, {
      x: 0.5, y: 0.8, w: 1.2, h: 0.3,
      fontSize: 10, fontFace: "Arial", color: "FFFFFF",
      bold: true, align: "center", valign: "middle",
    });
  }
  addSlideNum(slide, n);
  return slide;
}
```

---

### Result Card (for Key Findings)

White rounded card with coral left accent:

```javascript
function addResultCard(slide, text, y) {
  // White card with border
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: y, w: 9.0, h: 0.7,
    fill: { color: "FFFFFF" },
    line: { color: "D1D5DB", width: 0.5 },
    rectRadius: 0.06,
  });
  // Coral left accent
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: y, w: 0.06, h: 0.7, fill: { color: "E8636D" },
  });
  slide.addText(text, {
    x: 0.7, y: y + 0.05, w: 8.6, h: 0.6,
    fontSize: 16, fontFace: "Arial", color: "0D7377",
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
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: "0D7377" },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06, fill: { color: "E8636D" },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 4.2, w: 10, h: 1.425, fill: { color: "14A39A" },
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
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: "0D7377" },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06, fill: { color: "E8636D" },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 4.2, w: 10, h: 1.425, fill: { color: "14A39A" },
  });
  slide.addText("Thank You", {
    x: 0.8, y: 1.8, w: 8.4, h: 0.8,
    fontSize: 38, fontFace: "Arial", color: "FFFFFF",
    bold: true, align: "center",
  });
  slide.addText("Questions & Discussion", {
    x: 0.8, y: 2.7, w: 8.4, h: 0.6,
    fontSize: 22, fontFace: "Arial", color: "E8636D",
    align: "center",
  });
  return slide;
}
```
