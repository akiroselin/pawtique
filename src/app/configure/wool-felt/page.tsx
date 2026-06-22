'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useConfigurator } from '@/lib/store/configurator';
import {
  WOOL_PALETTE,
  BACKGROUNDS,
  POSES,
  calcWoolFeltPrice,
} from '@/types';
import dynamic from 'next/dynamic';

// Konva 需要 client-side only
const CanvasStage = dynamic(
  () => import('@/components/configurator/CanvasStage').then((m) => m.CanvasStage),
  { ssr: false, loading: () => <div className="w-full h-full skeleton rounded-3xl" /> }
);

export default function WoolFeltPage() {
  const config = useConfigurator((s) => s.woolFelt);
  const update = useConfigurator((s) => s.updateWoolFelt);
  const setPetPhoto = useConfigurator((s) => s.setPetPhoto);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const price = calcWoolFeltPrice(config);

  const handlePhotoUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setIsProcessing(true);
    // Mock: 用 createObjectURL；真实部署时先上传到 Supabase/Cloudinary
    const url = URL.createObjectURL(file);
    setPetPhoto(url);
    setIsProcessing(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handlePhotoUpload(file);
  };

  return (
    <main className="bg-cream min-h-screen">
      {/* ── Top breadcrumb ── */}
      <div className="border-b-[3px] border-dashed border-yellow/60 bg-cream px-6 md:px-10 py-3 flex items-center gap-2 text-sm">
        <Link href="/" className="text-muted hover:text-brown">首页</Link>
        <span className="text-muted">/</span>
        <Link href="/products" className="text-muted hover:text-brown">定制馆</Link>
        <span className="text-muted">/</span>
        <span className="font-bold">🐑 羊毛毡定制肖像</span>
      </div>

      <div className="configurator-grid p-6 md:p-8 max-w-[1600px] mx-auto">
        {/* ════════ 左侧：实时预览 ════════ */}
        <div className="canvas-wrap">
          <CanvasStage
            photoUrl={config.petPhotoUrl}
            background={BACKGROUNDS.find((b) => b.id === config.background)?.gradient || ''}
            pose={config.pose}
            woolPalette={config.woolPalette}
            accentColor={config.accentColor}
            petName={config.petName}
            onUploadClick={() => fileInputRef.current?.click()}
            isProcessing={isProcessing}
            isDragging={isDragging}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handlePhotoUpload(e.target.files[0])}
          />
        </div>

        {/* ════════ 右侧：配置面板 ════════ */}
        <div className="overflow-y-auto pr-2 space-y-6">
          {/* Title */}
          <div>
            <div className="inline-block bg-yellow text-brown text-xs font-black px-3 py-1 rounded-full border-2 border-yellow-dark mb-2">
              🐑 羊毛毡定制肖像
            </div>
            <h1 className="text-2xl md:text-3xl font-black mb-2">为它定制一只永久的羊毛毡</h1>
            <p className="text-sm text-brown-light leading-relaxed">
              每件由欧洲签约羊毛毡艺术家手工制作 · 7-14 天交付 · 不像承诺 1 次免费修改
            </p>
          </div>

          {/* Step 1: Pet Name */}
          <Section title="① 给它起个名字" emoji="📛">
            <input
              type="text"
              value={config.petName}
              onChange={(e) => update({ petName: e.target.value })}
              placeholder="例如：小豆、Mocha、Cooper..."
              className="w-full px-4 py-3 rounded-2xl border-2 border-yellow focus:border-yellow-dark outline-none font-bold text-lg bg-white"
              maxLength={20}
            />
          </Section>

          {/* Step 2: Pose */}
          <Section title="② 选个姿势" emoji="🐕">
            <div className="grid grid-cols-4 gap-2">
              {POSES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => update({ pose: p.id as typeof config.pose })}
                  className={`chip flex-col py-3 ${config.pose === p.id ? 'chip-active' : ''}`}
                >
                  <span className="text-2xl">{p.emoji}</span>
                  <span className="text-xs">{p.name}</span>
                </button>
              ))}
            </div>
          </Section>

          {/* Step 3: Wool Palette */}
          <Section title="③ 选羊毛色（可多选）" emoji="🎨">
            <div className="grid grid-cols-6 gap-3">
              {WOOL_PALETTE.map((c) => {
                const isSelected = config.woolPalette.includes(c.hex);
                return (
                  <button
                    key={c.hex}
                    onClick={() => {
                      const next = isSelected
                        ? config.woolPalette.filter((x) => x !== c.hex)
                        : [...config.woolPalette, c.hex].slice(-3);
                      update({ woolPalette: next.length ? next : [c.hex] });
                    }}
                    className={`color-swatch ${isSelected ? 'color-swatch-active' : ''}`}
                    style={{ background: c.hex }}
                    title={c.name}
                  />
                );
              })}
            </div>
            <div className="text-xs text-muted mt-2">已选 {config.woolPalette.length}/3 种颜色</div>
          </Section>

          {/* Step 4: Accent Color */}
          <Section title="④ 装饰色（项圈/围巾）" emoji="🎀">
            <div className="flex gap-2 flex-wrap">
              {['#FFD84D', '#FF8FA3', '#87CEEB', '#B5EAD7', '#B19CD9', '#FF6B6B', '#5C3D2E'].map((c) => (
                <button
                  key={c}
                  onClick={() => update({ accentColor: c })}
                  className={`color-swatch ${config.accentColor === c ? 'color-swatch-active' : ''}`}
                  style={{ background: c }}
                />
              ))}
            </div>
          </Section>

          {/* Step 5: Background */}
          <Section title="⑤ 背景场景" emoji="🏞️">
            <div className="grid grid-cols-5 gap-2">
              {BACKGROUNDS.map((b) => (
                <button
                  key={b.id}
                  onClick={() => update({ background: b.id as typeof config.background })}
                  className={`rounded-2xl overflow-hidden border-2 transition ${
                    config.background === b.id ? 'border-yellow-dark scale-105' : 'border-transparent'
                  }`}
                >
                  <div className="aspect-square" style={{ background: b.gradient }} />
                  <div className="text-[10px] font-bold py-1 bg-white">{b.name}</div>
                </button>
              ))}
            </div>
          </Section>

          {/* Step 6: Size + Mounting */}
          <Section title="⑥ 尺寸与挂载方式" emoji="📐">
            <div className="grid grid-cols-3 gap-2 mb-3">
              {(['S', 'M', 'L'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => update({ size: s })}
                  className={`chip justify-center py-3 ${config.size === s ? 'chip-active' : ''}`}
                >
                  {s} ({s === 'S' ? '15cm' : s === 'M' ? '25cm' : '35cm'})
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {([
                { v: 'frame', label: '🖼️ 挂框' },
                { v: 'standing', label: '🗿 站立' },
                { v: 'keychain', label: '🔑 钥匙扣' },
              ] as const).map((m) => (
                <button
                  key={m.v}
                  onClick={() => update({ mounting: m.v })}
                  className={`chip justify-center py-3 ${config.mounting === m.v ? 'chip-active' : ''}`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </Section>

          {/* Step 7: Frame */}
          {config.mounting === 'frame' && (
            <Section title="⑦ 画框样式" emoji="🖼️">
              <div className="grid grid-cols-2 gap-2">
                {([
                  { v: 'wood-oak', label: '🟫 橡木原色' },
                  { v: 'wood-walnut', label: '🟤 胡桃木' },
                  { v: 'white-modern', label: '⬜ 现代白' },
                  { v: 'gold-ornate', label: '🟡 复古金' },
                ] as const).map((f) => (
                  <button
                    key={f.v}
                    onClick={() => update({ frame: f.v })}
                    className={`chip justify-center py-2.5 ${config.frame === f.v ? 'chip-active' : ''}`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </Section>
          )}

          {/* Step 8: Rush */}
          <Section title="⑧ 加急选项" emoji="⚡">
            <label className="flex items-start gap-3 cursor-pointer bg-white rounded-2xl p-4 border-2 border-yellow">
              <input
                type="checkbox"
                checked={config.rushDelivery}
                onChange={(e) => update({ rushDelivery: e.target.checked })}
                className="mt-1 w-5 h-5 accent-yellow-dark"
              />
              <div>
                <div className="font-bold">⚡ 7-10 天加急交付 (+£35)</div>
                <div className="text-xs text-muted">标准交付 14-21 天 · 加急缩短到 7-10 天</div>
              </div>
            </label>
          </Section>

          {/* ── Price + CTA ── */}
          <div className="sticky bottom-0 bg-cream pt-4 pb-2 -mx-2 px-2 border-t-2 border-dashed border-yellow">
            <div className="bg-white rounded-2xl p-4 border-2 border-yellow-dark">
              <div className="flex items-baseline justify-between mb-3">
                <span className="text-sm font-bold text-muted">总价</span>
                <div>
                  <span className="text-3xl font-black text-brown">£{price.total}</span>
                </div>
              </div>
              <div className="text-xs text-muted space-y-0.5 mb-3">
                <div className="flex justify-between"><span>基础价</span><span>£{price.base}</span></div>
                <div className="flex justify-between"><span>尺寸/挂载</span><span>£{price.size}</span></div>
                {price.rush > 0 && <div className="flex justify-between"><span>加急</span><span>£{price.rush}</span></div>}
              </div>
              <button className="btn-paw w-full justify-center text-base py-4">
                🛒 加入购物车 · 立即下单
              </button>
              <div className="text-[11px] text-center text-muted mt-2">
                ✓ 不像承诺 1 次免费修改 · ✓ 私密包装 · ✓ 不满意全额退款
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Section({
  title, emoji, children,
}: { title: string; emoji: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-black text-base mb-3 flex items-center gap-2">
        <span className="text-xl">{emoji}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}