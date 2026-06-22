/**
 * Kling AI Types - 客户端/服务端共享类型
 */

export type KlingMotionMode =
  | 'standard'
  | 'expressive'
  | 'creative';

export interface KlingRequest {
  imageUrl: string;
  prompt?: string;
  motionMode?: KlingMotionMode;
  duration?: 5 | 10;
  aspectRatio?: '16:9' | '9:16' | '1:1';
  modelVersion?: 'kling-v1' | 'kling-v1-5' | 'kling-v2';
}

export interface KlingTask {
  taskId: string;
  status: 'pending' | 'processing' | 'succeed' | 'failed';
  videoUrl?: string;
  thumbnailUrl?: string;
  errorMessage?: string;
  createdAt: number;
  completedAt?: number;
}

export const PET_MOTION_PROMPTS: Record<string, { label: string; prompt: string; emoji: string }> = {
  gentle_blink: {
    label: '温柔眨眼',
    emoji: '👁️',
    prompt: '宠物轻轻眨眼，耳朵微微动，眼神温柔看向镜头',
  },
  head_turn: {
    label: '转头回眸',
    emoji: '🔄',
    prompt: '宠物缓缓转头看向一侧，然后转回看镜头，尾巴轻微摇摆',
  },
  breathing: {
    label: '安静呼吸',
    emoji: '💨',
    prompt: '宠物安静地趴着或坐着，胸口随呼吸轻微起伏，眨眼',
  },
  smile: {
    label: '开心微笑',
    emoji: '😊',
    prompt: '宠物微微张嘴像在微笑，舌头轻轻一舔，尾巴轻摇',
  },
  stretch: {
    label: '伸懒腰',
    emoji: '🤸',
    prompt: '宠物伸懒腰打哈欠，伸完懒腰后看向镜头',
  },
  standing_walk: {
    label: '缓步走来',
    emoji: '🚶',
    prompt: '宠物缓慢向镜头走来，背景轻微变化，像在散步',
  },
  sleep_dream: {
    label: '安静沉睡',
    emoji: '😴',
    prompt: '宠物闭眼安静沉睡，呼吸起伏，梦中爪子轻微抽动',
  },
  custom: {
    label: '自定义动作',
    emoji: '✨',
    prompt: '',
  },
};