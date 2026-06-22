/**
 * AI 服务适配层
 * - Meshy / Tripo: 照片 → 3D 模型
 * - remove.bg: 抠图
 * - Replicate / Stable Diffusion: 艺术风格迁移
 *
 * 真实部署时把 API key 放在 .env.local
 * MVP 阶段前端先用 mock 接口
 */

const MESHY_API = process.env.MESHY_API_KEY || '';
const REMOVE_BG_API = process.env.REMOVE_BG_API_KEY || '';
const REPLICATE_API = process.env.REPLICATE_API_TOKEN || '';

/**
 * 抠图 - 提取宠物轮廓
 * 后端实现: 接 remove.bg API，返回透明 PNG
 */
export async function removeBackground(imageUrl: string): Promise<string> {
  if (!REMOVE_BG_API) {
    console.log('[mock] removeBackground', imageUrl);
    return imageUrl; // mock: 返回原图
  }
  const res = await fetch('https://api.remove.bg/v1.0/removebg', {
    method: 'POST',
    headers: { 'X-Api-Key': REMOVE_BG_API },
    body: JSON.stringify({ image_url: imageUrl, size: 'auto' }),
  });
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

/**
 * 照片 → 3D 模型 (Meshy)
 * 后端实现: 提交任务，轮询直到完成
 */
export async function photoTo3D(imageUrl: string): Promise<string> {
  if (!MESHY_API) {
    console.log('[mock] photoTo3D', imageUrl);
    return '/mock/figurine.glb';
  }
  // 创建任务
  const create = await fetch('https://api.meshy.ai/openapi/v2/image-to-3d', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${MESHY_API}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image_url: imageUrl,
      model_type: 'standard',
      target_polycount: 30000,
    }),
  });
  const { result } = await create.json();
  // 轮询直到完成（简化版）
  let attempts = 0;
  while (attempts < 60) {
    const status = await fetch(`https://api.meshy.ai/openapi/v2/image-to-3d/${result}`, {
      headers: { 'Authorization': `Bearer ${MESHY_API}` },
    });
    const data = await status.json();
    if (data.status === 'succeeded') return data.model_urls.glb;
    if (data.status === 'failed') throw new Error('3D generation failed');
    await new Promise((r) => setTimeout(r, 5000));
    attempts++;
  }
  throw new Error('3D generation timeout');
}

/**
 * 艺术风格迁移 (Replicate)
 * 后端实现: 提交图片+风格 prompt，返回风格化图
 */
export async function applyArtStyle(
  imageUrl: string,
  style: 'renaissance' | 'ukiyo-e' | 'impressionist' | 'pop-art' | 'watercolor' | 'oil',
): Promise<string> {
  if (!REPLICATE_API) {
    console.log('[mock] applyArtStyle', imageUrl, style);
    return imageUrl;
  }
  const stylePrompts: Record<string, string> = {
    renaissance: 'renaissance oil painting style, classical, soft lighting, sfumato',
    'ukiyo-e': 'Japanese ukiyo-e woodblock print, bold outlines, flat color',
    impressionist: 'impressionist oil painting, visible brushstrokes, dappled light',
    'pop-art': 'pop art style, bold colors, halftone dots, comic',
    watercolor: 'watercolor painting, soft washes, wet on wet',
    oil: 'oil painting, rich texture, classical composition',
  };
  // Replicate SDXL call (简化)
  const res = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${REPLICATE_API}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: '39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
      input: {
        image: imageUrl,
        prompt: stylePrompts[style],
        prompt_strength: 0.7,
      },
    }),
  });
  const data = await res.json();
  // 简化: 假设有 polling URLs
  return data.output?.[0] || imageUrl;
}