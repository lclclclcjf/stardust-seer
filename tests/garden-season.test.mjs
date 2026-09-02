import assert from 'node:assert/strict';
import test from 'node:test';

import { parseGardenSeason } from '../src/components/design-demos/garden-season.ts';
import { getGardenPageHref } from '../src/components/design-demos/ui-variant.ts';

test('parseGardenSeason accepts known seasons and defaults safely to spring', () => {
  assert.equal(parseGardenSeason('summer'), 'summer');
  assert.equal(parseGardenSeason('autumn'), 'autumn');
  assert.equal(parseGardenSeason('winter'), 'winter');
  assert.equal(parseGardenSeason('unknown'), 'spring');
  assert.equal(parseGardenSeason(undefined), 'spring');
});

test('getGardenPageHref preserves explicit theme and non-default season', () => {
  assert.equal(getGardenPageHref('/', 'auto', 'spring'), '/');
  assert.equal(getGardenPageHref('/demos/garden', 'light', 'autumn'), '/demos/garden?theme=light&season=autumn');
});
