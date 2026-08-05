import type { Metadata } from "next";
import { parseDemoTheme } from "@/components/design-demos/demo-theme";
import TarotDemo from "@/components/design-demos/TarotDemo";

export const metadata: Metadata = {
  title: "樱雾庭院 | 樱花塔罗设计 Demo",
  description: "轻盈安静的樱花塔罗首页设计方案。",
};

export default async function GardenDemoPage({
  searchParams,
}: {
  searchParams: Promise<{ theme?: string | string[] }>;
}) {
  const themeMode = parseDemoTheme((await searchParams).theme);
  return <TarotDemo variant="garden" themeMode={themeMode} />;
}
