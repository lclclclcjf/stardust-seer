import type { Metadata } from "next";
import { parseDemoTheme } from "@/components/design-demos/demo-theme";
import TarotDemo from "@/components/design-demos/TarotDemo";

export const metadata: Metadata = {
  title: "花札剧场 | 樱花塔罗设计 Demo",
  description: "大胆图形化的樱花塔罗首页设计方案。",
};

export default async function TheatreDemoPage({
  searchParams,
}: {
  searchParams: Promise<{ theme?: string | string[] }>;
}) {
  const themeMode = parseDemoTheme((await searchParams).theme);
  return <TarotDemo variant="theatre" themeMode={themeMode} />;
}
