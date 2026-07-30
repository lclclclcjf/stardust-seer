# 04 - 数据模型

## 塔罗牌 (TarotCard)

```typescript
interface TarotCard {
  id: string;           // 唯一标识，如 "major-03", "cups-02", "swords-king"
  nameZh: string;       // 中文名，如 "女皇", "圣杯二", "宝剑国王"
  nameEn: string;       // 英文名，如 "The Empress", "Two of Cups"
  number: number;       // 牌号（大牌 0-21，小牌 1-14）
  suit: Suit;           // 牌组
  keywordsZh: string[]; // 中文关键词
  keywordsEn: string[]; // 英文关键词
  meaningUpright: string;   // 正位含义
  meaningReversed: string;  // 逆位含义
  element?: string;     // 元素（仅大牌和部分解释中用）
  zodiac?: string;      // 对应星座（仅大牌）
  planet?: string;      // 对应行星（仅大牌）
  symbol: string;       // 代表符号（emoji）
}
```

### Suit 枚举

```typescript
type Suit = 'major' | 'wands' | 'cups' | 'swords' | 'pentacles';
```

| 牌组 | 英文 | 元素 | 含义领域 | 张数 |
|------|------|------|----------|------|
| 大阿尔卡纳 | Major Arcana | — | 人生重大课题 | 22 |
| 权杖 | Wands | 火 🔥 | 行动、事业、热情 | 14 |
| 圣杯 | Cups | 水 💧 | 情感、关系、直觉 | 14 |
| 宝剑 | Swords | 风 🌬️ | 思想、沟通、挑战 | 14 |
| 钱币 | Pentacles | 土 🪨 | 物质、财富、健康 | 14 |

---

## 牌阵 (Spread)

```typescript
interface Spread {
  id: string;
  nameZh: string;
  nameEn: string;
  description: string;
  cardCount: number;
  positions: SpreadPosition[];
}

interface SpreadPosition {
  index: number;        // 0-based 位置序号
  nameZh: string;       // 位置中文名
  nameEn: string;       // 位置英文名
  meaning: string;      // 该位置的含义
  x: number;            // 布局 X 坐标 (0-100%)
  y: number;            // 布局 Y 坐标 (0-100%)
}
```

### 预设牌阵

#### 1. 单张牌 (Single Card) — 1 张

```
     ┌─────┐
     │  1  │  → 今日指引
     └─────┘
```

#### 2. 三张牌 (Past-Present-Future) — 3 张

```
  ┌─────┐  ┌─────┐  ┌─────┐
  │  1  │  │  2  │  │  3  │
  └─────┘  └─────┘  └─────┘
   过去      现在      未来
```

#### 3. 凯尔特十字 (Celtic Cross) — 10 张

```
                ┌─────┐
                │  3  │  ← 未来 / 目标
                └─────┘
  ┌─────┐  ┌─────┐  ┌─────┐
  │  5  │  │  1  │  │  6  │  1=现状 2=阻碍
  └─────┘  └─────┘  └─────┘  3=目标 4=过去
            ┌─────┐           5=上方 6=近未来
            │  2  │           7=自我 8=环境
            └─────┘           9=希望 10=结果
  ┌─────┐              ┌─────┐
  │  4  │              │ 10  │
  └─────┘              └─────┘
     ┌───┬───┬───┐
     │ 7 │ 8 │ 9 │  ← 自我·环境·希望/恐惧
     └───┴───┴───┘
```

---

## 抽牌结果 (DrawResult)

```typescript
interface DrawResult {
  id: string;                    // 唯一结果 ID
  timestamp: number;             // 抽牌时间戳
  spreadId: string;              // 使用的牌阵 ID
  themeId: string;               // 使用的牌面风格 ID
  question: string;              // 用户问题（可为空字符串）
  cards: DrawnCard[];            // 抽到的牌
}

interface DrawnCard {
  cardId: string;                // 牌 ID
  position: number;              // 在牌阵中的位置 (0-based)
  isReversed: boolean;           // 是否逆位
}
```

---

## 历史记录 (History)

存储在 `localStorage` 中，键名 `tarot-history`：

```typescript
// localStorage 中的数据结构
const history: DrawResult[] = [];
```

- 最多保存 100 条记录
- 超过 100 条时自动删除最早的记录
- 用户可在设置中一键清除

---

## 用户设置 (Settings)

存储在 `localStorage` 中，键名 `tarot-settings`：

```typescript
interface UserSettings {
  soundEnabled: boolean;         // 音效开关，默认 false
  lastThemeId: string;           // 上次使用的牌面风格，默认 "sakura"
  aiApiKey?: string;             // AI API Key（预留）
}
```
