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
  title: "樱雾庭院 · 樱花塔罗",
  description: "在樱花庭院中选择牌阵、翻开牌面，聆听此刻内心的声音。",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "樱花塔罗牌",
  },
};

export const viewport: Viewport = {
  themeColor: "#142922",
  width: "device-width",
  initialScale: 1,
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
