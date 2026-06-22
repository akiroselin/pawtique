import Link from 'next/link';

interface PriceRow {
  product: string;
  emoji: string;
  basePrice: string;
  variants: string;
  delivery: string;
  rush: string;
  tier: string;
  href: string;
}

const PRODUCTS: PriceRow[] = [
  {
    product: '虚拟宠物复活',
    emoji: '✨',
    basePrice: '£29',
    variants: '5 秒 / 10 秒',
    delivery: '1-3 分钟',
    rush: '×',
    tier: 'NEW',
    href: '/configure/virtual-pet',
  },
  {
    product: '羊毛毡定制肖像',
    emoji: '🐑',
    basePrice: '£150-300',
    variants: 'S / M / L',
    delivery: '14-21 天',
    rush: '+£35 (7-10 天)',
    tier: 'Tier 1',
    href: '/configure/wool-felt',
  },
  {
    product: '3D 打印 / 陶瓷雕塑',
    emoji: '🗿',
    basePrice: '£100-400',
    variants: 'S / M / L / XL',
    delivery: '14-21 天',
    rush: '+£35 (7-10 天)',
    tier: 'Tier 1',
    href: '/configure/figurine',
  },
  {
    product: 'AI 增强艺术画',
    emoji: '🎨',
    basePrice: '£80-200',
    variants: '4 尺寸 × 4 材质',
    delivery: '72 小时',
    rush: '×',
    tier: 'Tier 1',
    href: '/configure/ai-art',
  },
  {
    product: '手绘油画 / 水彩',
    emoji: '🖼️',
    basePrice: '£120-300',
    variants: '4 风格 × 4 尺寸',
    delivery: '21-28 天',
    rush: '+£50 (14 天)',
    tier: 'Tier 2',
    href: '/configure/painting',
  },
  {
    product: '高级树脂首饰',
    emoji: '💎',
    basePrice: '£80-250',
    variants: '6 形状 × 8 色',
    delivery: '14-21 天',
    rush: '+£35 (7-10 天)',
    tier: 'Tier 2',
    href: '/configure/jewelry',
  },
  {
    product: '悼念视频 + USB 礼盒',
    emoji: '🎬',
    basePrice: '£60-180',
    variants: '5 模板 × 3 时长',
    delivery: '5-7 天',
    rush: '+£25 (3 天)',
    tier: 'Tier 3',
    href: '/configure/video',
  },
  {
    product: '设计师陶瓷 Urn',
    emoji: '🏺',
    basePrice: '£120-350',
    variants: '10+ 釉色 × 3 尺寸',
    delivery: '21-28 天',
    rush: '+£50 (14 天)',
    tier: 'Tier 3',
    href: '/configure/urn',
  },
];

