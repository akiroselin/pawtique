'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    type: 'general',
    petName: '',
    message: '',
  });
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 接 API → 邮件/飞书 webhook
    setSent(true);
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <main className="px-6 md:px-10 py-12 max-w-5xl mx-auto">
      {/* ── Hero ── */}
      <div className="text-center mb-12">
        <div className="paw-divider mb-4"><span>💬</span></div>
        <h1 className="text-4xl md:text-6xl font-black mb-4">联系我们</h1>
        <p className="text-muted">24 小时内回复 · 邮件 / 飞书 / WhatsApp 都行</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* ── Contact Form ── */}
        <section className="bg-white rounded-3xl border-[3px] border-dashed border-yellow p-6 md:p-8">
          <h2 className="text-xl font-black mb-4">✉️ 发消息</h2>
          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="block text-xs font-bold mb-1">姓名 *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border-2 border-yellow focus:border-yellow-dark outline-none bg-cream"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">邮箱 *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border-2 border-yellow focus:border-yellow-dark outline-none bg-cream"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">咨询类型</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border-2 border-yellow focus:border-yellow-dark outline-none bg-cream"
              >
                <option value="general">一般咨询</option>
                <option value="order">订单相关</option>
                <option value="wholesale">批发 / 团购</option>
                <option value="artist">艺术家合作</option>
                <option value="press">媒体采访</option>
                <option value="other">其他</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">宠物名字（选填）</label>
              <input
                type="text"
                value={form.petName}
                onChange={(e) => setForm({ ...form, petName: e.target.value })}
                placeholder="让我们的回复更温暖"
                className="w-full px-3 py-2.5 rounded-xl border-2 border-yellow focus:border-yellow-dark outline-none bg-cream"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">消息 *</label>
              <textarea
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={5}
                className="w-full px-3 py-2.5 rounded-xl border-2 border-yellow focus:border-yellow-dark outline-none bg-cream resize-none"
              />
            </div>
            <button type="submit" className="btn-paw w-full justify-center">
              {sent ? '✓ 已发送 · 24 小时内回复' : '📤 发送消息'}
            </button>
            <p className="text-xs text-muted text-center">
              我们绝不会把你的邮箱用于营销 · 见 <a href="/privacy" className="underline">隐私政策</a>
            </p>
          </form>
        </section>

        {/* ── Direct Contact Info ── */}
        <section className="space-y-4">
          <div className="bg-cream rounded-2xl p-6 border-2 border-yellow">
            <div className="text-3xl mb-2">📧</div>
            <h3 className="font-black mb-1">邮件</h3>
            <a href="mailto:hello@pawtique.studio" className="text-brown hover:text-yellow-dark font-bold">
              hello@pawtique.studio
            </a>
            <p className="text-xs text-muted mt-1">订单咨询 / 商务合作</p>
          </div>

          <div className="bg-cream rounded-2xl p-6 border-2 border-yellow">
            <div className="text-3xl mb-2">💬</div>
            <h3 className="font-black mb-1">飞书 / Lark</h3>
            <p className="text-sm text-brown-light mb-2">实时客服 · 工作日 9:00-21:00 (CET)</p>
            <button className="text-yellow-dark font-bold text-sm">扫码加客服 →</button>
          </div>

          <div className="bg-cream rounded-2xl p-6 border-2 border-yellow">
            <div className="text-3xl mb-2">📱</div>
            <h3 className="font-black mb-1">WhatsApp / 电话</h3>
            <a href="tel:+44XXXXXXXXXX" className="text-brown hover:text-yellow-dark font-bold">
              +44 XXX XXX XXXX
            </a>
            <p className="text-xs text-muted mt-1">英国本地 · 仅紧急订单问题</p>
          </div>

          <div className="bg-cream rounded-2xl p-6 border-2 border-yellow">
            <div className="text-3xl mb-2">📍</div>
            <h3 className="font-black mb-1">工作室</h3>
            <p className="text-sm text-brown-light">
              伦敦 Shoreditch<br />
              阿姆斯特丹 Jordaan<br />
              <span className="text-xs text-muted">预约开放参观 · 邮件联系</span>
            </p>
          </div>

          <div className="bg-cream rounded-2xl p-6 border-2 border-yellow">
            <div className="text-3xl mb-2">🌐</div>
            <h3 className="font-black mb-1">社交</h3>
            <div className="flex gap-3 text-sm">
              <a href="#" className="hover:text-yellow-dark">Instagram</a>
              <a href="#" className="hover:text-yellow-dark">TikTok</a>
              <a href="#" className="hover:text-yellow-dark">Pinterest</a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}