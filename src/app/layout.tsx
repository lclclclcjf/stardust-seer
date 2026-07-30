import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "🌸 星尘占卜 · 樱花塔罗牌",
  description: "星尘占卜 — 塔罗牌、算卦等玄学工具，四种牌面风格，中英双语解读",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "樱花塔罗牌",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffb3c1",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
