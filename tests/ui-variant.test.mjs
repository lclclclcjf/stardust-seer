import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getUiVariantHomeHref,
  parseUiVariant,
} from '../src/components/design-demos/ui-variant.ts';

test('parseUiVariant accepts known variants and safely defaults to garden', () => {
  assert.equal(parseUiVariant('eclipse'), 'eclipse');
  assert.equal(parseUiVariant('theatre'), 'theatre');
  assert.equal(parseUiVariant('garden'), 'garden');
  assert.equal(parseUiVariant('unknown'), 'garden');
  assert.equal(parseUiVariant(undefined), 'garden');
});

test('getUiVariantHomeHref returns each originating theme route', () => {
  assert.equal(getUiVariantHomeHref('garden', 'auto'), '/');
  assert.equal(getUiVariantHomeHref('garden', 'light'), '/?theme=light');
  assert.equal(getUiVariantHomeHref('garden', 'dark', 'summer'), '/?theme=dark&season=summer');
  assert.equal(getUiVariantHomeHref('eclipse', 'dark'), '/demos/eclipse?theme=dark');
  assert.equal(getUiVariantHomeHref('theatre', 'light'), '/demos/theatre?theme=light');
});
