'use client';

import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Placeholder from '@/components/configurator/Placeholder';
import Gallery from '@/components/Gallery';
import { type ProductLineKey } from '@/components/ProductImage';
import { type ProductType } from '@/components/configurator/ProductPreview3D';

interface ProductItem {
  product_group_id: string;
  category: string;
  pet_type?: string;
  item_count: number;
  files: string[];
  description: string;
  visible_text?: string;
  main_image?: string;
}

// 3D 预览 — client-only（避免 SSR）
const ProductPreview3D = dynamic(
  () => import('@/components/configurator/ProductPreview3D').then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <div
        className="w-full rounded-2xl flex items-center justify-center text-muted text-sm"
        style={{
          height: 380,
          background: 'radial-gradient(circle at 50% 30%, rgba(255, 247, 230, 0.4), transparent 70%), #FAF6EC',
        }}
      >
        🌀 加载 3D 预览...
      </div>
    ),
  }
);

interface PageWithGalleryProps {
  /** 配置器参数 */
  configurator: {
    title: string;
    emoji: string;
    tier: string;
    description: string;
    features: string[];
    /** 关联的产品线 — 渲染真实产品图 */
    imageLine?: ProductLineKey;
  };
  /** 该产品线的过往作品 */
  products: ProductItem[];
  /** slug, 决定图片路径 /products/<slug>/<file> */
  slug: string;
  /** 提供后启用真 3D 预览（上传照片后在 3D 产品模型上实时显示） */
  productType?: ProductType;
  /** 可选：产品相关颜色（如画框/家具色、面料色） */
  frameColor?: string;
  fabricColor?: string;
}

/**
 * 配置器页面：
 * - 提供 productType 时：上半部分 = 上传 + 3D 预览，下半部分 = 画廊
 * - 未提供时：上半部分 = 占位配置器，下半部分 = 画廊
 */
export default function PageWithGallery({
  configurator, products, slug, productType, frameColor, fabricColor,
}: PageWithGalleryProps) {
  return (
    <main className="px-6 md:px-10 py-12 max-w-7xl mx-auto">
      {productType ? (
        <Configurator3DSection
          configurator={configurator}
          productType={productType}
          frameColor={frameColor}
          fabricColor={fabricColor}
        />
      ) : (
        <Placeholder {...configurator} />
      )}

      <section id="gallery" className="mt-16">
        <div className="text-center mb-8">
          <div className="paw-divider mb-3"><span>📸</span></div>
          <h2 className="text-2xl md:text-3xl font-black mb-2">{configurator.title} · 过往作品</h2>
          <p className="text-sm text-muted max-w-2xl mx-auto">
            以下案例来自定制店家的真实作品。配置器正式上线后，你提交的照片将走类似的工艺流程。
          </p>
        </div>
        <Gallery
          products={products}
          slug={slug}
          caption={`共 ${products.length} 个定制案例 · 来源百度网盘分享的宠物定制店家作品集 · PawTique 仅做展示`}
        />
      </section>
    </main>
  );
}

// ─────────────────────────────────────────────────────────────────
// 3D 配置器区：上传照片 → 实时预览
// ─────────────────────────────────────────────────────────────────
interface Configurator3DSectionProps {
  configurator: {
    title: string;
    emoji: string;
    tier: string;
    description: string;
    features: string[];
  };
  productType: ProductType;
  frameColor?: string;
  fabricColor?: string;
}

function Configurator3DSection({
  configurator, productType, frameColor, fabricColor,
}: Configurator3DSectionProps) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('只支持图片文件');
      return;
    }
    const url = URL.createObjectURL(file);
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    setPhotoUrl(url);
    setError(null);
  };

  return (
    <section>
      <div className="bg-white rounded-3xl border-[3px] border-dashed border-yellow overflow-hidden">
        <div className="grid lg:grid-cols-5 gap-0">
          {/* 左：上传 + 预览 (3 列) */}
          <div className="lg:col-span-3 p-6 md:p-8 bg-cream">
            <div
              className="bg-white rounded-2xl border-2 border-dashed border-yellow/60 p-4 cursor-pointer hover:border-yellow-dark transition relative"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files[0];
                if (f) handleUpload(f);
              }}
            >
              {photoUrl ? (
                <>
                  <ProductPreview3D
                    imageUrl={photoUrl}
                    productType={productType}
                    frameColor={frameColor}
                    fabricColor={fabricColor}
                    height={380}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (photoUrl) URL.revokeObjectURL(photoUrl);
                      setPhotoUrl(null);
                    }}
                    className="absolute top-6 right-6 btn-ghost text-xs z-10"
                  >
                    🔄 换一张
                  </button>
                </>
              ) : (
                <div className="h-[380px] flex flex-col items-center justify-center text-center">
                  <div className="text-6xl mb-3">{configurator.emoji}</div>
                  <p className="font-black text-lg mb-1">上传宠物照片</p>
                  <p className="text-sm text-muted mb-4 max-w-xs">
                    正脸 · 双眼可见 · 背景简洁
                    <br />
                    AI 自动应用到 3D {configurator.title.slice(0, 6)} 上 · 实时预览
                  </p>
                  <button className="btn-paw text-sm">📸 选择照片</button>
                  <p className="text-xs text-muted mt-3">或拖拽图片到这里 ↓</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
              />
            </div>
            {error && (
              <div className="mt-3 bg-red-50 border-2 border-red-200 text-red-700 rounded-xl p-3 text-sm">
                ⚠️ {error}
              </div>
            )}
          </div>

          {/* 右：产品信息 (2 列) */}
          <div className="lg:col-span-2 p-6 md:p-8">
            <div className="inline-block bg-yellow text-brown text-xs font-black px-3 py-1 rounded-full border-2 border-yellow-dark mb-3">
              {configurator.tier}
            </div>
            <h1 className="text-2xl md:text-3xl font-black mb-3">{configurator.title}</h1>
            <p className="text-sm text-brown-light mb-5">{configurator.description}</p>

            <div className="bg-cream rounded-2xl p-5 mb-5">
              <div className="font-black text-sm mb-2">本产品线核心功能</div>
              <ul className="space-y-1.5 text-sm">
                {configurator.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-yellow-dark">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-xs text-muted">
              📸 上传照片 → AI 自动提取轮廓 → 实时贴合到 3D 模型 →
              满意后下单制作（完整配置器开发中）
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
