'use client';

/**
 * ProductPreview3D — 通用 3D 产品预览
 *
 * 支持产品类型（productType）：
 *   全息类:  holo-pyramid（金字塔）, holo-cube（LCD 箱）
 *   服饰类:  pillow（抱枕）, tshirt（T 恤）, hat（帽子）, tote（帆布袋）
 *   艺术类:  painting（手绘画框）, sandstone（砂岩画板）
 *   配件类:  phone-case（手机壳）, pendant（吊坠）
 *   其他:    urn（陶瓷罐）, figurine（3D 雕塑占位）
 *
 *  - imageUrl（照片）或 videoUrl（视频）作为纹理源
 *   - photo 优先喂到面向用户的"主面"
 *   - 没有则用紫渐变 + 🌀 占位
 *  - OrbitControls + auto-rotate
 *  - 客户端 only（动态 import）
 */

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

export type ProductType =
  | 'holo-pyramid'
  | 'holo-cube'
  | 'pillow'
  | 'tshirt'
  | 'hat'
  | 'tote'
  | 'painting'
  | 'sandstone'
  | 'phone-case'
  | 'pendant'
  | 'urn'
  | 'figurine';

interface Props {
  imageUrl: string | null;
  videoUrl?: string | null;
  productType: ProductType;
  /** Holo 设备颜色 */
  deviceColor?: 'white' | 'black' | 'wood';
  /** 画框/家具颜色 */
  frameColor?: string;
  /** T 恤/抱枕/帽子底色 */
  fabricColor?: string;
  height?: number;
  autoRotate?: boolean;
  interactive?: boolean;
}

/** 产品类型 → 友好徽章文案 + emoji */
export const PRODUCT_META: Record<ProductType, { label: string; emoji: string }> = {
  'holo-pyramid': { label: '金字塔全息',  emoji: '🔺' },
  'holo-cube':    { label: 'LCD 全息',    emoji: '📺' },
  'pillow':       { label: '抱枕',        emoji: '🛏️' },
  'tshirt':       { label: 'T 恤 / 卫衣', emoji: '👕' },
  'hat':          { label: '帽子',        emoji: '🧢' },
  'tote':         { label: '帆布袋',      emoji: '👜' },
  'painting':     { label: '手绘画框',    emoji: '🖼️' },
  'sandstone':    { label: '砂岩画板',    emoji: '🪨' },
  'phone-case':   { label: '手机壳',      emoji: '📱' },
  'pendant':      { label: '树脂吊坠',    emoji: '💎' },
  'urn':          { label: '陶瓷 Urn',    emoji: '🏺' },
  'figurine':     { label: '3D 雕塑',     emoji: '🗿' },
};

// ═══════════════════════════ texture hook ═══════════════════════════
/** 同步创建 CanvasTexture，videoUrl 优先 → 动态绘制。返回非 null。 */
function useProductTexture(imageUrl: string | null, videoUrl: string | null): THREE.CanvasTexture {
  const { canvas, ctx, texture } = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 512;
    const cx = c.getContext('2d');
    if (!cx) throw new Error('Canvas 2D context unavailable');
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.minFilter = THREE.LinearFilter;
    t.magFilter = THREE.LinearFilter;
    return { canvas: c, ctx: cx, texture: t };
  }, []);

  useEffect(() => () => texture.dispose(), [texture]);

  useEffect(() => {
    let raf = 0;
    let disposed = false;

    const drawCover = (src: CanvasImageSource, w: number, h: number) => {
      const scale = Math.max(canvas.width / w, canvas.height / h);
      const dw = w * scale;
      const dh = h * scale;
      const dx = (canvas.width - dw) / 2;
      const dy = (canvas.height - dh) / 2;
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(src, dx, dy, dw, dh);
      texture.needsUpdate = true;
    };

    const drawFallback = (label: string, emoji: string) => {
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, '#2A1F4D');
      grad.addColorStop(1, '#7B5BFF');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = 'bold 56px system-ui, sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(label, canvas.width / 2, 60);
      ctx.font = '180px serif';
      ctx.textBaseline = 'middle';
      ctx.fillText(emoji, canvas.width / 2, canvas.height / 2 + 30);
      texture.needsUpdate = true;
    };

    const cleanup: Array<() => void> = [];

    if (videoUrl) {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.src = videoUrl;
      video.play().catch(() => {});
      const tick = () => {
        if (disposed) return;
        if (video.readyState >= 2 && video.videoWidth > 0) {
          drawCover(video, video.videoWidth, video.videoHeight);
        }
        raf = requestAnimationFrame(tick);
      };
      tick();
      cleanup.push(() => {
        video.pause();
        video.removeAttribute('src');
        video.load();
      });
    } else if (imageUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageUrl;
      img.onload = () => {
        if (!disposed && img.naturalWidth > 0) {
          drawCover(img, img.naturalWidth, img.naturalHeight);
        }
      };
      cleanup.push(() => {
        img.onload = null;
      });
    } else {
      drawFallback('上传照片后预览', '📸');
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      cleanup.forEach((fn) => fn());
    };
  }, [canvas, ctx, texture, imageUrl, videoUrl]);

  return texture;
}

