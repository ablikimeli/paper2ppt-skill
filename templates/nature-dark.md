# Template: Nature Dark (Redesigned)

Premium midnight + sky-blue/orange style with thin geometric line art, subtle circular accents, and refined typography. Color‑blind friendly.

```text
Theme ID: nature-dark
Alias:    nature, dark, premium, high-impact, aurora
```

---

## Visual Impression

Deep midnight (`0F0F1A`) background with cool sky‑blue (`56B4E9`) and warm orange (`E69F00`) accents. The title slide features thin geometric line art (multiple fine rectangles forming a subtle pattern) and small circular dots as decoration. Content slides are white with a delicate top border line and a small circle accent. Premium cards use a subtle double‑border effect. Elegant, refined, confident, restrained — inspired by high‑impact journal aesthetics.

---

## Color Palette (Color‑Blind Friendly)

Uses the Wong 2011 *Nature Methods* accessible palette.

```javascript
const C = {
  primary: "0F0F1A",   // Deep midnight — title bg
  primary2:"1A1A30",   // Slightly lighter midnight — band
  accent:  "56B4E9",   // Sky blue — highlights, rules, geometric elements
  accent2: "E69F00",   // Warm orange — secondary accents, card dots
  bg:      "FFFFFF",   // White — content bg
  cardBg:  "F0F4FF",   // Ice blue — card background
  body:    "1A1A2E",   // Near-black — body text
  muted:   "6B7280",   // Gray — citations
  rule:    "E5E7EB",   // Light gray — dividers
  white:   "FFFFFF",
};
```

## Typography

