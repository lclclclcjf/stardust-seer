import type { Metadata } from "next";
import Link from "next/link";
import { getArtbookAssets } from "@/lib/artbook-assets";
import ArtbookGallery from "./ArtbookGallery";
import styles from "./artbook.module.css";

export const metadata: Metadata = {
  title: "艺术设定集 | 樱花塔罗",
  description: "浏览樱花塔罗已经上线的主题背景、牌面与牌背设计。",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, noimageindex: true } },
};

export default async function ArtbookPage() {
  const { backgrounds, cards } = await getArtbookAssets();
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <nav className={styles.nav} aria-label="艺术设定集导航">
          <Link className={styles.brand} href="/">樱花塔罗</Link>
          <div>
            <Link href="/demos">更多主题</Link>
            <span aria-current="page">艺术设定集</span>
            <Link href="/history">历史</Link>
            <Link href="/settings">设置</Link>
          </div>
        </nav>
      </header>
      <main className={styles.main}>
        <section className={styles.intro} data-purpose="artbook-intro">
          <p>SAKURA TAROT · ART BOOK</p>
          <h1>艺术设定集</h1>
          <div><p>收藏庭院的四季、剧场的幕光、月蚀的轨迹，以及每一副曾陪你翻开的牌。</p><small>只读展览 · 点击作品可放大查看</small></div>
        </section>
        <ArtbookGallery backgrounds={backgrounds} cards={cards} />
      </main>
      <footer className={styles.footer}><p>作品仅供站内欣赏</p><Link href="/">返回庭院</Link></footer>
    </div>
  );
}
