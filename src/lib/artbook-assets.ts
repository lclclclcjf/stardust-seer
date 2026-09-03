import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { AI_DECKS } from "@/styles/ai-decks";

export interface ArtbookAsset {
  id: string;
  src: string;
  title: string;
  kind: "background" | "card-back" | "card-face";
}

const ASSET_PATTERN = /\/(?:demo-assets|card-assets)\/[A-Za-z0-9._/-]+\.(?:avif|jpe?g|png|webp)/g;
const CORE_CARDS = [
  "/card-assets/sakura-card-back-v3.webp",
  "/card-assets/sakura-card-face-v3.webp",
  "/card-assets/dreamy-card-back-v1.webp",
  "/card-assets/dreamy-card-face-v1.webp",
  "/card-assets/classic-card-back-v1.webp",
  "/card-assets/classic-card-face-v1.webp",
];

const BACKGROUND_TITLES: Record<string, string> = {
  "sakura-garden-hero-light-v3.webp": "樱雾庭院 · 春日",
  "sakura-garden-hero-dark-v3.webp": "樱雾庭院 · 春夜",
  "garden-summer-light.webp": "樱雾庭院 · 夏日",
  "garden-summer-dark.webp": "樱雾庭院 · 夏夜",
  "garden-autumn-light.webp": "樱雾庭院 · 秋日",
  "garden-autumn-dark.webp": "樱雾庭院 · 秋夜",
  "garden-winter-light.webp": "樱雾庭院 · 冬日",
  "garden-winter-dark.webp": "樱雾庭院 · 冬夜",
  "eclipse-archive-hero-light-v2.png": "月蚀档案 · 浅色",
  "eclipse-archive-hero-dark-v1.png": "月蚀档案 · 深色",
  "hana-theatre-opera-light-v3.png": "花札剧场 · 日光",
  "hana-theatre-opera-dark-v3.png": "花札剧场 · 夜幕",
  "history-garden-v2.webp": "庭院 · 历史记录",
  "lunar-archive.png": "月蚀档案 · 主题牌",
};

const CARD_SERIES: Record<string, string> = {
  sakura: "樱花庭院",
  dreamy: "梦幻治愈",
  classic: "经典重构",
};

async function walk(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const paths = await Promise.all(entries.map((entry) => {
    const current = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(current) : Promise.resolve([current]);
  }));
  return paths.flat();
}

async function referencedAssets(): Promise<Set<string>> {
  const sources = await walk(path.join(process.cwd(), "src"));
  const assets = new Set<string>();
  await Promise.all(sources.filter((file) => /\.(?:css|ts|tsx)$/.test(file)).map(async (file) => {
    const content = await readFile(file, "utf8");
    content.match(ASSET_PATTERN)?.forEach((asset) => assets.add(asset));
  }));
  CORE_CARDS.forEach((asset) => assets.add(asset));
  AI_DECKS.forEach((deck) => {
    assets.add(deck.backImage);
    assets.add(deck.faceImage);
  });
  return assets;
}

function cardTitle(filename: string): string {
  const aiDeck = AI_DECKS.find((deck) => filename.includes(`ai-${deck.id}-card-`));
  const series = aiDeck?.nameZh ?? Object.entries(CARD_SERIES).find(([id]) => filename.startsWith(id))?.[1] ?? "塔罗设计";
  return `${series} · ${filename.includes("-back-") ? "牌背" : "牌面"}`;
}

export async function getArtbookAssets(): Promise<{ backgrounds: ArtbookAsset[]; cards: ArtbookAsset[] }> {
  const publicRoot = path.join(process.cwd(), "public");
  const assets = [...await referencedAssets()];
  const existing = (await Promise.all(assets.map(async (src) => {
    try {
      await access(path.join(publicRoot, ...src.slice(1).split("/")));
      return src;
    } catch {
      return null;
    }
  }))).filter((src): src is string => src !== null);

  const backgrounds = existing.filter((src) => src.startsWith("/demo-assets/")).map((src) => {
    const filename = path.posix.basename(src);
    return { id: filename, src, title: BACKGROUND_TITLES[filename] ?? filename.replace(/[-_]/g, " "), kind: "background" as const };
  }).sort((a, b) => a.title.localeCompare(b.title, "zh-CN"));

  const cards = existing.filter((src) => src.startsWith("/card-assets/")).map((src) => {
    const filename = path.posix.basename(src);
    const kind = filename.includes("-back-") ? "card-back" as const : "card-face" as const;
    return { id: filename, src, title: cardTitle(filename), kind };
  }).sort((a, b) => a.title.localeCompare(b.title, "zh-CN"));
  return { backgrounds, cards };
}
