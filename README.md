# Westcoast Energy — Property Management Capability Statement

Four-page A4 capability statement for **Westcoast Energy Electrical & Solar**, written for real estate agencies, property managers, strata managers and portfolio managers.

Built in HTML/CSS/SVG and rendered to PDF with Chromium (Playwright).

## Deliverables

| File | What it is |
|---|---|
| `output/Westcoast-Energy_Property-Management_Capability-Statement_A4.pdf` | Final 4-page A4 PDF (vector text, print backgrounds) |
| `output/previews/…Page-01-Cover.png` … `Page-04-Our-Work-and-Contact.png` | 300 dpi PNG previews of each page |
| `src/` | Editable source: `index.html` (pages), `styles.css` (design system), `assets-map.js` (photo/logo assignments and crops) |
| `scripts/build.mjs` | Build: QR code → PDF → PNGs → automated QA |

## Rebuild

```bash
npm install
npm run build
```

The build also runs QA. It checks that the QR code decodes to `https://www.westcoastenergy.com.au`, that no text blocks collide, and that all text sits inside a 7.5 mm safe margin. It also lists any photo slots still showing placeholders.

## Adding the photography and logo

Every photo frame is a named **slot**. Until a file is supplied, the slot shows a clearly labelled placeholder. Nothing is stock or generated.

**Simplest:** drop files into these folders with the slot name as the filename, then run `npm run build`:

```
assets/logo/westcoast-energy-logo.svg      ← ORIGINAL logo (SVG preferred, or high-res transparent PNG)
assets/photos/cover-hero.jpg               ← etc., names below
```

| Slot | Page | Best photo for it |
|---|---|---|
| `cover-hero` | 1 | Completed residential property or a strong finished project (landscape, largest image in the document) |
| `cover-inset` | 1 | Switchboard work, close and sharp (portrait crop) |
| `about-founders` | 2 | Matthew & Mark together on the rooftop solar installation |
| `about-lighting` | 2 | Residential lighting installation |
| `about-power` | 2 | Power point installation / maintenance |
| `pm-hero` | 3 | Electrician working on a residential switchboard |
| `pm-testing` | 3 | Electrical testing / fault finding |
| `work-kitchen` | 4 | Completed kitchen lighting / renovation |
| `work-maint` | 4 | General electrical maintenance on-site |
| `work-board` | 4 | Switchboard work (different shot from page 1 if possible) |
| `work-solar` | 4 | Residential solar installation |
| `work-exterior` | 4 | Residential property exterior |

To fine-tune a crop (for example, to keep faces in frame), edit `pos` / `zoom` for that slot in `src/assets-map.js`.

## Outstanding information before commercial distribution

- [ ] **Original logo file** (SVG or high-res PNG with transparent background)
- [ ] **Project photography**: the 12 slots above
- [ ] **Phone number**: `[CONFIRM PHONE NUMBER]`, page 4
- [ ] **Email address**: `[CONFIRM EMAIL ADDRESS]`, page 4
- [ ] **Electrical contractor licence number** (EC number), page 4
- [ ] **ABN**, page 4
- [ ] **Accreditations**: only those actually held, page 4
- [ ] **Insurance details**: only as you are happy to publish them, page 4
- [ ] Sign-off on the four workflow step descriptions on page 3. They were written for this document, so confirm they match how you operate.

All placeholders use dashed outlines, so they can't be mistaken for final content.

## Design notes

- **Palette:** brand `#2C526C`, deep navy `#1B2B38`, warm off-white `#F2F0EA`, soft grey `#D1D9DC`. Supporting shades are ink `#121D26` (depth layers) and steel `#6F93AA` (accents on navy).
- **Type:** Archivo variable (expanded width, heavy weights) for headings; Inter for body copy. Both are SIL Open Font License and embedded in `src/fonts/`.
- **Geometry:** a single diagonal language runs through the document: angled photo masks, parallelogram insets with off-white keylines, brand "blades" along cut edges, chevron workflow, and a skewed four-shard collage.
- **Emphasis:** maintenance gets the visual weight, with solar supporting. "General Electrical Maintenance" is the highlighted service on page 2, and page 3 centres on day-to-day maintenance.
