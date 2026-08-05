"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ThemeId } from "@/types";
import { DEFAULT_AI_DECK_ID, randomAiDeckId } from "@/styles/ai-decks";
import type { DemoThemeMode } from "./demo-theme";
import styles from "./tarot-demo.module.css";

export type DemoVariant = "garden" | "eclipse" | "theatre";

type DemoConfig = {
  route: string;
  eyebrow: string;
  title: [string, string];
  intro: string;
  image: string;
  darkImage?: string;
  imageAlt: string;
  defaultCardTheme: ThemeId;
};

const DEMOS: Record<DemoVariant, DemoConfig> = {
  garden: {
    route: "/demos/garden",
    eyebrow: "樱雾庭院",
    title: ["在花落之前", "问问内心"],
    intro: "选一副牌阵，把此刻最真实的问题交给直觉。",
    image: "/demo-assets/sakura-garden-hero-light.png",
    darkImage: "/demo-assets/sakura-garden-hero-dark.png",
    imageAlt: "樱花、石灯笼、水钵与塔罗牌组成的静谧庭院",
    defaultCardTheme: "sakura",
  },
  eclipse: {
    route: "/demos/eclipse",
    eyebrow: "月蚀档案",
    title: ["让未知", "显出轮廓"],
    intro: "从纷乱中抽出一条线索，读懂此刻正在形成的方向。",
    image: "/demo-assets/lunar-archive.png",
    imageAlt: "黑色月相塔罗牌与银色日蚀环组成的静物",
    defaultCardTheme: "classic",
  },
  theatre: {
    route: "/demos/theatre",
    eyebrow: "花札剧场",
    title: ["抽一张牌", "改变镜头"],
    intro: "把问题放到台前，让牌面替你换一个观看角度。",
    image: "/demo-assets/hana-theatre.png",
    imageAlt: "蓝色背景中的纸艺樱花与两张白色塔罗牌",
    defaultCardTheme: "ai",
  },
};

const CARD_THEMES = [
  { value: "sakura", name: "日式樱花", detail: "清醒柔和" },
  { value: "dreamy", name: "梦幻治愈", detail: "温柔直觉" },
  { value: "classic", name: "经典重构", detail: "沉静象征" },
  { value: "ai", name: "AI 自由", detail: "开放想象" },
];

const SPREADS = [
  { value: "single", count: "1", name: "单张牌", detail: "今日指引" },
  { value: "three", count: "3", name: "三张牌", detail: "过去 / 现在 / 未来" },
  { value: "celtic-cross", count: "10", name: "凯尔特十字", detail: "完整梳理" },
];

