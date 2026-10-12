/*
 * WESTCOAST ENERGY — ASSET MAP
 * ------------------------------------------------------------------
 * The single place where photography and the logo are assigned to the
 * layout. Paths are relative to /src/index.html.
 *
 *   src   : path to the ORIGINAL file (null = clearly-marked placeholder)
 *   pos   : crop focus, CSS object-position ("50% 30%" = centre, upper third)
 *   zoom  : optional extra scale (1 = fit to frame) for tighter crops
 *
 * Never point "logo" at a redrawn or approximated logo — original files only.
 */
window.WCE_ASSETS = {
  logo: {
    // ORIGINAL artwork with only the flat background removed (scripts/prepare-logos.py).
    // Placed on white / off-white surfaces only.
    lockup:   "../assets/logo/westcoast-lockup-electrical-solar_cream_transparent.png",
    monogram: "../assets/logo/westcoast-monogram_white_transparent.png",
  },

  photos: {
    // PAGE 1 — COVER
    "cover-hero":       { src: "../assets/photos/graded/two-storey-exterior-solar.jpg", pos: "50% 4%", zoom: 1.16 }, // completed residential property
    "cover-inset":      { src: "../assets/photos/graded/ceiling-downlight-cutout.jpg", pos: "52% 58%", zoom: 1.45 },             // downlight cut-out, on the tools

    // PAGE 2 — ABOUT & CAPABILITIES
    "about-founders":   { src: "../assets/photos/graded/founders-matthew-mark-rooftop-solar.jpg", pos: "66% 40%", zoom: 1.24 },
    "about-work":       { src: "../assets/photos/graded/wall-chasing-rewire.jpg", pos: "28% 50%" },                  // wall chasing / rewiring

    // PAGE 3 — PROPERTY MANAGEMENT PARTNERSHIPS
    "pm-hero":          { src: "../assets/photos/graded/onsite-plans-review.jpg", pos: "60% 40%" },                  // reviewing plans on-site
    "pm-onsite":        { src: "../assets/photos/graded/solar-install-in-progress.jpg", pos: "52% 64%", zoom: 1.6 },            // solar install in progress

    // PAGE 4 — OUR WORK & CONTACT
    "work-kitchen":     { src: "../assets/photos/graded/kitchen-pendant-lighting.jpg", pos: "45% 38%" },             // completed kitchen lighting
    "work-residential": { src: "../assets/photos/graded/aerial-two-storey-solar.jpg", pos: "54% 50%" },              // aerial, residential solar
    "work-solar":       { src: "../assets/photos/graded/rooftop-solar-array.jpg", pos: "45% 62%" },                  // completed rooftop array
  },
};
