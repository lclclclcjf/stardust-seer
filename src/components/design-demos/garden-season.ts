import type { GardenSeason } from '@/types';

export const GARDEN_SEASONS: ReadonlyArray<{ value: GardenSeason; label: string }> = [
  { value: 'spring', label: '春' },
  { value: 'summer', label: '夏' },
  { value: 'autumn', label: '秋' },
  { value: 'winter', label: '冬' },
];

export function parseGardenSeason(value: string | string[] | undefined): GardenSeason {
  return value === 'summer' || value === 'autumn' || value === 'winter' ? value : 'spring';
}
