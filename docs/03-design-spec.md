# 03 - UI 设计规范

## 色彩系统

### 主色调 — 樱花粉

| Token | 色值 | 用途 |
|-------|------|------|
| `sakura-50` | `#fff0f3` | 页面背景 |
| `sakura-100` | `#ffe0e6` | 卡片背景浅色 |
| `sakura-200` | `#ffc2cd` | 边框、分割线 |
| `sakura-300` | `#ffb3c1` | 次要按钮、标签 |
| `sakura-400` | `#ff99ab` | 主按钮渐变起始 |
| `sakura-500` | `#ff7f95` | 主按钮渐变结束 |
| `sakura-600` | `#e6657a` | 按钮 hover 起始 |
| `sakura-700` | `#cc4c60` | 按钮 hover 结束 |

### 文字色 — 棕黑

| Token | 色值 | 用途 |
|-------|------|------|
| `ink-700` | `#3a2a1a` | 标题、正文 |
| `ink-500` | `#5c4a3a` | 次要文字 |
| `ink-400` | `#7c6855` | 导航链接 |
| `ink-300` | `#a08d7a` | 辅助说明 |
| `ink-200` | `#c4b5a5` | 提示文字（最浅） |

### 强调色

| Token | 色值 | 用途 |
|-------|------|------|
| `gold` | `#c9a96e` | 经典重构风格点缀 |
| `gold-light` | `#e0cfa0` | 卡片描边 |

### 功能色

| Token | 色值 | 用途 |
|-------|------|------|
| `bg-primary` | `#fff5f6` | 全局背景 |
| `bg-card` | `#ffffff` | 卡片背景 |
| `text-primary` | `#3a2a1a` | 主文字色 |
| `text-secondary` | `#7c6855` | 次要文字 |
| `text-muted` | `#a08d7a` | 禁用/提示文字 |
| `border` | `#ffc2cd` | 默认边框 |

---

## 字体规范

| 用途 | 字体 | 大小 | 字重 |
|------|------|------|------|
| 页面大标题 | Geist Sans | `text-4xl` (36px) | `font-bold` (700) |
| 区块标题 | Geist Sans | `text-2xl` (24px) | `font-semibold` (600) |
| 牌名（中） | Geist Sans | `text-xl` (20px) | `font-bold` (700) |
| 牌名（英） | Geist Sans | `text-sm` (14px) | `font-normal` (400) |
| 正文 | Geist Sans | `text-base` (16px) | `font-normal` (400) |
| 辅助文字 | Geist Sans | `text-xs` (12px) | `font-normal` (400) |
| 关键词 | Geist Sans | `text-sm` (14px) | `font-medium` (500) |
| 按钮文字 | Geist Sans | `text-lg` (18px) | `font-semibold` (600) |
| 牌号罗马数字 | Geist Mono | 按牌面缩放 | `font-bold` (700) |

---

## 间距规范

| Token | 值 | 用途 |
|-------|-----|------|
| 页面水平边距 | `px-6` (24px) | 移动端页面两侧留白 |
| 卡片内边距 | `p-6` (24px) | 白色卡片内部 |
| 组件间距 | `gap-4` (16px) | 同组元素间 |
| 区块间距 | `mb-8` ~ `mb-12` (32-48px) | 不同区块间 |
| 按钮高度 | `h-14` (56px) | 主操作按钮 |

---

## 圆角规范

| Token | 值 | 用途 |
|-------|-----|------|
| 大卡片 | `rounded-3xl` (24px) | 主卡片容器 |
| 按钮 | `rounded-2xl` (16px) | 主按钮 |
| 牌面 | `rounded-2xl` (16px) | 塔罗牌卡片 |
| 小标签 | `rounded-full` | 关键词标签 |

---

## 阴影规范

| 用途 | Tailwind |
|------|----------|
| 主按钮阴影 | `shadow-lg shadow-sakura-400/30` |
| 卡片阴影 | `shadow-lg shadow-sakura-200/30` |
| 牌面阴影 | `shadow-md` |

---

## 动画规范

| 场景 | 时长 | 缓动 | 效果 |
|------|------|------|------|
| 按钮按下 | 200ms | ease-out | `scale-[0.98]` |
| 颜色过渡 | 200ms | ease | `transition-colors` |
| 牌面翻转 | 600ms | ease-in-out | 3D rotateY |
| 洗牌 | 800ms | ease-out | translate + shuffle |
| 页面切换 | 200ms | ease | opacity + translateY |

---

## 移动端适配

- **基准宽度**：375px（iPhone SE）
- **最大内容宽度**：`max-w-lg` (512px)
- **断点**：
  - `sm:` 640px（大手机横屏）
  - `md:` 768px（平板）
  - `lg:` 1024px（桌面）
- **安全区域**：使用 `env(safe-area-inset-*)` 适配刘海屏
- **触摸目标**：最小 44x44px