// ═══════════════════════════ helpers ═══════════════════════════
function colorOf(c: string): THREE.Color {
  return new THREE.Color(c);
}

function deviceHex(c: 'white' | 'black' | 'wood'): string {
  if (c === 'black') return '#1a1a1a';
  if (c === 'wood') return '#C8A878';
  return '#F4F1EA';
}

// ═══════════════════════════ mesh components ═══════════════════════════

/** 金字塔全息：4 边锥 + 紫色描边 + 顶点光球 */
function HoloPyramidMesh({ texture }: { texture: THREE.CanvasTexture }) {
  const groupRef = useRef<THREE.Group>(null);
  const geometry = useMemo(() => new THREE.ConeGeometry(0.85, 1.4, 4, 1, true), []);
  const edges = useMemo(() => new THREE.EdgesGeometry(geometry, 1), [geometry]);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.35;
  });

  return (
    <group ref={groupRef} position={[0, 0.1, 0]}>
      <mesh geometry={geometry}>
        <meshBasicMaterial
          map={texture} transparent opacity={0.85}
          side={THREE.DoubleSide} blending={THREE.AdditiveBlending}
          depthWrite={false} toneMapped={false}
        />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color="#7B5BFF" transparent opacity={0.85} toneMapped={false} />
      </lineSegments>
      <mesh position={[0, 0.71, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color="#FFD84D" toneMapped={false} />
      </mesh>
    </group>
  );
}

/** LCD 全息箱：屏幕显示照片，Y 轴轻微摆动 */
function HoloCubeMesh({ texture, color }: { texture: THREE.CanvasTexture; color: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const screenGeo = useMemo(() => new THREE.PlaneGeometry(1.65, 0.95), []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.2 - 0.08;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.35) * 0.03;
    }
  });

  const baseHex = colorOf(color);
  return (
    <group ref={groupRef}>
      <mesh>
        <boxGeometry args={[1.8, 1.1, 0.2]} />
        <meshStandardMaterial color={baseHex} roughness={0.4} metalness={0.25} />
      </mesh>
      <mesh geometry={screenGeo} position={[0, 0, 0.101]}>
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      <mesh geometry={screenGeo} position={[0, 0, 0.102]}>
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.07}
          blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <lineSegments position={[0, 0, 0.103]}>
        <edgesGeometry args={[screenGeo]} />
        <lineBasicMaterial color="#7B5BFF" transparent opacity={0.65} toneMapped={false} />
      </lineSegments>
      <mesh position={[0.78, -0.42, 0.104]}>
        <circleGeometry args={[0.025, 16]} />
        <meshBasicMaterial color="#00FF88" toneMapped={false} />
      </mesh>
      <pointLight position={[0.78, -0.42, 0.2]} intensity={0.3} color="#00FF88" distance={0.4} />
      <mesh position={[0, -0.62, 0]}>
        <boxGeometry args={[1.0, 0.1, 0.5]} />
        <meshStandardMaterial color={baseHex} roughness={0.7} metalness={0.1} />
      </mesh>
    </group>
  );
}

