import type { Metadata } from "next";
import { parseDemoTheme } from "@/components/design-demos/demo-theme";
import { parseGardenSeason } from "@/components/design-demos/garden-season";
import TarotDemo from "@/components/design-demos/TarotDemo";

export const metadata: Metadata = {
  title: "樱雾庭院 | 樱花塔罗",
  description: "在樱花庭院中静下心来，选择牌阵并开始一次属于你的塔罗占卜。",
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ theme?: string | string[]; season?: string | string[] }>;
}) {
  const params = await searchParams;
  const themeMode = parseDemoTheme(params.theme);
  const gardenSeason = parseGardenSeason(params.season);

  return (
    <TarotDemo
      variant="garden"
      themeMode={themeMode}
      gardenSeason={gardenSeason}
      experienceMode="production"
    />
  );
}
