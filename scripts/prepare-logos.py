"""Make transparent, trimmed print versions of the ORIGINAL logo files.

Removes only the flat background colour (white or cream) by un-mixing each pixel
against it, so the original artwork, ink colours and anti-aliased edges are preserved.
Nothing is redrawn. Usage:  python3 scripts/prepare-logos.py
"""
from pathlib import Path
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC, OUT = ROOT / "assets/logo/originals", ROOT / "assets/logo"
INK = np.array([44, 82, 108], float)          # logo blue (#2C526C)

for f in sorted(SRC.glob("*.png")):
    rgb = np.asarray(Image.open(f).convert("RGB"), float)
    vals, counts = np.unique(rgb.reshape(-1, 3), axis=0, return_counts=True)
    bg = vals[counts.argmax()]                  # dominant colour = background
    # alpha = how far each pixel sits from the background toward the ink
    a = np.clip(np.abs(rgb - bg).max(-1) / np.abs(INK - bg).max(), 0, 1)
    col = bg + (rgb - bg) / np.maximum(a, 1e-6)[..., None]
    e = int(0.012 * max(a.shape))              # scanned-in edge strips on some files
    a[:e, :] = a[-e:, :] = 0; a[:, :e] = a[:, -e:] = 0
    col = np.where(a[..., None] > 0, np.clip(col, 0, 255), 0)
    out = Image.fromarray(np.dstack([col, a * 255]).round().astype(np.uint8), "RGBA")
    box = Image.fromarray((a > 0.02).astype(np.uint8) * 255).getbbox()
    pad = int(0.02 * max(out.size))
    out = out.crop((max(box[0] - pad, 0), max(box[1] - pad, 0),
                    min(box[2] + pad, out.width), min(box[3] + pad, out.height)))
    name = f.stem + "_transparent.png"
    out.save(OUT / name, optimize=True)
    print(f"{name}: {out.size}, background {tuple(int(v) for v in bg)} removed")
