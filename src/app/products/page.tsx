import Link from 'next/link';
import Gallery from '@/components/Gallery';
import ProductImage, { type ProductLineKey } from '@/components/ProductImage';
import productsData from '../../../products-data.json';

export default function ProductsPage() {
  const lines = productsData.product_lines as Record<string, Array<{
    product_group_id: string;
    category: string;
    pet_type?: string;
    item_count: number;
    files: string[];
    description: string;
    visible_text?: string;
    main_image?: string;
  }>>;

  const lineLabels: Record<string, { name: string; imageLine: ProductLineKey; color: string }> = {
    figurine:    { name: '3D 打印/雕塑', imageLine: 'figurine',  color: '#FFE8F0' },
    urn:         { name: '陶瓷 Urn/纪念品', imageLine: 'urn',       color: '#FFE8D6' },
    wool:        { name: '羊毛毡', imageLine: 'wool-felt',     color: '#FFF3B0' },
    painting:    { name: '手绘/装饰画', imageLine: 'painting',  color: '#FFF1D6' },
    jewelry:     { name: '首饰/挂件', imageLine: 'jewelry',    color: '#F0E8FF' },
    phone:       { name: '手机壳', imageLine: 'phone-case',  color: '#FFE0E6' },
    apparel:     { name: '服饰周边', imageLine: 'apparel',    color: '#E8FFE8' },
  };

  // 选取每个产品线的代表作品
  const featuredByLine: Record<string, Array<any>> = {
    figurine: lines.figurine?.slice(0, 8) || [],
    urn: lines.urn?.slice(0, 6) || [],
    wool: lines['wool-felt']?.slice(0, 6) || [],
    painting: lines.painting?.slice(0, 6) || [],
    jewelry: lines.jewelry?.slice(0, 8) || [],
    phone: lines['phone-case']?.slice(0, 6) || [],
    apparel: lines.apparel?.slice(0, 12) || [],
  };

  return (
    <main className="px-6 md:px-10 py-12 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <div className="paw-divider mb-4"><span>🐾</span></div>
        <h1 className="text-3xl md:text-5xl font-black mb-3">全部定制馆</h1>
        <p className="text-muted">九大产品线 · 全部支持实时互动配置</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 置顶：虚拟宠物复活 */}
        <Link
          href="/configure/virtual-pet"
          className="sm:col-span-2 lg:col-span-3 card-hover rounded-3xl overflow-hidden block relative"
          style={{ background: 'linear-gradient(135deg, #FFE8F0 0%, #FFF3B0 50%, #E8F4FF 100%)' }}
        >
          <div className="p-6 md:p-8 flex items-center gap-6">
            <div className="text-7xl">✨</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#FF8FA3] text-white text-xs font-black px-3 py-1 rounded-full border-2 border-[#e06080]">
                  🔥 NEW · 复活服务
                </span>
              </div>
              <h3 className="text-2xl font-black mb-2">让它的眼睛再动一次</h3>
              <p className="text-sm text-brown-light mb-2">Kling AI 驱动 · 1-3 分钟出片 · £29 起</p>
            </div>
            <span className="btn-paw text-sm whitespace-nowrap">立即复活 →</span>
          </div>
        </Link>

        {PRODUCTS.map((p) => (
          <Link
            key={p.slug}
            href={p.href}
            className="card-hover bg-white rounded-3xl border-[3px] border-dashed border-yellow/60 hover:border-yellow-dark overflow-hidden block"
          >
            <div className="aspect-[4/3] relative bg-white">
              <div className="absolute top-3 left-3 z-10 bg-yellow text-brown text-xs font-black px-3 py-1 rounded-full border-2 border-yellow-dark">
                {p.tier}
              </div>
              <ProductImage
                line={p.imageLine}
                size="hero"
                fallback={p.emoji}
                className="w-full h-full !rounded-none"
              />
            </div>
            <div className="p-5">
              <div className="text-xs font-bold text-muted mb-1">{p.category}</div>
              <h3 className="text-xl font-black mb-2">{p.name}</h3>
              <p className="text-sm text-brown-light mb-3 leading-relaxed min-h-[40px]">
                {p.tagline}
              </p>
              <div className="flex items-center justify-between">
                <div className="text-xl font-black text-brown">£{p.fromPrice}+</div>
                <span className="text-xs text-muted">→ 配置</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Past Works Gallery (来自百度网盘分享的定制店家作品) ── */}
      <section className="mt-20">
        <div className="text-center mb-10">
          <div className="paw-divider mb-3"><span>📸</span></div>
          <h2 className="text-2xl md:text-4xl font-black mb-3">过往作品精选</h2>
          <p className="text-muted max-w-2xl mx-auto">
            这些作品来自百度网盘分享的宠物定制店家作品集。<br/>
            PawTique 仅作展示以启发你的定制灵感，不涉及交易。
          </p>
        </div>

        {Object.entries(featuredByLine).map(([key, items]) => {
          const label = lineLabels[key];
          if (!label || items.length === 0) return null;
          const slugMap: Record<string, string> = {
            figurine: 'figurine', urn: 'urn', wool: 'wool-felt',
            painting: 'painting', jewelry: 'jewelry', phone: 'phone-case', apparel: 'apparel',
          };
          const realSlug = slugMap[key];
          return (
            <div key={key} className="mb-12">
              <div className="flex items-center gap-3 mb-5">
                <ProductImage
                  line={label.imageLine}
                  size="sm"
                  fallback="🎁"
                  className="!rounded-xl"
                />
                <h3 className="text-xl md:text-2xl font-black">{label.name}</h3>
                <span
                  className="text-xs font-black px-2.5 py-1 rounded-full border-2 border-yellow-dark"
                  style={{ background: label.color }}
                >
                  {items.length} 个作品
                </span>
                <Link
                  href={`/configure/${realSlug}#gallery`}
                  className="ml-auto text-xs text-yellow-dark hover:underline font-bold"
                >
                  查看全部 →
                </Link>
              </div>
              <Gallery products={items} slug={realSlug} cols={4} grouped />
            </div>
          );
        })}
      </section>

      {/* ── Process section ── */}
      <div className="mt-20 bg-cream-dark rounded-3xl p-10">
        <h2 className="text-2xl md:text-3xl font-black text-center mb-8">我们的承诺</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { icon: '🔄', t: '2 次免费修改', d: '满意为止' },
            { icon: '📦', t: '欧洲本地配送', d: '5-7 天送达' },
            { icon: '🤐', t: '私密包装', d: '无标签外箱' },
            { icon: '💯', t: '100% 退款', d: '不满意全额退' },
          ].map((p, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 text-center">
              <div className="text-4xl mb-2">{p.icon}</div>
              <div className="font-black text-base mb-1">{p.t}</div>
              <div className="text-xs text-muted">{p.d}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

const PRODUCTS: Array<{
  slug: string;
  href: string;
  tier: string;
  name: string;
  category: string;
  tagline: string;
  fromPrice: number;
  bg: string;
  emoji: string;
  imageLine: ProductLineKey;
}> = [
  { slug: 'wool-felt', href: '/configure/wool-felt', tier: 'Tier 1', name: '羊毛毡定制肖像', category: 'Wool Felt', tagline: '实时 3D 预览 · 50+ 羊毛色 · 4 周交付', fromPrice: 150, bg: '#FFF3B0', emoji: '🐑', imageLine: 'wool-felt' },
  { slug: 'figurine', href: '/configure/figurine', tier: 'Tier 1', name: '3D 打印/陶瓷雕塑', category: '3D Sculpture', tagline: 'AI 生成 3D · AR 预览 · 选姿势/釉色', fromPrice: 100, bg: '#FFE8F0', emoji: '🗿', imageLine: 'figurine' },
  { slug: 'ai-art', href: '/configure/ai-art', tier: 'Tier 1', name: 'AI 增强艺术画', category: 'AI Art Print', tagline: '5 种艺术风格 · 72 小时到货', fromPrice: 80, bg: '#E8F4FF', emoji: '🎨', imageLine: 'painting' },
  { slug: 'painting', href: '/configure/painting', tier: 'Tier 2', name: '手绘油画/水彩肖像', category: 'Hand-painted', tagline: '欧洲艺术家签约池 · 风格/构图/背景', fromPrice: 120, bg: '#FFF1D6', emoji: '🖼️', imageLine: 'painting' },
  { slug: 'jewelry', href: '/configure/jewelry', tier: 'Tier 2', name: '高级树脂首饰', category: 'Resin Jewelry', tagline: '925银链 · 嵌入毛发/骨灰/金箔', fromPrice: 80, bg: '#F0E8FF', emoji: '💎', imageLine: 'jewelry' },
  { slug: 'video', href: '/configure/video', tier: 'Tier 3', name: '悼念视频 + USB 礼盒', category: 'Tribute Video', tagline: '5 模板 × 音乐 · 实体 USB 木盒', fromPrice: 60, bg: '#E8FFE8', emoji: '🎬', imageLine: 'figurine' },
  { slug: 'urn', href: '/configure/urn', tier: 'Tier 3', name: '设计师陶瓷 Urn', category: 'Ceramic Urn', tagline: '10+ 釉色 · 表面处理 · 刻印', fromPrice: 120, bg: '#FFE8D6', emoji: '🏺', imageLine: 'urn' },
  { slug: 'phone-case', href: '/configure/phone-case', tier: 'Tier 2', name: '宠物定制手机壳', category: 'Phone Case', tagline: '全机型 · 9H 钢化玻璃喷印 · 5-7 天到货', fromPrice: 25, bg: '#FFE0E6', emoji: '📱', imageLine: 'phone-case' },
  { slug: 'apparel', href: '/configure/apparel', tier: 'Tier 2', name: '宠物刺绣 T 恤/卫衣', category: 'Pet Apparel', tagline: '高密度机绣 · 100% 纯棉 · 5-7 天到货', fromPrice: 39, bg: '#E8FFE8', emoji: '👕', imageLine: 'apparel' },
];