```javascript
const F = {
  titleFace: "Georgia",   // Serif for main title slide
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

Dark midnight with thin geometric line art (two fine horizontal lines + short vertical segments). Small sky‑blue and orange dots as decorative accents. Serif title.

```text
┌─────────────────────────────────────────────────────┐
│  ···       ···       ···        ···        ···      │  dotted line pattern
│─────────────────────────────────────────────────────│  thin blue line (h=0.01)
│                                                     │
│  Literature Review · Journal Club                  ● │  ● = small blue dot
│                                                     │
│  Full Paper Title in Georgia Serif                  │
│  (2-3 lines)                                       │
│                                                     │
│  ────                                               │  thin blue rule
│  Author1, Author2, et al.                           │
│  Journal Name  |  Date  |  IF: X.X                 │
│                                                     │
│─────────────────────────────────────────────────────│  thin orange line
│  ···       ···       ···        ···        ···      │  dotted pattern
│  Literature Review Presentation                     │
└─────────────────────────────────────────────────────┘
```

```javascript
function titleSlide(title, authors, journal, dateStr, volIssue, doi, ifVal, quartile) {
  const slide = pres.addSlide();
  // Deep midnight base
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: "0F0F1A" },
  });
  // Geometric line art — thin sky-blue line near top
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0.15, w: 10, h: 0.01, fill: { color: "56B4E9" },
  });
  // Three small dots along the top line
  slide.addShape(pres.shapes.OVAL, {
    x: 0.8, y: 0.12, w: 0.06, h: 0.06,
    fill: { color: "56B4E9" },
  });
  slide.addShape(pres.shapes.OVAL, {
    x: 5.0, y: 0.12, w: 0.06, h: 0.06,
    fill: { color: "56B4E9" },
  });
  slide.addShape(pres.shapes.OVAL, {
    x: 9.2, y: 0.12, w: 0.06, h: 0.06,
    fill: { color: "56B4E9" },
  });
  // Small orange dot (right side)
  slide.addShape(pres.shapes.OVAL, {
    x: 8.8, y: 0.55, w: 0.12, h: 0.12,
    fill: { color: "E69F00" },
  });
  // Label
  slide.addText("Literature Review  ·  Journal Club", {
    x: 0.8, y: 0.5, w: 8.4, h: 0.4,
    fontSize: 13, fontFace: "Arial", color: "56B4E9",
  });
  // Title (SERIF — larger, more space)
  slide.addText(title, {
    x: 0.8, y: 1.4, w: 8.4, h: 1.8,
    fontSize: 32, fontFace: "Georgia", color: "FFFFFF",
    bold: true, valign: "top", margin: 0,
  });
  // Short sky-blue rule
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 3.4, w: 1.0, h: 0.025, fill: { color: "56B4E9" },
  });
  // Authors
  slide.addText(authors, {
    x: 0.8, y: 3.6, w: 8.4, h: 0.35,
    fontSize: 14, fontFace: "Arial", color: "9CA3AF",
  });
  // Info block
  slide.addText(
    `${journal}\n${dateStr}  |  ${volIssue}\nIF: ${ifVal}  |  JCR: ${quartile}\nDOI: ${doi}`,
    { x: 0.8, y: 4.0, w: 8.4, h: 0.55,
      fontSize: 12, fontFace: "Arial", color: "FFFFFF",
      valign: "top", lineSpacingMultiple: 1.2 }
  );
  // Geometric line art — thin orange line near bottom
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.15, w: 10, h: 0.01, fill: { color: "E69F00" },
  });
  // Three dots along bottom line
  slide.addShape(pres.shapes.OVAL, {
    x: 0.8, y: 5.12, w: 0.06, h: 0.06,
    fill: { color: "E69F00" },
  });
  slide.addShape(pres.shapes.OVAL, {
    x: 5.0, y: 5.12, w: 0.06, h: 0.06,
    fill: { color: "E69F00" },
  });
  slide.addShape(pres.shapes.OVAL, {
    x: 9.2, y: 5.12, w: 0.06, h: 0.06,
    fill: { color: "E69F00" },
  });
  // Bottom label
  slide.addText("Literature Review Presentation", {
    x: 0.8, y: 5.25, w: 8.4, h: 0.25,
    fontSize: 11, fontFace: "Arial", color: "56B4E9",
  });
  return slide;
}
```

---

### Content Slide

White with a thin sky‑blue top line and small dot accents. Very clean. Maximum whitespace.

```text
┌─────────────────────────────────────────────────────┐
│  ················································   │  thin blue line + dots
│                                                     │
│  Action Title 28pt bold midnight                     │
│  ────────────────────────────────────────────────   │  thin gray divider
│                                                     │
│  • Bullet point in Arial 18pt                        │
│  • Second bullet point                               │
│  • Third bullet point                                │
│                                                     │
│  ┌─────────────────────────────────────────┐        │
│  │  Key Finding (ice-blue card, blue border)│  ●    │
│  │  Premium elegant presentation            │       │
│  └─────────────────────────────────────────┘       │
│                                                     │
│                                              N / N  │
└─────────────────────────────────────────────────────┘
```

```javascript
function contentSlide(title, n) {
  const slide = pres.addSlide();
  slide.background = { color: "FFFFFF" };
  // Thin sky-blue top line
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.02, fill: { color: "56B4E9" },
  });
  // Small dot accent on the right side of the line
  slide.addShape(pres.shapes.OVAL, {
    x: 9.2, y: 0, w: 0.08, h: 0.08,
    fill: { color: "E69F00" },
  });
  // Title
  slide.addText(title, {
    x: 0.6, y: 0.25, w: 8.8, h: 0.7,
    fontSize: 28, fontFace: "Georgia", color: "0F0F1A",
    bold: true, valign: "top", margin: 0,
  });
  // Divider
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 0.95, w: 8.8, h: 0.02, fill: { color: "E5E7EB" },
  });
  addSlideNum(slide, n);
  return slide;
}
```

---

### Premium Card

Ice‑blue card with a sky‑blue left accent and an orange dot decoration. Use for key findings.

```javascript
function addPremiumCard(slide, text, y) {
  // Card with subtle double border effect
  // Outer card
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: y, w: 8.8, h: 0.75,
    fill: { color: "F0F4FF" },
    line: { color: "56B4E9", width: 0.75 },
    rectRadius: 0.04,
  });
  // Sky-blue left accent
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: y, w: 0.05, h: 0.75,
    fill: { color: "56B4E9" },
  });
  // Orange dot decoration on card
  slide.addShape(pres.shapes.OVAL, {
    x: 9.2, y: y + 0.15, w: 0.16, h: 0.16,
    fill: { color: "E69F00" },
  });
  // Text
  slide.addText(text, {
    x: 0.85, y: y + 0.05, w: 8.3, h: 0.65,
    fontSize: 16, fontFace: "Arial", color: "0F0F1A",
    valign: "middle",
  });
}
```

---

### Stat Callout

A large sky‑blue number with a thin underline. Minimal, elegant.

```javascript
function addStatCallout(slide, number, label, y) {
  // Large number
  slide.addText(number, {
    x: 0.6, y: y, w: 2.0, h: 0.7,
    fontSize: 36, fontFace: "Georgia", color: "56B4E9",
    bold: true, valign: "middle",
  });
  // Thin underline for the number
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: y + 0.65, w: 1.5, h: 0.02,
    fill: { color: "E69F00" },
  });
  // Label
  slide.addText(label, {
    x: 2.8, y: y, w: 6.6, h: 0.7,
    fontSize: 16, fontFace: "Arial", color: "1A1A2E",
    valign: "middle",
  });
}
```

---

### TOC Slide

Midnight background with geometric dots. Sky‑blue line near top and orange line near bottom.

```javascript
function tocSlide(sections) {
  const slide = pres.addSlide();
  // Midnight base
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: "0F0F1A" },
  });
  // Sky-blue line near top
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0.15, w: 10, h: 0.01, fill: { color: "56B4E9" },
  });
  // Orange line near bottom
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.15, w: 10, h: 0.01, fill: { color: "E69F00" },
  });
  // Dots
  slide.addShape(pres.shapes.OVAL, {
    x: 0.8, y: 0.12, w: 0.06, h: 0.06,
    fill: { color: "56B4E9" },
  });
  slide.addShape(pres.shapes.OVAL, {
    x: 9.2, y: 0.12, w: 0.06, h: 0.06,
    fill: { color: "56B4E9" },
  });
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
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: "0F0F1A" },
  });
  // Geometric lines
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0.15, w: 10, h: 0.01, fill: { color: "56B4E9" },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.15, w: 10, h: 0.01, fill: { color: "E69F00" },
  });
  // Dots
  slide.addShape(pres.shapes.OVAL, {
    x: 5.0, y: 0.12, w: 0.06, h: 0.06,
    fill: { color: "56B4E9" },
  });
  slide.addShape(pres.shapes.OVAL, {
    x: 5.0, y: 5.12, w: 0.06, h: 0.06,
    fill: { color: "E69F00" },
  });
  // Orange dot accent
  slide.addShape(pres.shapes.OVAL, {
    x: 8.5, y: 2.5, w: 0.15, h: 0.15,
    fill: { color: "E69F00" },
  });
  slide.addText("Thank You", {
    x: 0.8, y: 1.8, w: 8.4, h: 0.8,
    fontSize: 38, fontFace: "Georgia", color: "FFFFFF",
    bold: true, align: "center",
  });
  slide.addText("Questions & Discussion", {
    x: 0.8, y: 2.7, w: 8.4, h: 0.6,
    fontSize: 22, fontFace: "Arial", color: "56B4E9",
    align: "center",
  });
  return slide;
}
```
