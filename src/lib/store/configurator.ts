/**
 * Zustand store - 配置器状态管理
 * 用于跨组件共享当前配置
 */
import { create } from 'zustand';
import type {
  WoolFeltConfig,
  FigurineConfig,
  AIArtConfig,
  HoloPetConfig,
  ProductLine,
} from '@/types';

interface ConfiguratorState {
  productLine: ProductLine;
  woolFelt: WoolFeltConfig;
  figurine: FigurineConfig;
  aiArt: AIArtConfig;
  holoPet: HoloPetConfig;

  // actions
  setProductLine: (line: ProductLine) => void;
  updateWoolFelt: (partial: Partial<WoolFeltConfig>) => void;
  updateFigurine: (partial: Partial<FigurineConfig>) => void;
  updateAIArt: (partial: Partial<AIArtConfig>) => void;
  updateHoloPet: (partial: Partial<HoloPetConfig>) => void;
  setPetPhoto: (url: string) => void;
  reset: () => void;
}

export const useConfigurator = create<ConfiguratorState>((set) => ({
  productLine: 'wool-felt',
  woolFelt: {
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
  },
  figurine: {
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
  },
  aiArt: {
    productLine: 'ai-art',
    petPhotoUrl: null,
    petName: '',
    artStyle: 'renaissance',
    palette: 'warm',
    composition: 'head',
    background: 'gradient',
    size: '12x16',
    outputMaterial: 'framed',
  },
  holoPet: {
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
  },

  setProductLine: (line) => set({ productLine: line }),
  updateWoolFelt: (partial) =>
    set((state) => ({ woolFelt: { ...state.woolFelt, ...partial } })),
  updateFigurine: (partial) =>
    set((state) => ({ figurine: { ...state.figurine, ...partial } })),
  updateAIArt: (partial) =>
    set((state) => ({ aiArt: { ...state.aiArt, ...partial } })),
  updateHoloPet: (partial) =>
    set((state) => ({ holoPet: { ...state.holoPet, ...partial } })),
  setPetPhoto: (url) =>
    set((state) => {
      if (state.productLine === 'wool-felt') {
        return { woolFelt: { ...state.woolFelt, petPhotoUrl: url } };
      }
      if (state.productLine === 'figurine') {
        return { figurine: { ...state.figurine, petPhotoUrls: [url] } };
      }
      if (state.productLine === 'holo-pet') {
        return { holoPet: { ...state.holoPet, petPhotoUrl: url } };
      }
      return { aiArt: { ...state.aiArt, petPhotoUrl: url } };
    }),
  reset: () => set({
    woolFelt: {
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
    },
  }),
}));