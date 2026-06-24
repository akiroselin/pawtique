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

/** 把 IMG_6470.JPG 转为 img-6470.webp（与白底图目录一致） */
function slugify(name: string): string {
  return name.replace(/\.[^.]+$/, '').toLowerCase().replace(/_/g, '-') + '.webp';
}

interface GalleryProps {
  products: ProductItem[];
  /** 产品线 slug，用于拼接图片路径 /products/<slug>/<file> */
  slug: string;
  /** 展示来源说明 */
  caption?: string;
  /** 限制展示数量 */
  limit?: number;
  /** 列数（移动端 2 / 桌面 4） */
  cols?: 3 | 4 | 5;
  /** 是否按产品分组（多图产品显示 +N 角标） */
  grouped?: boolean;
}

export default function Gallery({
  products,
  slug,
  caption = '📸 来自百度网盘分享的宠物定制店家作品集 · PawTique 仅做展示，不涉及交易',
  limit,
  cols = 4,
  grouped = true,
}: GalleryProps) {
  const items = limit ? products.slice(0, limit) : products;

  const gridClass = {
    3: 'sm:grid-cols-2 md:grid-cols-3',
    4: 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    5: 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
  }[cols];

  return (
    <div className="mt-12">
      {caption && (
        <p className="text-xs text-muted text-center mb-6 italic">{caption}</p>
      )}
      <div className={`grid ${gridClass} gap-4`}>
        {items.map((p) => {
          const main = p.main_image || p.files[0];
          const restCount = p.files.length - 1;
          const fileListParam = encodeURIComponent(JSON.stringify({
            slug,
            files: p.files,
            desc: p.description,
            pet: p.pet_type,
          }));
          return (
            <a
              key={p.product_group_id}
              href={`/gallery-viewer?d=${fileListParam}`}
              className="group block bg-white rounded-2xl border-2 border-yellow/30 hover:border-yellow-dark overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg"
              title={p.description}
            >
              <div className="aspect-square relative bg-white overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/products-studio/${slug}/${slugify(main)}`}
                  alt={p.description}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                {grouped && restCount > 0 && (
                  <div className="absolute top-2 right-2 bg-brown text-white text-xs font-black px-2 py-1 rounded-full border-2 border-cream shadow">
                    +{restCount}
                  </div>
                )}
                {p.pet_type && p.pet_type !== 'null' && (
                  <div className="absolute top-2 left-2 bg-yellow text-brown text-xs font-black px-2 py-1 rounded-full border-2 border-yellow-dark shadow">
                    {p.pet_type}
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-xs text-brown leading-snug line-clamp-2 min-h-[2.5em]">
                  {p.description}
                </p>
              </div>
            </a>
          );
        })}
      </div>
      {limit && products.length > limit && (
        <p className="text-center text-xs text-muted mt-4">
          展示前 {limit} 个，共 {products.length} 个作品
        </p>
      )}
    </div>
  );
}
