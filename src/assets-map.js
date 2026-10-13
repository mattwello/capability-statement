/*
 * WESTCOAST ENERGY — ASSET MAP (v2)
 * ------------------------------------------------------------------
 * Assigns the ORIGINAL photos and logo files to the layout.
 *   src  : path to the prepared photo (scripts/prepare-photos.py)
 *   pos  : crop focus, CSS object-position
 *   zoom : optional extra scale for tighter crops
 *   crop : optional [left, top, right, bottom] fractions of the image to keep
 * v1 of the document keeps its own map in assets-map-v1.js.
 */
window.WCE_ASSETS = {
  logo: {
    // ORIGINAL artwork; only flat backgrounds removed or trimmed (scripts/prepare-logos.py)
    lockup:   "../assets/logo/westcoast-lockup-electrical-solar_cream_transparent.png",
    monogram: "../assets/logo/westcoast-monogram_white_transparent.png",
    reversed: "../assets/logo/westcoast-lockup-electrical-solar_reversed-white_trimmed.png", // on navy / photo
  },
  photos: {
    // PAGE 1
    "cover-hero":       { src: "../assets/photos/muted/two-storey-exterior-solar.jpg", crop: [0, 0.16, 1, 0.515] }, // ends above the scissor lift
    "cover-onsite":     { src: "../assets/photos/muted/solar-install-in-progress.jpg", pos: "55% 62%", zoom: 1.5 },
    // PAGE 2
    "about-founders":   { src: "../assets/photos/muted/founders-matthew-mark-rooftop-solar.jpg", pos: "62% 30%" },
    "about-work":       { src: "../assets/photos/muted/power-point-testing.jpg", pos: "60% 50%" },
    // PAGE 3
    "pm-hero":          { src: "../assets/photos/muted/meter-box-testing.jpg", pos: "55% 40%" },
    // PAGE 4
    "work-kitchen":     { src: "../assets/photos/muted/kitchen-pendant-lighting.jpg", pos: "45% 40%" },
    "work-light":       { src: "../assets/photos/muted/ceiling-downlight-cutout.jpg", pos: "50% 52%" },
    "work-reno":        { src: "../assets/photos/muted/wall-chasing-rewire.jpg", pos: "45% 45%" },
    "work-residential": { src: "../assets/photos/muted/aerial-two-storey-solar.jpg", pos: "54% 50%" },
    "work-solar":       { src: "../assets/photos/muted/rooftop-solar-array.jpg", pos: "45% 62%" },
  },
};
