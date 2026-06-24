import Link from 'next/link';
import ProductImage, { type ProductLineKey } from '@/components/ProductImage';

interface Story {
  petName: string;
  species: string;
  passed: string;
  owner: string;
  excerpt: string;
  product: string;
  imageLine: ProductLineKey;
  bg: string;
}

const STORIES: Story[] = [
  {
    petName: '小豆',
    species: '柴犬 · 14 岁',
    passed: '2026 年 3 月',
    owner: 'Lin',
    excerpt: '小豆陪伴了我从大学到工作，从租房到买房。决定去做一只羊毛毡他，这样每天回家都能看到他躺在玄关的样子。收到的时候我真的哭了...',
    product: '羊毛毡定制肖像',
    imageLine: 'wool-felt',
    bg: '#FFF3B0',
  },
  {
    petName: 'Mocha',
    species: '英短 · 11 岁',
    passed: '2025 年 12 月',
    owner: 'Elena',
    excerpt: 'Mocha 是我从抑郁症里拉回来的天使。给她做了一个 3D 雕塑放在书桌上，每天看着我工作。复活视频里她眨眼的那一瞬间，我觉得她又活过来了一次。',
    product: '3D 打印雕塑 + 虚拟复活',
    imageLine: 'figurine',
    bg: '#FFE8F0',
  },
  {
    petName: 'Cooper',
    species: '金毛 · 13 岁',
    passed: '2026 年 1 月',
    owner: 'James',
    excerpt: '他走的那天正好是我的生日。本来想放弃庆祝，但爸妈给我定制了一幅油画挂在客厅。现在每次看到都觉得他在笑。',
    product: '手绘油画肖像',
    imageLine: 'painting',
    bg: '#FFF1D6',
  },
  {
    petName: '米娅',
    species: '兔子 · 7 岁',
    passed: '2025 年 10 月',
    owner: 'Yuki',
    excerpt: '把她的毛发做成了一条项链贴身戴。过敏的朋友可以碰我的脖子，这是只有我知道的秘密。',
    product: '高级树脂首饰',
    imageLine: 'jewelry',
    bg: '#F0E8FF',
  },
];

export default function StoriesPage() {
  return (
    <main className="px-6 md:px-10 py-12 max-w-6xl mx-auto">
      {/* ── Hero ── */}
      <div className="text-center mb-12">
        <div className="paw-divider mb-4"><span>💝</span></div>
        <h1 className="text-4xl md:text-6xl font-black mb-4">
          它们的故事<br />
          <em className="doodle-font text-yellow-dark not-italic text-5xl md:text-7xl">我们永远记得</em>
        </h1>
        <p className="text-muted text-base max-w-2xl mx-auto">
          每一位宠物都独一无二 · 这些是主人分享给我们的回忆
        </p>
      </div>

      {/* ── Filter bar (UI only for MVP) ── */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        <button className="chip chip-active">全部</button>
        <button className="chip">狗</button>
        <button className="chip">猫</button>
        <button className="chip">异宠</button>
        <button className="chip">羊毛毡</button>
        <button className="chip">3D 雕塑</button>
        <button className="chip">油画</button>
      </div>

      {/* ── Story Cards ── */}
      <div className="grid sm:grid-cols-2 gap-6">
        {STORIES.map((s, i) => (
          <article key={i} className="card-hover bg-white rounded-3xl border-[3px] border-dashed border-yellow/60 hover:border-yellow-dark overflow-hidden">
            <div className="aspect-video relative bg-white">
              <ProductImage
                line={s.imageLine}
                size="hero"
                fallback="🐾"
                className="w-full h-full !rounded-none"
              />
              <div className="absolute top-3 left-3 z-10 bg-yellow text-brown text-xs font-black px-3 py-1 rounded-full border-2 border-yellow-dark">
                {s.product}
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-baseline gap-2 mb-2">
                <h2 className="text-2xl font-black">★ {s.petName} ★</h2>
                <span className="text-xs text-muted">— {s.owner}</span>
              </div>
              <div className="text-xs text-brown-light mb-3">
                {s.species} · 离世 {s.passed}
              </div>
              <p className="text-sm leading-relaxed text-ink">{s.excerpt}</p>
            </div>
          </article>
        ))}
      </div>

      {/* ── CTA: 分享你的故事 ── */}
      <div className="mt-16 bg-yellow-light rounded-3xl p-8 md:p-12 border-[3px] border-dashed border-yellow-dark text-center">
        <div className="text-5xl mb-4">📖</div>
        <h2 className="text-2xl md:text-3xl font-black mb-3">分享你的故事</h2>
        <p className="text-brown-light mb-6 max-w-lg mx-auto">
          如果你也想和社区分享你的宠物故事 · 我们会把它做成纪念页 · 让更多人记得它
        </p>
        <Link href="/contact" className="btn-paw">
          ✍️ 提交你的故事
        </Link>
      </div>
    </main>
  );
}