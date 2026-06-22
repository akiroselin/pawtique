'use client';

import { useState } from 'react';

interface FAQ {
  q: string;
  a: string;
  category: string;
}

const FAQS: FAQ[] = [
  // 下单前
  { category: '下单前', q: '怎么选适合的纪念品类？', a: '如果是第一次购买，建议从「羊毛毡肖像」或「虚拟宠物复活」开始 —— 性价比高、出品快、能看到效果。如果想要更正式的仪式感，选「陶瓷 Urn」或「手绘油画」。具体对比见 /pricing 页面。' },
  { category: '下单前', q: '真的能做出像样的吗？会不会不像？', a: '我们承诺：不像全额退款。所有手工品类都有 1 次免费修改 —— 工艺师会先做 proof 给你看，确认后才进入最终制作。AI 复活和 3D 雕塑在配置阶段就能实时预览，避免"开盲盒"。' },
  { category: '下单前', q: '多久能收到？', a: '虚拟复活 1-3 分钟 · AI 艺术画 72 小时 · 悼念视频 5-7 天 · 羊毛毡 / 3D 雕塑 / 树脂首饰 14-21 天 · 手绘油画 / 陶瓷 Urn 21-28 天。加急选项见 /pricing。' },
  { category: '下单前', q: '能加急吗？', a: '可以。配置器里有「加急 7-10 天」选项（+£35）。手绘油画 / 陶瓷 Urn 有 14 天加急（+£50）。虚拟复活本身就快，不用加急。' },

  // 照片要求
  { category: '照片要求', q: '什么照片效果最好？', a: '正脸照最佳 · 双眼可见 · 背景简洁 · 光线均匀。如果有侧脸照 / 全身照也传，能帮助工艺师更好地还原。多角度照片（5-10 张）对 3D 雕塑特别重要。' },
  { category: '照片要求', q: '照片模糊或角度不好怎么办？', a: '不要担心 —— 我们的工艺师有 10+ 年经验，会根据照片特征调整。但照片质量越高，最终效果越好。如果实在找不到好照片，可以用宠物生前视频截图。' },
  { category: '照片要求', q: '上传的照片会被保存吗？会被用来训练 AI 吗？', a: '不会。照片仅用于本次订单，订单完成后 30 天自动删除。绝不会用于 AI 模型训练或分享给第三方。详细见 /privacy。' },

  // 工艺细节
  { category: '工艺细节', q: '羊毛毡是什么材料？耐用吗？', a: '100% 新西兰美利奴羊毛 · 防蛀处理 · 不掉毛 · 可保存 20+ 年。触感柔软，可以抚摸。适合作为日常陪伴型纪念品。' },
  { category: '工艺细节', q: '3D 打印精度够吗？', a: '我们用 0.05mm 精度树脂打印 + 手工上色。完工后像陶瓷质感，比一般 3D 打印精致得多。也可以选陶瓷材质，由欧洲合作工坊手工烧制。' },
  { category: '工艺细节', q: '油画用什么颜料？会褪色吗？', a: '专业油画颜料（温莎牛顿 / 老荷兰）+ 防水底漆 + UV 保护漆。正常室内光照下 50+ 年不褪色。建议避免阳光直射。' },

  // 付款配送
  { category: '付款配送', q: '能送到哪些国家？', a: '欧洲大部分国家：英国 / 德国 / 法国 / 荷兰 / 比利时 / 意大利 / 西班牙 / 葡萄牙 / 奥地利 / 瑞士（+£20）/ 挪威（+£20）/ 丹麦 / 瑞典 / 芬兰。' },
  { category: '付款配送', q: '关税要自己付吗？', a: '欧盟内配送已含 VAT。英国（脱欧后）可能会有关税，由快递公司代收，通常 £10-25。' },
  { category: '付款配送', q: '支持哪些支付方式？', a: 'Stripe 支持：Visa / Mastercard / American Express / Apple Pay / Google Pay / Klarna（分期）。近期会接入 PayPal。' },
  { category: '付款配送', q: '运费多少？', a: '欧洲主要国家包邮。瑞士 / 挪威 +£20。订单满 £300 享全球免邮（含亚洲 / 美洲）。' },

  // 售后服务
  { category: '售后服务', q: '能退款吗？', a: '100% 退款保证 —— 如果成品与你预期严重不符（不像 / 工艺缺陷 / 运输破损），全额退款 + 运费我们承担。30 天内有效。' },
  { category: '售后服务', q: '能修改吗？', a: '所有手工品类有 1 次免费修改（颜色 / 姿势 / 细节调整）。加急修改 ¥25 / 次。修改周期 7-14 天。' },
  { category: '售后服务', q: '运输破损怎么办？', a: '私密包装 + 防震内衬。如果收到时破损，48 小时内拍照给我们，免费重做。运费我们承担。' },

  // 伦理隐私
  { category: '伦理隐私', q: '做这些纪念品会不会让我更难过？', a: '我们的客户调研显示：85% 的客户在收到成品后感受到「温暖」而非「更难过」。纪念品的意义在于「陪伴」而非「提醒失去」。如果你情绪很脆弱，建议先从虚拟复活（£29）尝试。' },
  { category: '伦理隐私', q: '能用我宠物的毛发或骨灰吗？', a: '可以。树脂首饰系列支持嵌入毛发 / 骨灰 / 干花 / 金箔。提交订单后我们会寄专用收集包给你。' },
  { category: '伦理隐私', q: '你们的 AI 模型是用我的照片训练的吗？', a: '绝对不会。我们使用第三方 AI 服务（Kling AI / Stable Diffusion），它们也不会用你的照片训练模型。所有照片订单完成后 30 天自动删除。' },
];

