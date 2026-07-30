import type { ThemeConfig, ThemeId } from '@/types';

export const THEMES: Record<ThemeId, ThemeConfig> = {
  sakura: {
    id: 'sakura',
    nameZh: '日式樱花',
    nameEn: 'Sakura',
    description: '浮世绘海浪与飘落樱花，唯美日式画风',
    preview: '🌸',
  },
  dreamy: {
    id: 'dreamy',
    nameZh: '梦幻治愈',
    nameEn: 'Dreamy',
    description: '柔和光晕与星光渐变，温暖治愈的氛围',
    preview: '✨',
  },
  classic: {
    id: 'classic',
    nameZh: '经典重构',
    nameEn: 'Classic',
    description: '复古金与羊皮纸纹理，经典塔罗致敬',
    preview: '🏛️',
  },
  ai: {
    id: 'ai',
    nameZh: 'AI 自由',
    nameEn: 'AI Free',
    description: '未来感几何线条，天马行空的创意',
    preview: '🤖',
  },
};

export const THEME_LIST: ThemeConfig[] = Object.values(THEMES);

export function getThemeById(id: ThemeId): ThemeConfig {
  return THEMES[id];
}

/** 每种风格的 CSS 类名组合 */
export const themeStyles: Record<ThemeId, {
  cardBg: string;
  cardBorder: string;
  cardText: string;
  cardGlow: string;
  backBg: string;
  backPattern: string;
}> = {
  sakura: {
    cardBg: 'bg-gradient-to-br from-sakura-50 via-white to-sakura-100',
    cardBorder: 'border-sakura-300',
    cardText: 'text-ink-700',
    cardGlow: 'shadow-lg shadow-sakura-200/40',
    backBg: 'bg-gradient-to-br from-sakura-300 to-sakura-500',
    backPattern: '🌸',
  },
  dreamy: {
    cardBg: 'bg-gradient-to-br from-purple-50 via-white to-pink-50',
    cardBorder: 'border-purple-300',
    cardText: 'text-ink-700',
    cardGlow: 'shadow-lg shadow-purple-200/40',
    backBg: 'bg-gradient-to-br from-purple-400 to-pink-400',
    backPattern: '✨',
  },
  classic: {
    cardBg: 'bg-gradient-to-br from-amber-50 via-white to-yellow-50',
    cardBorder: 'border-gold',
    cardText: 'text-ink-800',
    cardGlow: 'shadow-lg shadow-amber-200/40',
    backBg: 'bg-gradient-to-br from-amber-700 to-yellow-800',
    backPattern: '✧',
  },
  ai: {
    cardBg: 'bg-gradient-to-br from-slate-50 via-white to-cyan-50',
    cardBorder: 'border-cyan-300',
    cardText: 'text-ink-700',
    cardGlow: 'shadow-lg shadow-cyan-200/40',
    backBg: 'bg-gradient-to-br from-cyan-500 to-blue-600',
    backPattern: '⬡',
  },
};
