import Link from 'next/link';

export default function HomePage() {
  return (
    <main>
      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 bg-cream border-b-[3px] border-dashed border-yellow-dark px-6 md:px-10 h-[68px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-3xl">🐾</span>
          <span className="text-2xl font-black text-brown">
            Paw<span className="text-yellow-dark">Tique</span>
          </span>
        </Link>
        <ul className="hidden md:flex gap-8 list-none">
          <li><Link href="/products" className="font-bold hover:text-yellow-dark transition">定制馆</Link></li>
          <li>
            <Link href="/configure/virtual-pet" className="font-bold hover:text-yellow-dark transition flex items-center gap-1">
              ✨ 复活服务
              <span className="text-[10px] bg-yellow text-brown px-1.5 py-0.5 rounded-full">NEW</span>
            </Link>
          </li>
          <li>
            <Link href="/configure/holo-pet" className="font-bold hover:text-[#7B5BFF] transition flex items-center gap-1">
              🌀 全息投影
              <span className="text-[10px] bg-[#7B5BFF] text-white px-1.5 py-0.5 rounded-full">3D</span>
            </Link>
          </li>
          <li><Link href="/pricing" className="font-bold hover:text-yellow-dark transition">价格</Link></li>
          <li><Link href="/stories" className="font-bold hover:text-yellow-dark transition">毛孩故事</Link></li>
          <li><Link href="/faq" className="font-bold hover:text-yellow-dark transition">FAQ</Link></li>
          <li><Link href="/about" className="font-bold hover:text-yellow-dark transition">关于</Link></li>
        </ul>
        <div className="flex gap-3">
          <button className="w-10 h-10 rounded-full border-2 border-yellow bg-white hover:bg-yellow-light transition" aria-label="搜索">🔍</button>
          <button className="w-10 h-10 rounded-full border-2 border-yellow bg-white hover:bg-yellow-light transition relative" aria-label="购物车">
            🛒<span className="absolute -top-1 -right-1 bg-yellow-dark text-brown text-[11px] font-black w-[18px] h-[18px] rounded-full flex items-center justify-center">0</span>
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="bg-yellow-light border-b-[3px] border-dashed border-yellow-dark px-6 md:px-10 py-20 md:py-28 text-center relative overflow-hidden">
        <span aria-hidden className="absolute text-7xl opacity-10 top-5 left-[5%]">🐾</span>
        <span aria-hidden className="absolute text-6xl opacity-10 bottom-8 right-[8%]">🐾</span>
        <div className="inline-block bg-yellow text-brown font-black text-xs tracking-[2px] px-4 py-1.5 rounded-full mb-5 border-2 border-yellow-dark">
          ✨ 每一只毛孩子都值得独一无二的纪念
        </div>
        <h1 className="text-4xl md:text-6xl font-black leading-tight mb-4">
          为你的毛孩子<br />
          <em className="doodle-font text-yellow-dark not-italic text-5xl md:text-7xl">定制专属纪念</em>
        </h1>
        <p className="text-base md:text-lg text-brown-light max-w-xl mx-auto mb-8 leading-relaxed">
          上传照片 · 实时调整 · 看到最终效果 · 欧洲手工艺人作品<br />
          不像承诺退款 · 一辈子珍藏
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/configure/wool-felt" className="btn-paw text-base">
            🐑 开始定制羊毛毡 →
          </Link>
          <Link href="/configure/virtual-pet" className="btn-paw text-base" style={{ background: '#FF8FA3', borderColor: '#e06080' }}>
            ✨ 复活我的宠物 →
          </Link>
          <Link href="/products" className="btn-ghost">
            浏览全部产品
          </Link>
        </div>

        {/* ── 社会证明条 ── */}
        <div className="mt-12 inline-flex flex-wrap items-center justify-center gap-4 md:gap-8 bg-white/70 backdrop-blur rounded-full px-6 py-3 border-2 border-yellow/60">
          <div className="flex items-center gap-1 text-sm font-bold">
            <span className="text-yellow-dark">★★★★★</span>
            <span>4.9/5</span>
          </div>
          <div className="text-sm font-bold">🐾 500+ 宠物已定制</div>
          <div className="text-sm font-bold">🎨 12 位签约艺术家</div>
          <div className="text-sm font-bold">🇪🇺 8 国配送</div>
          <div className="text-sm font-bold">💯 100% 退款保证</div>
        </div>
      </section>

      {/* ── PRODUCT GRID (7 条线) ── */}
      <section className="px-6 md:px-10 py-20 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="paw-divider mb-4"><span>🐾</span></div>
          <h2 className="text-3xl md:text-4xl font-black mb-3">七种方式 · 留住它的样子</h2>
          <p className="text-muted text-base">每一种都能在浏览器里实时调整 · 看到最终效果再下单</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* 置顶卡片：虚拟宠物复活（NEW） */}
          <Link
            href="/configure/virtual-pet"
            className="card-hover sm:col-span-2 lg:col-span-3 xl:col-span-4 rounded-3xl overflow-hidden block relative"
            style={{ background: 'linear-gradient(135deg, #FFE8F0 0%, #FFF3B0 50%, #E8F4FF 100%)' }}
          >
            <div className="p-6 md:p-8 flex items-center gap-6">
              <div className="text-7xl md:text-8xl">✨</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-[#FF8FA3] text-white text-xs font-black px-3 py-1 rounded-full border-2 border-[#e06080]">
                    🔥 NEW · 复活服务
                  </span>
                  <span className="text-xs text-muted">⚡ Kling AI 驱动 · 1-3 分钟出片</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black mb-2">
                  让它的眼睛<span className="doodle-font text-yellow-dark text-3xl md:text-5xl not-italic">再动一次</span>
                </h3>
                <p className="text-sm text-brown-light mb-3 max-w-2xl">
                  上传一张正脸照 → AI 生成 5-10 秒动态视频 → 眨眼转头呼吸都自然 → 下载 MP4 + GIF · £29 起
                </p>
                <div className="flex gap-2">
                  <span className="chip text-xs">👁️ 温柔眨眼</span>
                  <span className="chip text-xs">🔄 转头回眸</span>
                  <span className="chip text-xs">😴 安静沉睡</span>
                  <span className="chip text-xs">😊 开心微笑</span>
                </div>
              </div>
              <span className="btn-paw text-sm whitespace-nowrap">立即复活 →</span>
            </div>
          </Link>

          {/* 置顶卡片：3D 全息投影（3D NEW） */}
          <Link
            href="/configure/holo-pet"
            className="card-hover sm:col-span-2 lg:col-span-3 xl:col-span-4 rounded-3xl overflow-hidden block relative"
            style={{ background: 'linear-gradient(135deg, #E8E0FF 0%, #1a1a2e 50%, #7B5BFF 100%)' }}
          >
            <div className="p-6 md:p-8 flex items-center gap-6 text-cream">
              <div className="text-7xl md:text-8xl" style={{ filter: 'drop-shadow(0 0 20px rgba(123, 91, 255, 0.8))' }}>
                🌀
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-[#7B5BFF] text-white text-xs font-black px-3 py-1 rounded-full border-2 border-white/30">
                    🌀 3D · 全息投影
                  </span>
                  <span className="text-xs opacity-80">AI 复活视频 + 桌面全息仪一体</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black mb-2">
                  它<span style={{ fontFamily: 'Caveat, cursive', fontSize: '1.3em', color: '#FFD84D' }}>在迷你投影箱里</span>陪着你
                </h3>
                <p className="text-sm opacity-80 mb-3 max-w-2xl">
                  上传照片 → AI 生成 8 动作 + 2 交互 → 预装到迷你投影箱 → 它就在你桌面上陪着你
                </p>
                <div className="flex gap-2 flex-wrap">
                  <span className="chip text-xs" style={{ background: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.3)', color: '#FFF' }}>
                    🔺 金字塔迷你投影箱 £90
                  </span>
                  <span className="chip text-xs" style={{ background: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.3)', color: '#FFF' }}>
                    📺 LCD 迷你投影箱 £200
                  </span>
                  <span className="chip text-xs" style={{ background: '#FFD84D', color: '#5C3D2E', borderColor: '#F5C200' }}>
                    🎬 8 动作 + 2 交互 £49
                  </span>
                </div>
              </div>
              <span className="text-sm whitespace-nowrap px-5 py-3 rounded-2xl bg-[#7B5BFF] border-2 border-white/30 text-white font-black">
                立即配置 →
              </span>
            </div>
          </Link>
          {PRODUCTS.map((p) => (
            <Link
              key={p.slug}
              href={p.href}
              className="card-hover bg-white rounded-3xl border-[3px] border-dashed border-yellow/60 hover:border-yellow-dark overflow-hidden block"
            >
              <div className="aspect-square relative" style={{ background: p.bg }}>
                <div className="absolute top-3 left-3 bg-yellow text-brown text-xs font-black px-3 py-1 rounded-full border-2 border-yellow-dark">
                  {p.tier}
                </div>
                {p.badge && (
                  <div className="absolute top-3 right-3 bg-[#FF8FA3] text-white text-xs font-black px-3 py-1 rounded-full border-2 border-[#e06080]">
                    {p.badge}
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center text-8xl">
                  {p.emoji}
                </div>
              </div>
              <div className="p-5">
                <div className="text-xs font-bold text-muted mb-1">{p.category}</div>
                <div className="text-lg font-black mb-2">{p.name}</div>
                <div className="text-sm text-brown-light mb-3 leading-relaxed min-h-[40px]">
                  {p.tagline}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-muted">起售价</span>
                    <div className="text-xl font-black text-brown">£{p.fromPrice}</div>
                  </div>
                  <div className="btn-ghost text-xs">配置 →</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="bg-cream-dark px-6 md:px-10 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="paw-divider mb-4"><span>✨</span></div>
            <h2 className="text-3xl md:text-4xl font-black mb-3">三步完成定制</h2>
            <p className="text-muted">从照片到作品 · 不用猜 · 不用等邮件</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map((s, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 border-[3px] border-dashed border-yellow relative">
                <div className="absolute -top-5 -left-2 bg-yellow text-brown font-black text-2xl w-12 h-12 rounded-full border-3 border-yellow-dark flex items-center justify-center doodle-font">
                  {i + 1}
                </div>
                <div className="text-5xl mb-4 text-center mt-3">{s.icon}</div>
                <h3 className="text-xl font-black text-center mb-2">{s.title}</h3>
                <p className="text-sm text-brown-light text-center leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 客户故事（3 则） ── */}
      <section id="stories" className="px-6 md:px-10 py-20 bg-cream-dark">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="paw-divider mb-4"><span>💝</span></div>
            <h2 className="text-3xl md:text-4xl font-black mb-3">它们的故事</h2>
            <p className="text-muted">三位主人分享他们和 PawTique 的回忆</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                pet: '小豆', emoji: '🐕', species: '柴犬 · 14 岁',
                bg: '#FFF3B0',
                text: '收到羊毛毡小豆的那天，我把它放在玄关每天回家第一眼看到的位置。三个月过去了，它陪我度过了最难的日子。',
                owner: 'Lin · 伦敦',
              },
              {
                pet: 'Mocha', emoji: '🐈', species: '英短 · 11 岁',
                bg: '#FFE8F0',
                text: '复活视频里她眨眼的那一瞬间，我觉得她又活过来了一次。现在视频放在我手机首屏，每天开机都看到。',
                owner: 'Elena · 阿姆斯特丹',
              },
              {
                pet: 'Cooper', emoji: '🦮', species: '金毛 · 13 岁',
                bg: '#FFF1D6',
                text: '他走的那天是我生日。本来想放弃庆祝，但爸妈送了我这幅油画。现在客厅最显眼的位置挂着它。',
                owner: 'James · 柏林',
              },
            ].map((s, i) => (
              <article key={i} className="card-hover bg-white rounded-3xl border-[3px] border-dashed border-yellow/60 overflow-hidden">
                <div className="aspect-[4/3] relative" style={{ background: s.bg }}>
                  <div className="absolute inset-0 flex items-center justify-center text-8xl">{s.emoji}</div>
                </div>
                <div className="p-5">
                  <div className="flex items-baseline justify-between mb-2">
                    <h3 className="font-black text-lg">★ {s.pet} ★</h3>
                    <span className="text-xs text-muted">{s.owner}</span>
                  </div>
                  <div className="text-xs text-muted mb-2">{s.species}</div>
                  <p className="text-sm text-brown-light leading-relaxed">{s.text}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/stories" className="btn-ghost">
              看更多故事 →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ 折叠 3 条 ── */}
      <section className="px-6 md:px-10 py-20 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="paw-divider mb-4"><span>❓</span></div>
          <h2 className="text-3xl md:text-4xl font-black mb-3">常见问题</h2>
        </div>
        <div className="space-y-3">
          {[
            { q: '会不会做出来不像？', a: '承诺：不像全额退款。所有手工品类有 1 次免费修改。AI 复活和 3D 雕塑在配置阶段就能实时预览。' },
            { q: '多久能收到？', a: '虚拟复活 1-3 分钟 · AI 艺术画 72 小时 · 羊毛毡 / 3D 雕塑 14-21 天 · 油画 21-28 天。加急选项见价格页。' },
            { q: '能送到哪些国家？', a: '欧洲主要国家：英国 / 德国 / 法国 / 荷兰 / 意大利 / 西班牙 / 比利时 / 奥地利等。瑞士 / 挪威 +£20。' },
          ].map((f, i) => (
            <details key={i} className="bg-white rounded-2xl border-2 border-yellow/60 group">
              <summary className="px-5 py-4 font-bold cursor-pointer flex items-center justify-between">
                {f.q}
                <span className="text-2xl text-yellow-dark group-open:rotate-45 transition-transform">+</span>
              </summary>
              <div className="px-5 pb-5 text-sm text-brown-light leading-relaxed">{f.a}</div>
            </details>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link href="/faq" className="btn-ghost">看全部 20 个问题 →</Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-brown text-cream px-6 md:px-10 py-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-5 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🐾</span>
              <span className="text-xl font-black">Paw<span className="text-yellow">Tique</span></span>
            </div>
            <p className="text-sm opacity-80">欧洲宠物纪念品定制工作室</p>
          </div>
          <div>
            <h4 className="font-black mb-3">定制馆</h4>
            <ul className="space-y-1 text-sm opacity-80">
              <li><Link href="/configure/wool-felt">羊毛毡肖像</Link></li>
              <li><Link href="/configure/figurine">3D 雕塑</Link></li>
              <li><Link href="/configure/ai-art">AI 艺术画</Link></li>
              <li><Link href="/configure/virtual-pet">✨ 复活服务</Link></li>
              <li><Link href="/configure/holo-pet">🌀 全息投影</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black mb-3">了解</h4>
            <ul className="space-y-1 text-sm opacity-80">
              <li><Link href="/about">关于我们</Link></li>
              <li><Link href="/pricing">价格</Link></li>
              <li><Link href="/stories">毛孩故事</Link></li>
              <li><Link href="/faq">常见问题</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black mb-3">服务</h4>
            <ul className="space-y-1 text-sm opacity-80">
              <li>2 次免费修改</li>
              <li>欧洲配送 5-7 天</li>
              <li>私密包装</li>
              <li>不满意全额退款</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black mb-3">联系</h4>
            <ul className="space-y-1 text-sm opacity-80">
              <li><Link href="/contact">hello@pawtique.studio</Link></li>
              <li>伦敦 / 阿姆斯特丹</li>
              <li><Link href="/contact">联系客服 →</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-cream/20 text-center text-xs opacity-60">
          © 2026 PawTique Studio · Made with ❤️ for every furry friend ·{' '}
          <Link href="/privacy" className="underline">Privacy</Link> ·{' '}
          <Link href="/terms" className="underline">Terms</Link>
        </div>
      </footer>
    </main>
  );
}

// ── 产品数据 (7 条线 + Temu POD) ──
const PRODUCTS = [
  {
    slug: 'wool-felt', href: '/configure/wool-felt',
    tier: 'Tier 1', badge: '🔥 爆款',
    name: '羊毛毡定制肖像', category: 'Wool Felt',
    tagline: '上传照片 → AI 抠轮廓 → 选姿势/羊毛色/背景 → 实时 3D 预览',
    fromPrice: 150, bg: '#FFF3B0', emoji: '🐑',
  },
  {
    slug: 'figurine', href: '/configure/figurine',
    tier: 'Tier 1', badge: '✨ 推荐',
    name: '3D 打印/陶瓷雕塑', category: '3D Sculpture',
    tagline: '多角度照片 → AI 生成 3D 模型 → 选姿势/釉色/底座 → AR 预览',
    fromPrice: 100, bg: '#FFE8F0', emoji: '🗿',
  },
  {
    slug: 'ai-art', href: '/configure/ai-art',
    tier: 'Tier 1', badge: '⚡ 72h',
    name: 'AI 增强艺术画', category: 'AI Art Print',
    tagline: '5 种艺术风格 × 调色板 × 构图 → 实时风格迁移 → 画布/框画',
    fromPrice: 80, bg: '#E8F4FF', emoji: '🎨',
  },
  {
    slug: 'painting', href: '/configure/painting',
    tier: 'Tier 2',
    name: '手绘油画/水彩肖像', category: 'Hand-painted',
    tagline: '选风格/构图/背景/尺寸 → 欧洲艺术家签约池 → 4 周交付',
    fromPrice: 120, bg: '#FFF1D6', emoji: '🖼️',
  },
  {
    slug: 'jewelry', href: '/configure/jewelry',
    tier: 'Tier 2',
    name: '高级树脂首饰', category: 'Resin Jewelry',
    tagline: '选吊坠形状/嵌入物(毛发/骨灰/金箔) → 925银链 → 实时 3D',
    fromPrice: 80, bg: '#F0E8FF', emoji: '💎',
  },
  {
    slug: 'video', href: '/configure/video',
    tier: 'Tier 3',
    name: '悼念视频 + USB 礼盒', category: 'Tribute Video',
    tagline: '多张照片 → 5 模板 × 音乐 → 实时预览 → 木盒 USB',
    fromPrice: 60, bg: '#E8FFE8', emoji: '🎬',
  },
  {
    slug: 'urn', href: '/configure/urn',
    tier: 'Tier 3',
    name: '设计师陶瓷 Urn', category: 'Ceramic Urn',
    tagline: '10+ 釉色 × 表面处理 × 刻印 → 3D 预览 → 高端设计师款',
    fromPrice: 120, bg: '#FFE8D6', emoji: '🏺',
  },
];

const STEPS = [
  { icon: '📸', title: '上传照片', desc: '正脸照（多角度更佳）· AI 自动提取轮廓和特征' },
  { icon: '🎨', title: '实时调整', desc: '在浏览器里选姿势/颜色/背景 · 立刻看到 3D 预览' },
  { icon: '📦', title: '下单制作', desc: '满意后再付款 · 欧洲手工艺人制作 · 5-7 天送达' },
];