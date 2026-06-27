'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useConfigurator } from '@/lib/store/configurator';

// 3D 产品预览（Three.js）— client-only
const ProductPreview3D = dynamic(
  () => import('@/components/configurator/ProductPreview3D').then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <div
        className="w-full rounded-2xl flex items-center justify-center text-cream/60 text-sm"
        style={{
          height: 280,
          background: 'radial-gradient(circle at 50% 30%, rgba(123, 91, 255, 0.25), transparent 70%), #1a1a2e',
        }}
      >
        🌀 加载 3D 全息预览...
      </div>
    ),
  }
);
import { PET_MOTION_PROMPTS, type KlingTask } from '@/lib/kling/types';
import {
  calcHoloPetPrice,
  type HoloDevice,
} from '@/types';

type Step = 'configure' | 'generating' | 'result';

const DEVICES: Array<{
  id: HoloDevice;
  label: string;
  desc: string;
  emoji: string;
  size: string;
}> = [
  // 风扇式全息已下架 — 专注迷你投影箱
  { id: 'pyramid', label: '金字塔迷你投影箱', desc: '12cm · 桌面级 · 透明金字塔反射 · 静音', emoji: '🔺', size: '12 × 12 × 10 cm' },
  { id: 'cube',    label: 'LCD 迷你投影箱',    desc: '8寸 LCD · 视频+音频一体 · 触摸控制',  emoji: '📺', size: '20 × 15 × 5 cm' },
];

const MOTION_SETS = {
  basic: {
    label: '基础 5 动作',
    price: 29,
    motions: ['gentle_blink', 'head_turn', 'breathing', 'smile', 'stretch'] as const,
  },
  advanced: {
    label: '高级 8 动作 + 2 交互',
    price: 49,
    motions: [
      'gentle_blink', 'head_turn', 'breathing', 'smile',
      'stretch', 'standing_walk', 'sleep_dream',
      'custom',
    ] as const,
    interactive: ['🎤 音频驱动（说话/声音触发转头）', '👋 摄像头互动（挥手触发回应）'],
  },
};

const MUSIC = [
  { id: 'none',  label: '无音乐',          emoji: '🔇' },
  { id: 'calm',  label: '舒缓钢琴',         emoji: '🎹' },
  { id: 'happy', label: '轻快民谣',         emoji: '🎸' },
  { id: 'sleep', label: '白噪音 + 摇篮曲',  emoji: '🌙' },
] as const;

const DEVICE_COLORS = [
  { id: 'white', label: '珍珠白',  hex: '#F8F8F5' },
  { id: 'black', label: '哑光黑',  hex: '#2A2A2A' },
  { id: 'wood',  label: '实木原色', hex: '#C8A878' },
] as const;

