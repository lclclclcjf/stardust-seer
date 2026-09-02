import type { Metadata } from "next";
import { parseDemoTheme } from "@/components/design-demos/demo-theme";
import { parseGardenSeason } from "@/components/design-demos/garden-season";
import TarotDemo from "@/components/design-demos/TarotDemo";

export const metadata: Metadata = {
  title: "樱雾庭院 | 樱花塔罗设计 Demo",
  description: "轻盈安静的樱花塔罗首页设计方案。",
};

export default async function GardenDemoPage({
  searchParams,
}: {
  searchParams: Promise<{ theme?: string | string[]; season?: string | string[] }>;
}) {
  const params = await searchParams;
  const themeMode = parseDemoTheme(params.theme);
  const gardenSeason = parseGardenSeason(params.season);
  return <TarotDemo variant="garden" themeMode={themeMode} gardenSeason={gardenSeason} />;
}
