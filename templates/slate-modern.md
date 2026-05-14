# Template: Slate Modern

Clean, contemporary style with dark slate and indigo accent. Best for technology, engineering, and data science papers.

```
Theme ID: slate-modern
Alias:    slate, modern, indigo, tech, cs
```

---

## Color Palette

```javascript
const C = {
  primary: "1E293B",   // Dark slate — title slide bg
  accent:  "4F46E5",   // Indigo — section markers, borders
  accent2: "818CF8",   // Light indigo — secondary accents
  bg:      "FFFFFF",   // White — content slide background
  body:    "1E293B",   // Slate — body text
  muted:   "64748B",   // Gray-blue — citations, slide numbers
  rule:    "CBD5E1",   // Light slate — divider lines
  lightBg: "EEF2FF",   // Very light indigo — callout box fill
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
- Dark slate gradient (`1E293B` top, `334155` bottom)
- "Literature Review · Journal Club" label (14pt, indigo `818CF8`)
- Paper title: 28pt bold white
- Authors: 15pt light gray (`CBD5E1`)
- Accent rule: 1.8" wide, indigo `4F46E5`
- Journal info: 13pt white
- Bottom band from y=4.2 (`334155`)

### Content Slides
- White background
- Indigo header band at top (h=0.08, `4F46E5`)
- Action title: 26pt bold slate (`1E293B`)
- Thin divider: y=0.95
- Body text: 18pt slate

### TOC Slide
- Dark slate background + indigo accent band
- Section list: 22pt white

### End Slide
- Same two-tone slate as title slide

## Code Snippets

```javascript
// Title slide
function titleSlide(title, authors, journal, dateStr, volIssue, doi, ifVal, quartile) {
  const slide = pres.addSlide();
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625,
    fill: { color: "1E293B" },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 4.2, w: 10, h: 1.425,
    fill: { color: "334155" },
  });
  slide.addText("Literature Review  ·  Journal Club", {
    x: 0.7, y: 0.5, w: 8.6, h: 0.4,
    fontSize: 14, fontFace: "Arial", color: "818CF8",
  });
  slide.addText(title, {
    x: 0.7, y: 1.3, w: 8.6, h: 1.6,
    fontSize: 28, fontFace: "Arial", color: "FFFFFF",
    bold: true, valign: "top", margin: 0,
  });
  slide.addText(authors, {
    x: 0.7, y: 2.9, w: 8.6, h: 0.4,
    fontSize: 15, fontFace: "Arial", color: "CBD5E1",
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 3.3, w: 1.8, h: 0.03,
    fill: { color: "4F46E5" },
  });
  slide.addText(
    `${journal}\n${dateStr}  |  ${volIssue}\nIF: ${ifVal}  |  JCR: ${quartile}\nDOI: ${doi}`,
    { x: 0.7, y: 3.5, w: 8.6, h: 0.7,
      fontSize: 13, fontFace: "Arial", color: "FFFFFF",
      valign: "top", lineSpacingMultiple: 1.3 }
  );
  slide.addText("Literature Review Presentation", {
    x: 0.7, y: 5.0, w: 8.6, h: 0.3,
    fontSize: 12, fontFace: "Arial", color: "94A3B8",
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
    fill: { color: "4F46E5" },
  });
  slide.addText(title, {
    x: 0.5, y: 0.2, w: 9.0, h: 0.75,
    fontSize: 26, fontFace: "Arial", color: "1E293B",
    bold: true, valign: "top", margin: 0,
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 0.95, w: 9.0, h: 0.025,
    fill: { color: "CBD5E1" },
  });
  addSlideNum(slide, n);
  return slide;
}
```
