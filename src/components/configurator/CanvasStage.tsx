'use client';

import { useState, useEffect } from 'react';
import { Stage, Layer, Image as KImage, Rect, Text, Circle, Group } from 'react-konva';
import useImage from 'use-image';

interface CanvasStageProps {
  photoUrl: string | null;
  background: string;
  pose: 'sitting' | 'standing' | 'lying' | 'playful';
  woolPalette: string[];
  accentColor: string;
  petName: string;
  onUploadClick: () => void;
  isProcessing: boolean;
  isDragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
}

export function CanvasStage(props: CanvasStageProps) {
  const {
    photoUrl, background, pose, woolPalette, accentColor, petName,
    onUploadClick, isProcessing, isDragging, onDragOver, onDragLeave, onDrop,
  } = props;
  const [size, setSize] = useState({ w: 800, h: 600 });

  useEffect(() => {
    const update = () => {
      const parent = document.getElementById('canvas-wrap-inner');
      if (parent) setSize({ w: parent.clientWidth, h: parent.clientHeight });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const [photo] = useImage(photoUrl || '');

  // 宠物轮廓占位（用羊毛毡风格的简化形状）
  // 真实部署：用 remove.bg 抠图后渲染；MVP 用 emoji 占位
  return (
    <div
      id="canvas-wrap-inner"
      className="w-full h-full relative"
      style={{ background, minHeight: 500 }}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {/* ── Konva Stage ── */}
      <Stage width={size.w} height={size.h}>
        <Layer>
          {/* 背景渐变已通过 div 实现 */}

          {/* 场景装饰（按 pose 显示不同） */}
          {pose === 'sitting' && (
            <Group>
              {/* 地面/地毯 */}
              <Rect x={size.w * 0.1} y={size.h * 0.7} width={size.w * 0.8} height={20} fill={woolPalette[1] || '#8B5E3C'} cornerRadius={10} opacity={0.5} />
            </Group>
          )}

          {pose === 'lying' && (
            <Group>
              <Rect x={size.w * 0.15} y={size.h * 0.65} width={size.w * 0.7} height={50} fill={woolPalette[1] || '#8B5E3C'} cornerRadius={25} opacity={0.4} />
            </Group>
          )}

          {/* 宠物轮廓 - 简化版（MVP 用圆形+emoji） */}
          <Group x={size.w / 2} y={size.h * 0.45}>
            {photoUrl && photo ? (
              // 真实部署：用 remove.bg 抠图后的透明 PNG
              <KImage
                image={photo}
                x={-150} y={-150}
                width={300} height={300}
                cornerRadius={20}
              />
            ) : (
              // MVP 占位：羊毛毡风格的圆形 + emoji
              <Group>
                {/* 身体（按 pose 变形） */}
                {pose === 'sitting' && (
                  <>
                    <Circle radius={80} y={20} fill={woolPalette[0]} />
                    <Circle radius={50} y={-60} fill={woolPalette[0]} />
                    {/* 项圈 */}
                    <Circle radius={52} y={-50} stroke={accentColor} strokeWidth={8} />
                  </>
                )}
                {pose === 'standing' && (
                  <>
                    <Rect x={-40} y={-50} width={80} height={120} fill={woolPalette[0]} cornerRadius={40} />
                    <Circle radius={45} y={-70} fill={woolPalette[0]} />
                    <Circle radius={47} y={-62} stroke={accentColor} strokeWidth={8} />
                  </>
                )}
                {pose === 'lying' && (
                  <>
                    <Rect x={-100} y={-30} width={200} height={70} fill={woolPalette[0]} cornerRadius={35} />
                    <Circle radius={45} x={-110} y={-30} fill={woolPalette[0]} />
                    <Circle radius={47} x={-110} y={-22} stroke={accentColor} strokeWidth={8} />
                  </>
                )}
                {pose === 'playful' && (
                  <>
                    <Circle radius={60} y={10} fill={woolPalette[0]} />
                    <Circle radius={45} y={-60} fill={woolPalette[0]} rotation={15} />
                    <Circle radius={47} y={-50} stroke={accentColor} strokeWidth={8} />
                  </>
                )}

                {/* "上传照片"占位文字 */}
                {!photoUrl && (
                  <Text
                    text="🐾"
                    fontSize={60}
                    fill="white"
                    x={-30} y={-30}
                    opacity={0.8}
                  />
                )}
              </Group>
            )}
          </Group>

          {/* 宠物名字 */}
          {petName && (
            <Text
              text={`★ ${petName} ★`}
              fontSize={28}
              fontStyle="bold"
              fill="#5C3D2E"
              x={size.w / 2 - 80}
              y={size.h * 0.78}
              width={160}
              align="center"
              fontFamily="Caveat, cursive"
            />
          )}

          {/* 羊毛毡质感噪点（装饰） */}
          <Group opacity={0.15}>
            {Array.from({ length: 30 }).map((_, i) => (
              <Circle
                key={i}
                x={Math.random() * size.w}
                y={Math.random() * size.h}
                radius={Math.random() * 3 + 1}
                fill={woolPalette[Math.floor(Math.random() * woolPalette.length)]}
              />
            ))}
          </Group>
        </Layer>
      </Stage>

      {/* ── Overlay UI ── */}
      {!photoUrl && !isProcessing && (
        <div
          className={`absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm transition ${
            isDragging ? 'bg-yellow/40' : ''
          }`}
        >
          <div className="bg-white rounded-3xl p-8 max-w-sm mx-4 border-[3px] border-dashed border-yellow-dark text-center">
            <div className="text-6xl mb-4">📸</div>
            <h3 className="text-xl font-black mb-2">上传一张正脸照</h3>
            <p className="text-sm text-brown-light mb-4">
              建议正面 · 双眼可见 · 背景简洁<br />
              AI 会自动提取轮廓生成 3D 预览
            </p>
            <button onClick={onUploadClick} className="btn-paw w-full justify-center">
              选择照片
            </button>
            <p className="text-xs text-muted mt-3">或拖拽图片到这里 ↓</p>
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 flex items-center gap-3">
            <div className="w-8 h-8 border-4 border-yellow border-t-yellow-dark rounded-full animate-spin" />
            <span className="font-bold">AI 处理中…</span>
          </div>
        </div>
      )}

      {/* ── Top right controls ── */}
      {photoUrl && (
        <div className="absolute top-4 right-4 flex gap-2">
          <button onClick={onUploadClick} className="btn-ghost text-xs">
            🔄 换张照
          </button>
        </div>
      )}

      {/* ── Bottom hint ── */}
      <div className="absolute bottom-4 left-4 text-xs text-brown/70 bg-white/80 rounded-full px-3 py-1.5">
        🎨 实时预览 · 右边调整立即生效
      </div>
    </div>
  );
}