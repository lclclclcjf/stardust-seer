import { createHash } from 'node:crypto';

interface RateLimitOptions {
  maxRequests: number;
  windowMs: number;
  maxIdentifiers?: number;
}

interface RateLimitBucket {
  count: number;
  windowStartedAt: number;
}

export type RateLimitDecision =
  | { allowed: true; remaining: number; retryAfterSeconds: 0 }
  | { allowed: false; remaining: 0; retryAfterSeconds: number };

export class FixedWindowRateLimiter {
  private readonly buckets = new Map<string, RateLimitBucket>();
  private readonly maxIdentifiers: number;
  private readonly options: RateLimitOptions;

  constructor(options: RateLimitOptions) {
    this.options = options;
    this.maxIdentifiers = options.maxIdentifiers ?? 10_000;
  }

  consume(identifier: string, now: number): RateLimitDecision {
    this.pruneIfNeeded(now);
    const bucket = this.buckets.get(identifier);
    if (!bucket || now - bucket.windowStartedAt >= this.options.windowMs) {
      this.buckets.set(identifier, { count: 1, windowStartedAt: now });
      return this.allowed(this.options.maxRequests - 1);
    }
    if (bucket.count >= this.options.maxRequests) {
      const remainingMs = this.options.windowMs - (now - bucket.windowStartedAt);
      return { allowed: false, remaining: 0, retryAfterSeconds: Math.ceil(remainingMs / 1000) };
    }
    bucket.count += 1;
    return this.allowed(this.options.maxRequests - bucket.count);
  }

  private allowed(remaining: number): RateLimitDecision {
    return { allowed: true, remaining, retryAfterSeconds: 0 };
  }

  private pruneIfNeeded(now: number): void {
    if (this.buckets.size < this.maxIdentifiers) return;
    for (const [key, bucket] of this.buckets) {
      if (now - bucket.windowStartedAt >= this.options.windowMs) this.buckets.delete(key);
    }
    while (this.buckets.size >= this.maxIdentifiers) {
      const oldest = this.buckets.keys().next().value;
      if (typeof oldest !== 'string') break;
      this.buckets.delete(oldest);
    }
  }
}

const RATE_LIMIT_MAX = readPositiveInteger('AI_RATE_LIMIT_MAX', 5);
const RATE_LIMIT_WINDOW_MS = readPositiveInteger('AI_RATE_LIMIT_WINDOW_SECONDS', 60) * 1000;
const limiter = new FixedWindowRateLimiter({
  maxRequests: RATE_LIMIT_MAX,
  windowMs: RATE_LIMIT_WINDOW_MS,
});

export function consumeAiRateLimit(request: Request, now = Date.now()): RateLimitDecision {
  return limiter.consume(clientFingerprint(request), now);
}

export function clientFingerprint(request: Request): string {
  const source = request.headers.get('cf-connecting-ip')
    ?? request.headers.get('x-real-ip')
    ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? 'unknown-client';
  const salt = process.env.AI_RATE_LIMIT_SALT?.trim() || 'tarot-ai-rate-limit';
  return createHash('sha256').update(`${salt}:${source}`).digest('hex');
}

function readPositiveInteger(name: string, fallback: number): number {
  const value = Number(process.env[name]);
  return Number.isSafeInteger(value) && value > 0 ? value : fallback;
}
