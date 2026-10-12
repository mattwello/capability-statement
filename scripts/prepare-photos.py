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

for d in OUT:
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
    print(f"{f.name}: {im.size}")
