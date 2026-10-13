// Runs the teardown probe (measure.js) against the capability statement's live DOM.
//   node teardown/tools/measure-doc.mjs <out.json>
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const probe = fs.readFileSync(path.join(ROOT, "teardown/tools/measure.js"), "utf8");
const browser = await chromium.launch();
// One A4 page per viewport (210 x 297 mm at 96 dpi), so "first viewport" means the cover.
const page = await browser.newPage({ viewport: { width: 794, height: 1123 } });
await page.goto(pathToFileURL(path.join(ROOT, "src/index.html")).href);
await page.waitForFunction(() => window.__WCE_READY === true);
await page.emulateMedia({ media: "print" });
const visibleCount = await page.evaluate(() => Array.from(document.querySelectorAll("body *")).filter(el => { const r = el.getBoundingClientRect(); return r.width >= 1 && r.height >= 1; }).length);
const out = JSON.parse(await page.evaluate(probe));
// Print specific additions: geometry and accent counts per page, read from the DOM.
out.print = await page.evaluate(() => {
  const pages = [...document.querySelectorAll(".page")];
  return pages.map((pg, i) => ({
    page: i + 1,
    polygons: pg.querySelectorAll("svg.shape polygon").length,
    clippedElements: [...pg.querySelectorAll("*")].filter(e => { const c = getComputedStyle(e).clipPath; return c && c !== "none"; }).length,
    photos: pg.querySelectorAll(".photo").length,
    headlinePt: (() => { const h = pg.querySelector(".display"); return h ? +(parseFloat(getComputedStyle(h).fontSize) * 0.75).toFixed(1) : null; })(),
  }));
});
out.visibleElements = visibleCount;
out.fontsStatus = await page.evaluate(() => document.fonts.status);
await browser.close();
fs.writeFileSync(process.argv[2], JSON.stringify(out, null, 1));
console.log(`visible elements ${visibleCount}, fonts ${out.fontsStatus}`);
