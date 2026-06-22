import { NextRequest, NextResponse } from 'next/server';
import { checkKlingStatus } from '@/lib/kling/server';

export const runtime = 'nodejs';
export const maxDuration = 30;

/**
 * GET /api/kling/status?taskId=xxx
 * 查询 Kling AI 任务状态
 */
export async function GET(req: NextRequest) {
  const taskId = req.nextUrl.searchParams.get('taskId');
  if (!taskId) {
    return NextResponse.json({ error: 'taskId required' }, { status: 400 });
  }

  try {
    const task = await checkKlingStatus(taskId);
    return NextResponse.json({ success: true, task });
  } catch (err) {
    console.error('[kling/status] error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}