/**
 * Kling AI Server-only Client
 * 仅在 server side 使用（API routes）
 * 客户端组件请只 import types.ts
 */

import 'server-only';
import type { KlingRequest, KlingTask } from './types';

export type { KlingRequest, KlingTask, KlingMotionMode } from './types';
export { PET_MOTION_PROMPTS } from './types';

/**
 * 提交任务到 Kling AI
 * 优先走官方 API（如果 KLING_API_KEY 存在）
 * 否则走浏览器自动化 fallback（CDP）
 */
export async function submitKlingTask(req: KlingRequest): Promise<KlingTask> {
  const apiKey = process.env.KLING_API_KEY;

  if (apiKey) {
    return submitViaAPI(req, apiKey);
  }
  return submitViaBrowser(req);
}

export async function checkKlingStatus(taskId: string): Promise<KlingTask> {
  const apiKey = process.env.KLING_API_KEY;
  if (apiKey) {
    return checkViaAPI(taskId, apiKey);
  }
  return checkViaBrowser(taskId);
}

// ═══════════════════════════════════════════════════
// 路径 1: 官方 API
// ═══════════════════════════════════════════════════

const KLING_API_BASE = 'https://api.klingai.com';

async function submitViaAPI(req: KlingRequest, apiKey: string): Promise<KlingTask> {
  const url = `${KLING_API_BASE}/v1/videos/image2video`;
  const body = {
    model_name: req.modelVersion || 'kling-v1-5',
    image: req.imageUrl,
    prompt: req.prompt || '宠物轻轻转头，眨眼',
    motion_mode: req.motionMode || 'expressive',
    duration: String(req.duration || 5),
    aspect_ratio: req.aspectRatio || '16:9',
  };

  const r = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await r.json();
  if (data.code !== 0) {
    throw new Error(`Kling API error: ${data.message}`);
  }
  return {
    taskId: data.data.task_id,
    status: 'pending',
    createdAt: Date.now(),
  };
}

async function checkViaAPI(taskId: string, apiKey: string): Promise<KlingTask> {
  const r = await fetch(`${KLING_API_BASE}/v1/videos/image2video/${taskId}`, {
    headers: { 'Authorization': `Bearer ${apiKey}` },
  });
  const data = await r.json();
  const task = data.data;
  const statusMap: Record<string, KlingTask['status']> = {
    submitted: 'pending',
    processing: 'processing',
    succeed: 'succeed',
    failed: 'failed',
  };
  return {
    taskId,
    status: statusMap[task.task_status] || 'pending',
    videoUrl: task.task_result?.videos?.[0]?.url,
    thumbnailUrl: task.task_result?.videos?.[0]?.thumbnail_url,
    errorMessage: task.task_status_msg,
    createdAt: task.created_at,
    completedAt: task.updated_at,
  };
}

// ═══════════════════════════════════════════════════
// 路径 2: 浏览器自动化 (CDP fallback)
// ═══════════════════════════════════════════════════

import { spawn } from 'child_process';
import { promises as fs } from 'fs';

async function submitViaBrowser(req: KlingRequest): Promise<KlingTask> {
  const taskId = `kling_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const queueFile = `/tmp/kling_queue_${taskId}.json`;
  await fs.writeFile(
    queueFile,
    JSON.stringify({ taskId, request: req, status: 'pending' })
  );

  // 调用浏览器自动化脚本
  const workerPath = `${process.cwd()}/scripts/kling_browser_worker.py`;
  const child = spawn('python3', [workerPath, 'submit', queueFile], {
    detached: true,
    stdio: 'ignore',
  });
  child.unref();

  return {
    taskId,
    status: 'pending',
    createdAt: Date.now(),
  };
}

async function checkViaBrowser(taskId: string): Promise<KlingTask> {
  const queueFile = `/tmp/kling_queue_${taskId}.json`;
  try {
    const data = JSON.parse(await fs.readFile(queueFile, 'utf-8'));
    return {
      taskId,
      status: data.status,
      videoUrl: data.videoUrl,
      thumbnailUrl: data.thumbnailUrl,
      errorMessage: data.errorMessage,
      createdAt: data.createdAt,
      completedAt: data.completedAt,
    };
  } catch {
    return {
      taskId,
      status: 'failed',
      errorMessage: 'Task not found',
      createdAt: Date.now(),
    };
  }
}