"""Pixel measurements that can be taken identically from a rendered page image
and from a flat reference image (where no DOM exists).

  paper    share of the page that is light neutral ground (open space)
  dark     share that is near black / deep navy
  colour   Hasler and Suesstrunk colourfulness (0 = greyscale, 100+ = very colourful)
  accent   share of pixels in the accent colour family (passed in as hex values)
  diagonal share of strong edges that run at an angle, not horizontal or vertical

Usage: python3 pixel-metrics.py <json-out> <label>=<accent hexes comma sep>=<img>[@x0,y0,x1,y1] ...
"""
import json, sys
import numpy as np
from PIL import Image

def hex2rgb(h):
    h = h.lstrip("#"); return np.array([int(h[i:i+2], 16) for i in (0, 2, 4)], float)

def metrics(im, accents):
    a = np.asarray(im.convert("RGB").resize((420, int(420 * im.height / im.width))), float)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    mx, mn = a.max(-1), a.min(-1)
    sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1), 0)
    lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
    rg, yb = r - g, 0.5 * (r + g) - b
    colour = np.sqrt(rg.std() ** 2 + yb.std() ** 2) + 0.3 * np.sqrt(rg.mean() ** 2 + yb.mean() ** 2)
    acc = np.zeros(lum.shape, bool)
    for h in accents:
        acc |= np.linalg.norm(a - hex2rgb(h), axis=-1) < 38
    gy, gx = np.gradient(a.mean(-1))
    mag = np.hypot(gx, gy); strong = mag > 40
    ang = np.degrees(np.arctan2(np.abs(gy), np.abs(gx)))  # 0 or 90 = axis aligned
    diag = strong & (ang > 15) & (ang < 75)
    return {
        "paper": round(float(((lum > 0.85) & (sat < 0.12)).mean()), 3),
        "dark": round(float((lum < 0.22).mean()), 3),
        "colour": round(float(colour), 1),
        "accent": round(float(acc.mean()), 3),
        "diagonal": round(float(diag.sum() / max(strong.sum(), 1)), 3),
    }

out = {}
for arg in sys.argv[2:]:
    label, accents, src = arg.split("=", 2)
    box = None
    if "@" in src:
        src, b = src.split("@"); box = tuple(int(v) for v in b.split(","))
    im = Image.open(src)
    if box: im = im.crop(box)
    out[label] = metrics(im, [h for h in accents.split(",") if h])
json.dump(out, open(sys.argv[1], "w"), indent=1)
for k, v in out.items(): print(f"{k:28s}", v)
