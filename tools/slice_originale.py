"""Cut originale.png (4 rows x 10 cards) into single card PNGs for skins/originale.

Sheet layout: rows = Coppe, Denari, Bastoni, Spade; columns = Asso, 2..7, Fante, Cavallo, Re.
Output names: <suit>_<rank:02d>.png, e.g. denari_07.png (settebello).

Usage: python3 tools/slice_originale.py originale.png skins/originale
"""
import os
import sys

import numpy as np
from PIL import Image

ROW_SUITS = ["coppe", "denari", "bastoni", "spade"]
OUT_WIDTH = 320


def runs(v, thr):
    out, start = [], None
    for i, x in enumerate(v):
        if x > thr and start is None:
            start = i
        elif x <= thr and start is not None:
            out.append((start, i))
            start = None
    if start is not None:
        out.append((start, len(v)))
    return out


def main(src, dst):
    im = Image.open(src).convert("RGBA")
    a = np.array(im)
    card = (a[:, :, 3] > 128) & (a[:, :, :3].astype(int).sum(axis=2) > 120)
    cols = runs(card.mean(axis=0), 0.3)
    rows = runs(card.mean(axis=1), 0.3)
    if len(cols) != 10 or len(rows) != 4:
        sys.exit(f"expected a 10x4 grid, found {len(cols)}x{len(rows)}")
    os.makedirs(dst, exist_ok=True)
    alpha = a[:, :, 3]
    for r, (y0, y1) in enumerate(rows):
        for c, (x0, x1) in enumerate(cols):
            # Grow the box slightly so anti-aliased rounded corners are kept, then trim to alpha.
            pad = 12
            bx0, by0 = max(0, x0 - pad), max(0, y0 - pad)
            bx1, by1 = min(a.shape[1], x1 + pad), min(a.shape[0], y1 + pad)
            sub = alpha[by0:by1, bx0:bx1] > 8
            ys, xs = np.where(sub)
            box = (bx0 + xs.min(), by0 + ys.min(), bx0 + xs.max() + 1, by0 + ys.max() + 1)
            piece = im.crop(box)
            h = round(piece.height * OUT_WIDTH / piece.width)
            piece = piece.resize((OUT_WIDTH, h), Image.LANCZOS)
            # Flat printed colours: a 256-colour palette is visually lossless and ~4x smaller.
            piece = piece.quantize(256, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.NONE)
            name = f"{ROW_SUITS[r]}_{c + 1:02d}.png"
            piece.save(os.path.join(dst, name), optimize=True)
    print("sliced 40 cards into", dst, "size", OUT_WIDTH, "x", h)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
