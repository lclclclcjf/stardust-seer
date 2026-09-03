# 开发日志

> 项目：🌸 樱花塔罗牌
> 创建日期：2026-07-24
> 当前版本：v0.1.0（全部 7 步完成）

---

## 2026-07-25（部署上线 ✅）

### ✅ 已完成
- [x] 项目名称更新：「星尘占卜 · 樱花塔罗牌」
- [x] 网址选定：`stardust-seer.vercel.app`
- [x] Git 初始化 + 推送到 GitHub（`lclclclcjf/stardust-seer`）
- [x] Vercel 部署成功，线上正常运行

### 🎨 本轮大更新（2026-07-26 前后）
- [x] **AI 牌组系统**（`src/styles/ai-decks.ts`）— 6 套 AI 生成牌面（星海/云河/深空/糖果星球/极光冰川/沙漠流星）
- [x] **CSS 模块重构** — 牌面卡片迁移至 `tarot-card.module.css`，抽牌页迁移至 `draw.module.css`
- [x] **设计演示系统** — `/demos` 页面（garden/eclipse/theatre 三种变体）+ `TarotDemo` 组件
- [x] **牌面卡片视觉升级** — PNG 卡牌素材 + 逆位封印 + 符号舞台 + 光泽效果
- [x] **抽牌仪式感重写** — 深色氛围抽牌页 + 3D 翻转动画
- [x] **根路由重构** — 首页改用 `TarotDemo` 组件（`experienceMode="production"`）
- [x] 解读排版优化 — 🌸 段落前缀 + 段间空行
- [x] 全局背景渐变（粉色 → 白色）
- [x] TypeScript 零报错 ✅
- [x] 推送到 GitHub ✅
- [x] Vercel 自动部署中 🔄

### 🆕 最新改动部署（用户修改）
- [x] 解读页 CSS 模块化（`reading.module.css`）
- [x] UI 主题切换支持（light/dark/auto 模式，通过 `?theme=` 参数）
- [x] `ReadingDisplay` 支持 className 传入
- [x] 新背景素材（sakura-garden-hero v2 亮暗两版）
- [x] `performDraw` 增加 uiTheme 参数
- [x] TypeScript 零报错 ✅
- [x] 生产构建通过（10 个路由）✅
- [x] 推送到 GitHub ✅
- [x] Vercel 自动部署中 🔄

### 🚀 最大版本更新（用户修改）
- [x] **AI 深度解读** — `/api/readings/generate` API + `AiReadingPanel` 组件 + OpenAI 集成
- [x] **扇形选牌仪式** — 卡牌扇形展开，凭直觉点击选牌，含自动选牌模式
- [x] **6 套新 AI 牌组** — 深渊珍珠/云上神殿/翡翠河流/月下锦鲤/日曜天文台/糖霜水晶
- [x] 历史页 CSS 模块化（`history.module.css`）+ 花园风格空状态
- [x] 速率限制（5次/分钟）保护 AI API
- [x] 测试文件（`tests/ai-reading-*.test.mjs`）
- [x] `.env.example` 模板提交，`.env.local` 正确排除（含密钥 ✅ 未泄露）
- [x] TypeScript 零报错 ✅
- [x] 生产构建通过（13 个路由）✅
- [x] 推送到 GitHub ✅
- [x] Vercel 自动部署中 🔄
- [ ] ⚠️ 待用户操作：Vercel 环境变量配置（OPENAI_API_KEY 等）

### 🌸 庭院体验升级（用户修改）
- [x] **GardenIcon 图标系统** — 设置/历史页统一庭院风 SVG 图标
- [x] **占卜音效** — `lib/ritual-sound.ts` 轻柔提示音（默认关闭）
- [x] **历史删除撤销** — 删除后 7 秒内可撤销
- [x] 设置页 CSS 模块化（`settings.module.css`）+ 主题适配
- [x] **WebP 素材压缩** — 全部卡牌素材转换 WebP，加载更快
- [x] 扇形选牌交互重构（`fan-interaction.ts` + 测试）
- [x] TypeScript 零报错 ✅
- [x] 生产构建通过（13 个路由）✅
- [x] 推送到 GitHub ✅
- [x] Vercel 自动部署中 🔄

### 🔑 Vercel AI 环境变量配置（用户确认）
- [x] Vercel CLI 登录（lclclclcjf / GitHub）
- [x] 项目关联 `lucy-ac68/stardust-seer`
- [x] 添加 5 个生产环境变量：OPENAI_API_KEY / OPENAI_MODEL / AI_RATE_LIMIT_MAX / AI_RATE_LIMIT_WINDOW_SECONDS / AI_RATE_LIMIT_SALT
- [x] 重新部署（39 秒完成）
- [x] **线上 AI 解读验证通过** ✅（真实 API 测试返回 ok:true）

### 🍂 庭院四季更新（用户修改）
- [x] **四季系统**（`garden-season.ts`）— 春/夏/秋/冬庭院背景自动切换
- [x] 6 张四季背景素材（夏/秋/冬 × 亮/暗主题 WebP）
- [x] 春夏秋冬共 8 张背景高清重制至 2560×1440（深浅模式）
- [x] 浅色模式左侧白雾收窄，在主页文字右侧快速退雾
- [x] **ThemeMotion 动效组件**（演示页）
- [x] **UI 变体系统**（`ui-variant.ts`）
- [x] 测试文件（garden-season / ui-variant）
- [x] TypeScript 零报错 ✅
- [x] 生产构建通过 ✅
- [x] 推送到 GitHub ✅
- [x] Vercel 自动部署中 🔄

