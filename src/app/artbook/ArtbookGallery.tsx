"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { ArtbookAsset } from "@/lib/artbook-assets";
import styles from "./artbook.module.css";

function AssetList({ assets, cards, onOpen }: { assets: ArtbookAsset[]; cards?: boolean; onOpen: (asset: ArtbookAsset) => void }) {
  return (
    <ul className={cards ? styles.cardGrid : styles.backgroundGrid}>
      {assets.map((asset, index) => (
        <li key={asset.id}>
          <button type="button" className={styles.assetButton} onClick={() => onOpen(asset)} aria-label={`放大查看${asset.title}`}>
            <span className={cards ? styles.cardMedia : styles.backgroundMedia}>
              <Image src={asset.src} alt={asset.title} fill sizes={cards ? "(max-width: 640px) 42vw, 180px" : "(max-width: 760px) 92vw, 46vw"} priority={!cards && index < 2} draggable={false} />
            </span>
            <span className={styles.assetCaption}>{asset.title}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

export default function ArtbookGallery({ backgrounds, cards }: { backgrounds: ArtbookAsset[]; cards: ArtbookAsset[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<ArtbookAsset | null>(null);
  const open = (asset: ArtbookAsset) => {
    setSelected(asset);
    window.requestAnimationFrame(() => dialogRef.current?.showModal());
  };
  const close = () => dialogRef.current?.close();

  if (!backgrounds.length && !cards.length) return <p className={styles.empty} role="status">设定集正在整理中。</p>;
  return (
    <div onContextMenu={(event) => event.preventDefault()} onDragStart={(event) => event.preventDefault()}>
      <section className={styles.collection} aria-labelledby="background-heading" data-purpose="background-collection">
        <div className={styles.sectionHeading}><p>SCENES</p><h2 id="background-heading">全屏背景</h2><span>{backgrounds.length} 幅</span></div>
        <AssetList assets={backgrounds} onOpen={open} />
      </section>
      <section className={styles.collection} aria-labelledby="cards-heading" data-purpose="card-collection">
        <div className={styles.sectionHeading}><p>DECKS</p><h2 id="cards-heading">牌面与牌背</h2><span>{cards.length} 张</span></div>
        <AssetList assets={cards} cards onOpen={open} />
      </section>
      <dialog ref={dialogRef} className={styles.viewer} onClose={() => setSelected(null)} aria-label={selected ? `查看${selected.title}` : "作品预览"}>
        {selected && (
          <div className={styles.viewerInner}>
            <button type="button" className={styles.closeButton} onClick={close} aria-label="关闭预览">×</button>
            <div className={selected.kind === "background" ? styles.viewerBackground : styles.viewerCard}>
              <Image src={selected.src} alt={selected.title} fill sizes="95vw" priority draggable={false} />
            </div>
            <p>{selected.title}</p>
          </div>
        )}
      </dialog>
    </div>
  );
}
