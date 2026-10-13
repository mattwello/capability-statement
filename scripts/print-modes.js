/*
 * Print modes, applied in the browser after the document has rendered.
 * Used by scripts/build-print.mjs; the design source files are not changed.
 *
 *   applyBleed(): commercial print. 226 x 313 mm sheet = A4 trim (210 x 297)
 *     + 3 mm bleed + 5 mm slug for crop marks. Anything that touches a trim
 *     edge is stretched 3 mm into the bleed so the printer can trim cleanly.
 *   applyHome(): desktop printers. Each page is scaled to 92% and centred on
 *     an A4 sheet, so printers that cannot print to the edge clip nothing.
 *     Navy and brand blue are lifted slightly and photos brightened, because
 *     inkjets print large dark areas darker and muddier than the screen.
 */
(function () {
  const MM = 96 / 25.4;
  const SLUG = 5, BLEED = 3, OFF = SLUG + BLEED; // mm
  const W = 210, H = 297;

  function css(text) {
    const s = document.createElement("style");
    s.textContent = text;
    document.head.appendChild(s);
  }

  window.applyBleed = function () {
    css(`
      @page { size: ${W + 2 * OFF}mm ${H + 2 * OFF}mm; margin: 0; }
      body { background: #fff !important; padding: 0 !important; }
      .page { margin: 0 !important; box-shadow: none !important; width: ${W + 2 * OFF}mm !important; height: ${H + 2 * OFF}mm !important; background: #fff !important; overflow: hidden; }
      .wce-clip { position: absolute; left: ${SLUG}mm; top: ${SLUG}mm; width: ${W + 2 * BLEED}mm; height: ${H + 2 * BLEED}mm; overflow: hidden; }
      .wce-trim { position: absolute; left: ${BLEED}mm; top: ${BLEED}mm; width: ${W}mm; height: ${H}mm; overflow: visible; }
      .wce-marks { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
    `);
    document.querySelectorAll(".page").forEach((page) => {
      const bg = getComputedStyle(page).backgroundColor;
      const clip = document.createElement("div"); clip.className = "wce-clip"; clip.style.background = bg;
      const trim = document.createElement("div"); trim.className = "wce-trim";
      while (page.firstChild) trim.appendChild(page.firstChild);
      clip.appendChild(trim); page.appendChild(clip);

      // Stretch every painted element that touches a trim edge into the bleed.
      const T = trim.getBoundingClientRect();
      const painted = (el) => {
        const c = getComputedStyle(el);
        return el.classList.contains("photo") || el.tagName.toLowerCase() === "svg" ||
          (c.backgroundColor !== "rgba(0, 0, 0, 0)" && c.backgroundColor !== "transparent") || c.backgroundImage !== "none";
      };
      const edits = [];
      trim.querySelectorAll("*").forEach((el) => {
        const c = getComputedStyle(el);
        if (c.position !== "absolute" || !painted(el) || el.classList.contains("giant")) return;
        if (el.parentElement.closest(".photo")) return; // overlays inside photos follow their photo
        const r = el.getBoundingClientRect();
        const e = { l: (r.left - T.left) / MM < 0.3, t: (r.top - T.top) / MM < 0.3, r: (T.right - r.right) / MM < 0.3, b: (T.bottom - r.bottom) / MM < 0.3 };
        if (e.l || e.t || e.r || e.b) edits.push({ el, e, left: el.offsetLeft, top: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight, c });
      });
      const B = BLEED * MM;
      edits.forEach(({ el, e, left, top, w, h, c }) => {
        let L = left, Tp = top, Wd = w, Ht = h;
        if (e.l) { L -= B; Wd += B; el.style.paddingLeft = parseFloat(c.paddingLeft) + B + "px"; }
        if (e.r) { Wd += B; el.style.paddingRight = parseFloat(c.paddingRight) + B + "px"; }
        if (e.t) { Tp -= B; Ht += B; el.style.paddingTop = parseFloat(c.paddingTop) + B + "px"; }
        if (e.b) { Ht += B; el.style.paddingBottom = parseFloat(c.paddingBottom) + B + "px"; }
        Object.assign(el.style, { left: L + "px", top: Tp + "px", width: Wd + "px", height: Ht + "px", right: "auto", bottom: "auto", boxSizing: "border-box" });
      });

      // Crop marks in the slug, aligned to the trim lines.
      const tw = W + 2 * OFF, th = H + 2 * OFF;
      const x1 = OFF, x2 = OFF + W, y1 = OFF, y2 = OFF + H, len = SLUG - 1;
      const lines = [
        [x1, 0, x1, len], [x2, 0, x2, len], [x1, th - len, x1, th], [x2, th - len, x2, th],
        [0, y1, len, y1], [0, y2, len, y2], [tw - len, y1, tw, y1], [tw - len, y2, tw, y2],
      ].map(([a, b, c2, d]) => `<line x1="${a}" y1="${b}" x2="${c2}" y2="${d}"/>`).join("");
      page.insertAdjacentHTML("beforeend",
        `<svg class="wce-marks" viewBox="0 0 ${tw} ${th}" preserveAspectRatio="none"><g stroke="#000" stroke-width="0.1">${lines}</g></svg>`);
    });
  };

  window.applyHome = function () {
    const S = 0.92;
    css(`
      @page { size: A4; margin: 0; }
      body { background: #fff !important; padding: 0 !important; }
      :root { --navy: #2B4152; --brand: #3A6584; }
      .wce-sheet { position: relative; width: ${W}mm; height: ${H}mm; overflow: hidden; break-after: page; background: #fff; }
      .wce-sheet:last-child { break-after: auto; }
      .wce-sheet > .page { position: absolute; margin: 0 !important; box-shadow: none !important; break-after: auto;
        left: ${(W - W * S) / 2}mm; top: ${(H - H * S) / 2}mm; transform: scale(${S}); transform-origin: 0 0;
        outline: 0.2mm solid #E3E5E6; }
      .photo img { filter: brightness(1.1) contrast(0.96); }
    `);
    document.querySelectorAll(".page").forEach((page) => {
      const sheet = document.createElement("div"); sheet.className = "wce-sheet";
      page.parentNode.insertBefore(sheet, page); sheet.appendChild(page);
    });
  };
})();
