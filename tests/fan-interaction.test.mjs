import assert from 'node:assert/strict';
import test from 'node:test';
import { classifyFanGesture } from '../src/app/draw/fan-interaction.ts';

test('recognizes an upward lift gesture', () => {
  assert.equal(classifyFanGesture(8, -52, false), 'lift');
});

test('ignores short and diagonal movements', () => {
  assert.equal(classifyFanGesture(8, -20, false), 'none');
  assert.equal(classifyFanGesture(44, -42, false), 'none');
});

test('only switches cards horizontally after one is lifted', () => {
  assert.equal(classifyFanGesture(-58, 4, false), 'none');
  assert.equal(classifyFanGesture(-58, 4, true), 'next');
  assert.equal(classifyFanGesture(58, -3, true), 'previous');
});