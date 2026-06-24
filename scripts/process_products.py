#!/usr/bin/env python3
"""
PawTique 产品图白底化处理
输入：public/products/{figurine,jewelry,...}/IMG_*.JPG (杂乱背景实拍)
输出：public/products-studio/{line}/{slug}.webp (白底+阴影)

用法：
  python3 process_products.py                # 处理全部
  python3 process_products.py figurine       # 只处理 figurine
  python3 process_products.py figurine 5     # 只处理 figurine 前 5 张（用于测试）

性能：~0.8s/张（rembg CPU u2net 模型）· 226 张约 3 分钟
"""

import sys
import os
import time
import shutil
from pathlib import Path
from PIL import Image, ImageFilter, ImageOps

# rembg 2.0+ 用 new_session 缓存
try:
    from rembg import remove, new_session
    REMBG_AVAILABLE = True
except ImportError:
    REMBG_AVAILABLE = False
    print("ERROR: rembg not installed. Install: pip install rembg[gpu]" if 'gpu' in sys.argv else
          "ERROR: rembg not installed. Install: pip install rembg")
    sys.exit(1)

SRC_BASE = Path('/Users/kirosealin/Developer/pawtique/public/products')
DST_BASE = Path('/Users/kirosealin/Developer/pawtique/public/products-studio')

# 配置：每条线的输出尺寸（长边）
SIZE_MAP = {
    'figurine':  1024,   # 3D 雕塑 — 正方形展示
    'jewelry':   800,    # 首饰 — 紧凑
    'painting':  1200,   # 画框 — 较大
    'wool-felt': 1024,
    'urn':       1024,
    'phone-case': 800,
    'apparel':   1200,
}

# 白底 + 轻微投影（专业摄影标准）
SHADOW_RADIUS = 8        # 阴影模糊半径
SHADOW_OFFSET = (0, 6)   # 阴影偏移 (px)
SHADOW_OPACITY = 60      # 0-255
CANVAS_PAD = 60          # 周围留白 (px)
BG_COLOR = (255, 255, 255)  # 纯白

def remove_bg_keep_alpha(img: Image.Image, session) -> Image.Image:
    """rembg 抠图，保留 alpha 通道"""
    out = remove(img, session=session, only_mask=False)
    return out.convert('RGBA')

def add_drop_shadow(fg_rgba: Image.Image) -> Image.Image:
    """给前景加自然投影
    思路：alpha 模糊 → 黑色 → 偏移 → 复合到 fg 下方
    """
    alpha = fg_rgba.split()[-1]
    # 阴影：把 alpha 模糊 + 反相成黑
    shadow = alpha.filter(ImageFilter.GaussianBlur(SHADOW_RADIUS))
    # 限制阴影强度（按 alpha 重映射）
    shadow = shadow.point(lambda p: min(255, int(p * SHADOW_OPACITY / 255)))
    # 转成黑底透明
    shadow_img = Image.new('RGBA', fg_rgba.size, (0, 0, 0, 0))
    shadow_img.putalpha(shadow)
    return shadow_img

def composite_on_white(fg_rgba: Image.Image, size: int) -> Image.Image:
    """把前景（含阴影）合成到白底画布"""
    # 计算缩放比例 — 长边 = size
    w, h = fg_rgba.size
    scale = size / max(w, h)
    new_w, new_h = int(w * scale), int(h * scale)
    fg_scaled = fg_rgba.resize((new_w, new_h), Image.LANCZOS)

    # 阴影层同样缩放
    shadow_layer = add_drop_shadow(fg_scaled)
    shadow_offset_img = Image.new('RGBA', fg_scaled.size, (0, 0, 0, 0))
    shadow_offset_img.paste(shadow_layer, SHADOW_OFFSET, shadow_layer)

    # 白底画布 = size + 2*pad
    canvas_size = size + CANVAS_PAD * 2
    canvas = Image.new('RGB', (canvas_size, canvas_size), BG_COLOR)
    canvas_rgba = canvas.convert('RGBA')

    # 阴影 + 前景居中
    paste_x = (canvas_size - new_w) // 2
    paste_y = (canvas_size - new_h) // 2
    canvas_rgba.alpha_composite(shadow_offset_img, (paste_x, paste_y))
    canvas_rgba.alpha_composite(fg_scaled, (paste_x, paste_y))

    return canvas_rgba.convert('RGB')

def slugify(name: str) -> str:
    base = os.path.splitext(name)[0]
    return base.lower().replace('_', '-')

def process_folder(line: str, limit: int = None) -> int:
    """处理一条产品线的所有图片"""
    src_dir = SRC_BASE / line
    dst_dir = DST_BASE / line
    dst_dir.mkdir(parents=True, exist_ok=True)

    if not src_dir.exists():
        print(f"  ⚠ {line}: source dir not found")
        return 0

    files = sorted([f for f in src_dir.iterdir()
                    if f.suffix.lower() in ('.jpg', '.jpeg', '.png', '.webp')])
    if limit:
        files = files[:limit]

    if not files:
        print(f"  ⚠ {line}: no images")
        return 0

    size = SIZE_MAP.get(line, 1024)
    session = new_session('u2net')  # 通用抠图模型

    print(f"  → {line}: {len(files)} images → {size}px")
    n_done = 0
    t0 = time.time()
    for f in files:
        try:
            with Image.open(f) as img:
                img = ImageOps.exif_transpose(img).convert('RGB')
                fg = remove_bg_keep_alpha(img, session)
                out = composite_on_white(fg, size)
                slug = slugify(f.name)
                out.save(dst_dir / f"{slug}.webp", 'WEBP', quality=92, method=6)
            n_done += 1
            print(f"    ✓ {f.name[:30]:30s} → {slug}.webp", end='\r')
        except Exception as e:
            print(f"\n    ✗ {f.name}: {e}")
    elapsed = time.time() - t0
    print(f"    ✓ {line}: {n_done}/{len(files)} done in {elapsed:.1f}s ({elapsed/max(n_done,1):.1f}s/张)        ")
    return n_done

def main():
    args = sys.argv[1:]
    limit = None
    target_lines = list(SIZE_MAP.keys())

    if args:
        target_lines = [args[0]]
        if len(args) > 1 and args[1].isdigit():
            limit = int(args[1])

    print(f"=== PawTique 产品图白底化 ===")
    print(f"输入: {SRC_BASE}")
    print(f"输出: {DST_BASE}")
    print(f"目标: {', '.join(target_lines)}{f' (限 {limit} 张/类)' if limit else ''}")
    print()

    total = 0
    t0 = time.time()
    for line in target_lines:
        total += process_folder(line, limit)
    elapsed = time.time() - t0

    print(f"\n=== 完成 ===")
    print(f"处理 {total} 张图 · 用时 {elapsed:.1f}s · 输出到 {DST_BASE}")

if __name__ == '__main__':
    main()