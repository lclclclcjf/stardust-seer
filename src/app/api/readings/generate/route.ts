import { NextResponse } from 'next/server';
import { z } from 'zod';
import { buildTrustedContext } from '@/features/ai-reading/domain';
import { generateAiReading } from '@/features/ai-reading/openai-provider';
import { clientFingerprint, consumeAiRateLimit } from '@/features/ai-reading/rate-limit';
import {
  AI_READING_VERSION,
  AiReadingRequestSchema,
  type AiReadingApiResponse,
} from '@/features/ai-reading/schemas';

export const runtime = 'nodejs';
const MAX_REQUEST_BYTES = 24_000;

export async function POST(request: Request): Promise<NextResponse<AiReadingApiResponse>> {
  if (!isSameOrigin(request)) return apiError('FORBIDDEN', '请求来源无效', 403);
  if (exceedsBodyLimit(request)) return apiError('PAYLOAD_TOO_LARGE', '请求内容过大', 413);
  const body = await readJson(request);
  const parsed = AiReadingRequestSchema.safeParse(body);
  if (!parsed.success) {
    const questionMissing = isQuestionMissing(body);
    return apiError(
      questionMissing ? 'QUESTION_REQUIRED' : 'INVALID_REQUEST',
      questionMissing ? '请输入问题后再生成 AI 解读' : '占卜数据格式不正确',
      422,
    );
  }

  const context = buildTrustedContext(parsed.data);
  if (!context.ok) return apiError(context.code, context.message, 422);

  const rateLimit = consumeAiRateLimit(request);
  const rateHeaders = {
    'X-RateLimit-Remaining': String(rateLimit.remaining),
    ...(rateLimit.allowed ? {} : { 'Retry-After': String(rateLimit.retryAfterSeconds) }),
  };
  if (!rateLimit.allowed) {
    return apiError('RATE_LIMITED', '请求过于频繁，请稍后重试', 429, rateHeaders);
  }

  const generated = await generateAiReading(
    context.value,
    clientFingerprint(request),
    parsed.data.drawId,
  );
  if (!generated.ok) {
    const status = generated.code === 'AI_NOT_CONFIGURED' || generated.code === 'AI_CIRCUIT_OPEN'
      ? 503
      : 502;
    return apiError(generated.code, generated.message, status, rateHeaders);
  }

  return NextResponse.json({
    ok: true,
    reading: {
      ...generated.value,
      promptVersion: AI_READING_VERSION,
      generatedAt: new Date().toISOString(),
    },
  }, { headers: rateHeaders });
}

function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  return !origin || origin === new URL(request.url).origin;
}

function exceedsBodyLimit(request: Request): boolean {
  const contentLength = Number(request.headers.get('content-length') ?? 0);
  return Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES;
}

function isQuestionMissing(body: unknown): boolean {
  const result = z.object({ question: z.unknown().optional() }).passthrough().safeParse(body);
  if (!result.success || typeof result.data.question !== 'string') return true;
  return result.data.question.trim().length === 0;
}

async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

function apiError(
  code: string,
  message: string,
  status: number,
  headers?: HeadersInit,
): NextResponse<AiReadingApiResponse> {
  return NextResponse.json({ ok: false, code, message }, { status, headers });
}
