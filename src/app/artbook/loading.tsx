import styles from "./artbook.module.css";

export default function ArtbookLoading() {
  return (
    <main className={`${styles.page} ${styles.loading}`} aria-busy="true" aria-label="正在整理艺术设定集">
      <p>SAKURA TAROT · ART BOOK</p>
      <h1>正在展开设定集</h1>
      <div aria-hidden="true" />
    </main>
  );
}
