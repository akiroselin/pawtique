'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

export type ProductLineKey =
  | 'figurine'
  | 'jewelry'
  | 'painting'
  | 'wool-felt'
  | 'urn'
  | 'phone-case'
  | 'apparel'
  | 'video'
  | 'holo-pet'
  | 'virtual-pet';

interface Props {
  line: ProductLineKey;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  /** 当图片不可用时显示的 emoji fallback */
  fallback?: string;
  /** 多图轮播 - 0 表示用主图（第一张） */
  variant?: number;
  className?: string;
  rounded?: boolean;
  shadow?: boolean;
}

/**
 * 产品线 → 图片目录映射
 * 实际图片从 /products-studio/{line}/ 下随机取
 */
const LINE_DIRS: Record<ProductLineKey, string> = {
  'figurine':    '/products-studio/figurine',
  'jewelry':     '/products-studio/jewelry',
  'painting':    '/products-studio/painting',
  'wool-felt':   '/products-studio/wool-felt',
  'urn':         '/products-studio/urn',
  'phone-case':  '/products-studio/phone-case',
  'apparel':     '/products-studio/apparel',
  // AI/hologram 没有真实产品图，回落到 emoji
  'video':       '',
  'holo-pet':    '',
  'virtual-pet': '',
};

/**
 * 各产品线的代表图（精选 — 大图、清晰、特征明显）
 * 通过手动挑选文件名确保是高质量案例
 */
const HERO_IMAGES: Partial<Record<ProductLineKey, string[]>> = {
  'figurine': [
    '/products-studio/figurine/img-6470.webp',
    '/products-studio/figurine/img-6471.webp',
    '/products-studio/figurine/img-6472.webp',
    '/products-studio/figurine/img-6478.webp',
    '/products-studio/figurine/img-7342.webp',
  ],
  'jewelry': [
    '/products-studio/jewelry/img-6539.webp',
    '/products-studio/jewelry/img-6540.webp',
    '/products-studio/jewelry/img-6827.webp',
    '/products-studio/jewelry/img-7613.webp',
    '/products-studio/jewelry/img-7614.webp',
  ],
  'painting': [
    '/products-studio/painting/img-8531.webp',
    '/products-studio/painting/img-8712.webp',
    '/products-studio/painting/img-8713.webp',
    '/products-studio/painting/img-8763.webp',
  ],
  'wool-felt': [
    '/products-studio/wool-felt/img-8518.webp',
    '/products-studio/wool-felt/img-8583.webp',
    '/products-studio/wool-felt/img-8585.webp',
  ],
  'urn': [
    '/products-studio/urn/img-8486.webp',
    '/products-studio/urn/img-8487.webp',
    '/products-studio/urn/img-8488.webp',
    '/products-studio/urn/img-8489.webp',
  ],
  'phone-case': [
    '/products-studio/phone-case/img-8636.webp',
    '/products-studio/phone-case/img-8637.webp',
    '/products-studio/phone-case/img-8638.webp',
  ],
  'apparel': [
    '/products-studio/apparel/img-8252.webp',
    '/products-studio/apparel/img-8477.webp',
    '/products-studio/apparel/img-8478.webp',
    '/products-studio/apparel/img-8494.webp',
  ],
};

const SIZE_PX: Record<NonNullable<Props['size']>, number> = {
  xs: 40,
  sm: 80,
  md: 160,
  lg: 320,
  xl: 480,
  hero: 640,
};

export default function ProductImage({
  line,
  size = 'md',
  fallback,
  variant = 0,
  className = '',
  rounded = true,
  shadow = false,
}: Props) {
  const [error, setError] = useState(false);
  const px = SIZE_PX[size];

  // 选图：先看精选 HERO_IMAGES，否则从 LINE_DIRS 随机
  const heroList = HERO_IMAGES[line];
  let src: string;
  if (heroList && heroList.length > 0) {
    src = heroList[variant % heroList.length];
  } else if (LINE_DIRS[line]) {
    // 服务端无法读取 fs，client-side 取默认
    src = `${LINE_DIRS[line]}/placeholder.webp`;
  } else {
    src = '';
  }

  const showFallback = !src || error;

  if (showFallback) {
    return (
      <div
        className={`flex items-center justify-center bg-cream ${
          rounded ? 'rounded-2xl' : ''
        } ${shadow ? 'shadow-soft' : ''} ${className}`}
        style={{ width: px, height: px, fontSize: px * 0.5 }}
      >
        {fallback ?? '🎁'}
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden bg-white ${
        rounded ? 'rounded-2xl' : ''
      } ${shadow ? 'shadow-soft' : ''} ${className}`}
      style={{ width: px, height: px }}
    >
      <Image
        src={src}
        alt={`${line} product photo`}
        fill
        sizes={`${px}px`}
        className="object-cover"
        onError={() => setError(true)}
        priority={size === 'hero' || size === 'xl'}
      />
    </div>
  );
}

/**
 * 批量展示一组产品图（用于画廊 / social proof）
 */
export function ProductGallery({
  line,
  count = 4,
  size = 'sm',
  className = '',
}: {
  line: ProductLineKey;
  count?: number;
  size?: Props['size'];
  className?: string;
}) {
  const heroList = HERO_IMAGES[line] ?? [];
  const items = heroList.slice(0, count);
  if (items.length === 0) return null;

  return (
    <div className={`flex gap-2 ${className}`}>
      {items.map((src, i) => (
        <ProductImage key={i} line={line} size={size} variant={i} />
      ))}
    </div>
  );
}
