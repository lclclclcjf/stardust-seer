import type { Metadata } from "next";
import { parseDemoTheme } from "@/components/design-demos/demo-theme";
import TarotDemo from "@/components/design-demos/TarotDemo";

export const metadata: Metadata = {
  title: "月蚀档案 | 樱花塔罗设计 Demo",
  description: "深色现代的樱花塔罗首页设计方案。",
};

export default async function EclipseDemoPage({
  searchParams,
}: {
  searchParams: Promise<{ theme?: string | string[] }>;
}) {
  const themeMode = parseDemoTheme((await searchParams).theme);
  return <TarotDemo variant="eclipse" themeMode={themeMode} />;
}
