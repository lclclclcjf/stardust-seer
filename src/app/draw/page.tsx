'use client';

import { use, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { DrawnCard, ThemeId } from '@/types';
import { parseAiDeckId } from '@/styles/ai-decks';
import { parseDemoTheme } from '@/components/design-demos/demo-theme';
import { getSpreadById } from '@/data/spreads';
import { getCardById } from '@/data/cards';
import { performDraw } from '@/hooks/useTarot';
import CardBack from '@/components/CardBack';
import CardFace from '@/components/CardFace';
import styles from './draw.module.css';

type DrawPhase = 'shuffling' | 'selecting' | 'revealing';

export default function DrawPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = use(searchParams);
  const router = useRouter();

  const spreadId = (params.spread as string) || 'single';
  const themeId = (params.theme as ThemeId) || 'sakura';
  const aiDeckId = parseAiDeckId(params.aiDeck);
  const uiTheme = parseDemoTheme(params.uiTheme);
  const question = (params.question as string) || '';

  const spread = getSpreadById(spreadId);
  const [phase, setPhase] = useState<DrawPhase>('shuffling');
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [revealed, setRevealed] = useState<boolean[]>([]);
  const [drawId, setDrawId] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const result = performDraw(spreadId, themeId, question, aiDeckId, uiTheme);
      setDrawnCards(result.cards);
      setDrawId(result.id);
      setRevealed(new Array(result.cards.length).fill(false));
      setPhase('selecting');
    }, 1500);

    return () => window.clearTimeout(timer);
  }, [spreadId, themeId, question, aiDeckId, uiTheme]);

  useEffect(() => {
    if (phase !== 'revealing' || !drawId) return;

    const timer = window.setTimeout(() => {
      router.push(`/reading?drawId=${drawId}&uiTheme=${uiTheme}`);
    }, 1500);

    return () => window.clearTimeout(timer);
  }, [phase, drawId, router, uiTheme]);

  const handleReveal = useCallback(
    (index: number) => {
      if (phase !== 'selecting' || revealed[index]) return;

      const nextRevealed = [...revealed];
      nextRevealed[index] = true;
      setRevealed(nextRevealed);

      if (nextRevealed.every(Boolean)) {
        setPhase('revealing');
      }
    },
    [phase, revealed]
  );

  if (!spread) {
    return (
      <main className={styles.page}>
        <div className={styles.invalidState}>
          <p>这个牌阵不存在。</p>
          <button type="button" onClick={() => router.push('/')}>
            返回首页
          </button>
        </div>
      </main>
    );
  }

  const revealedCount = revealed.filter(Boolean).length;
  const layoutClass =
    spread.cardCount === 1
      ? styles.singleGrid
      : spread.cardCount === 3
        ? styles.threeGrid
        : styles.tenGrid;
  const cardSize = spread.cardCount === 1 ? 'lg' : spread.cardCount === 3 ? 'md' : 'sm';

  return (
    <main className={styles.page}>
      <div className={styles.backdrop} aria-hidden="true" />
      <div className={styles.mist} aria-hidden="true" />

      <header className={styles.topBar}>
        <button type="button" className={styles.backButton} onClick={() => router.back()}>
          <span aria-hidden="true">←</span>
          返回庭院
        </button>
        <p>SAKURA DIVINATION</p>
        <span className={styles.stepMark}>抽牌仪式 · 02</span>
      </header>

      <section className={styles.ritual} aria-live="polite">
        <div className={styles.heading}>
          <p className={styles.eyebrow}>{spread.nameEn}</p>
          <h1>{spread.nameZh}</h1>
          <p className={styles.status}>
            {phase === 'shuffling' && '静候牌组回应你的问题'}
            {phase === 'selecting' && `依次翻开 ${spread.cardCount} 张牌`}
            {phase === 'revealing' && '牌面已经显现，正在进入解读'}
          </p>
          {question && <p className={styles.question}>「{question}」</p>}
        </div>

        {phase === 'shuffling' && (
          <div className={styles.shuffleStage}>
            <div className={styles.shuffleDeck} aria-label="正在洗牌">
              {[0, 1, 2].map((index) => (
                <div key={index} className={styles.shuffleCard}>
                  <CardBack themeId={themeId} aiDeckId={aiDeckId} size="md" className={styles.fillCard} />
                </div>
              ))}
            </div>
            <p>让呼吸慢下来，答案正在靠近</p>
          </div>
        )}

        {(phase === 'selecting' || phase === 'revealing') && drawnCards.length > 0 && (
          <div className={styles.cardViewport}>
            <div className={`${styles.cardGrid} ${layoutClass}`}>
              {drawnCards.map((drawnCard, index) => {
                const card = getCardById(drawnCard.cardId);
                if (!card) return null;

                const isRevealed = revealed[index];
                const position = spread.positions[index];

                return (
                  <article key={`${drawnCard.cardId}-${index}`} className={styles.cardSlot}>
                    <div className={styles.positionLabel}>
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <strong>{position?.nameZh || `牌 ${index + 1}`}</strong>
                      <small>{position?.nameEn}</small>
                    </div>

                    <button
                      type="button"
                      className={`${styles.flipCard} ${isRevealed ? styles.isRevealed : ''}`}
                      onClick={() => handleReveal(index)}
                      disabled={isRevealed || phase === 'revealing'}
                      aria-label={isRevealed ? `${position?.nameZh || '牌卡'}已翻开` : `翻开${position?.nameZh || '牌卡'}`}
                    >
                      <span className={styles.flipInner}>
                        <span className={`${styles.cardSide} ${styles.backSide}`}>
                          <CardBack themeId={themeId} aiDeckId={aiDeckId} size={cardSize} className={styles.fillCard} />
                        </span>
                        <span className={`${styles.cardSide} ${styles.faceSide}`}>
                          <CardFace
                            card={card}
                            themeId={themeId}
                            aiDeckId={aiDeckId}
                            isReversed={drawnCard.isReversed}
                            size={cardSize}
                            className={styles.fillCard}
                          />
                        </span>
                      </span>
                    </button>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {(phase === 'selecting' || phase === 'revealing') && (
        <footer className={styles.progress}>
          <span className={styles.progressLine} aria-hidden="true">
            <i style={{ width: `${(revealedCount / spread.cardCount) * 100}%` }} />
          </span>
          <p>
            {phase === 'selecting' ? '轻触牌背，让它翻向你' : '请停留片刻，感受牌面的第一印象'}
            <span>{revealedCount} / {spread.cardCount}</span>
          </p>
        </footer>
      )}
    </main>
  );
}
