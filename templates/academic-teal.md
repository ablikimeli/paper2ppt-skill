# Template: Academic Teal

Fresh teal-green style for medical, health, and life science presentations.

```
Theme ID: academic-teal
Alias:    teal, green, medical, health
```

---

## Color Palette

```javascript
const C = {
  primary: "0D7377",   // Teal — title slide bg, primary elements
  accent:  "14A39A",   // Bright teal — section markers, borders
  accent2: "5EEAD4",   // Light teal — secondary accents
  bg:      "FFFFFF",   // White — content slide background
  body:    "2D2D2D",   // Near-black — body text
  muted:   "6B7280",   // Gray — citations, slide numbers
  rule:    "D1D5DB",   // Light gray — divider lines
  lightBg: "E6FFFA",   // Very light teal — callout box fill
  white:   "FFFFFF",
};
```

## Typography

```javascript
const F = {
  face: "Arial",
  title: 26,
  subtitle: 20,
  body: 18,
  small: 14,
  cite: 11,
};
```

## Slide Layouts

### Title Slide
- Teal gradient (`0D7377` top, `14A39A` bottom)
- "Literature Review · Journal Club" label (13pt, light teal `99F6E4`)
- Paper title: 28pt bold white
- Authors: 15pt light teal (`A7F3D0`)
- Accent rule: 1.5" wide, bright teal (`5EEAD4`)
- Journal info: 13pt white

### Content Slides
- White background
- Teal header band at top (h=0.08, `0D7377`)
- Action title: 26pt bold teal
- Thin divider: y=0.95, h=0.025 (`D1D5DB`)
- Body text: 18pt, dark gray
- Bullets: standard pptxgenjs `bullet: true`

### TOC Slide
- Teal background matching title slide (bottom band `14A39A`)
- "Table of Contents": 28pt bold white
- Section list: 22pt white, paraSpaceAfter: 12

### End Slide
- Same two-tone teal as title slide
- "Thank You": 36pt bold white
- "Questions & Discussion": 22pt light teal

## Code Snippets

```javascript
// Title slide
function titleSlide(title, authors, journal, dateStr, volIssue, doi, ifVal, quartile) {
  const slide = pres.addSlide();
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625,
    fill: { color: "0D7377" },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 4.2, w: 10, h: 1.425,
    fill: { color: "14A39A" },
  });
  slide.addText("Literature Review  ·  Journal Club", {
    x: 0.7, y: 0.5, w: 8.6, h: 0.4,
    fontSize: 14, fontFace: "Arial", color: "99F6E4",
  });
  slide.addText(title, {
    x: 0.7, y: 1.3, w: 8.6, h: 1.6,
    fontSize: 28, fontFace: "Arial", color: "FFFFFF",
    bold: true, valign: "top", margin: 0,
  });
  slide.addText(authors, {
    x: 0.7, y: 2.9, w: 8.6, h: 0.4,
    fontSize: 15, fontFace: "Arial", color: "A7F3D0",
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 3.3, w: 1.5, h: 0.03,
    fill: { color: "5EEAD4" },
  });
  slide.addText(
    `${journal}\n${dateStr}  |  ${volIssue}\nIF: ${ifVal}  |  JCR: ${quartile}\nDOI: ${doi}`,
    { x: 0.7, y: 3.5, w: 8.6, h: 0.7,
      fontSize: 13, fontFace: "Arial", color: "FFFFFF",
      valign: "top", lineSpacingMultiple: 1.3 }
  );
  slide.addText("Literature Review Presentation", {
    x: 0.7, y: 5.0, w: 8.6, h: 0.3,
    fontSize: 12, fontFace: "Arial", color: "6EE7B7",
  });
  return slide;
}
```

```javascript
// Content slide
function contentSlide(title, n) {
  const slide = pres.addSlide();
  slide.background = { color: "FFFFFF" };
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.08,
    fill: { color: "0D7377" },
  });
  slide.addText(title, {
    x: 0.5, y: 0.2, w: 9.0, h: 0.75,
    fontSize: 26, fontFace: "Arial", color: "0D7377",
    bold: true, valign: "top", margin: 0,
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 0.95, w: 9.0, h: 0.025,
    fill: { color: "D1D5DB" },
  });
  addSlideNum(slide, n);
  return slide;
}
```
