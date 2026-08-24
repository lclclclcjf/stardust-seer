// 牌组类型
export type Suit = 'major' | 'wands' | 'cups' | 'swords' | 'pentacles';

// 塔罗牌
export interface TarotCard {
  id: string;
  nameZh: string;
  nameEn: string;
  number: number;
  suit: Suit;
  keywordsZh: string[];
  keywordsEn: string[];
  meaningUpright: string;
  meaningReversed: string;
  element?: string;
  zodiac?: string;
  symbol: string;
}

// 牌阵位置
export interface SpreadPosition {
  index: number;
  nameZh: string;
  nameEn: string;
  meaning: string;
}

// 牌阵
export interface Spread {
  id: string;
  nameZh: string;
  nameEn: string;
  description: string;
  cardCount: number;
  positions: SpreadPosition[];
}

// 抽到的牌
export interface DrawnCard {
  cardId: string;
  position: number;
  isReversed: boolean;
}

// 抽牌结果
export interface DrawResult {
  id: string;
  timestamp: number;
  spreadId: string;
  themeId: ThemeId;
  aiDeckId?: AiDeckId;
  uiTheme?: UiThemeMode;
  question: string;
  cards: DrawnCard[];
}

// 牌面风格主题
export type ThemeId = 'sakura' | 'dreamy' | 'classic' | 'ai';

export type AiDeckId =
  | 'star-sea'
  | 'cloud-river'
  | 'deep-space'
  | 'candy-planet'
  | 'aurora-glacier'
  | 'desert-meteor';

export type UiThemeMode = 'auto' | 'light' | 'dark';

export interface ThemeConfig {
  id: ThemeId;
  nameZh: string;
  nameEn: string;
  description: string;
  preview: string;
}

// 用户设置
export interface UserSettings {
  soundEnabled: boolean;
  lastThemeId: ThemeId;
}
