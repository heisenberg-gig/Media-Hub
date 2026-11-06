"""Gera o logo transparente, os WebP da app e os ícones do lançador a partir de brand/logo-source.jpg.
Uso: python3 scripts/make-brand.py"""
from PIL import Image
import numpy as np

im = Image.open('brand/logo-source.jpg').convert('RGB')
crop = im.crop((368, 2, 1068, 702))  # squircle centrado, 700x700
a = np.asarray(crop).astype(np.float32)
floor = 10.0
m = a.max(axis=2)
alpha = np.clip((m - floor) / (255.0 - floor), 0, 1)           # preto -> transparente
safe = np.where(alpha > 0, alpha, 1)[..., None]
rgb = np.clip((a - floor * (a / np.maximum(m, 1)[..., None])) / (255.0 - floor) / safe * 255.0, 0, 255)
logo = Image.fromarray(np.dstack([rgb, alpha * 255]).astype(np.uint8), 'RGBA')

for name, size in (('logo-512', 512), ('logo-128', 128)):
    logo.resize((size, size), Image.LANCZOS).save(f'public/{name}.webp', 'WEBP', quality=92, alpha_quality=100, method=6)

black = Image.new('RGBA', logo.size, (0, 0, 0, 255)); black.alpha_composite(logo); black = black.convert('RGB')
black.resize((80, 80), Image.LANCZOS).save('webos/icon.png')          # ícone do lançador (fundo preto)
black.resize((130, 130), Image.LANCZOS).save('webos/largeIcon.png')

bg = Image.new('RGBA', (1920, 1080), (0, 0, 0, 255))                    # splash do sistema = preto, igual ao da app
bg.alpha_composite(logo.resize((320, 320), Image.LANCZOS), ((1920 - 320) // 2, (1080 - 320) // 2 - 50))
bg.convert('RGB').save('webos/splash.png')