export default function PricingPage() {
  return (
    <main className="px-6 md:px-10 py-12 max-w-6xl mx-auto">
      {/* ── Hero ── */}
      <div className="text-center mb-12">
        <div className="paw-divider mb-4"><span>💷</span></div>
        <h1 className="text-4xl md:text-6xl font-black mb-4">透明定价</h1>
        <p className="text-muted text-base max-w-2xl mx-auto">
          没有隐藏费用 · 英镑定价已含欧洲配送 · 全部含 1 次免费修改
        </p>
      </div>

      {/* ── Trust badges ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {[
          { i: '🚚', t: '欧洲 5-7 天配送' },
          { i: '💯', t: '不满意全额退款' },
          { i: '🔒', t: '私密包装' },
          { i: '🔄', t: '2 次免费修改' },
        ].map((b, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 text-center border-2 border-yellow">
            <div className="text-2xl mb-1">{b.i}</div>
            <div className="text-xs font-bold">{b.t}</div>
          </div>
        ))}
      </div>

      {/* ── 价格表 ── */}
      <div className="bg-white rounded-3xl border-[3px] border-dashed border-yellow overflow-hidden mb-12">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-yellow-light">
              <tr>
                <th className="px-4 py-4 text-left font-black">产品</th>
                <th className="px-4 py-4 text-left font-black">起售价</th>
                <th className="px-4 py-4 text-left font-black">规格</th>
                <th className="px-4 py-4 text-left font-black">交付</th>
                <th className="px-4 py-4 text-left font-black">加急</th>
                <th className="px-4 py-4 text-left font-black">CTA</th>
              </tr>
            </thead>
            <tbody>
              {PRODUCTS.map((p, i) => (
                <tr key={i} className="border-t border-yellow/40 hover:bg-cream transition">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{p.emoji}</span>
                      <div>
                        <div className="font-bold">{p.product}</div>
                        <div className="text-xs text-muted">{p.tier}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 font-black text-brown">{p.basePrice}</td>
                  <td className="px-4 py-4 text-brown-light">{p.variants}</td>
                  <td className="px-4 py-4 text-brown-light">{p.delivery}</td>
                  <td className="px-4 py-4 text-brown-light">{p.rush}</td>
                  <td className="px-4 py-4">
                    <Link href={p.href} className="btn-ghost text-xs">
                      配置 →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Bundle 套餐 ── */}
      <section className="mb-12">
        <h2 className="text-2xl md:text-3xl font-black text-center mb-6">🎁 套装优惠</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-yellow-light rounded-3xl p-6 border-[3px] border-dashed border-yellow-dark">
            <div className="text-3xl mb-2">🐑 + 🖼️</div>
            <h3 className="font-black text-lg mb-2">记忆套装</h3>
            <div className="text-sm text-brown-light mb-3">羊毛毡肖像 + 手绘油画</div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-2xl font-black">£270</span>
              <span className="text-sm text-muted line-through">£300</span>
              <span className="text-xs bg-yellow text-brown px-2 py-0.5 rounded-full font-black">9 折</span>
            </div>
          </div>
          <div className="bg-yellow-light rounded-3xl p-6 border-[3px] border-dashed border-yellow-dark">
            <div className="text-3xl mb-2">🏺 + 🐾 + 📸</div>
            <h3 className="font-black text-lg mb-2">完整仪式套装</h3>
            <div className="text-sm text-brown-light mb-3">Urn + Paw Print Kit + 油画</div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-2xl font-black">£189</span>
              <span className="text-sm text-muted line-through">£210</span>
              <span className="text-xs bg-yellow text-brown px-2 py-0.5 rounded-full font-black">9 折</span>
            </div>
          </div>
          <div className="bg-yellow-light rounded-3xl p-6 border-[3px] border-dashed border-yellow-dark">
            <div className="text-3xl mb-2">✨ + 🎬</div>
            <h3 className="font-black text-lg mb-2">动态纪念套装</h3>
            <div className="text-sm text-brown-light mb-3">虚拟复活 + 悼念视频 USB</div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-2xl font-black">£108</span>
              <span className="text-sm text-muted line-through">£120</span>
              <span className="text-xs bg-yellow text-brown px-2 py-0.5 rounded-full font-black">9 折</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 加价项 ── */}
      <section className="mb-12">
        <h2 className="text-2xl md:text-3xl font-black text-center mb-6">💳 加价项</h2>
        <div className="bg-white rounded-2xl p-6 border-2 border-yellow">
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span>加急 7-10 天交付</span>
              <span className="font-bold">+£35</span>
            </li>
            <li className="flex justify-between">
              <span>实体画框升级（高端版）</span>
              <span className="font-bold">+£20-50</span>
            </li>
            <li className="flex justify-between">
              <span>USB 木盒（实木）</span>
              <span className="font-bold">+£15</span>
            </li>
            <li className="flex justify-between">
              <span>欧盟外配送（瑞士/挪威）</span>
              <span className="font-bold">+£20</span>
            </li>
            <li className="flex justify-between">
              <span>礼品包装 + 手写卡片</span>
              <span className="font-bold">免费</span>
            </li>
          </ul>
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="text-center">
        <Link href="/products" className="btn-paw">
          🛒 浏览全部产品
        </Link>
      </div>
    </main>
  );
}