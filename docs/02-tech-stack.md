# 02 - 技术方案与架构

## 技术栈

| 层级 | 技术 | 版本 | 用途 |
|------|------|------|------|
| 框架 | Next.js | 16.x | React 全栈框架，App Router |
| 语言 | TypeScript | 5.x | 类型安全 |
| 样式 | Tailwind CSS | 4.x | 原子化 CSS，`@theme` 自定义主题 |
| 字体 | Geist (Sans + Mono) | — | Vercel 出品，优雅无衬线字体 |
| 包管理 | npm | 11.x | 依赖管理 |
| 部署 | Vercel | — | 免费托管，自动 HTTPS |

## 未引入的依赖

保持零额外依赖，全部使用浏览器原生能力和 Next.js 内置功能：

- **状态管理**：React `useState` / `useContext`（不需要 Redux/Zustand）
- **路由**：Next.js App Router（不需要 react-router）
- **动画**：CSS Transitions + `framer-motion`（按需引入）
- **数据存储**：`localStorage`（不需要数据库）
- **HTTP 请求**：`fetch`（不需要 axios）
- **PWA**：手动配置 `manifest.json`（不需要 next-pwa）

## 项目结构

```
tarot-app/
├── public/
│   ├── manifest.json          # PWA 配置
│   ├── sw.js                  # Service Worker（离线缓存）
│   └── icons/                 # App 图标（192x192, 512x512）
├── src/
│   ├── app/                   # Next.js App Router 页面
│   │   ├── layout.tsx         # 根布局（html/body/全局导航）
│   │   ├── page.tsx           # 首页
│   │   ├── globals.css        # 全局样式 + Tailwind @theme
│   │   ├── draw/
│   │   │   └── page.tsx       # 抽牌页面
│   │   ├── reading/
│   │   │   └── page.tsx       # 解读页面
│   │   ├── history/
│   │   │   └── page.tsx       # 历史记录页面
│   │   └── settings/
│   │       └── page.tsx       # 设置页面
│   ├── components/            # React 组件
│   │   ├── CardFace.tsx       # 牌面正面
│   │   ├── CardBack.tsx       # 牌背
│   │   ├── CardDeck.tsx       # 牌组
│   │   ├── SpreadLayout.tsx   # 牌阵布局
│   │   ├── StylePicker.tsx    # 风格选择器
│   │   ├── ReadingDisplay.tsx # 解读展示
│   │   └── ShuffleAnimation.tsx
│   ├── data/                  # 静态数据
│   │   ├── cards.ts           # 78 张牌数据
│   │   ├── spreads.ts         # 3 种牌阵定义
│   │   └── interpretations.ts
│   ├── hooks/                 # 自定义 Hooks
│   │   ├── useLocalStorage.ts
│   │   └── useTarot.ts
│   ├── lib/                   # 工具函数
│   │   └── shuffle.ts         # 洗牌算法
│   ├── types/                 # TypeScript 类型
│   │   └── index.ts
│   └── styles/                # 主题配置
│       └── themes.ts          # 四种风格 CSS 变量
├── docs/                      # 项目文档
├── DEVLOG.md                  # 开发日志
├── package.json
└── tsconfig.json
```

## 架构原则

1. **零依赖**：尽量不引入第三方库，减少维护负担
2. **纯前端**：无后端，无数据库，数据全在 localStorage
3. **渐进增强**：基础功能不依赖 JS 框架特性，保证兼容性
4. **移动优先**：CSS 先写移动端样式，再用 `md:` / `lg:` 适配桌面
