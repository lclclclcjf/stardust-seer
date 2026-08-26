import assert from 'node:assert/strict';
import test from 'node:test';
import { AiReadingRequestSchema } from '../src/features/ai-reading/schemas.ts';

const baseRequest = {
  drawId: 'draw-test',
  question: '这份工作是否适合我？',
  spreadId: 'single',
  cards: [{ cardId: 'major-00', position: 0, isReversed: false }],
};

test('accepts a draw with a meaningful question', () => {
  const result = AiReadingRequestSchema.safeParse(baseRequest);
  assert.equal(result.success, true);
});

test('rejects an empty question before any provider call', () => {
  const result = AiReadingRequestSchema.safeParse({ ...baseRequest, question: '' });
  assert.equal(result.success, false);
});

test('rejects a whitespace-only question before any provider call', () => {
  const result = AiReadingRequestSchema.safeParse({ ...baseRequest, question: '   \n  ' });
  assert.equal(result.success, false);
});
