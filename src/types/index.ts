/**
 * 全局类型定义 - PawTique 纪念品定制平台
 */

export type TierLevel = 'Tier 1' | 'Tier 2' | 'Tier 3';

export type ProductLine =
  | 'wool-felt'
  | 'figurine'
  | 'ai-art'
  | 'painting'
  | 'jewelry'
  | 'video'
  | 'urn'
  | 'holo-pet';

export interface ProductLineMeta {
  slug: ProductLine;
  name: string;
  tier: TierLevel;
  category: string;
  tagline: string;
  fromPrice: number;
  emoji: string;
  bg: string;
}

// ── 3D 全息宠物投影配置 ──
export type HoloDevice = 'fan' | 'pyramid' | 'cube';

export interface HoloPetConfig {
  productLine: 'holo-pet';
  petPhotoUrl: string | null;
  petName: string;
  videoTaskId: string | null;       // Kling 任务 ID
  videoUrl: string | null;
  device: HoloDevice;                // 硬件类型
  deviceColor: 'white' | 'black' | 'wood';
  motionSet: 'basic' | 'advanced';   // 5动作 vs 8动作+2交互
  loopDuration: 30 | 60 | 120;       // 循环秒数
  bgMusic: 'none' | 'calm' | 'happy' | 'sleep';
  sound: boolean;                    // 音频驱动（眨眼/转头 同步）
  customEngraving: string;           // 设备外壳刻字（最多 20 字）
  rushDelivery: boolean;
}

export const DEFAULT_HOLO_PET: HoloPetConfig = {
  productLine: 'holo-pet',
  petPhotoUrl: null,
  petName: '',
  videoTaskId: null,
  videoUrl: null,
  device: 'fan',
  deviceColor: 'white',
  motionSet: 'basic',
  loopDuration: 60,
  bgMusic: 'calm',
  sound: false,
  customEngraving: '',
  rushDelivery: false,
};

// ── 羊毛毡配置 ──
export interface WoolFeltConfig {
  productLine: 'wool-felt';
  petPhotoUrl: string | null;
  petName: string;
  pose: 'sitting' | 'standing' | 'lying' | 'playful';
  woolPalette: string[];        // 主体羊毛色
  accentColor: string;          // 装饰色 (项圈/围巾)
  background: 'plain' | 'cozy' | 'forest' | 'meadow' | 'studio';
  size: 'S' | 'M' | 'L';
  frame: 'none' | 'wood-oak' | 'wood-walnut' | 'white-modern' | 'gold-ornate';
  mounting: 'frame' | 'standing' | 'keychain';
  rushDelivery: boolean;
}

export const DEFAULT_WOOL_FELT: WoolFeltConfig = {
  productLine: 'wool-felt',
  petPhotoUrl: null,
  petName: '',
  pose: 'sitting',
  woolPalette: ['#C68B5E', '#8B5E3C', '#5C3D2E'],
  accentColor: '#FFD84D',
  background: 'cozy',
  size: 'M',
  frame: 'wood-oak',
  mounting: 'frame',
  rushDelivery: false,
};

// ── 3D 雕塑配置 (后续 P1b) ──
export interface FigurineConfig {
  productLine: 'figurine';
  petPhotoUrls: string[];
  petName: string;
  pose: 'sitting' | 'standing' | 'lying' | 'playful' | 'sleeping';
  material: 'resin-3d' | 'ceramic-painted' | 'ceramic-raw';
  glazeColor: string;
  baseStyle: 'none' | 'wood-plinth' | 'stone-base' | 'grass-tuft';
  size: 'S' | 'M' | 'L' | 'XL';
  arPreview: boolean;
  rushDelivery: boolean;
}

export const DEFAULT_FIGURINE: FigurineConfig = {
  productLine: 'figurine',
  petPhotoUrls: [],
  petName: '',
  pose: 'sitting',
  material: 'resin-3d',
  glazeColor: '#F5E6D3',
  baseStyle: 'wood-plinth',
  size: 'M',
  arPreview: false,
  rushDelivery: false,
};

// ── AI 艺术画配置 ──
export interface AIArtConfig {
  productLine: 'ai-art';
  petPhotoUrl: string | null;
  petName: string;
  artStyle: 'renaissance' | 'ukiyo-e' | 'impressionist' | 'pop-art' | 'watercolor' | 'oil';
  palette: 'warm' | 'cool' | 'pastel' | 'monochrome' | 'vibrant';
  composition: 'head' | 'half-body' | 'full-body' | 'multi-pet';
  background: 'plain' | 'gradient' | 'scene-park' | 'scene-studio';
  size: '8x10' | '12x16' | '16x20' | '20x30';
  outputMaterial: 'canvas' | 'framed' | 'metal-print' | 'wood-print';
}

export const DEFAULT_AI_ART: AIArtConfig = {
  productLine: 'ai-art',
  petPhotoUrl: null,
  petName: '',
  artStyle: 'renaissance',
  palette: 'warm',
  composition: 'head',
  background: 'gradient',
  size: '12x16',
  outputMaterial: 'framed',
};

