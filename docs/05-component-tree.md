# 05 - 组件树与页面路由

## 页面路由

```
/                   → 首页（风格选择 + 牌阵选择 + 问题输入）
/draw               → 抽牌页面（洗牌动画 + 选牌交互）
/reading            → 解读页面（牌面展示 + 解读文字）
/history            → 历史记录页面
/settings           → 设置页面
```

路由数据传递方式：使用 `URLSearchParams`（query string）+ `localStorage`。

### 页面流转

```
首页(/) → 点击"开始占卜" → 抽牌页(/draw) → 翻牌完毕 → 解读页(/reading)
                                    ↑                          │
                                    └──────── 再次占卜 ←───────┘
```

状态通过 URL query 传递：
- `/draw?spread=single&theme=sakura&question=我的感情运如何`
- `/reading?drawId=xxxx`（从 localStorage 读取抽牌结果）

---

## 组件树

```
RootLayout (layout.tsx)
├── HomePage (page.tsx)
│   ├── StylePicker          # 四种牌面风格选择
│   ├── SpreadSelector       # 三种牌阵选择
│   ├── QuestionInput        # 问题输入框
│   └── [StartButton]        # 开始占卜按钮（内联）
│
├── DrawPage (draw/page.tsx)
│   ├── ShuffleAnimation     # 洗牌动画
│   ├── CardBack × N         # 牌背（N 张，根据牌阵）
│   └── SpreadLayout         # 牌阵布局容器
│
├── ReadingPage (reading/page.tsx)
│   ├── CardFace × N         # 已翻开的牌面
│   └── ReadingDisplay × N   # 每张牌的解读
│
├── HistoryPage (history/page.tsx)
│   └── HistoryCard × N      # 每条历史记录卡片
│
└── SettingsPage (settings/page.tsx)
    ├── SoundToggle          # 音效开关
    ├── ClearHistoryButton   # 清除历史
    └── AiKeyInput           # AI Key（预留）
```

---

## 核心组件 Props

### CardFace

```typescript
interface CardFaceProps {
  card: TarotCard;
  themeId: string;       // 当前风格
  isReversed: boolean;   // 是否逆位显示
  revealed: boolean;     // 是否已翻开
}
```

### CardBack

```typescript
interface CardBackProps {
  themeId: string;       // 牌背风格跟随牌面风格
  onClick?: () => void;
}
```

### StylePicker

```typescript
interface StylePickerProps {
  selected: string;
  onSelect: (themeId: string) => void;
}
```

### SpreadLayout

```typescript
interface SpreadLayoutProps {
  spread: Spread;
  cards: DrawnCard[];
  revealed: boolean[];
  themeId: string;
  onCardClick: (index: number) => void;
}
```

### ReadingDisplay

```typescript
interface ReadingDisplayProps {
  card: TarotCard;
  isReversed: boolean;
  position: SpreadPosition;
}
```

---

## 状态管理

不使用全局状态库。状态流转方式：

1. **首页 → 抽牌页**：通过 URL query string 传递选择
2. **抽牌结果**：存入 `localStorage`（key: `tarot-current-draw`）
3. **解读页**：从 `localStorage` 读取当前结果
4. **历史记录**：每次占卜完成后 push 到 `localStorage`（key: `tarot-history`）
5. **用户设置**：`localStorage`（key: `tarot-settings`）