/** 抱枕 — 压扁球体当作软枕 */
function PillowMesh({ texture }: { texture: THREE.CanvasTexture }) {
  const groupRef = useRef<THREE.Group>(null);
  const geo = useMemo(() => {
    const g = new THREE.SphereGeometry(1, 32, 20);
    g.scale(1.4, 0.95, 0.45);
    return g;
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.25;
  });

  return (
    <group ref={groupRef}>
      <mesh geometry={geo}>
        <meshStandardMaterial map={texture} roughness={0.92} metalness={0} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/** T 恤 — body + 两袖 + 衣领 */
function TShirtMesh({
  texture, fabricColor = '#F4F1EA',
}: { texture: THREE.CanvasTexture; fabricColor?: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.3;
  });

  const fabric = colorOf(fabricColor);

  return (
    <group ref={groupRef}>
      {/* 主体 */}
      <mesh>
        <boxGeometry args={[1.0, 1.4, 0.12]} />
        <meshStandardMaterial color={fabric} roughness={0.85} metalness={0} />
      </mesh>
      {/* 胸口贴图 */}
      <mesh position={[0, 0.15, 0.062]}>
        <planeGeometry args={[0.5, 0.5]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      {/* 胸口贴图外圈描边 */}
      <lineSegments position={[0, 0.15, 0.063]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(0.5, 0.5)]} />
        <lineBasicMaterial color="#5C3D2E" transparent opacity={0.4} toneMapped={false} />
      </lineSegments>
      {/* 左袖 */}
      <mesh position={[-0.62, 0.4, 0]} rotation={[0, 0, 0.4]}>
        <boxGeometry args={[0.45, 0.55, 0.12]} />
        <meshStandardMaterial color={fabric} roughness={0.85} metalness={0} />
      </mesh>
      {/* 右袖 */}
      <mesh position={[0.62, 0.4, 0]} rotation={[0, 0, -0.4]}>
        <boxGeometry args={[0.45, 0.55, 0.12]} />
        <meshStandardMaterial color={fabric} roughness={0.85} metalness={0} />
      </mesh>
      {/* 衣领 */}
      <mesh position={[0, 0.72, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.15, 0.04, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#3A2A1A" roughness={0.7} />
      </mesh>
    </group>
  );
}

/** 帽子 — 圆柱帽身 + 帽檐 */
function HatMesh({
  texture, fabricColor = '#2A4A6A',
}: { texture: THREE.CanvasTexture; fabricColor?: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.3;
  });

  const fabric = colorOf(fabricColor);

  return (
    <group ref={groupRef}>
      {/* 帽身 */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.5, 0.55, 0.5, 24, 1, true]} />
        <meshStandardMaterial color={fabric} roughness={0.85} metalness={0} side={THREE.DoubleSide} />
      </mesh>
      {/* 帽顶 */}
      <mesh position={[0, 0.45, 0]}>
        <sphereGeometry args={[0.5, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={fabric} roughness={0.85} metalness={0} />
      </mesh>
      {/* 帽檐 */}
      <mesh position={[0, -0.05, 0.25]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.85, 0.85, 0.04, 32, 1, false]} />
        <meshStandardMaterial color={fabric} roughness={0.85} metalness={0} />
      </mesh>
      {/* 正面 logo/照片（圆柱前部贴图） */}
      <mesh position={[0, 0.2, 0.5]}>
        <planeGeometry args={[0.4, 0.25]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** 帆布袋 — box + 提手 */
function ToteMesh({
  texture, fabricColor = '#E8DCC0',
}: { texture: THREE.CanvasTexture; fabricColor?: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.3;
  });

  const fabric = colorOf(fabricColor);

  return (
    <group ref={groupRef}>
      {/* 袋身 */}
      <mesh>
        <boxGeometry args={[1.0, 1.1, 0.15]} />
        <meshStandardMaterial color={fabric} roughness={0.95} metalness={0} />
      </mesh>
      {/* 正面贴图 */}
      <mesh position={[0, -0.05, 0.076]}>
        <planeGeometry args={[0.7, 0.7]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      {/* 提手 — 用 torus 半圈 */}
      <mesh position={[0, 0.6, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.3, 0.025, 8, 32, Math.PI]} />
        <meshStandardMaterial color={fabric} roughness={0.9} metalness={0} />
      </mesh>
      <mesh position={[0, 0.6, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.3, 0.025, 8, 32, Math.PI]} />
        <meshStandardMaterial color={fabric} roughness={0.9} metalness={0} />
      </mesh>
    </group>
  );
}

/** 手绘画框 — 木质边框 + 画布（照片） */
function PaintingMesh({
  texture, frameColor = '#8B5E3C',
}: { texture: THREE.CanvasTexture; frameColor?: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.2;
  });

  const frame = colorOf(frameColor);
  const W = 1.7, H = 1.25, D = 0.08, T = 0.13;

  return (
    <group ref={groupRef}>
      {/* 画布底板 */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[W, H, 0.04]} />
        <meshStandardMaterial color="#F8F4E8" roughness={0.95} />
      </mesh>
      {/* 照片贴图 */}
      <mesh position={[0, 0, 0.022]}>
        <planeGeometry args={[W - T * 2, H - T * 2]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      {/* 上框 */}
      <mesh position={[0, H / 2 - T / 2, D / 2]}>
        <boxGeometry args={[W + T * 2, T, D]} />
        <meshStandardMaterial color={frame} roughness={0.5} metalness={0.05} />
      </mesh>
      {/* 下框 */}
      <mesh position={[0, -H / 2 + T / 2, D / 2]}>
        <boxGeometry args={[W + T * 2, T, D]} />
        <meshStandardMaterial color={frame} roughness={0.5} metalness={0.05} />
      </mesh>
      {/* 左框 */}
      <mesh position={[-W / 2 + T / 2, 0, D / 2]}>
        <boxGeometry args={[T, H, D]} />
        <meshStandardMaterial color={frame} roughness={0.5} metalness={0.05} />
      </mesh>
      {/* 右框 */}
      <mesh position={[W / 2 - T / 2, 0, D / 2]}>
        <boxGeometry args={[T, H, D]} />
        <meshStandardMaterial color={frame} roughness={0.5} metalness={0.05} />
      </mesh>
    </group>
  );
}

/** 砂岩画板 — 厚板 + 砂岩纹理 + 照片 */
function SandstoneMesh({ texture }: { texture: THREE.CanvasTexture }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.2;
  });

  const W = 1.8, H = 1.3, D = 0.18;

  return (
    <group ref={groupRef}>
      {/* 砂岩厚板 */}
      <mesh>
        <boxGeometry args={[W, H, D]} />
        <meshStandardMaterial color="#C9B591" roughness={0.95} metalness={0} bumpScale={0.05} />
      </mesh>
      {/* 表面贴图（轻微凹陷感） */}
      <mesh position={[0, 0, D / 2 + 0.001]}>
        <planeGeometry args={[W * 0.85, H * 0.85]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.9}
          metalness={0}
          polygonOffset polygonOffsetFactor={-1} polygonOffsetUnits={-1}
        />
      </mesh>
      {/* 描边 */}
      <lineSegments position={[0, 0, D / 2 + 0.002]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(W * 0.85, H * 0.85)]} />
        <lineBasicMaterial color="#8B6F47" transparent opacity={0.4} toneMapped={false} />
      </lineSegments>
    </group>
  );
}

/** 手机壳 — 黑色外壳 + 正面贴图 + 摄像头凸起 */
function PhoneCaseMesh({ texture }: { texture: THREE.CanvasTexture }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.25;
  });

  // 轻微 Y 轴抳斜起始，避免手机完全正对相机看不到立体感
  return (
    <group ref={groupRef} rotation={[0, -0.25, 0]}>
      {/* 手机壳主体 */}
      <mesh>
        <boxGeometry args={[0.75, 1.5, 0.1]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.4} />
      </mesh>
      {/* 正面贴图（面向相机，旋转中始终可见） */}
      <mesh position={[0, 0, 0.051]}>
        <planeGeometry args={[0.65, 1.4]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      {/* 背面贴图（另一面也能看到照片） */}
      <mesh position={[0, 0, -0.051]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[0.65, 1.4]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      {/* 摄像头模块 */}
      <mesh position={[-0.22, 0.58, -0.06]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.025, 16]} />
        <meshStandardMaterial color="#0A0A0A" roughness={0.2} metalness={0.7} />
      </mesh>
      <mesh position={[-0.22, 0.58, -0.075]}>
        <circleGeometry args={[0.04, 16]} />
        <meshBasicMaterial color="#1F2A4A" toneMapped={false} />
      </mesh>
      <mesh position={[-0.10, 0.58, -0.075]}>
        <circleGeometry args={[0.03, 16]} />
        <meshBasicMaterial color="#1F2A4A" toneMapped={false} />
      </mesh>
    </group>
  );
}

/** 树脂吊坠 — 圆盘 + 嵌入照片 + 边框 + 项链 */
function PendantMesh({ texture }: { texture: THREE.CanvasTexture }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.4;
  });

  return (
    <group ref={groupRef}>
      {/* 项链 */}
      <mesh position={[0, 0.7, 0]}>
        <torusGeometry args={[0.6, 0.015, 8, 32, Math.PI]} />
        <meshStandardMaterial color="#C0C0C0" roughness={0.2} metalness={0.9} />
      </mesh>
      {/* 吊坠圆环 */}
      <mesh position={[0, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.35, 0.04, 12, 32]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.3} metalness={0.85} />
      </mesh>
      {/* 嵌入照片（略内陷） */}
      <mesh position={[0, 0.08, 0]}>
        <circleGeometry args={[0.31, 32]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      {/* 玻璃反光层 */}
      <mesh position={[0, 0.08, 0.005]}>
        <circleGeometry args={[0.31, 32]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.12}
          blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** 陶瓷 Urn — Lathe 旋转面 */
function UrnMesh() {
  const groupRef = useRef<THREE.Group>(null);
  const geometry = useMemo(() => {
    const points: THREE.Vector2[] = [];
    // 轮廓：底部圆→腰鼓→颈部→喇叭口
    const profile = [
      [0.0, -0.6], [0.5, -0.6], [0.55, -0.5],
      [0.62, -0.3], [0.65, -0.05], [0.55, 0.15],
      [0.42, 0.3], [0.35, 0.4], [0.38, 0.5],
      [0.45, 0.55], [0.4, 0.6],
    ];
    profile.forEach(([r, y]) => points.push(new THREE.Vector2(r, y)));
    return new THREE.LatheGeometry(points, 48);
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.25;
  });

  return (
    <group ref={groupRef}>
      <mesh geometry={geometry}>
        <meshPhysicalMaterial
          color="#E8D5C4"
          roughness={0.3}
          metalness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
      {/* 高光环 */}
      <mesh position={[0, 0.1, 0]}>
        <torusGeometry args={[0.4, 0.005, 8, 32]} />
        <meshBasicMaterial color="#FFD84D" transparent opacity={0.6} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** 3D 雕塑 — 占位（球+纹理），等真 Meshy API */
function FigurineMesh({ texture }: { texture: THREE.CanvasTexture }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.3;
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[0.7, 32, 24]} />
        <meshStandardMaterial map={texture} roughness={0.5} metalness={0.1} />
      </mesh>
      {/* 底座 */}
      <mesh position={[0, -0.85, 0]}>
        <cylinderGeometry args={[0.45, 0.55, 0.15, 32]} />
        <meshStandardMaterial color="#3A2A1A" roughness={0.7} />
      </mesh>
    </group>
  );
}

// ═══════════════════════════ scene ═══════════════════════════
function ProductScene({
  imageUrl,
  videoUrl,
  productType,
  deviceColor = 'white',
  frameColor,
  fabricColor,
  autoRotate = true,
  interactive = true,
}: Props) {
  const texture = useProductTexture(imageUrl, videoUrl ?? null);
  const isHolo = productType === 'holo-pyramid' || productType === 'holo-cube';

  return (
    <>
      {isHolo ? (
        <color attach="background" args={['#1a1a2e']} />
      ) : (
        <color attach="background" args={['#F8F4E8']} />
      )}
      {isHolo && <fog attach="fog" args={['#1a1a2e', 4, 12]} />}

      <ambientLight intensity={isHolo ? 0.55 : 0.7} />
      <pointLight position={[3, 3, 4]} intensity={1.0} color={isHolo ? '#7B5BFF' : '#FFE5B4'} />
      <pointLight position={[-3, 2, -2]} intensity={0.5} color={isHolo ? '#FFD84D' : '#FFFFFF'} />
      {isHolo && <pointLight position={[0, 4, 0]} intensity={0.5} color="#FFFFFF" />}

      {productType === 'holo-pyramid' && <HoloPyramidMesh texture={texture} />}
      {productType === 'holo-cube'    && <HoloCubeMesh texture={texture} color={deviceHex(deviceColor!)} />}
      {productType === 'pillow'       && <PillowMesh texture={texture} />}
      {productType === 'tshirt'       && <TShirtMesh texture={texture} fabricColor={fabricColor} />}
      {productType === 'hat'          && <HatMesh texture={texture} fabricColor={fabricColor} />}
      {productType === 'tote'         && <ToteMesh texture={texture} fabricColor={fabricColor} />}
      {productType === 'painting'     && <PaintingMesh texture={texture} frameColor={frameColor} />}
      {productType === 'sandstone'    && <SandstoneMesh texture={texture} />}
      {productType === 'phone-case'   && <PhoneCaseMesh texture={texture} />}
      {productType === 'pendant'      && <PendantMesh texture={texture} />}
      {productType === 'urn'          && <UrnMesh />}
      {productType === 'figurine'     && <FigurineMesh texture={texture} />}

      {/* Holo 才需要地面辉光圆盘 */}
      {isHolo && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.78, 0]}>
          <circleGeometry args={[1.6, 48]} />
          <meshBasicMaterial color="#7B5BFF" transparent opacity={0.35}
            blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </mesh>
      )}
      {/* 非 holo — 软阴影地面 */}
      {!isHolo && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.85, 0]}>
          <circleGeometry args={[1.4, 32]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.08} toneMapped={false} />
        </mesh>
      )}

      {interactive && (
        <OrbitControls
          enablePan={false}
          enableZoom={!isHolo}
          minDistance={isHolo ? 3 : 1.5}
          maxDistance={isHolo ? 6 : 4}
          autoRotate={autoRotate}
          autoRotateSpeed={1.2}
          minPolarAngle={isHolo ? Math.PI / 3 : Math.PI / 6}
          maxPolarAngle={isHolo ? Math.PI / 1.8 : Math.PI / 1.4}
        />
      )}
    </>
  );
}

