'use client';

import { z } from 'zod';
import {
  AI_READING_VERSION,
  AiReadingApiResponseSchema,
  AiReadingSchema,
  type AiReading,
  type AiReadingRequest,
} from './schemas';

const STORAGE_KEY = 'tarot-ai-readings-v1';
const MAX_CACHED_READINGS = 100;

const CacheEntrySchema = z.object({
  key: z.string(),
  reading: AiReadingSchema,
}).strict();
const CacheSchema = z.array(CacheEntrySchema).max(MAX_CACHED_READINGS);

export type AiReadingLoadResult =
  | { status: 'success'; reading: AiReading }
  | { status: 'error'; code: string; message: string }
  | { status: 'skipped' };

const requests = new Map<string, Promise<AiReadingLoadResult>>();

export function getAiReading(
  request: AiReadingRequest,
  attempt: number,
): Promise<AiReadingLoadResult> {
  const key = `${request.drawId}:${AI_READING_VERSION}:${attempt}`;
  const existing = requests.get(key);
  if (existing) return existing;
  const pending = loadAiReading(request);
  requests.set(key, pending);
  return pending;
}

async function loadAiReading(request: AiReadingRequest): Promise<AiReadingLoadResult> {
  if (!request.question.trim()) return { status: 'skipped' };
  const cached = readCache().find((entry) => entry.key === cacheKey(request.drawId));
  if (cached) return { status: 'success', reading: cached.reading };

  try {
    const response = await fetch('/api/readings/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    const parsed = AiReadingApiResponseSchema.safeParse(await response.json());
    if (!parsed.success) return errorResult('AI_INVALID_RESPONSE', 'AI 返回了无法识别的内容');
    if (!parsed.data.ok) return errorResult(parsed.data.code, parsed.data.message);
    writeCache(request.drawId, parsed.data.reading);
    return { status: 'success', reading: parsed.data.reading };
  } catch {
    return errorResult('AI_NETWORK', 'AI 解读暂时没有生成，请稍后重试');
  }
}

function readCache(): z.infer<typeof CacheSchema> {
  if (typeof window === 'undefined') return [];
  try {
    const parsed = CacheSchema.safeParse(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'));
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

function writeCache(drawId: string, reading: AiReading): void {
  try {
    const key = cacheKey(drawId);
    const current = readCache().filter((entry) => entry.key !== key);
    const next = [{ key, reading }, ...current].slice(0, MAX_CACHED_READINGS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    console.warn('AI reading cache is unavailable in this browser.');
  }
}

function cacheKey(drawId: string): string {
  return `${drawId}:${AI_READING_VERSION}`;
}

function errorResult(code: string, message: string): AiReadingLoadResult {
  return { status: 'error', code, message };
}