### 🔗 线上地址
- **主站**：https://stardust-seer.vercel.app/
- **GitHub**：https://github.com/lclclclcjf/stardust-seer

### 💡 备注
- iPhone 用 Safari 打开线上地址 → 添加到主屏幕，即可像 App 一样使用

---

## 2026-07-24（全部 7 步完成 ✅）

### ✅ 已完成

#### 第 1 步：项目初始化 + 主题系统
- [x] Next.js 16 项目创建（TypeScript + Tailwind CSS + Turbopack）
- [x] 樱花粉色主题色配置（`sakura` + `ink` 色系，含 7 级色阶）
- [x] 全局布局 `layout.tsx`（PWA 元数据、iPhone 安全区域）
- [x] 首页骨架（标题、引导语、牌面预览卡片、开始按钮）
- [x] 开发服务器运行在 `http://localhost:3000`

#### 第 2 步：文档体系搭建
- [x] `docs/` 目录及 7 份规范文档
  - `01-requirements.md` — 需求规格说明书
  - `02-tech-stack.md` — 技术方案与架构
  - `03-design-spec.md` — UI 设计规范（颜色/字体/间距/圆角/阴影）
  - `04-data-model.md` — 数据模型（78 牌 + 3 牌阵 + 历史 + 设置）
  - `05-component-tree.md` — 组件树与页面路由
  - `06-development-steps.md` — 执行步骤清单
  - `07-deployment-guide.md` — Vercel 部署指南
- [x] `DEVLOG.md` 创建

#### 第 3 步：数据层
- [x] TypeScript 类型定义 `src/types/index.ts`
- [x] 78 张塔罗牌完整数据 `src/data/cards.ts`
  - 大阿尔卡纳 22 张（每张手写详细中英双语解读）
  - 小阿尔卡纳 56 张（4 牌组 × 14 级，含通用解读）
- [x] 3 种牌阵定义 `src/data/spreads.ts`（单张/三张/凯尔特十字）
- [x] TypeScript 零报错 ✅

#### 第 4 步：核心逻辑
- [x] Fisher-Yates 洗牌算法 `src/lib/shuffle.ts`
- [x] localStorage 封装 `src/hooks/useLocalStorage.ts`（Hook + 工具函数）
- [x] 核心 Hook `src/hooks/useTarot.ts`（抽牌、解读、历史管理）
- [x] TypeScript 零报错 ✅

#### 第 5 步：牌面 UI 组件
- [x] 四种风格主题配置 `src/styles/themes.ts`
- [x] `CardFace.tsx` — 牌面正面（罗马数字、符号、中英牌名、逆位标识）
- [x] `CardBack.tsx` — 牌背（四种风格对应四种牌背）
- [x] `StylePicker.tsx` — 风格选择器（2×2 网格，选中高亮）
- [x] TypeScript 零报错 ✅

#### 第 6 步：完整交互流程
- [x] 首页 `HomePage.tsx` 集成（StylePicker + 牌阵选择 + 问题输入 + 开始按钮）
- [x] 抽牌页面 `/draw`（洗牌动画 → 牌背排列 → 点击翻牌 → 自动跳转）
- [x] 解读页面 `/reading`（牌面展示 + 逐张详细解读 + AI 预留区）
- [x] `ReadingDisplay.tsx`（位置说明、关键词标签、正逆位解读、元素/星座信息）
- [x] TypeScript 零报错 ✅
- [x] 生产构建成功 ✅

#### 第 7 步：辅助功能 + PWA + 部署准备
- [x] 历史记录页面 `/history`（时间线列表、查看详情、删除单条/清空全部）
- [x] 设置页面 `/settings`（音效开关、清除数据、AI Key 预留入口、「关于」区块）
- [x] PWA `manifest.json`（应用名称、主题色、全屏模式）
- [x] PWA 图标（SVG 格式，192×192 + 512×512）
- [x] 生产构建成功（6 个路由全部通过）✅

### 📊 构建结果

```
Route         | Type
/             | Static  (首页)
/draw         | Dynamic (抽牌页)
/reading      | Dynamic (解读页)
/history      | Static  (历史记录)
/settings     | Static  (设置页)
/_not-found   | Static  (404)
✓ All pages compiled successfully
```

### 📁 最终项目结构（23 个源文件）

```
tarot-app/
├── DEVLOG.md
├── docs/ (7 份规范文档)
├── public/
│   ├── manifest.json
│   └── icons/ (2 个 SVG 图标)
├── src/
│   ├── app/ (6 个路由页面)
│   ├── components/ (6 个组件)
│   ├── data/ (2 个数据文件)
│   ├── hooks/ (2 个 Hook)
│   ├── lib/ (1 个工具)
│   ├── styles/ (1 个主题配置)
│   └── types/ (1 个类型文件)
```

### 🔜 待办（明天）

- [ ] 部署到 Vercel（用户需先注册 Vercel 账号）
- [ ] iPhone Safari 真机测试 + 添加到主屏幕
- [ ] 根据用户反馈调整细节

### 📌 阻塞项
- Vercel 部署需要用户完成 GitHub 登录（见 `docs/07-deployment-guide.md`）

### 💡 备注
- 零第三方依赖（除 Next.js/React/Tailwind 内置），维护成本极低
- AI 功能预留完整接口，后续只需对接 API 即可
- 明天用户上线后继续：部署 + 真机测试