export default function HoloPetPage() {
  const config = useConfigurator((s) => s.holoPet);
  const update = useConfigurator((s) => s.updateHoloPet);
  const setProductLine = useConfigurator((s) => s.setProductLine);

  // 页面加载时同步 productLine，确保 setPetPhoto 写到 holoPet 配置
  useEffect(() => {
    setProductLine('holo-pet');
  }, [setProductLine]);

  const [step, setStep] = useState<Step>('configure');
  const [task, setTask] = useState<KlingTask | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  const photoUrl = config.petPhotoUrl;
  const price = calcHoloPetPrice(config);
  const motionSet = MOTION_SETS[config.motionSet];

  const handleUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('只支持图片文件');
      return;
    }
    const url = URL.createObjectURL(file);
    update({ petPhotoUrl: url });
    setError(null);
  };

  const generate = async () => {
    if (!photoUrl) {
      setError('请先上传照片');
      return;
    }
    setStep('generating');
    setError(null);
    setProgress(0);
    try {
      const r = await fetch('/api/kling/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: photoUrl,
          prompt: '宠物轻轻眨眼，耳朵微动，温柔看向镜头',
          motionMode: 'expressive',
          duration: 5,
          aspectRatio: '1:1',
        }),
      });
      const data = await r.json();
      if (!data.success) throw new Error(data.error || '提交失败');
      setTask(data.task);
      startPolling(data.task.taskId);
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败');
      setStep('configure');
    }
  };

  const startPolling = (taskId: string) => {
    if (pollRef.current) clearInterval(pollRef.current);
    let p = 0;
    pollRef.current = setInterval(async () => {
      p = Math.min(p + 8, 92);
      setProgress(p);
      try {
        const r = await fetch(`/api/kling/status?taskId=${taskId}`);
        const data = await r.json();
        if (data.success) {
          setTask(data.task);
          if (data.task.status === 'succeed') {
            setProgress(100);
            setStep('result');
            update({ videoTaskId: taskId, videoUrl: data.task.videoUrl });
            if (pollRef.current) clearInterval(pollRef.current);
          } else if (data.task.status === 'failed') {
            setError(data.task.errorMessage || '生成失败');
            setStep('configure');
            if (pollRef.current) clearInterval(pollRef.current);
          }
        }
      } catch {}
    }, 3000);
  };

  useEffect(() => () => {
    if (pollRef.current) clearInterval(pollRef.current);
  }, []);

  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <main className="bg-cream min-h-screen">
      {/* ── Top bar ── */}
      <div className="border-b-[3px] border-dashed border-yellow/60 bg-cream px-6 md:px-10 py-3 flex items-center gap-2 text-sm">
        <Link href="/" className="text-muted hover:text-brown">首页</Link>
        <span className="text-muted">/</span>
        <span className="font-bold">🌀 3D 全息宠物投影</span>
        <span className="ml-auto chip text-xs">⚡ Kling AI + 桌面全息仪</span>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-10 py-10">
        {/* ── Title ── */}
        <div className="text-center mb-10">
          <div className="inline-block bg-[#7B5BFF] text-white text-xs font-black px-3 py-1 rounded-full border-2 border-[#5B3BFF] mb-3">
            🌀 3D 全息投影 · AI 复活 + 桌面硬件一体
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3">
            它<span className="doodle-font text-[#7B5BFF] text-5xl md:text-7xl not-italic">悬浮</span>在你桌面上
          </h1>
          <p className="text-brown-light text-base max-w-xl mx-auto">
            上传照片 → AI 生成动态视频 → 选择全息仪 → 它就在你面前 · 3D 浮动
          </p>
        </div>

        {/* ════════ Step 1: 配置 ════════ */}
        {step === 'configure' && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* 左：照片 + 设备预览 */}
            <div className="space-y-4 sticky top-24 self-start">
              {/* 照片上传区 */}
              <div
                className="bg-white rounded-3xl border-[3px] border-dashed border-yellow p-6 text-center cursor-pointer hover:border-yellow-dark transition"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const f = e.dataTransfer.files[0];
                  if (f) handleUpload(f);
                }}
              >
                {photoUrl ? (
                  <div className="relative">
                    <img src={photoUrl} alt="Pet" className="w-full h-64 object-cover rounded-2xl" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        update({ petPhotoUrl: null });
                      }}
                      className="absolute top-2 right-2 btn-ghost text-xs"
                    >
                      🔄 换一张
                    </button>
                  </div>
                ) : (
                  <div className="py-6">
                    <div className="text-5xl mb-2">📸</div>
                    <p className="font-bold">上传宠物照片</p>
                    <p className="text-xs text-muted mt-1">正脸 · 双眼可见</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
                />
              </div>

              {/* 设备预览 — 真 3D 全息（金字塔 / LCD 箱）*/}
              <div className="space-y-2">
                <ProductPreview3D
                  imageUrl={photoUrl}
                  videoUrl={null}
                  productType={config.device === 'cube' ? 'holo-cube' : 'holo-pyramid'}
                  deviceColor={config.deviceColor}
                  height={300}
                />
                <div className="text-cream text-xs text-center opacity-70">
                  {DEVICES.find((d) => d.id === config.device)?.label} ·{' '}
                  {DEVICES.find((d) => d.id === config.device)?.size}
                </div>
              </div>
            </div>

            {/* 右：配置面板 */}
            <div className="space-y-5">
              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 rounded-2xl p-4 text-sm">
                  ⚠️ {error}
                </div>
              )}

              {/* 设备选择 */}
              <section>
                <h3 className="font-black text-lg mb-3 flex items-center gap-2">
                  <span className="text-2xl">🖥️</span>
                  选全息仪
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {DEVICES.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => update({ device: d.id })}
                      className={`p-4 rounded-2xl border-2 text-left flex items-center gap-3 transition ${
                        config.device === d.id
                          ? 'border-[#7B5BFF] bg-purple-50'
                          : 'border-yellow/40 bg-white hover:border-yellow'
                      }`}
                    >
                      <span className="text-3xl">{d.emoji}</span>
                      <div className="flex-1">
                        <div className="font-black">{d.label}</div>
                        <div className="text-xs text-muted">{d.desc}</div>
                      </div>
                      <div className="text-xs font-bold text-[#7B5BFF]">£{d.id === 'cube' ? 200 : 90}</div>
                    </button>
                  ))}
                </div>
              </section>

              {/* 颜色 */}
              <section>
                <h3 className="font-black text-lg mb-3 flex items-center gap-2">
                  <span className="text-2xl">🎨</span>
                  外壳颜色
                </h3>
                <div className="flex gap-2">
                  {DEVICE_COLORS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => update({ deviceColor: c.id })}
                      className={`chip flex-1 justify-center py-3 ${
                        config.deviceColor === c.id ? 'chip-active' : ''
                      }`}
                    >
                      <span
                        className="inline-block w-4 h-4 rounded-full border-2 border-brown"
                        style={{ background: c.hex }}
                      />
                      {c.label}
                      {c.id !== 'white' && (
                        <span className="text-xs text-muted">
                          +£{c.id === 'wood' ? 25 : 15}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </section>

              {/* 动作集 */}
              <section>
                <h3 className="font-black text-lg mb-3 flex items-center gap-2">
                  <span className="text-2xl">🎬</span>
                  AI 动作集
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => update({ motionSet: 'basic' })}
                    className={`p-4 rounded-2xl border-2 text-left transition ${
                      config.motionSet === 'basic'
                        ? 'border-[#7B5BFF] bg-purple-50'
                        : 'border-yellow/40 bg-white hover:border-yellow'
                    }`}
                  >
                    <div className="font-black text-base">基础</div>
                    <div className="text-2xl font-black text-[#7B5BFF]">£29</div>
                    <div className="text-xs text-muted">5 个动作</div>
                  </button>
                  <button
                    onClick={() => update({ motionSet: 'advanced' })}
                    className={`p-4 rounded-2xl border-2 text-left transition relative ${
                      config.motionSet === 'advanced'
                        ? 'border-[#7B5BFF] bg-purple-50'
                        : 'border-yellow/40 bg-white hover:border-yellow'
                    }`}
                  >
                    <div className="absolute -top-2 -right-2 bg-yellow text-brown text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-yellow-dark">
                      🔥 POPULAR
                    </div>
                    <div className="font-black text-base">高级</div>
                    <div className="text-2xl font-black text-[#7B5BFF]">£49</div>
                    <div className="text-xs text-muted">8 个动作 + 2 交互</div>
                  </button>
                </div>
                <div className="mt-3 bg-cream rounded-xl p-3 text-xs text-brown-light">
                  <div className="font-bold mb-1">📋 包含的动作：</div>
                  <div className="flex flex-wrap gap-1">
                    {motionSet.motions.map((m) => (
                      <span key={m} className="bg-white px-2 py-0.5 rounded-full">
                        {PET_MOTION_PROMPTS[m]?.emoji} {PET_MOTION_PROMPTS[m]?.label}
                      </span>
                    ))}
                  </div>
                  {'interactive' in motionSet && (
                    <>
                      <div className="font-bold mt-2 mb-1">🎤 交互动作：</div>
                      <div className="space-y-0.5">
                        {motionSet.interactive.map((i, idx) => (
                          <div key={idx}>· {i}</div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </section>

              {/* 循环时长 + 音乐 */}
              <section className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-black text-base mb-2">⏱️ 循环</h3>
                  <div className="flex flex-col gap-1">
                    {([30, 60, 120] as const).map((d) => (
                      <button
                        key={d}
                        onClick={() => update({ loopDuration: d })}
                        className={`chip justify-center py-2 ${
                          config.loopDuration === d ? 'chip-active' : ''
                        }`}
                      >
                        {d}秒
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-black text-base mb-2">🎵 背景音乐</h3>
                  <div className="flex flex-col gap-1">
                    {MUSIC.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => update({ bgMusic: m.id })}
                        className={`chip justify-start py-2 text-xs ${
                          config.bgMusic === m.id ? 'chip-active' : ''
                        }`}
                      >
                        <span>{m.emoji}</span>
                        <span>{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              {/* 音频驱动（仅 advanced） */}
              {config.motionSet === 'advanced' && (
                <section>
                  <label className="flex items-center justify-between bg-purple-50 rounded-2xl p-4 border-2 border-[#7B5BFF]/40 cursor-pointer">
                    <div>
                      <div className="font-black flex items-center gap-2">
                        🎤 音频驱动 <span className="chip text-xs">+£35</span>
                      </div>
                      <div className="text-xs text-brown-light mt-1">
                        你说话或叫它名字时，宠物会转向声源
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.sound}
                      onChange={(e) => update({ sound: e.target.checked })}
                      className="w-6 h-6 accent-[#7B5BFF]"
                    />
                  </label>
                </section>
              )}

              {/* 定制刻字 */}
              <section>
                <h3 className="font-black text-base mb-2 flex items-center gap-2">
                  ✍️ 设备外壳刻字 <span className="text-xs text-muted">（选填 · £10）</span>
                </h3>
                <input
                  type="text"
                  value={config.customEngraving}
                  onChange={(e) => update({ customEngraving: e.target.value.slice(0, 20) })}
                  placeholder="例：In memory of 小豆 · 2012-2026"
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-yellow focus:border-yellow-dark outline-none bg-white"
                />
              </section>

              {/* 加急 */}
              <section>
                <label className="flex items-center justify-between bg-cream rounded-2xl p-4 border-2 border-yellow cursor-pointer">
                  <div>
                    <div className="font-black flex items-center gap-2">
                      ⚡ 7-10 天加急 <span className="chip text-xs">+£35</span>
                    </div>
                    <div className="text-xs text-brown-light mt-1">
                      标准交付 14-21 天 · 加急节省一半时间
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.rushDelivery}
                    onChange={(e) => update({ rushDelivery: e.target.checked })}
                    className="w-6 h-6 accent-yellow-dark"
                  />
                </label>
              </section>

              {/* 价格 + CTA */}
              <div className="bg-white rounded-2xl p-5 border-2 border-[#7B5BFF] mt-6">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-sm text-muted">总价</span>
                  <span className="text-3xl font-black text-[#7B5BFF]">
                    £{price.total}
                  </span>
                </div>
                <div className="text-xs text-brown-light mb-3 leading-relaxed">
                  <div>✓ 设备 + AI 复活视频预装</div>
                  <div>✓ MP4 + GIF 双格式备份</div>
                  <div>✓ 不满意免费重做 1 次</div>
                  <div>✓ USB-C 充电线 + 中英文说明书</div>
                  <div>✓ 欧洲 7-14 天配送</div>
                </div>
                <button
                  onClick={generate}
                  disabled={!photoUrl}
                  className="w-full py-4 rounded-2xl bg-[#7B5BFF] text-white font-black text-base border-2 border-[#5B3BFF] hover:bg-[#5B3BFF] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  🌀 生成 3D 投影 · 立即下单
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ════════ Step 2: 生成中 ════════ */}
        {step === 'generating' && (
          <div className="bg-white rounded-3xl border-[3px] border-dashed border-[#7B5BFF] p-12 text-center">
            <div className="text-7xl mb-6" style={{ animation: 'spin 3s linear infinite' }}>
              🌀
            </div>
            <h2 className="text-2xl font-black mb-2">正在生成 3D 全息内容...</h2>
            <p className="text-sm text-brown-light mb-6">
              Kling AI 正在分析照片 · 生成 8 个动作 + 2 个交互模式 · 通常 1-3 分钟
            </p>
            <div className="max-w-md mx-auto">
              <div className="bg-cream rounded-full h-4 overflow-hidden mb-2">
                <div
                  className="bg-[#7B5BFF] h-full transition-all duration-500 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-sm text-muted">{progress}%</div>
            </div>
          </div>
        )}

        {/* ════════ Step 3: 结果 ════════ */}
        {step === 'result' && task?.videoUrl && (
          <div className="bg-white rounded-3xl border-[3px] border-dashed border-[#7B5BFF] p-8 md:p-12">
            <div className="text-center mb-6">
              <div className="text-5xl mb-2">🎉</div>
              <h2 className="text-2xl md:text-3xl font-black mb-2">3D 全息内容生成成功！</h2>
              <p className="text-sm text-brown-light">预装到全息仪后，它就在你桌面上 3D 浮动了</p>
            </div>

            <div className="max-w-2xl mx-auto">
              <ProductPreview3D
                imageUrl={photoUrl}
                videoUrl={task.videoUrl}
                productType={config.device === 'cube' ? 'holo-cube' : 'holo-pyramid'}
                deviceColor={config.deviceColor}
                height={420}
              />
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm font-bold text-brown-light hover:text-brown">
                  ▶ 查看原视频（平面预览）
                </summary>
                <video
                  src={task.videoUrl}
                  controls
                  autoPlay
                  loop
                  className="w-full mt-3 rounded-2xl border-2 border-[#7B5BFF]/40 shadow-soft"
                />
              </details>
            </div>

            <div className="flex flex-wrap gap-3 justify-center mt-6">
              <a href={task.videoUrl} download className="btn-paw">
                📥 下载 MP4
              </a>
              <button className="btn-ghost">🔗 复制分享</button>
              <button
                onClick={() => {
                  setStep('configure');
                  setTask(null);
                }}
                className="btn-ghost"
              >
                🌀 再做一个
              </button>
            </div>

            <div className="mt-6 bg-purple-50 rounded-2xl p-5 max-w-2xl mx-auto border-2 border-[#7B5BFF]/30">
              <div className="text-sm">
                <div className="font-black mb-2 text-[#7B5BFF]">📦 下一步 · 实物制作</div>
                <ul className="space-y-1 text-brown-light">
                  <li>· 工艺师确认视频 → 预装到全息仪（3-5 天）</li>
                  <li>· 整机测试 → 包装 → 发货（7-14 天）</li>
                  <li>· 你收到后插电即用，桌面上就是悬浮的它</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}