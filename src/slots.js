/*
 * Fills [data-slot] photo frames and [data-logo] holders from WCE_ASSETS.
 * Empty slots render as clearly-labelled placeholders (never fake imagery).
 * Sets window.__WCE_READY once every image has decoded (used by the build).
 */
(function () {
  const A = window.WCE_ASSETS || { photos: {}, logo: {} };
  const AUTO = window.WCE_AUTO || { photos: {}, logo: null };
  const waits = [];
  const missing = [];

  function load(img) {
    waits.push(img.decode().catch(() => { img.dataset.broken = "1"; }));
  }

  document.querySelectorAll("[data-slot]").forEach((frame) => {
    const key = frame.dataset.slot;
    const cfg = Object.assign({}, A.photos[key]);
    cfg.src = cfg.src || AUTO.photos[key];
    if (cfg.src) {
      const img = document.createElement("img");
      // ?web → email-size build uses the lighter graded-web copies
      img.src = location.search.includes("web") ? cfg.src.replace(/\/(graded|muted|duo|mono)\//, "/$1-web/") : cfg.src;
      img.alt = frame.dataset.label || key;
      img.style.objectPosition = cfg.pos || "50% 50%";
      // crop: [left, top, right, bottom] as fractions of the image to keep
      if (cfg.crop) {
        const [l, t, r, b] = cfg.crop.map((v) => v * 100);
        img.style.objectViewBox = `inset(${t}% ${100 - r}% ${100 - b}% ${l}%)`;
      }
      if (cfg.zoom && cfg.zoom !== 1) {
        img.style.transform = `scale(${cfg.zoom})`;
        img.style.transformOrigin = cfg.pos || "50% 50%";
      }
      frame.prepend(img);
      frame.classList.add("is-filled");
      load(img);
    } else {
      frame.classList.add("is-empty");
      missing.push(key);
      const tag = document.createElement("span");
      tag.className = "ph-label";
      tag.innerHTML = `<b>Photo · ${key}</b>${frame.dataset.label || ""}`;
      frame.appendChild(tag);
    }
  });

  document.querySelectorAll("[data-logo]").forEach((holder) => {
    const kind = holder.dataset.logo || "lockup";
    const src = (A.logo || {})[kind] || (kind === "lockup" ? AUTO.logo : null);
    if (src) {
      const img = document.createElement("img");
      img.src = src;
      img.alt = "Westcoast Energy Electrical & Solar";
      holder.appendChild(img);
      holder.classList.add("is-filled");
      load(img);
    } else {
      holder.classList.add("is-empty");
      if (!missing.includes("logo")) missing.push("logo");
      holder.innerHTML = `<span>Original logo file</span>`;
    }
  });

  window.__WCE_MISSING = missing;
  Promise.all([document.fonts.ready, ...waits]).then(() => {
    window.__WCE_READY = true;
  });
})();