export default function TarotDemo({
  variant,
  themeMode,
  experienceMode = "demo",
}: {
  variant: DemoVariant;
  themeMode: DemoThemeMode;
  experienceMode?: "demo" | "production";
}) {
  const demoRef = useRef<HTMLDivElement>(null);
  const [aiDeckId, setAiDeckId] = useState(DEFAULT_AI_DECK_ID);
  const demo = DEMOS[variant];
  const nextTheme = themeMode === "dark" ? "light" : "dark";
  const themeLabel = themeMode === "dark" ? "浅色预览" : "深色预览";
  const isProduction = experienceMode === "production";
  const pageRoute = isProduction ? "/" : demo.route;
  const activeImage =
    themeMode === "dark" && demo.darkImage ? demo.darkImage : demo.image;

  useEffect(() => {
    if (variant !== "garden") return;

    const root = demoRef.current;
    const hero = root?.querySelector<HTMLElement>("main > section");
    const reading = root?.querySelector<HTMLElement>("#reading");
    if (!root || !hero || !reading) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const clamp = (value: number) => Math.min(1, Math.max(0, value));
    const thresholds = Array.from({ length: 101 }, (_, index) => index / 100);

    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        if (reducedMotion.matches) return;
        const heroProgress = clamp((1 - entry.intersectionRatio) / 0.72);
        root.style.setProperty("--garden-hero-progress", heroProgress.toFixed(4));
      },
      { threshold: thresholds },
    );

    const readingObserver = new IntersectionObserver(
      ([entry]) => {
        if (reducedMotion.matches) return;
        const viewportHeight = entry.rootBounds?.height ?? window.innerHeight;
        const revealStart = viewportHeight * 0.96;
        const revealDistance = viewportHeight * 0.68;
        const readingProgress = clamp(
          (revealStart - entry.boundingClientRect.top) / revealDistance,
        );
        root.style.setProperty(
          "--garden-reading-progress",
          readingProgress.toFixed(4),
        );
      },
      { threshold: thresholds },
    );

    const syncMotionPreference = () => {
      if (reducedMotion.matches) {
        root.style.setProperty("--garden-hero-progress", "0");
        root.style.setProperty("--garden-reading-progress", "1");
      }
    };

    syncMotionPreference();
    heroObserver.observe(hero);
    readingObserver.observe(reading);
    reducedMotion.addEventListener("change", syncMotionPreference);

    return () => {
      heroObserver.disconnect();
      readingObserver.disconnect();
      reducedMotion.removeEventListener("change", syncMotionPreference);
    };
  }, [variant]);

  return (
    <div
      ref={demoRef}
      className={`${styles.demo} ${styles[variant]} ${styles[themeMode]}`}
      data-testid={`demo-${variant}`}
    >
      <header className={styles.siteHeader}>
        <nav className={styles.nav} aria-label={isProduction ? "主导航" : "Demo 导航"}>
          <Link className={styles.brand} href="/">
            樱花塔罗
          </Link>
          <div className={styles.navLinks}>
            <Link href="/demos">设计总览</Link>
            <Link href="/history">历史</Link>
            <Link href="/settings">设置</Link>
            <Link
              className={styles.themeSwitch}
              href={`${pageRoute}?theme=${nextTheme}`}
              rel="nofollow"
            >
              {themeLabel}
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <section id="top" data-purpose="hero" className={styles.hero} aria-labelledby={`${variant}-title`}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>{demo.eyebrow}</p>
            <h1 id={`${variant}-title`} className={styles.heroTitle}>
              <span>{demo.title[0]}</span>
              <span>{demo.title[1]}</span>
            </h1>
            <p className={styles.heroIntro}>{demo.intro}</p>
            <div className={styles.heroActions}>
              <a className={styles.primaryAction} href="#reading">
                开始提问
              </a>
              <Link className={styles.secondaryAction} href={isProduction ? "/history" : "/demos"}>
                {isProduction ? "查看历史" : "查看其他方案"}
              </Link>
            </div>
          </div>

          <div className={styles.heroVisual}>
            {themeMode === "auto" && demo.darkImage ? (
              <picture className={styles.heroPicture}>
                <source
                  media="(prefers-color-scheme: dark)"
                  srcSet={demo.darkImage}
                />
                <Image
                  className={styles.heroImage}
                  src={demo.image}
                  alt={demo.imageAlt}
                  width={1792}
                  height={1024}
                  sizes={variant === "garden" ? "100vw" : "(max-width: 767px) 92vw, 48vw"}
                  loading="eager"
                />
              </picture>
            ) : (
              <Image
                className={styles.heroImage}
                src={activeImage}
                alt={demo.imageAlt}
                width={variant === "garden" ? 1792 : 1120}
                height={variant === "garden" ? 1024 : 1400}
                sizes={variant === "garden" ? "100vw" : "(max-width: 767px) 92vw, 48vw"}
                loading="eager"
              />
            )}
            <div className={styles.imageFrame} aria-hidden="true" />
          </div>
        </section>

        <section id="reading" data-purpose="divination-setup" className={styles.readingSection}>
          <div className={styles.sectionHeading}>
            <h2>为这次占卜定下语气</h2>
            <p>
              {isProduction
                ? "选择牌面、牌阵与问题，让庭院为你展开一次正式占卜。"
                : "选择牌面、牌阵与问题，然后进入现有抽牌流程。"}
            </p>
          </div>

          <form className={styles.readingForm} action="/draw" method="get">
            <input name="aiDeck" type="hidden" value={aiDeckId} readOnly />
            <fieldset className={styles.controlGroup}>
              <legend>牌面风格</legend>
              <div className={styles.themeGrid}>
                {CARD_THEMES.map((theme) => (
                  <div className={styles.optionWrap} key={theme.value}>
                    <input
                      className={styles.choiceInput}
                      id={`${variant}-theme-${theme.value}`}
                      name="theme"
                      type="radio"
                      value={theme.value}
                      defaultChecked={theme.value === demo.defaultCardTheme}
                      onClick={
                        theme.value === "ai"
                          ? () => setAiDeckId(randomAiDeckId())
                          : undefined
                      }
                    />
                    <label
                      className={styles.themeOption}
                      htmlFor={`${variant}-theme-${theme.value}`}
                    >
                      <span
                        className={`${styles.themeSwatch} ${styles[`swatch${theme.value}`]}`}
                        aria-hidden="true"
                      />
                      <span>
                        <strong>{theme.name}</strong>
                        <small>{theme.detail}</small>
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </fieldset>

            <fieldset className={styles.controlGroup}>
              <legend>牌阵</legend>
              <div className={styles.spreadGrid}>
                {SPREADS.map((spread) => (
                  <div className={styles.optionWrap} key={spread.value}>
                    <input
                      className={styles.choiceInput}
                      id={`${variant}-spread-${spread.value}`}
                      name="spread"
                      type="radio"
                      value={spread.value}
                      defaultChecked={spread.value === "single"}
                    />
                    <label
                      className={styles.spreadOption}
                      htmlFor={`${variant}-spread-${spread.value}`}
                    >
                      <span className={styles.spreadCount}>{spread.count}</span>
                      <span>
                        <strong>{spread.name}</strong>
                        <small>{spread.detail}</small>
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </fieldset>

            <div className={styles.questionGroup}>
              <label htmlFor={`${variant}-question`}>想问什么？</label>
              <textarea
                id={`${variant}-question`}
                name="question"
                rows={3}
                maxLength={240}
                placeholder="例如：接下来最值得我投入精力的方向是什么？"
                aria-describedby={`${variant}-question-help`}
              />
              <p id={`${variant}-question-help`}>
                问题可以留空。明确的问题通常会得到更聚焦的解读。
              </p>
            </div>

            <button className={styles.submitButton} type="submit">
              开始占卜
            </button>
          </form>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>{isProduction ? "樱雾庭院 · 樱花塔罗" : "樱花塔罗设计实验"}</p>
        <Link href={isProduction ? "#top" : "/demos"}>
          {isProduction ? "返回庭院" : "返回三个方案"}
        </Link>
      </footer>
    </div>
  );
}
