"""Optional asset maintenance with Pillow; the static build uses checked-in files.

Run from any directory: python scripts/build-responsive-images.py
No image package is needed for npm run build:static or check:static.
"""
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parent.parent / 'docs' / 'assets' / 'img'
with Image.open(root / 'profile-professional.png') as source:
    for width in (128, 256, 768):
        height = round(source.height * width / source.width)
        source.convert('RGB').resize((width, height), Image.Resampling.LANCZOS).save(
            root / f'profile-professional-{width}.jpg', quality=85, optimize=True)

with Image.open(root / 'fusion-platform-preview.png') as source:
    for width in (440, 880):
        height = round(source.height * width / source.width)
        source.resize((width, height), Image.Resampling.LANCZOS).save(
            root / f'fusion-platform-preview-{width}.webp', quality=85, method=6)
