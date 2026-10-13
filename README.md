# Westcoast Energy — Property Management Capability Statement

Four-page A4 capability statement for **Westcoast Energy Electrical & Solar**, written for real estate agencies, property managers, strata managers and portfolio managers.

Built in HTML/CSS/SVG and rendered to PDF with Chromium (Playwright).

## Deliverables

| File | What it is |
|---|---|
| `output/Westcoast-Energy_Property-Management_Capability-Statement_A4.pdf` | Final 4-page A4 PDF for print (vector text, full-resolution photos) |
| `output/Westcoast-Energy_Property-Management_Capability-Statement_A4_email.pdf` | Same layout with lighter photos, sized for email |
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

**Logo:** a reversed (white) lockup is also available, at `assets/logo/westcoast-lockup-electrical-solar_reversed-white_trimmed.png`, for use on navy. The original files are in `assets/logo/originals/`. `python3 scripts/prepare-logos.py` makes the transparent versions used in the layout. It removes only the flat white or cream background, keeping the original artwork, colours and edges, and never redraws anything.

**Photos:** originals live in `assets/photos/originals/` and are never modified. `python3 scripts/prepare-photos.py` writes colour-graded copies to `graded/` (print) and `graded-web/` (email), and `src/assets-map.js` assigns them to slots. Alternatively, drop a file named after its slot (e.g. `assets/photos/cover-hero.jpg`) into `assets/photos/` and run `npm run build`.

| Slot | Page | Photo |
|---|---|---|
| `cover-hero` | 1 | Two-storey exterior with solar |
| `cover-inset` | 1 | Ceiling downlight cut-out |
| `about-founders` | 2 | Matthew & Mark on the rooftop |
| `about-work` | 2 | Power point testing |
| `pm-hero` | 3 | Reviewing plans on-site |
| `pm-onsite` | 3 | Meter box testing |
| `work-kitchen` | 4 | Completed kitchen pendant lighting |
| `work-reno` | 4 | Wall chasing / renovation rewiring |
| `work-residential` | 4 | Aerial, residential solar |
| `work-solar` | 4 | Completed rooftop array |

Also in `assets/photos/originals/` but not placed: solar install in progress (an earlier version used it on page 3).

To fine-tune a crop (for example, to keep faces in frame), edit `pos` / `zoom` for that slot in `src/assets-map.js`.

## Outstanding information before commercial distribution

- [x] **Original logo files**: supplied and placed (cover, contact tile, page 3 monogram). An SVG/vector master would still be best for commercial print.
- [x] **Photography:** 10 of the supplied photos placed, each used once. No placeholders, stock or generated imagery remain.
- [x] **Phone number**: 0429 346 088
- [x] **Email address**: hello@westcoastenergy.com.au
- [x] **Electrical contractor licence**: EC 16993
- [x] **ABN**: 73 687 509 566
- [ ] **Accreditations**: only those actually held, page 4
- [ ] **Insurance details**: only as you are happy to publish them, page 4
- [ ] Sign-off on the four workflow step descriptions on page 3. They were written for this document, so confirm they match how you operate.

All placeholders use dashed outlines, so they can't be mistaken for final content.

## Design notes (v3, current)

v3 softens the design to match westcoastenergy.com.au, using values sampled from a screenshot of the site.

- **Page and cards:** white page, `#F5F5F5` cards, 3 to 4 mm rounded corners. No angled cuts.
- **Headlines:** Inter semibold in sentence case, two tones: `#343345` for the first line, `#83828D` for the second.
- **Body text:** `#595D7A`.
- **Labels:** outlined pill tags with a dot for section labels. White pills sit over photos.
- **Icons:** white circular icon buttons on grey cards. General maintenance gets the one blue button.
- **Colour blocks:** the workflow and contact blocks are rounded navy cards inside the margins.
- **Kept from v2:** the brand colours, running header, fixed headline slot, muted photo grade and seven-step type scale.

Earlier versions are kept for comparison:

- **v2:** `src/index-v2.html`, `src/styles-v2.css` and `src/assets-map-v2.js`, with page images in `teardown/before-v2/`.
- **v1:** `src/index-v1.html`, `src/styles-v1.css` and `src/assets-map-v1.js`, with page images in `teardown/before/`.

## Alternate style (v4), for comparison

A trial of the second capability statement template the client supplied, re-coloured to the Westcoast brand:

- photos tinted in the brand colour (duotone), with one large rounded corner
- giant cropped words bleeding off the cover and back page
- condensed headings with coloured subtitles, triangle bullets and soft grey panels

It does not replace the main PDF.

| Part | Where |
|---|---|
| Source | `src/index-v4.html`, `src/styles-v4.css`, `src/assets-map-v4.js` |
| Output | `output/alt-style-v4/` |
| Rebuild | `node scripts/build.mjs index-v4.html alt-style-v4 Alt-Style` |

## Design teardown

- **Interactive page:** `teardown/index.html`. Open it in a browser, and press B to flip every demo between v1 and v2. `teardown/Westcoast-Energy_Design-Teardown_standalone.html` is the same page as a single file you can send.
- **Measurements:** `teardown/data/*.json`, from the teardown probe (`teardown/tools/measure.js`, run by `measure-doc.mjs`) and from `teardown/tools/pixel-metrics.py`.
- **v1:** kept for comparison as `src/index-v1.html`, `src/styles-v1.css` and `src/assets-map-v1.js`, with page images in `teardown/before/`.
