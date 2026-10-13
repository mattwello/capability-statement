"""Prepare graded copies of the ORIGINAL project photos for the layout.

Applies the document's unifying grade (slightly reduced saturation, a touch more
contrast) so the PDF can embed plain JPEGs instead of rasterising CSS filters.
  assets/photos/graded/      full resolution, for the print PDF
  assets/photos/graded-web/  max 1400 px, for the email-size PDF
Originals in assets/photos/originals/ are never modified. Faces and geometry are
untouched: no warping, stretching or retouching. Usage: python3 scripts/prepare-photos.py
"""
from pathlib import Path
import numpy as np
from PIL import Image, ImageEnhance, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets/photos/originals"
OUT = {"graded": (None, 92), "graded-web": (1400, 82)}
# v2 "muted" grade: lower saturation and a cool navy cast in the shadows, so a
# mixed set of site photos reads as one series (see teardown: colourfulness).
MUTED = {"muted": (None, 92), "muted-web": (1400, 82)}
NAVY = np.array([27, 43, 56], float)

def mute(im):
    im = ImageEnhance.Color(im).enhance(0.62)
    im = ImageEnhance.Contrast(im).enhance(1.06)
    a = np.asarray(im, float)
    lum = (a @ [0.2126, 0.7152, 0.0722]) / 255
    w = (0.16 * (1 - lum) ** 2)[..., None]
    return Image.fromarray(np.clip(a * (1 - w) + NAVY * w, 0, 255).astype(np.uint8))

# v4 alternate style: brand duotone (navy shadows -> soft brand highlights) and cool greyscale.
DUO = {"duo": (None, 90), "duo-web": (1400, 80)}
MONO = {"mono": (None, 90), "mono-web": (1400, 80)}
DUO_DARK, DUO_MID, DUO_LIGHT = np.array([18, 30, 40.]), np.array([44, 82, 108.]), np.array([196, 214, 224.])

def duotone(im):
    l = np.asarray(ImageOps.autocontrast(im.convert("L"), cutoff=1), float)[..., None] / 255
    lo = DUO_DARK + (DUO_MID - DUO_DARK) * np.clip(l / .55, 0, 1)
    hi = DUO_MID + (DUO_LIGHT - DUO_MID) * np.clip((l - .55) / .45, 0, 1)
    return Image.fromarray(np.where(l < .55, lo, hi).astype(np.uint8))

def mono(im):
    g = np.asarray(ImageOps.autocontrast(im.convert("L"), cutoff=1), float)[..., None]
    return Image.fromarray(np.clip(g * [0.97, 1.0, 1.03], 0, 255).astype(np.uint8))

def save_set(img, sets, stem):
    for d, (max_px, q) in sets.items():
        out = img.copy()
        if max_px:
            out.thumbnail((max_px, max_px), Image.LANCZOS)
        out.save(ROOT / "assets/photos" / d / (stem + ".jpg"), quality=q, optimize=True, progressive=True)

for d in list(OUT) + list(MUTED) + list(DUO) + list(MONO):
    (ROOT / "assets/photos" / d).mkdir(parents=True, exist_ok=True)

for f in sorted(SRC.glob("*.jp*g")) + sorted(SRC.glob("*.png")):
    im = ImageOps.exif_transpose(Image.open(f)).convert("RGB")
    rows = np.where(np.asarray(im.convert("L")).mean(1) > 12)[0]   # trim black letterbox bars (phone screenshots)
    im = im.crop((0, int(rows.min()), im.width, int(rows.max()) + 1))
    im = ImageEnhance.Color(im).enhance(0.90)
    im = ImageEnhance.Contrast(im).enhance(1.05)
    im = ImageEnhance.Brightness(im).enhance(1.01)
    for d, (max_px, q) in OUT.items():
        out = im.copy()
        if max_px:
            out.thumbnail((max_px, max_px), Image.LANCZOS)
        out.save(ROOT / "assets/photos" / d / (f.stem + ".jpg"), quality=q, optimize=True, progressive=True)
    m = mute(im)
    for d, (max_px, q) in MUTED.items():
        out = m.copy()
        if max_px:
            out.thumbnail((max_px, max_px), Image.LANCZOS)
        out.save(ROOT / "assets/photos" / d / (f.stem + ".jpg"), quality=q, optimize=True, progressive=True)
    save_set(duotone(im), DUO, f.stem)
    save_set(mono(im), MONO, f.stem)
    print(f"{f.name}: {im.size}")
