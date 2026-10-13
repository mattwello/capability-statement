// Print builds for both designs:
//   output/print/*_PRINT-SHOP_CMYK.pdf : 3 mm bleed, crop marks, CMYK, TrimBox/BleedBox set
//   output/print/*_HOME-PRINT.pdf      : white margins, lighter blues, for desktop printers
// Needs Ghostscript (gs) and Python pikepdf.  Usage: node scripts/build-print.mjs
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "output", "print");
const PREV = path.join(OUT, "proofs");
fs.mkdirSync(PREV, { recursive: true });
const MODES = fs.readFileSync(path.join(ROOT, "scripts", "print-modes.js"), "utf8");

const DESIGNS = [
  { html: "index.html", name: "Westcoast-Energy_Capability-Statement_Website-Style" },
  { html: "index-v4.html", name: "Westcoast-Energy_Capability-Statement_Alt-Style" },
];

const browser = await chromium.launch();
for (const d of DESIGNS) {
  for (const mode of ["bleed", "home"]) {
    const page = await browser.newPage({ deviceScaleFactor: 1.5 });
    await page.goto(pathToFileURL(path.join(ROOT, "src", d.html)).href);
    await page.waitForFunction(() => window.__WCE_READY === true, null, { timeout: 30000 });
    await page.emulateMedia({ media: "print" });
    await page.addScriptTag({ content: MODES });
    await page.evaluate((m) => (m === "bleed" ? window.applyBleed() : window.applyHome()), mode);
    await page.evaluate(() => document.fonts.ready);
    const rgb = path.join(OUT, `${d.name}_${mode}_rgb.tmp.pdf`);
    await page.pdf({ path: rgb, preferCSSPageSize: true, printBackground: true });

    const first = await page.$(mode === "bleed" ? ".page" : ".wce-sheet");
    await first.screenshot({ path: path.join(PREV, `${d.name}_${mode === "bleed" ? "PRINT-SHOP" : "HOME-PRINT"}_page1-proof.png`) });
    await page.close();

    if (mode === "bleed") {
      const cmyk = path.join(OUT, `${d.name}_PRINT-SHOP_CMYK.pdf`);
      const tmp = cmyk + ".gs.tmp";
      execFileSync("gs", ["-q", "-dNOPAUSE", "-dBATCH", "-dSAFER", "-sDEVICE=pdfwrite", "-dPDFSETTINGS=/prepress",
        "-dAutoRotatePages=/None", "-sColorConversionStrategy=CMYK", "-sProcessColorModel=DeviceCMYK",
        "-dDownsampleColorImages=false", `-sOutputFile=${tmp}`, rgb]);
      // Page boxes: trim = A4 inside 8 mm (5 mm slug + 3 mm bleed); bleed box 5 mm in.
      execFileSync("python3", ["-I", "-c", `
import pikepdf, sys
src, dst = sys.argv[1], sys.argv[2]
pdf = pikepdf.open(src)
for p in pdf.pages:
    x0, y0, x1, y1 = [float(v) for v in p.mediabox]
    k = (x1 - x0) / 226.0   # pt per mm as rendered
    p.trimbox  = [x0 + 8 * k, y0 + 8 * k, x1 - 8 * k, y1 - 8 * k]
    p.bleedbox = [x0 + 5 * k, y0 + 5 * k, x1 - 5 * k, y1 - 5 * k]
# Soft-mask groups only shape transparency (e.g. a photo fade); gs leaves their
# colour space as RGB, which strict preflight flags. Gray computes the same mask.
def fix(o, seen):
    if isinstance(o, (pikepdf.Dictionary, pikepdf.Stream)):
        if o.objgen != (0, 0):
            if o.objgen in seen: return
            seen.add(o.objgen)
        if o.get("/S") == "/Luminosity" and "/G" in o and "/Group" in o.G and o.G.Group.get("/CS") == "/DeviceRGB":
            o.G.Group.CS = pikepdf.Name("/DeviceGray")
        for k in list(o.keys()): fix(o[k], seen)
    elif isinstance(o, pikepdf.Array):
        for v in o: fix(v, seen)
seen = set()
for p in pdf.pages: fix(p.obj, seen)
pdf.save(dst)
`, tmp, cmyk]);
      fs.rmSync(tmp); fs.rmSync(rgb);
      console.log("print shop :", path.relative(ROOT, cmyk), `${(fs.statSync(cmyk).size / 1048576).toFixed(1)} MB`);
    } else {
      const home = path.join(OUT, `${d.name}_HOME-PRINT.pdf`);
      fs.renameSync(rgb, home);
      console.log("home print :", path.relative(ROOT, home), `${(fs.statSync(home).size / 1048576).toFixed(1)} MB`);
    }
  }
}
await browser.close();
