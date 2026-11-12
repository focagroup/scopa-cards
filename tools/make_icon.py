"""App icon: the lobby logo (Settebello + Re di Bastoni from the originale skin) on green felt.

Writes:
  icon.png                                   1024x1024 master icon (project root)
  app/res/mipmap-<dpi>/ic_launcher.png       legacy launcher icon (Android 7.x), rounded square
  app/res/mipmap-<dpi>/ic_launcher_foreground.png / _background.png   adaptive icon layers (Android 8+)

Usage: python3 tools/make_icon.py   (run from the project root)
"""
import os

from PIL import Image, ImageChops, ImageDraw, ImageFilter

SKIN = "skins/originale"
LEGACY = {"mdpi": 48, "hdpi": 72, "xhdpi": 96, "xxhdpi": 144, "xxxhdpi": 192}
ADAPTIVE = {"mdpi": 108, "hdpi": 162, "xhdpi": 216, "xxhdpi": 324, "xxxhdpi": 432}


def felt(size):
    """Radial green gradient like the game table."""
    small = 256
    im = Image.new("RGB", (small, small))
    px = im.load()
    c0, c1, c2 = (0x13, 0x6B, 0x3F), (0x0E, 0x4D, 0x2E), (0x0A, 0x38, 0x21)
    for y in range(small):
        for x in range(small):
            d = (((x - small * 0.5) ** 2 + (y - small * 0.42) ** 2) ** 0.5) / (small * 0.72)
            if d < 0.6:
                t = d / 0.6
                col = [round(a + (b - a) * t) for a, b in zip(c0, c1)]
            else:
                t = min(1.0, (d - 0.6) / 0.4)
                col = [round(a + (b - a) * t) for a, b in zip(c1, c2)]
            px[x, y] = tuple(col)
    return im.resize((size, size), Image.BICUBIC).convert("RGBA")


def cards_group(size, card_w):
    """Two overlapping, slightly fanned cards centred on a transparent square canvas."""
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    left = Image.open(os.path.join(SKIN, "denari_07.png")).convert("RGBA")
    right = Image.open(os.path.join(SKIN, "bastoni_10.png")).convert("RGBA")
    card_h = round(card_w * left.height / left.width)
    left = left.resize((card_w, card_h), Image.LANCZOS).rotate(8, Image.BICUBIC, expand=True)
    right = right.resize((card_w, card_h), Image.LANCZOS).rotate(-8, Image.BICUBIC, expand=True)
    offset = round(card_w * 20 / 34)  # same overlap as the lobby logo
    total_w = offset + right.width
    x0 = (size - total_w) // 2
    y0 = (size - left.height) // 2
    for img, x in ((left, x0), (right, x0 + offset)):
        shadow = Image.new("RGBA", img.size, (0, 0, 0, 0))
        shadow.putalpha(img.getchannel("A").point(lambda a: a * 0.55))
        shadow = shadow.filter(ImageFilter.GaussianBlur(card_w / 40))
        canvas.alpha_composite(shadow, (x + round(card_w / 60), y0 + round(card_w / 30)))
        canvas.alpha_composite(img, (x, y0))
    return canvas


def rounded(im, radius_frac=0.2):
    mask = Image.new("L", im.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, im.width - 1, im.height - 1], radius=round(im.width * radius_frac), fill=255)
    out = im.copy()
    out.putalpha(ImageChops.multiply(out.getchannel("A"), mask))
    return out


def main():
    master = felt(1024)
    master.alpha_composite(cards_group(1024, 400))
    master.save("icon.png")

    # Adaptive layers: keep the cards inside the 66dp safe zone of the 108dp canvas.
    fg_master = cards_group(1728, 470)
    bg_master = felt(1728)
    for dpi, px in ADAPTIVE.items():
        d = os.path.join("app/res", "mipmap-" + dpi)
        os.makedirs(d, exist_ok=True)
        fg_master.resize((px, px), Image.LANCZOS).save(os.path.join(d, "ic_launcher_foreground.png"), optimize=True)
        bg_master.convert("RGB").resize((px, px), Image.LANCZOS).save(os.path.join(d, "ic_launcher_background.png"), optimize=True)
    legacy = rounded(master)
    for dpi, px in LEGACY.items():
        legacy.resize((px, px), Image.LANCZOS).save(os.path.join("app/res", "mipmap-" + dpi, "ic_launcher.png"), optimize=True)
    print("icon.png + launcher icons written")


if __name__ == "__main__":
    main()
