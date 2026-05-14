# Template: Academic Navy (Default)

Professional navy-blue academic style. Best for most literature review presentations.

```
Theme ID: academic-navy
Alias:    navy, default, blue
```

---

## Color Palette

```javascript
const C = {
  primary: "1A3A5C",   // Deep navy — title slide bg, primary elements
  accent:  "2E75B6",   // Mid-blue — section markers, borders
  accent2: "4A90D9",   // Lighter blue — secondary accents
  bg:      "FFFFFF",   // White — content slide background
  body:    "2D2D2D",   // Near-black — body text
  muted:   "666666",   // Gray — citations, slide numbers
  rule:    "D0D0D0",   // Light gray — divider lines
  lightBg: "EBF3FA",   // Light blue — callout box fill
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
- Dark navy gradient (`1A3A5C` top, `2B5A8A` bottom)
- "Literature Review · Journal Club" label at top (14pt, accent blue)
- Paper title: 28pt bold white
- Authors: 15pt light blue (`CADCFC`)
- Thin accent rule (2" wide, blue)
- Journal info: 13pt white
- Bottom accent band from y=4.2

### Content Slides
- White background
- Thin navy header band at top (h=0.08)
- Action title: 26pt bold navy, y=0.2
- Thin divider: y=0.95, h=0.025
- Body text: 18pt, dark gray

### TOC Slide
- Navy background matching title slide
- "Table of Contents": 28pt bold white
- Section list: 22pt white, paraSpaceAfter: 12
- Bottom accent band matching title slide

### End Slide
- Same two-tone navy as title slide
- "Thank You": 36pt bold white, centered
- "Questions & Discussion": 22pt blue, centered

## Code Snippets

```javascript
// Title slide with two-tone gradient
function titleSlide(title, authors, journal, dateStr, volIssue, doi, ifVal, quartile) {
  const slide = pres.addSlide();
  // Dark base
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625,
    fill: { color: "1A3A5C" },
  });
  // Lighter band at bottom
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 4.2, w: 10, h: 1.425,
    fill: { color: "2B5A8A" },
  });
  // Label
  slide.addText("Literature Review  ·  Journal Club", {
    x: 0.7, y: 0.5, w: 8.6, h: 0.4,
    fontSize: 14, fontFace: "Arial", color: "2E75B6",
  });
  // Title
  slide.addText(title, {
    x: 0.7, y: 1.3, w: 8.6, h: 1.6,
    fontSize: 28, fontFace: "Arial", color: "FFFFFF",
    bold: true, valign: "top", margin: 0,
  });
  // Authors
  slide.addText(authors, {
    x: 0.7, y: 2.9, w: 8.6, h: 0.4,
    fontSize: 15, fontFace: "Arial", color: "CADCFC",
  });
  // Accent rule
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 3.3, w: 2.0, h: 0.03,
    fill: { color: "2E75B6" },
  });
  // Journal info
  slide.addText(
    `${journal}\n${dateStr}  |  ${volIssue}\nIF: ${ifVal}  |  JCR: ${quartile}\nDOI: ${doi}`,
    { x: 0.7, y: 3.5, w: 8.6, h: 0.7,
      fontSize: 13, fontFace: "Arial", color: "FFFFFF",
      valign: "top", lineSpacingMultiple: 1.3 }
  );
  // Bottom label
  slide.addText("Literature Review Presentation", {
    x: 0.7, y: 5.0, w: 8.6, h: 0.3,
    fontSize: 12, fontFace: "Arial", color: "8899BB",
  });
  return slide;
}
```

```javascript
// Content slide
function contentSlide(title, n) {
  const slide = pres.addSlide();
  slide.background = { color: "FFFFFF" };
  // Header band
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.08,
    fill: { color: "1A3A5C" },
  });
  // Title
  slide.addText(title, {
    x: 0.5, y: 0.2, w: 9.0, h: 0.75,
    fontSize: 26, fontFace: "Arial", color: "1A3A5C",
    bold: true, valign: "top", margin: 0,
  });
  // Divider
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 0.95, w: 9.0, h: 0.025,
    fill: { color: "D0D0D0" },
  });
  addSlideNum(slide, n);
  return slide;
}
```
