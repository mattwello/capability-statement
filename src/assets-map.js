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
    // Full-colour logo for light backgrounds (cover tab, contact tile, folios)
    onLight: null,          // e.g. "../assets/logo/westcoast-energy-logo.png"
  },

  photos: {
    // PAGE 1 — COVER
    "cover-hero":      { src: null, pos: "50% 55%" }, // completed residential property / hero project
    "cover-inset":     { src: null, pos: "50% 45%" }, // switchboard work, close & sharp

    // PAGE 2 — ABOUT & CAPABILITIES
    "about-founders":  { src: null, pos: "50% 35%" }, // Matthew & Mark together on rooftop solar
    "about-lighting":  { src: null, pos: "50% 50%" }, // residential lighting installation
    "about-power":     { src: null, pos: "50% 50%" }, // power point installation / maintenance

    // PAGE 3 — PROPERTY MANAGEMENT PARTNERSHIPS
    "pm-hero":         { src: null, pos: "50% 40%" }, // electrician working on residential switchboard
    "pm-testing":      { src: null, pos: "50% 50%" }, // electrical testing & fault finding

    // PAGE 4 — OUR WORK & CONTACT
    "work-kitchen":    { src: null, pos: "50% 45%" }, // completed kitchen lighting / renovation
    "work-maint":      { src: null, pos: "50% 50%" }, // general electrical maintenance on-site
    "work-board":      { src: null, pos: "50% 50%" }, // switchboard work
    "work-solar":      { src: null, pos: "50% 50%" }, // residential solar installation
    "work-exterior":   { src: null, pos: "50% 60%" }, // residential property exterior
  },
};
