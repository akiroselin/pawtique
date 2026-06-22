import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="px-6 md:px-10 py-12 max-w-5xl mx-auto">
      {/* ── Hero ── */}
      <div className="text-center mb-16">
        <div className="paw-divider mb-4"><span>🐾</span></div>
        <h1 className="text-4xl md:text-6xl font-black mb-4">
          关于 PawTique
        </h1>
        <p className="doodle-font text-3xl text-yellow-dark mb-4">
          We remember every furry friend.
        </p>
        <p className="text-muted max-w-2xl mx-auto">
          一家专注于宠物纪念品定制的欧洲工作室 · 我们相信每一只宠物都值得被永久记住
        </p>
      </div>

      {/* ── 创始故事 ── */}
      <section className="mb-16">
        <div className="bg-white rounded-3xl border-[3px] border-dashed border-yellow p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-black mb-6 doodle-font text-yellow-dark">💌 我们的故事</h2>
          <div className="space-y-4 text-brown-light leading-relaxed">
            <p>
              PawTique 创立于 2024 年的伦敦。当时我们的一位联合创始人刚刚失去了陪伴她 14 年的柴犬「小豆」。
            </p>
            <p>
              她花了三个月在市面上找一份「像样」的纪念品，但找到的不是廉价的批量产品就是需要等半年的昂贵定制。
              没有一个东西让她觉得「这就是小豆」。
            </p>
            <p>
              于是我们决定自己来做 —— 做一个能让你<strong className="text-brown">参与设计</strong>的纪念品平台。
              让你看到最终效果再下单。让你和手工艺人直接沟通。
            </p>
            <p className="font-bold text-brown">
              我们不卖批量生产的产品。我们卖的是「你为它做的最后一件礼物」。
            </p>
          </div>
        </div>
      </section>

      {/* ── 核心数据 ── */}
      <section className="mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { n: '500+', label: '已定制宠物', emoji: '🐾' },
            { n: '12', label: '签约艺术家', emoji: '🎨' },
            { n: '4.9★', label: '客户评价', emoji: '⭐' },
            { n: '8', label: '欧洲国家', emoji: '🇪🇺' },
          ].map((s, i) => (
            <div key={i} className="bg-cream rounded-2xl p-6 text-center border-2 border-yellow/40">
              <div className="text-3xl mb-2">{s.emoji}</div>
              <div className="text-3xl md:text-4xl font-black text-brown mb-1">{s.n}</div>
              <div className="text-xs text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 团队 ── */}
      <section className="mb-16">
        <h2 className="text-2xl md:text-3xl font-black text-center mb-8">👋 遇见团队</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { name: 'Lin', role: '联合创始人', desc: '前设计师 · 因为小豆决定做这件事', emoji: '👩‍🎨' },
            { name: 'Marco', role: '工艺总监', desc: '意大利羊毛毡匠人 · 15 年经验', emoji: '🧑‍🎨' },
            { name: 'Yuki', role: '运营负责人', desc: '养了三只猫的资深铲屎官', emoji: '👩‍💼' },
          ].map((m, i) => (
            <div key={i} className="card-hover bg-white rounded-3xl p-6 text-center border-[3px] border-dashed border-yellow/40">
              <div className="text-7xl mb-3">{m.emoji}</div>
              <h3 className="text-xl font-black">{m.name}</h3>
              <div className="text-xs text-yellow-dark font-bold mb-2">{m.role}</div>
              <p className="text-sm text-brown-light">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 工艺流程 ── */}
      <section className="mb-16">
        <h2 className="text-2xl md:text-3xl font-black text-center mb-3">🛠 我们的工艺</h2>
        <p className="text-center text-muted mb-8">从你的照片到永恒的纪念 · 6 步透明</p>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { n: 1, t: '你上传照片', d: '正脸照最佳 · AI 自动提取特征' },
            { n: 2, t: 'AI 实时预览', d: '选姿势 / 颜色 / 背景 · 看 3D 效果' },
            { n: 3, t: '工艺师对接', d: '欧洲签约艺术家直接制作 · 不外包' },
            { n: 4, t: '免费 proof', d: '先看草图 · 不满意 1 次免费修改' },
            { n: 5, t: '手工制作', d: '羊毛毡 / 油画 / 3D 打印 / 树脂 · 真材实料' },
            { n: 6, t: '私密包装', d: '纯素色外箱 · 手写感谢卡 · 5-7 天送达' },
          ].map((s, i) => (
            <div key={i} className="bg-cream rounded-2xl p-5 relative">
              <div className="absolute -top-3 -left-2 bg-yellow text-brown font-black w-9 h-9 rounded-full border-2 border-yellow-dark flex items-center justify-center">
                {s.n}
              </div>
              <h3 className="font-black mt-2 mb-1">{s.t}</h3>
              <p className="text-sm text-brown-light">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 合作 ── */}
      <section className="mb-16">
        <h2 className="text-2xl md:text-3xl font-black text-center mb-8">🤝 合作</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-6 border-2 border-yellow">
            <div className="text-3xl mb-2">🎨</div>
            <h3 className="font-black mb-2">艺术家招募</h3>
            <p className="text-sm text-brown-light mb-3">欧洲签约艺术家 · 远程合作 · 项目制</p>
            <Link href="/contact" className="text-xs text-yellow-dark font-bold">了解 →</Link>
          </div>
          <div className="bg-white rounded-2xl p-6 border-2 border-yellow">
            <div className="text-3xl mb-2">🐾</div>
            <h3 className="font-black mb-2">宠物慈善</h3>
            <p className="text-sm text-brown-light mb-3">每售出一件 · 捐赠 £1 给流浪动物救助</p>
            <Link href="/contact" className="text-xs text-yellow-dark font-bold">合作机构 →</Link>
          </div>
          <div className="bg-white rounded-2xl p-6 border-2 border-yellow">
            <div className="text-3xl mb-2">📦</div>
            <h3 className="font-black mb-2">批发 / 团购</h3>
            <p className="text-sm text-brown-light mb-3">宠物医院 / 殡葬馆 / 宠物店渠道合作</p>
            <Link href="/contact" className="text-xs text-yellow-dark font-bold">申请 →</Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="bg-brown text-cream rounded-3xl p-8 md:p-12 text-center">
        <div className="text-5xl mb-4">🐾</div>
        <h2 className="text-2xl md:text-3xl font-black mb-3">准备好开始了吗？</h2>
        <p className="mb-6 opacity-80">从一张照片开始 · 让它永远陪着你</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/configure/virtual-pet" className="btn-paw" style={{ background: '#FF8FA3', borderColor: '#e06080' }}>
            ✨ 复活我的宠物
          </Link>
          <Link href="/configure/wool-felt" className="btn-paw">
            🐑 定制羊毛毡
          </Link>
        </div>
      </div>
    </main>
  );
}