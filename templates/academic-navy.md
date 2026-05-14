# Template: Academic Navy (Enhanced)

Professional navy + gold academic style with serif titles, card layouts, and left accent bars.

```
Theme ID: academic-navy
Alias:    navy, default
```

---

## Visual Impression

Deep navy primary with warm gold accents. Serif font for main title (Georgia), sans-serif for body (Arial). Content slides use white cards with a navy left accent bar. Key findings are highlighted in rounded gold-tinted cards. Clean, confident, scholarly.

---

## Color Palette

```javascript
const C = {
  primary: "1A3A5C",   // Deep navy — title bg, header band
  primary2:"2B5A8A",   // Lighter navy — title gradient band
  accent:  "C9A84C",   // Gold — key highlights, rules
  accent2: "E8D5A3",   // Light gold — card fill
  bg:      "FFFFFF",   // White — content bg
  cardBg:  "F8F6F0",   // Warm off-white — card background
  body:    "2D2D2D",   // Near-black — body text
  muted:   "6B7280",   // Gray — citations
  rule:    "D1D5DB",   // Light gray — dividers
  accent3: "3B7DD8",   // Blue — secondary links
  white:   "FFFFFF",
};
```

## Typography

```javascript
const F = {
  titleFace: "Georgia",   // Serif for main title
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

Navy gradient background. Gold accent elements. Serif paper title for elegance.

```
┌─────────────────────────────────────────────────────┐
│  ██████████████████████████████████████████████████  │  gold top bar (h=0.06)
│                                                     │
│  Literature Review  ·  Journal Club                  │  14pt Arial gold
│                                                     │
│    Full Paper Title in Georgia Serif                 │  30pt bold white, Georgia
│    (2-3 lines)                                      │
│                                                     │
│  ────                                                │  gold rule (w=1.5)
│                                                     │
│  Author1, Author2, et al.                            │  15pt light blue
│                                                     │
│  Journal Name                                        │  13pt white
│  Published: Date  |  Vol(Issue):Pages                │
│  IF: X.X  |  JCR: QX  |  DOI: 10.xxxx/xxxx          │
│                                                     │
├──────────────────────────────────────────────────────┤  lighter navy band y=4.2
│  Literature Review Presentation                      │  12pt gold
└─────────────────────────────────────────────────────┘
```

```javascript
function titleSlide(title, authors, journal, dateStr, volIssue, doi, ifVal, quartile) {
  const slide = pres.addSlide();
  // Dark navy base
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: "1A3A5C" },
  });
  // Gold top bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06, fill: { color: "C9A84C" },
  });
  // Lighter band at bottom
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 4.2, w: 10, h: 1.425, fill: { color: "2B5A8A" },
  });
  // Gold bottom bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 4.2, w: 10, h: 0.02, fill: { color: "C9A84C" },
  });
  // Label
  slide.addText("Literature Review  ·  Journal Club", {
    x: 0.8, y: 0.5, w: 8.4, h: 0.4,
    fontSize: 14, fontFace: "Arial", color: "C9A84C",
  });
  // Paper title (SERIF for elegance)
  slide.addText(title, {
    x: 0.8, y: 1.3, w: 8.4, h: 1.8,
    fontSize: 30, fontFace: "Georgia", color: "FFFFFF",
    bold: true, valign: "top", margin: 0,
  });
  // Authors
  slide.addText(authors, {
    x: 0.8, y: 3.1, w: 8.4, h: 0.4,
    fontSize: 15, fontFace: "Arial", color: "B8C9E0",
  });
  // Gold rule
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 3.55, w: 1.5, h: 0.03, fill: { color: "C9A84C" },
  });
  // Journal info
  slide.addText(
    `${journal}\n${dateStr}  |  ${volIssue}\nIF: ${ifVal}  |  JCR: ${quartile}\nDOI: ${doi}`,
    { x: 0.8, y: 3.7, w: 8.4, h: 0.6,
      fontSize: 13, fontFace: "Arial", color: "FFFFFF",
      valign: "top", lineSpacingMultiple: 1.3 }
  );
  // Bottom label
  slide.addText("Literature Review Presentation", {
    x: 0.8, y: 5.0, w: 8.4, h: 0.3,
    fontSize: 12, fontFace: "Arial", color: "E8D5A3",
  });
  return slide;
}
```

---

### Content Slide

White background with navy left accent bar. Thin divider under title. Body in Arial.

```
┌─────────────────────────────────────────────────────┐
│█ Action Title in Georgia Serif, 28pt bold navy       │  left accent bar w=0.08
│█ ────────────────────────────────────────────────── │
│█                                                     │
│█  • Bullet point text in Arial 18pt                  │
│█  • Second bullet point                              │
│█  • Third bullet point                               │
│█                                                     │
│█  ┌─────────────────────────────────────────┐        │
│█  │  Key Finding Card (gold background)      │        │
│█  │  Highlighted takeaway                     │        │
│█  └─────────────────────────────────────────┘        │
│█                                                     │
│█                                              N / N  │
└─────────────────────────────────────────────────────┘
```

```javascript
function contentSlide(title, n) {
  const slide = pres.addSlide();
  slide.background = { color: "FFFFFF" };
  // Navy left accent bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.08, h: 5.625, fill: { color: "1A3A5C" },
  });
  // Title
  slide.addText(title, {
    x: 0.4, y: 0.2, w: 9.1, h: 0.75,
    fontSize: 28, fontFace: "Georgia", color: "1A3A5C",
    bold: true, valign: "top", margin: 0,
  });
  // Divider
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 0.95, w: 9.1, h: 0.025, fill: { color: "D1D5DB" },
  });
  addSlideNum(slide, n);
  return slide;
}
```

---

### Highlight Card (for Key Findings)

Use a gold-tinted rounded card to highlight important results:

```javascript
function addHighlightCard(slide, text, y) {
  // Card background
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: y, w: 9.0, h: 0.7,
    fill: { color: "F8F6F0" },
    line: { color: "C9A84C", width: 1 },
    rectRadius: 0.06,
  });
  // Left gold accent stripe on card
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: y, w: 0.06, h: 0.7, fill: { color: "C9A84C" },
  });
  // Card text
  slide.addText(text, {
    x: 0.7, y: y + 0.05, w: 8.6, h: 0.6,
    fontSize: 16, fontFace: "Arial", color: "1A3A5C",
    valign: "middle",
  });
}
```

---

### TOC Slide

Navy background. Gold top bar. White text list. Clean.

```javascript
function tocSlide(sections) {
  const slide = pres.addSlide();
  // Navy base
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: "1A3A5C" },
  });
  // Gold top bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06, fill: { color: "C9A84C" },
  });
  // Bottom band
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 4.2, w: 10, h: 1.425, fill: { color: "2B5A8A" },
  });
  slide.addText("Table of Contents", {
    x: 0.8, y: 0.5, w: 8.4, h: 0.6,
    fontSize: 28, fontFace: "Georgia", color: "FFFFFF",
    bold: true, margin: 0,
  });
  // Gold accents between items
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

Matching navy + gold gradient.

```javascript
function endSlide() {
  const slide = pres.addSlide();
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: "1A3A5C" },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06, fill: { color: "C9A84C" },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 4.2, w: 10, h: 1.425, fill: { color: "2B5A8A" },
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
