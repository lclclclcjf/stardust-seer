import assert from 'node:assert/strict';
import test from 'node:test';
import { FixedWindowRateLimiter } from '../src/features/ai-reading/rate-limit.ts';

test('blocks requests after the configured window quota', () => {
  const limiter = new FixedWindowRateLimiter({ maxRequests: 2, windowMs: 60_000 });

  assert.deepEqual(limiter.consume('reader-a', 0), {
    allowed: true,
    remaining: 1,
    retryAfterSeconds: 0,
  });
  assert.deepEqual(limiter.consume('reader-a', 10_000), {
    allowed: true,
    remaining: 0,
    retryAfterSeconds: 0,
  });
  assert.deepEqual(limiter.consume('reader-a', 20_000), {
    allowed: false,
    remaining: 0,
    retryAfterSeconds: 40,
  });
});

test('starts a fresh quota after the window expires', () => {
  const limiter = new FixedWindowRateLimiter({ maxRequests: 1, windowMs: 1_000 });
  limiter.consume('reader-a', 0);

  assert.equal(limiter.consume('reader-a', 1_000).allowed, true);
});

test('keeps quotas independent for different readers', () => {
  const limiter = new FixedWindowRateLimiter({ maxRequests: 1, windowMs: 1_000 });
  limiter.consume('reader-a', 0);

  assert.equal(limiter.consume('reader-b', 0).allowed, true);
});
