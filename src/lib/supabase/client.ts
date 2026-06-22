/**
 * Supabase 客户端 - 占位实现
 * 真实部署时填入 .env.local 的 SUPABASE_URL 和 SUPABASE_ANON_KEY
 */

// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// export const supabase = createClient(supabaseUrl, supabaseKey);

// ── 占位接口（前端原型阶段先用 mock data） ──

export interface OrderRow {
  id: string;
  productLine: string;
  config: Record<string, unknown>;
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  customerEmail?: string;
  createdAt: string;
}

export interface PetPhotoRow {
  id: string;
  userId: string;
  url: string;
  thumbnailUrl: string;
  petName?: string;
  uploadAt: string;
}

/**
 * 上传宠物照片到 Supabase Storage
 * TODO: 实现真实上传逻辑（用 Cloudinary 做图片处理更便宜）
 */
export async function uploadPetPhoto(file: File): Promise<string> {
  // 临时用 URL.createObjectURL 让原型可演示
  if (typeof window === 'undefined') return '';
  return URL.createObjectURL(file);
}

/**
 * 保存订单到 Supabase
 * TODO: 接支付后实现
 */
export async function saveOrder(order: OrderRow): Promise<void> {
  console.log('[mock] saveOrder', order);
}