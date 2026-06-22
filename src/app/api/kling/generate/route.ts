import { NextRequest, NextResponse } from 'next/server';
import { submitKlingTask, type KlingRequest } from '@/lib/kling/server';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * POST /api/kling/generate
 * Body: { imageUrl: string, prompt?: string, motionMode?: string, duration?: number }
 *
 * 提交虚拟宠物视频生成任务到 Kling AI
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as KlingRequest;

    // 验证必填字段
    if (!body.imageUrl) {
      return NextResponse.json(
        { error: 'imageUrl is required' },
        { status: 400 }
      );
    }

    const task = await submitKlingTask({
      imageUrl: body.imageUrl,
      prompt: body.prompt || '宠物轻轻转头，眨眼',
      motionMode: body.motionMode || 'expressive',
      duration: body.duration || 5,
      aspectRatio: body.aspectRatio || '16:9',
      modelVersion: 'kling-v1-5', // 对宠物效果好
    });

    return NextResponse.json({ success: true, task });
  } catch (err) {
    console.error('[kling/generate] error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}