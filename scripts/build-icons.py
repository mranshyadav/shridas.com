#!/usr/bin/env python3
"""Regenerate the raster favicons from public/favicon.svg.

public/favicon.svg is the source of truth for the mark. The .ico and the
apple-touch PNG are derived, so they must be rebuilt whenever it changes —
they are committed rather than generated during `npm run build` so that a
deploy never depends on a local Chrome install.

    npm run icons

Rasterises with headless Chrome (the same renderer that will display the SVG,
so the fallbacks cannot drift from it) and resizes with Pillow.
"""

import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
SOURCE = PUBLIC / "favicon.svg"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# Sizes a browser actually picks from: 16 for the tab, 32 for retina tabs and
# bookmarks, 48 for the Windows taskbar.
ICO_SIZES = [(16, 16), (32, 32), (48, 48)]
APPLE_TOUCH = 180


def render(svg: Path, out: Path, size: int) -> None:
    subprocess.run(
        [
            CHROME,
            "--headless",
            "--disable-gpu",
            "--force-device-scale-factor=1",
            "--default-background-color=00000000",
            f"--window-size={size},{size}",
            f"--screenshot={out}",
            str(svg),
        ],
        check=True,
        capture_output=True,
    )


def main() -> int:
    if not SOURCE.exists():
        print(f"missing {SOURCE.relative_to(ROOT)}", file=sys.stderr)
        return 1
    if not Path(CHROME).exists():
        print(f"missing Chrome at {CHROME}", file=sys.stderr)
        return 1

    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)

        rounded_png = tmp / "rounded.png"
        render(SOURCE, rounded_png, 512)

        # iOS rounds the home-screen icon itself, so it needs a square,
        # fully opaque source — a pre-rounded one gets rounded twice.
        square_svg = tmp / "square.svg"
        square_svg.write_text(SOURCE.read_text().replace(' rx="22"', ""))
        square_png = tmp / "square.png"
        render(square_svg, square_png, 512)

        Image.open(rounded_png).convert("RGBA").save(
            PUBLIC / "favicon.ico", format="ICO", sizes=ICO_SIZES
        )
        Image.open(square_png).convert("RGB").resize(
            (APPLE_TOUCH, APPLE_TOUCH), Image.LANCZOS
        ).save(PUBLIC / "apple-touch-icon.png", optimize=True)

    sizes = ", ".join(f"{w}x{h}" for w, h in ICO_SIZES)
    print(f"favicon.ico ({sizes})  apple-touch-icon.png ({APPLE_TOUCH}x{APPLE_TOUCH})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
