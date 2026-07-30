# 07 - 部署指南

## 部署平台：Vercel

Vercel 是 Next.js 官方推荐部署平台，免费额度足够个人使用。

---

## 前置准备

1. **GitHub 账号**：注册 [github.com](https://github.com)
2. **Vercel 账号**：用 GitHub 账号登录 [vercel.com](https://vercel.com)
3. **安装 Git**（如未安装）：[git-scm.com](https://git-scm.com)

---

## 部署步骤

### 1. 推送到 GitHub

```bash
cd tarot-app
git init
git add .
git commit -m "Initial commit: Sakura Tarot"
git remote add origin https://github.com/你的用户名/tarot-app.git
git push -u origin main
```

### 2. 连接 Vercel

1. 打开 [vercel.com](https://vercel.com)
2. 点击 "New Project"
3. 导入 GitHub 仓库 `tarot-app`
4. 框架自动识别为 Next.js
5. 点击 "Deploy"

### 3. 获取 URL

部署完成后获得类似 `https://tarot-app.vercel.app` 的地址。

---

## iPhone 添加到主屏幕

1. 用 Safari 打开 Vercel URL
2. 点击底部 **分享按钮**（方框 + 箭头）
3. 滑动找到 **添加到主屏幕**
4. 确认名称 "樱花塔罗牌"
5. 点击 **添加**
6. 主屏幕出现 🌸 图标，点击即可像 App 一样打开

---

## PWA 配置清单

需要在项目中配置：

- [ ] `public/manifest.json`：应用名称、图标路径、主题色、显示模式
- [ ] `public/icons/icon-192x192.png`：小图标
- [ ] `public/icons/icon-512x512.png`：大图标
- [ ] `public/sw.js`：Service Worker（离线缓存）
- [ ] `layout.tsx` 中 `metadata.appleWebApp` 配置（已完成 ✅）

### manifest.json 模板

```json
{
  "name": "🌸 樱花塔罗牌",
  "short_name": "樱花塔罗",
  "description": "精美塔罗牌占卜应用",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#fff5f6",
  "theme_color": "#ffb3c1",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## 自定义域名（可选）

1. 购买域名（阿里云 / Namecheap 等）
2. 在 Vercel 项目设置 → Domains → 添加域名
3. 按指引配置 DNS 记录
4. Vercel 自动申请 HTTPS 证书

成本：域名约 $10-15/年

---

## 更新部署

推送到 GitHub 的 `main` 分支后，Vercel 自动重新部署：

```bash
git add .
git commit -m "描述你的改动"
git push
```

30 秒内新版本自动上线。
