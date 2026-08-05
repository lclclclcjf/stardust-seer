import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import styles from "./demos.module.css";

export const metadata: Metadata = {
  title: "三个设计方向 | 樱花塔罗",
  description: "樱花塔罗的三套全新网页设计 Demo。",
};

const DEMOS = [
  {
    className: styles.garden,
    href: "/demos/garden",
    name: "樱雾庭院",
    english: "Sakura Garden",
    description: "安静、克制，以晨雾和留白承托占卜仪式。",
    image: "/demo-assets/sakura-garden.png",
    alt: "樱花枝、水钵与浅色塔罗牌",
    dials: "变化 6 / 动效 4 / 密度 3",
  },
  {
    className: styles.eclipse,
    href: "/demos/eclipse?theme=dark",
    name: "月蚀档案",
    english: "Eclipse Archive",
    description: "深色、精密，让每次抽牌像打开一份天文档案。",
    image: "/demo-assets/lunar-archive.png",
    alt: "黑色月相塔罗牌与银色日蚀环",
    dials: "变化 8 / 动效 6 / 密度 4",
  },
  {
    className: styles.theatre,
    href: "/demos/theatre",
    name: "花札剧场",
    english: "Hana Theatre",
    description: "大胆、明快，用海报构图把抽牌变成一次登场。",
    image: "/demo-assets/hana-theatre.png",
    alt: "蓝色背景中的纸艺樱花与塔罗牌",
    dials: "变化 9 / 动效 7 / 密度 4",
  },
];

export default function DemosPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <nav className={styles.nav} aria-label="设计 Demo 导航">
          <Link href="/">樱花塔罗</Link>
          <div>
            <Link href="/history">历史</Link>
            <Link href="/settings">设置</Link>
          </div>
        </nav>
      </header>

      <main className={styles.main}>
        <section className={styles.intro}>
          <p className={styles.eyebrow}>设计探索</p>
          <h1>
            同一场占卜
            <span>三种进入方式</span>
          </h1>
          <p>
            三个方案共享现有功能与内容，仅改变页面的节奏、材质和情绪。
          </p>
        </section>

        <section className={styles.demoGrid} aria-label="三个设计方案">
          {DEMOS.map((demo) => (
            <Link
              className={`${styles.demoCard} ${demo.className}`}
              href={demo.href}
              key={demo.name}
            >
              <div className={styles.imageWrap}>
                <Image
                  src={demo.image}
                  alt={demo.alt}
                  width={1120}
                  height={1400}
                  sizes="(max-width: 767px) 92vw, 55vw"
                  loading={demo.name === "樱雾庭院" ? "eager" : "lazy"}
                />
              </div>
              <div className={styles.cardCopy}>
                <span className={styles.english}>{demo.english}</span>
                <h2>{demo.name}</h2>
                <p>{demo.description}</p>
                <span className={styles.dials}>{demo.dials}</span>
                <span className={styles.openLabel}>打开 Demo</span>
              </div>
            </Link>
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
