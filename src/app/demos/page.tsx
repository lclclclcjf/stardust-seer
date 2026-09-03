import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import styles from "./demos.module.css";
import { MotionThemeCard, ThemeRippleField } from "./ThemeMotion";

export const metadata: Metadata = {
  title: "更多主题 | 樱花塔罗",
  description: "欢迎探索樱花塔罗的其他主题。",
};

const DEMOS = [
  {
    className: styles.garden,
    href: "/demos/garden",
    name: "樱雾庭院",
    english: "Sakura Garden",
    description: "安静、克制，以晨雾和留白承托占卜仪式。",
    image: "/demo-assets/sakura-garden-hero-light-v3.webp",
    alt: "樱花枝、水钵与浅色塔罗牌",
  },
  {
    className: styles.eclipse,
    href: "/demos/eclipse?theme=dark",
    name: "月蚀档案",
    english: "Eclipse Archive",
    description: "深色、精密，让每次抽牌像打开一份天文档案。",
    image: "/demo-assets/lunar-archive.png",
    alt: "黑色月相塔罗牌与银色日蚀环",
  },
  {
    className: styles.theatre,
    href: "/demos/theatre",
    name: "花札剧场",
    english: "Hana Theatre",
    description: "幕光、面具与飞牌交叠，让每次抽牌成为一次登场。",
    image: "/demo-assets/hana-theatre-opera-light-v3.png",
    alt: "欧式剧场舞台中的戏剧面具与飞落塔罗牌",
  },
];

export default function DemosPage() {
  return (
    <div className={styles.page}>
      <ThemeRippleField />
      <header className={styles.header}>
        <nav className={styles.nav} aria-label="设计 Demo 导航">
          <Link href="/">樱花塔罗</Link>
          <div>
            <Link href="/demos" aria-current="page">更多主题</Link>
            <Link href="/artbook">艺术设定集</Link>
            <Link href="/history">历史</Link>
            <Link href="/settings">设置</Link>
          </div>
        </nav>
      </header>

      <main className={styles.main}>
        <section className={styles.intro} data-purpose="theme-intro">
          <h1>
            同一场占卜
            <span>三种进入方式</span>
          </h1>
          <p>
            欢迎探索其他主题，找到与你此刻心境相合的占卜庭院。
          </p>
        </section>

        <section className={styles.demoGrid} data-purpose="theme-gallery" aria-label="其他占卜主题">
          {DEMOS.map((demo) => (
            <MotionThemeCard
              className={demo.className}
              href={demo.href}
              key={demo.name}
            >
              <div className={styles.imageWrap}>
                <Image
                  src={demo.image}
                  alt={demo.alt}
                  width={1120}
                  height={1400}
                  sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 980px) 31vw, 420px"
                  loading={demo.name === "樱雾庭院" ? "eager" : "lazy"}
                />
              </div>
              <div className={styles.cardCopy}>
                <span className={styles.english}>{demo.english}</span>
                <h2>{demo.name}</h2>
                <p>{demo.description}</p>
                <span className={styles.openLabel}>进入</span>
              </div>
            </MotionThemeCard>
          ))}
        </section>
      </main>

      <footer className={styles.footer}>
        <p>基于项目文档与现有流程构建</p>
        <Link href="/">进入正式庭院</Link>
      </footer>
    </div>
  );
}