// ── 价格表 ──
export interface PriceQuote {
  base: number;
  size: number;
  material: number;
  rush: number;
  total: number;
  currency: 'GBP';
}

export function calcWoolFeltPrice(c: WoolFeltConfig): PriceQuote {
  const base = 120;
  const sizeAdj = { S: 0, M: 30, L: 80 }[c.size];
  const mountAdj = c.mounting === 'keychain' ? -20 : c.mounting === 'standing' ? 25 : 0;
  const rushAdj = c.rushDelivery ? 35 : 0;
  return {
    base,
    size: sizeAdj + mountAdj,
    material: 0,
    rush: rushAdj,
    total: base + sizeAdj + mountAdj + rushAdj,
    currency: 'GBP',
  };
}

export function calcFigurinePrice(c: FigurineConfig): PriceQuote {
  const base = 80;
  const sizeAdj = { S: 0, M: 40, L: 100, XL: 200 }[c.size];
  const matAdj = {
    'resin-3d': 0,
    'ceramic-painted': 80,
    'ceramic-raw': 30,
  }[c.material];
  const rushAdj = c.rushDelivery ? 35 : 0;
  return {
    base,
    size: sizeAdj,
    material: matAdj,
    rush: rushAdj,
    total: base + sizeAdj + matAdj + rushAdj,
    currency: 'GBP',
  };
}

export function calcAIArtPrice(c: AIArtConfig): PriceQuote {
  const base = 50;
  const sizeAdj = { '8x10': 0, '12x16': 30, '16x20': 60, '20x30': 120 }[c.size];
  const matAdj = {
    canvas: 0,
    framed: 25,
    'metal-print': 45,
    'wood-print': 55,
  }[c.outputMaterial];
  return {
    base,
    size: sizeAdj,
    material: matAdj,
    rush: 0,
    total: base + sizeAdj + matAdj,
    currency: 'GBP',
  };
}

// ── 3D 全息宠物投影价格 ──
// 设备基础价 + AI 复活视频 + 加项
export function calcHoloPetPrice(c: HoloPetConfig): PriceQuote {
  // 设备硬件
  const deviceBase = { fan: 120, pyramid: 90, cube: 200 }[c.device];
  // AI 复活视频：basic £29, advanced £49
  const videoBase = c.motionSet === 'basic' ? 29 : 49;
  // 颜色升级
  const colorAdj = c.deviceColor === 'wood' ? 25 : c.deviceColor === 'black' ? 15 : 0;
  // 音频驱动（advanced 才有意义）
  const soundAdj = c.sound && c.motionSet === 'advanced' ? 35 : 0;
  // 加急
  const rushAdj = c.rushDelivery ? 35 : 0;
  const base = deviceBase + videoBase;

  return {
    base,
    size: colorAdj,
    material: soundAdj,
    rush: rushAdj,
    total: base + colorAdj + soundAdj + rushAdj,
    currency: 'GBP',
  };
}

// ── 羊毛色板 ──
export const WOOL_PALETTE = [
  { name: '奶油黄', hex: '#FFF3B0' },
  { name: '暖金', hex: '#F5C200' },
  { name: '蜜糖棕', hex: '#C68B5E' },
  { name: '巧克力', hex: '#5C3D2E' },
  { name: '玫瑰粉', hex: '#FFE8F0' },
  { name: '暮色紫', hex: '#B19CD9' },
  { name: '天空蓝', hex: '#A8D8EA' },
  { name: '薄荷绿', hex: '#B5EAD7' },
  { name: '樱桃红', hex: '#FF6B6B' },
  { name: '石墨灰', hex: '#4A4A4A' },
  { name: '雪白', hex: '#FAFAFA' },
  { name: '焦糖', hex: '#A0522D' },
];

// ── 背景预设 ──
export const BACKGROUNDS = [
  { id: 'plain', name: '纯色', gradient: 'linear-gradient(135deg, #FFF9EC 0%, #FFF1D6 100%)' },
  { id: 'cozy', name: '温馨家居', gradient: 'linear-gradient(135deg, #FFE8D6 0%, #FFD4B8 100%)' },
  { id: 'forest', name: '森林', gradient: 'linear-gradient(135deg, #B5EAD7 0%, #87CEEB 100%)' },
  { id: 'meadow', name: '草地', gradient: 'linear-gradient(135deg, #C8E6C9 0%, #FFF9C4 100%)' },
  { id: 'studio', name: '工作室', gradient: 'linear-gradient(135deg, #E8EAF6 0%, #F3E5F5 100%)' },
] as const;

export const POSES = [
  { id: 'sitting', name: '坐姿', emoji: '🪑' },
  { id: 'standing', name: '站姿', emoji: '🧍' },
  { id: 'lying', name: '躺姿', emoji: '🛌' },
  { id: 'playful', name: '俏皮', emoji: '🤸' },
] as const;