// ═══════════════════════════ export ═══════════════════════════
export default function ProductPreview3D(props: Props) {
  const { height = 320 } = props;
  const isHolo = props.productType === 'holo-pyramid' || props.productType === 'holo-cube';
  const meta = PRODUCT_META[props.productType];

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl border-2"
      style={{
        height,
        background: isHolo
          ? 'radial-gradient(circle at 50% 30%, rgba(123, 91, 255, 0.25), transparent 70%), #1a1a2e'
          : 'radial-gradient(circle at 50% 30%, rgba(255, 247, 230, 0.4), transparent 70%), #FAF6EC',
        borderColor: isHolo ? 'rgba(123,91,255,0.4)' : 'rgba(220, 180, 100, 0.4)',
      }}
    >
      <Canvas
        camera={{ position: [0, 0.6, isHolo ? 3.2 : 2.6], fov: isHolo ? 42 : 38 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
      >
        <Suspense fallback={null}>
          <ProductScene {...props} />
        </Suspense>
      </Canvas>

      {/* 左上：产品类型徽章 */}
      <div className="absolute top-3 left-3 chip text-xs"
        style={isHolo
          ? { background: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }
          : { background: 'rgba(255,255,255,0.9)', borderColor: '#E8D5C4', color: '#5C3D2E' }}>
        {meta.emoji} {meta.label}
      </div>
      {/* 右上：纹理源状态 */}
      {!props.videoUrl && props.imageUrl && (
        <div className="absolute top-3 right-3 chip text-xs"
          style={{ background: 'rgba(255,216,77,0.92)', color: '#3D2A1A', borderColor: 'rgba(245,194,0,0.9)' }}>
          📸 显示上传照片
        </div>
      )}
      {props.videoUrl && (
        <div className="absolute top-3 right-3 chip text-xs"
          style={{ background: 'rgba(123,91,255,0.92)', color: '#fff', borderColor: 'rgba(91,59,255,0.9)' }}>
          🎬 实时播放
        </div>
      )}
      {!props.imageUrl && !props.videoUrl && (
        <div className="absolute top-3 right-3 chip text-xs"
          style={{ background: 'rgba(255,255,255,0.9)', color: '#5C3D2E', borderColor: '#E8D5C4' }}>
          ⏳ 等待上传
        </div>
      )}
      {/* 底部操作提示 */}
      {props.interactive !== false && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] bg-black/40 text-white rounded-full px-2.5 py-1">
          拖拽旋转 · {isHolo ? '自动旋转中' : '滚轮缩放'}
        </div>
      )}
    </div>
  );
}
