'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useConfigurator } from '@/lib/store/configurator';
import { PET_MOTION_PROMPTS, type KlingTask } from '@/lib/kling/types';

type Step = 'upload' | 'configure' | 'generating' | 'result';

export default function VirtualPetPage() {
  const config = useConfigurator((s) => s.aiArt);
  const update = useConfigurator((s) => s.updateAIArt);
  const setPetPhoto = useConfigurator((s) => s.setPetPhoto);

  const [step, setStep] = useState<Step>('upload');
  const [photoUrl, setPhotoUrl] = useState<string | null>(config.petPhotoUrl);
  const [motionKey, setMotionKey] = useState<keyof typeof PET_MOTION_PROMPTS>('gentle_blink');
  const [customPrompt, setCustomPrompt] = useState('');
  const [duration, setDuration] = useState<5 | 10>(5);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');

  const [task, setTask] = useState<KlingTask | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  const prompt = motionKey === 'custom'
    ? customPrompt
    : PET_MOTION_PROMPTS[motionKey].prompt;

  // 上传
  const handleUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('只支持图片文件');
      return;
    }
    const url = URL.createObjectURL(file);
    setPhotoUrl(url);
    setPetPhoto(url);
    setStep('configure');
    setError(null);
  };

  // 提交生成
  const generate = async () => {
    if (!photoUrl) return;
    setStep('generating');
    setError(null);
    setProgress(0);
    try {
      const r = await fetch('/api/kling/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: photoUrl,
          prompt,
          motionMode: 'expressive',
          duration,
          aspectRatio,
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

  // 轮询任务状态
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
            if (pollRef.current) clearInterval(pollRef.current);
          } else if (data.task.status === 'failed') {
            setError(data.task.errorMessage || '生成失败');
            setStep('configure');
            if (pollRef.current) clearInterval(pollRef.current);
          }
        }
      } catch {
        // 网络错误继续轮询
      }
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  return (
    <main className="bg-cream min-h-screen">
      {/* ── Top bar ── */}
      <div className="border-b-[3px] border-dashed border-yellow/60 bg-cream px-6 md:px-10 py-3 flex items-center gap-2 text-sm">
        <Link href="/" className="text-muted hover:text-brown">首页</Link>
        <span className="text-muted">/</span>
        <span className="font-bold">✨ 虚拟宠物复活</span>
        <span className="ml-auto chip text-xs">⚡ Kling AI 驱动</span>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-10 py-10">
        {/* ── Title ── */}
        <div className="text-center mb-10">
          <div className="inline-block bg-yellow text-brown text-xs font-black px-3 py-1 rounded-full border-2 border-yellow-dark mb-3">
            ✨ 复活服务 · Kling AI 驱动
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3">
            让它的眼睛<span className="doodle-font text-yellow-dark text-5xl md:text-7xl not-italic">再动一次</span>
          </h1>
          <p className="text-brown-light text-base max-w-xl mx-auto">
            上传一张正脸照 · AI 生成 5-10 秒动态视频 · 眨眼转头像真的一样
          </p>
        </div>

        {/* ════════ Step 1: 上传 ════════ */}
        {step === 'upload' && (
          <div
            className="bg-white rounded-3xl border-[3px] border-dashed border-yellow-dark p-12 text-center cursor-pointer hover:border-yellow transition"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const f = e.dataTransfer.files[0];
              if (f) handleUpload(f);
            }}
          >
            <div className="text-7xl mb-4">📸</div>
            <h2 className="text-2xl font-black mb-2">上传一张正脸照</h2>
            <p className="text-sm text-brown-light mb-6 max-w-md mx-auto">
              建议正面 · 双眼可见 · 背景简洁<br />
              AI 会保留神态，只生成自然动作
            </p>
            <button className="btn-paw text-base py-3">选择照片</button>
            <p className="text-xs text-muted mt-3">或拖拽图片到这里</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
            />
          </div>
        )}

        {/* ════════ Step 2: 配置动作 ════════ */}
        {step === 'configure' && photoUrl && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* 左侧：照片预览 */}
            <div className="canvas-wrap sticky top-24 self-start">
              <img src={photoUrl} alt="Pet" className="w-full h-auto rounded-3xl" />
              <button
                onClick={() => {
                  setPhotoUrl(null);
                  setStep('upload');
                }}
                className="absolute top-4 right-4 btn-ghost text-xs"
              >
                🔄 换张照
              </button>
            </div>

            {/* 右侧：配置 */}
            <div className="space-y-5">
              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 rounded-2xl p-4 text-sm">
                  ⚠️ {error}
                </div>
              )}

              {/* 动作模板 */}
              <section>
                <h3 className="font-black text-lg mb-3 flex items-center gap-2">
                  <span className="text-2xl">🎬</span>
                  选个动作
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(PET_MOTION_PROMPTS) as Array<keyof typeof PET_MOTION_PROMPTS>).map((k) => {
                    const m = PET_MOTION_PROMPTS[k];
                    return (
                      <button
                        key={k}
                        onClick={() => setMotionKey(k)}
                        className={`chip justify-start py-3 ${motionKey === k ? 'chip-active' : ''}`}
                      >
                        <span className="text-lg">{m.emoji}</span>
                        <span>{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* 自定义 prompt */}
              {motionKey === 'custom' && (
                <section>
                  <label className="block font-black text-base mb-2">
                    ✏️ 描述你想要的画面
                  </label>
                  <textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="例如：宠物在阳光下午睡，醒来伸懒腰，眨眨眼看向镜头..."
                    className="w-full px-4 py-3 rounded-2xl border-2 border-yellow focus:border-yellow-dark outline-none bg-white resize-none"
                    rows={3}
                    maxLength={200}
                  />
                  <div className="text-xs text-muted mt-1 text-right">
                    {customPrompt.length}/200
                  </div>
                </section>
              )}

              {/* 时长 + 比例 */}
              <section className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-black text-base mb-2">⏱️ 时长</h3>
                  <div className="flex gap-2">
                    {([5, 10] as const).map((d) => (
                      <button
                        key={d}
                        onClick={() => setDuration(d)}
                        className={`chip flex-1 justify-center py-2.5 ${duration === d ? 'chip-active' : ''}`}
                      >
                        {d}秒
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-black text-base mb-2">📐 比例</h3>
                  <div className="flex gap-2">
                    {(['16:9', '9:16', '1:1'] as const).map((r) => (
                      <button
                        key={r}
                        onClick={() => setAspectRatio(r)}
                        className={`chip flex-1 justify-center py-2.5 ${aspectRatio === r ? 'chip-active' : ''}`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              {/* 价格 + CTA */}
              <div className="bg-white rounded-2xl p-5 border-2 border-yellow-dark mt-6">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-sm text-muted">生成费用</span>
                  <span className="text-2xl font-black text-brown">
                    £{(duration === 5 ? 29 : 49)}
                  </span>
                </div>
                <div className="text-xs text-muted mb-3">
                  ✓ 不满意免费重做 1 次 · ✓ MP4 + GIF 双格式 · ✓ 商用授权
                </div>
                <button
                  onClick={generate}
                  disabled={!prompt || (motionKey === 'custom' && !customPrompt.trim())}
                  className="btn-paw w-full justify-center text-base py-4"
                >
                  ✨ 开始复活 · 立即生成
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ════════ Step 3: 生成中 ════════ */}
        {step === 'generating' && (
          <div className="bg-white rounded-3xl border-[3px] border-dashed border-yellow p-12 text-center">
            <div className="text-7xl mb-6 float-anim">✨</div>
            <h2 className="text-2xl font-black mb-2">AI 正在复活...</h2>
            <p className="text-sm text-brown-light mb-6">
              Kling 正在分析照片 · 生成自然动作 · 通常 1-3 分钟
            </p>

            {/* 进度条 */}
            <div className="max-w-md mx-auto">
              <div className="bg-cream rounded-full h-4 overflow-hidden mb-2">
                <div
                  className="bg-yellow-dark h-full transition-all duration-500 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-sm text-muted">{progress}%</div>
            </div>

            <div className="text-xs text-muted mt-6">
              💡 你可以保留此页面，生成完成会自动跳转
            </div>
          </div>
        )}

        {/* ════════ Step 4: 结果 ════════ */}
        {step === 'result' && task?.videoUrl && (
          <div className="bg-white rounded-3xl border-[3px] border-dashed border-yellow-dark p-8 md:p-12">
            <div className="text-center mb-6">
              <div className="text-5xl mb-2">🎉</div>
              <h2 className="text-2xl md:text-3xl font-black mb-2">复活成功！</h2>
              <p className="text-sm text-brown-light">AI 生成的视频已就绪 · 下载或分享给家人朋友</p>
            </div>

            <video
              src={task.videoUrl}
              controls
              autoPlay
              loop
              className="w-full max-w-2xl mx-auto rounded-2xl border-2 border-yellow shadow-soft"
            />

            <div className="flex flex-wrap gap-3 justify-center mt-6">
              <a
                href={task.videoUrl}
                download={`pawtique-${config.petName || 'pet'}-${Date.now()}.mp4`}
                className="btn-paw"
              >
                📥 下载 MP4
              </a>
              <button className="btn-ghost">🔗 复制分享链接</button>
              <Link href="/configure/video" className="btn-ghost">
                🎬 升级为悼念视频
              </Link>
              <button
                onClick={() => {
                  setStep('configure');
                  setTask(null);
                }}
                className="btn-ghost"
              >
                ✨ 再做一个
              </button>
            </div>

            <div className="mt-6 bg-cream rounded-2xl p-4 max-w-2xl mx-auto">
              <div className="text-sm">
                <div className="font-black mb-2">💝 下一步建议</div>
                <ul className="space-y-1 text-brown-light">
                  <li>• 升级为「悼念视频 + USB 木盒」—— 把这段视频做成实体礼盒寄给家人</li>
                  <li>• 配合「羊毛毡肖像」—— 实物 + 动态影像双重纪念</li>
                  <li>• 下载后可发到家族群 · 朋友圈 · TikTok</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}