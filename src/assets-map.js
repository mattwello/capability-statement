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
    "cover-hero":      { src: "../assets/photos/graded/two-storey-exterior-solar.jpg", pos: "50% 4%", zoom: 1.16 }, // completed residential property / hero project
    "cover-inset":     { src: "../assets/photos/graded/rooftop-solar-array.jpg", pos: "45% 60%" }, // switchboard work, close & sharp

    // PAGE 2 — ABOUT & CAPABILITIES
    "about-founders":  { src: null, pos: "50% 35%" }, // Matthew & Mark together on rooftop solar
    "about-lighting":  { src: null, pos: "50% 50%" }, // residential lighting installation
    "about-power":     { src: null, pos: "50% 50%" }, // power point installation / maintenance

    // PAGE 3 — PROPERTY MANAGEMENT PARTNERSHIPS
    "pm-hero":         { src: "../assets/photos/graded/onsite-plans-review.jpg", pos: "60% 40%" }, // electrician working on residential switchboard
    "pm-testing":      { src: null, pos: "50% 50%" }, // electrical testing & fault finding

    // PAGE 4 — OUR WORK & CONTACT
    "work-kitchen":    { src: "../assets/photos/graded/kitchen-pendant-lighting.jpg", pos: "45% 38%" }, // completed kitchen lighting / renovation
    "work-maint":      { src: null, pos: "50% 50%" }, // general electrical maintenance on-site
    "work-board":      { src: null, pos: "50% 50%" }, // switchboard work
    "work-solar":      { src: "../assets/photos/graded/aerial-two-storey-solar.jpg", pos: "54% 50%" }, // residential solar installation
    "work-exterior":   { src: null, pos: "50% 60%" }, // residential property exterior
  },
};
