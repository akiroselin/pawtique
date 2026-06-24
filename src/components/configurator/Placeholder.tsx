import Link from 'next/link';
import ProductImage, { type ProductLineKey } from '@/components/ProductImage';

interface Props {
  title: string;
  emoji: string;
  tier: string;
  description: string;
  features: string[];
  /** 关联的产品线 — 用于渲染真实产品图 */
  imageLine?: ProductLineKey;
}

export default function ConfiguratorPlaceholder({
  title,
  emoji,
  tier,
  description,
  features,
  imageLine,
}: Props) {
  return (
    <main className="px-6 md:px-10 py-12 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <Link href="/" className="text-sm text-muted hover:text-brown">← 返回首页</Link>
      </div>

      <div className="bg-white rounded-3xl border-[3px] border-dashed border-yellow overflow-hidden">
        {/* 真实产品图（替代 emoji） */}
        <div className="bg-white flex items-center justify-center p-8" style={{ minHeight: 320 }}>
          {imageLine ? (
            <ProductImage
              line={imageLine}
              size="hero"
              fallback={emoji}
              shadow
              className="!rounded-2xl"
            />
          ) : (
            <div className="text-9xl">{emoji}</div>
          )}
        </div>

        <div className="p-8 md:p-12 text-center">
          <div className="inline-block bg-yellow text-brown text-xs font-black px-3 py-1 rounded-full border-2 border-yellow-dark mb-3">
            {tier}
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-3">{title}</h1>
          <p className="text-brown-light mb-8 max-w-xl mx-auto">{description}</p>

          <div className="bg-cream rounded-2xl p-6 mb-8 text-left">
            <div className="font-black mb-3">即将上线</div>
            <div className="text-sm text-brown-light mb-4">
              配置器正在按 Phase 计划开发中。当前阶段优先上线 <Link href="/configure/wool-felt" className="text-yellow-dark font-bold underline">羊毛毡配置器</Link>。
            </div>
            <div className="text-sm font-bold mb-2">本产品线核心功能：</div>
            <ul className="space-y-1.5 text-sm">
              {features.map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-yellow-dark">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/configure/wool-felt" className="btn-paw">试试羊毛毡配置器</Link>
            <Link href="/configure/virtual-pet" className="btn-paw" style={{ background: '#FF8FA3', borderColor: '#e06080' }}>
              试试复活服务
            </Link>
            <Link href="/products" className="btn-ghost">返回产品列表</Link>
          </div>
        </div>
      </div>
    </main>
  );
}