export default function FAQPage() {
  const [openId, setOpenId] = useState<number | null>(0);
  const categories = Array.from(new Set(FAQS.map((f) => f.category)));

  return (
    <main className="px-6 md:px-10 py-12 max-w-4xl mx-auto">
      {/* ── Hero ── */}
      <div className="text-center mb-12">
        <div className="paw-divider mb-4"><span>❓</span></div>
        <h1 className="text-4xl md:text-6xl font-black mb-4">常见问题</h1>
        <p className="text-muted">20 个最常被问到的问题 · 没找到答案？<a href="/contact" className="text-yellow-dark font-bold">联系我们 →</a></p>
      </div>

      {/* ── Category chips ── */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {categories.map((c) => (
          <a
            key={c}
            href={`#cat-${c}`}
            className="chip"
          >
            {c}
          </a>
        ))}
      </div>

      {/* ── FAQ by category ── */}
      {categories.map((cat) => (
        <section key={cat} id={`cat-${cat}`} className="mb-10">
          <h2 className="text-2xl font-black mb-4 doodle-font text-yellow-dark">📌 {cat}</h2>
          <div className="space-y-3">
            {FAQS.filter((f) => f.category === cat).map((f, i) => {
              const id = FAQS.indexOf(f);
              const isOpen = openId === id;
              return (
                <div
                  key={id}
                  className="bg-white rounded-2xl border-2 border-yellow/60 hover:border-yellow-dark transition overflow-hidden"
                >
                  <button
                    onClick={() => setOpenId(isOpen ? null : id)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left"
                  >
                    <span className="font-bold pr-4">{f.q}</span>
                    <span className="text-2xl text-yellow-dark flex-shrink-0">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-sm text-brown-light leading-relaxed">
                      {f.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {/* ── Contact CTA ── */}
      <div className="bg-yellow-light rounded-3xl p-8 border-[3px] border-dashed border-yellow-dark text-center mt-12">
        <div className="text-4xl mb-3">💬</div>
        <h2 className="text-xl font-black mb-2">还有问题？</h2>
        <p className="text-sm text-brown-light mb-4">24 小时内回复 · 邮件 / 飞书 / WhatsApp 都行</p>
        <a href="/contact" className="btn-paw">联系客服</a>
      </div>
    </main>
  );
}