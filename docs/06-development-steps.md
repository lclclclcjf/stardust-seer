# 06 - 执行步骤

> 顺序执行，上一步验证通过后再开始下一步。

---

## 第 1 步 ✅：项目初始化 + 主题系统

**目标**：项目能跑起来，能看到樱花粉色主题

- [x] 用 create-next-app 创建项目（Next.js 16 + TypeScript + Tailwind）
- [x] 配置 globals.css 樱花粉色主题（sakura + ink 色系）
- [x] 创建根布局（PWA 元数据、iPhone 安全区域）
- [x] 创建首页（标题、引导语、预览卡片、按钮骨架）
- [x] `npm run dev` 验证

---

## 第 2 步 ✅：文档体系搭建

**目标**：docs/ + DEVLOG.md 就位

- [x] 创建 docs/ 目录
- [x] 编写 01-requirements.md
- [x] 编写 02-tech-stack.md
- [x] 编写 03-design-spec.md
- [x] 编写 04-data-model.md
- [x] 编写 05-component-tree.md
- [x] 编写 06-development-steps.md
- [x] 编写 07-deployment-guide.md
- [x] 创建 DEVLOG.md

---

## 第 3 步：数据层

**目标**：78 张牌 + 3 种牌阵数据就位

1. 创建 `src/types/index.ts`
2. 创建 78 张牌数据 `src/data/cards.ts`
3. 创建 3 种牌阵 `src/data/spreads.ts`
4. 验证：TypeScript 编译无报错，数据字段齐全

---

## 第 4 步：核心逻辑

**目标**：抽牌逻辑可运行

1. Fisher-Yates 洗牌算法 `src/lib/shuffle.ts`
2. localStorage Hook `src/hooks/useLocalStorage.ts`
3. 核心 Hook `src/hooks/useTarot.ts`（抽牌 + 解读 + 历史）
4. 控制台验证：抽牌随机性、正逆位概率

---

## 第 5 步：牌面 UI 组件

**目标**：四种风格的牌面卡片可渲染

1. 主题配置 `src/styles/themes.ts`
2. CardFace 组件（正面）
3. CardBack 组件（背面，四种风格）
4. StylePicker 组件
5. 首页集成预览

---

## 第 6 步：完整交互流程

**目标**：首页 → 抽牌 → 解读，全流程可用

1. 完善首页（集成 StylePicker + SpreadSelector + QuestionInput）
2. 抽牌页面（ShuffleAnimation + SpreadLayout + CardBack）
3. 解读页面（CardFace + ReadingDisplay）
4. 全流程串联测试

---

## 第 7 步：辅助功能 + 部署

**目标**：历史 + 设置 + PWA + 上线

1. 历史记录页面
2. 设置页面（音效开关 + 清除数据 + AI Key 入口）
3. PWA 配置（manifest.json + 图标 + Service Worker）
4. 移动端适配最终检查
5. Vercel 部署
6. iPhone 添加到主屏幕测试
