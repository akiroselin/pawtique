import Placeholder from '@/components/configurator/Placeholder';
import Gallery from '@/components/Gallery';
import { type ProductLineKey } from '@/components/ProductImage';

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
}

/**
 * 配置器页面：上半部分 = 占位配置器，下半部分 = 该产品线的过往作品画廊
 * 适用于还没开发完整配置器的产品线（figurine/jewelry/apparel/painting/urn/phone-case）
 */
export default function PageWithGallery({ configurator, products, slug }: PageWithGalleryProps) {
  return (
    <main className="px-6 md:px-10 py-12 max-w-7xl mx-auto">
      <Placeholder {...configurator} />

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
