import type { GardenSeason, UiThemeMode, UiVariant } from '@/types';

const UI_VARIANT_ROUTES: Record<UiVariant, string> = {
  garden: '/',
  eclipse: '/demos/eclipse',
  theatre: '/demos/theatre',
};

export const UI_VARIANT_NAMES: Record<UiVariant, string> = {
  garden: '樱雾庭院',
  eclipse: '月蚀档案',
  theatre: '花札剧场',
};

export const UI_VARIANT_RITUAL_LABELS: Record<UiVariant, string> = {
  garden: 'SAKURA DIVINATION',
  eclipse: 'ECLIPSE ARCHIVE',
  theatre: 'HANA THEATRE',
};
export function parseUiVariant(value: string | string[] | undefined): UiVariant {
  return value === 'eclipse' || value === 'theatre' ? value : 'garden';
}

export function getGardenPageHref(route: string, theme: UiThemeMode, season: GardenSeason): string {
  const params = new URLSearchParams();
  if (theme !== 'auto') params.set('theme', theme);
  if (season !== 'spring') params.set('season', season);
  const query = params.toString();
  return query ? `${route}?${query}` : route;
}

export function getUiVariantHomeHref(
  variant: UiVariant,
  theme: UiThemeMode,
  gardenSeason: GardenSeason = 'spring',
): string {
  const route = UI_VARIANT_ROUTES[variant];
  if (variant === 'garden') return getGardenPageHref(route, theme, gardenSeason);
  return theme === 'auto' ? route : `${route}?theme=${theme}`;
}
