"""Generate production icon + splash PNGs from the SVG sources.

- icon.png (1024): full-bleed launcher icon, user-supplied artwork.
- adaptive-icon.png (1024): foreground glyph scaled into the Android
  adaptive-icon safe zone on transparency; combined with the #080808
  backgroundColor from app.json the seam is invisible.
- splash-icon.png (1024): LEL wordmark on transparency, shown on the
  #080808 splash background configured in app.json.

Run: python3 scripts/generate-assets.py
Requires: cairosvg, Pillow.
"""

from pathlib import Path

import cairosvg
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "assets"

SIZE = 1024
# Foreground artwork size: keeps the calculator glyph inside the
# ornament/mask safe zone (~66dp of 108dp grid => ~62%).
ADAPTIVE_FG = 640


def render(svg: Path, width: int, height: int) -> bytes:
    return cairosvg.svg2png(
        url=str(svg),
        output_width=width,
        output_height=height,
    )


def main() -> None:
    icon_svg = ASSETS / "icon-source.svg"
    splash_svg = ASSETS / "splash-source.svg"

    # 1. Full-bleed icon.
    (ASSETS / "icon.png").write_bytes(render(icon_svg, SIZE, SIZE))

    # 2. Adaptive foreground: scaled artwork centred on transparency.
    import io

    fg = Image.open(io.BytesIO(render(icon_svg, ADAPTIVE_FG, ADAPTIVE_FG))).convert("RGBA")
    canvas = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    canvas.paste(fg, ((SIZE - ADAPTIVE_FG) // 2, (SIZE - ADAPTIVE_FG) // 2), fg)
    canvas.save(ASSETS / "adaptive-icon.png")

    # 3. Splash wordmark on transparency.
    (ASSETS / "splash-icon.png").write_bytes(render(splash_svg, SIZE, SIZE))

    for name in ("icon.png", "adaptive-icon.png", "splash-icon.png"):
        with Image.open(ASSETS / name) as img:
            print(f"{name}: {img.size} mode={img.mode}")


if __name__ == "__main__":
    main()
