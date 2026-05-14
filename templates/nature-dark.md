# Template: Nature Dark

Premium dark theme inspired by Nature and high-impact journal presentation styles. Sophisticated, high-contrast, visually striking.

```
Theme ID: nature-dark
Alias:    nature, dark, premium, high-impact
```

---

## Color Palette

```javascript
const C = {
  primary: "1A1A2E",   // Deep midnight — title slide bg
  accent:  "D4A843",   // Gold/amber — section markers, highlights
  accent2: "E8C66A",   // Light gold — secondary accents
  bg:      "FFFFFF",   // White — content slide background
  body:    "1A1A2E",   // Midnight — body text
  muted:   "6B7280",   // Gray — citations, slide numbers
  rule:    "D1D5DB",   // Light gray — divider lines
  lightBg: "FFFBEB",   // Very light gold — callout box fill
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
- Deep midnight background (`1A1A2E`) 
- Subtle gold accent band at top (h=0.06, `D4A843`)
- "Literature Review · Journal Club" label (14pt, gold `D4A843`)
- Paper title: 28pt bold white
- Authors: 15pt warm gray (`9CA3AF`)
- Thin gold accent rule: 1.5" wide
- Journal info: 13pt white
- Bottom accent band: y=4.8, gold `D4A843`

### Content Slides
- White background
- Gold thin top accent (h=0.06, `D4A843`)
- Action title: 26pt bold midnight (`1A1A2E`)
- Thin divider: y=0.95, warm gray
- Body text: 18pt midnight
- Bullets: standard

### TOC Slide
- Deep midnight background
- Small gold top accent bar (h=0.06)
- "Table of Contents": 28pt bold white
- Section list: 22pt white, with gold dot markers
- Bottom gold accent bar

### End Slide
- Matching midnight + gold accents
- "Thank You": 36pt bold white
- "Questions & Discussion": 22pt gold

## Code Snippets

```javascript
// Title slide
function titleSlide(title, authors, journal, dateStr, volIssue, doi, ifVal, quartile) {
  const slide = pres.addSlide();
  // Dark base
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625,
    fill: { color: "1A1A2E" },
  });
  // Gold top accent bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06,
    fill: { color: "D4A843" },
  });
  // Gold bottom accent bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 4.8, w: 10, h: 0.06,
    fill: { color: "D4A843" },
  });
  // Label
  slide.addText("Literature Review  ·  Journal Club", {
    x: 0.7, y: 0.5, w: 8.6, h: 0.4,
    fontSize: 14, fontFace: "Arial", color: "D4A843",
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
    fontSize: 15, fontFace: "Arial", color: "9CA3AF",
  });
  // Gold accent rule
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 3.3, w: 1.5, h: 0.03,
    fill: { color: "D4A843" },
  });
  // Journal info
  slide.addText(
    `${journal}\n${dateStr}  |  ${volIssue}\nIF: ${ifVal}  |  JCR: ${quartile}\nDOI: ${doi}`,
    { x: 0.7, y: 3.5, w: 8.6, h: 0.7,
      fontSize: 13, fontFace: "Arial", color: "FFFFFF",
      valign: "top", lineSpacingMultiple: 1.3 }
  );
  slide.addText("Literature Review Presentation", {
    x: 0.7, y: 5.0, w: 8.6, h: 0.3,
    fontSize: 12, fontFace: "Arial", color: "D4A843",
  });
  return slide;
}
```

```javascript
// Content slide
function contentSlide(title, n) {
  const slide = pres.addSlide();
  slide.background = { color: "FFFFFF" };
  // Gold top accent
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06,
    fill: { color: "D4A843" },
  });
  // Title
  slide.addText(title, {
    x: 0.5, y: 0.2, w: 9.0, h: 0.75,
    fontSize: 26, fontFace: "Arial", color: "1A1A2E",
    bold: true, valign: "top", margin: 0,
  });
  // Divider
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 0.95, w: 9.0, h: 0.025,
    fill: { color: "D1D5DB" },
  });
  addSlideNum(slide, n);
  return slide;
}
```
