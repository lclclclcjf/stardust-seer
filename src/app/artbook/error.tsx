"use client";

import Link from "next/link";
import styles from "./artbook.module.css";

export default function ArtbookError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className={`${styles.page} ${styles.errorState}`}>
      <section role="alert">
        <p>SAKURA TAROT · ART BOOK</p><h1>设定集暂时合上了</h1>
        <span>作品没有顺利展开，你可以再次尝试。</span>
        <div><button type="button" onClick={reset}>再试一次</button><Link href="/">返回庭院</Link></div>
      </section>
    </main>
  );
}
