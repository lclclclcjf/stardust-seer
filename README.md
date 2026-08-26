# 樱花塔罗

一个以樱雾庭院为主题的本地塔罗体验。基础牌义始终在浏览器内可用；只有用户输入了非空问题时，解读页才会请求服务端生成 AI 个性解读。

## Getting Started

安装依赖并启动开发服务器：

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

## AI 个性解读

复制 `.env.example` 为 `.env.local`，只在服务端填写密钥：

```dotenv
OPENAI_API_KEY=your_server_side_key
OPENAI_MODEL=gpt-5.4-mini
```

密钥不会发送到浏览器。服务端使用 Responses API 的结构化输出，并设置 `store: false`。未配置密钥、请求失败或 AI 返回异常时，页面会保留原有基础牌义作为兜底。

服务端默认对同一来源限制为每分钟 5 次，并对相同牌面请求进行并发合并和 30 分钟短期复用。连续上游失败会触发 60 秒熔断。可在 `.env.local` 中通过 `AI_RATE_LIMIT_MAX`、`AI_RATE_LIMIT_WINDOW_SECONDS` 和 `AI_RATE_LIMIT_SALT` 调整；公开部署时还应在托管平台启用分布式限流。

空字符串、只有空格或未填写问题的占卜不会挂载 AI 面板，也不会调用 `/api/readings/generate`。接口本身还会再次校验这一条件。

验证 AI 请求边界：

```bash
npm run test:ai
npm run lint
npm run build
```

在正式公开部署前，仍建议在托管平台增加按 IP/账户的分布式限流与用量告警，避免公开接口被滥用产生费用。
