'use client';

import type { AiDeckId, TarotCard, ThemeId } from '@/types';
import { getAiDeck } from '@/styles/ai-decks';
import { themeStyles } from '@/styles/themes';
import styles from './tarot-card.module.css';

interface CardFaceProps {
  card: TarotCard;
  themeId: ThemeId;
  isReversed?: boolean;
  revealed?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  aiDeckId?: AiDeckId;
}

export default function CardFace({
  card,
  themeId,
  isReversed = false,
  revealed = true,
  size = 'md',
  className = '',
  aiDeckId,
}: CardFaceProps) {
  const style = themeStyles[themeId];
  const aiDeck = themeId === 'ai' ? getAiDeck(aiDeckId) : null;

  if (!revealed) return null;

  if (aiDeck || themeId === 'sakura' || themeId === 'dreamy' || themeId === 'classic') {
    const illustratedFace =
      aiDeck
        ? styles.aiFace
        : themeId === 'dreamy'
        ? styles.dreamyFace
        : themeId === 'classic'
          ? styles.classicFace
          : styles.sakuraFace;
    const sheen =
      aiDeck
        ? styles.aiSheen
        : themeId === 'dreamy'
        ? styles.pearlSheen
        : themeId === 'classic'
          ? styles.classicSheen
          : styles.lacquerSheen;
    return (
      <div
        className={`${styles.card} ${styles[size]} ${illustratedFace} ${
          aiDeck?.contentTone === 'dark' ? styles.aiContentDark : ''
        } ${aiDeck?.labelTone === 'dark' ? styles.aiLabelDark : ''} ${
          aiDeck?.numberTone === 'dark' ? styles.aiNumberDark : ''
        } ${
          isReversed ? styles.reversed : ''
        } ${className}`}
        style={aiDeck ? { backgroundImage: `url('${aiDeck.faceImage}')` } : undefined}
      >
        <span className={sheen} aria-hidden="true" />

        <span className={styles.faceNumber}>
          {card.suit === 'major' ? romanNumeral(card.number) : card.number}
        </span>

        <span className={styles.symbolStage} aria-hidden="true">
          <span className={styles.cardSymbol}>{cardGlyph(card)}</span>
        </span>

        <span className={styles.faceTitle}>
          <strong>{card.nameZh}</strong>
          <small>{card.nameEn}</small>
        </span>

        {isReversed && <span className={styles.reverseSeal}>逆位</span>}
      </div>
    );
  }

  return (
    <div
      className={`${styles.card} ${styles[size]} ${styles.fallbackFace} ${
        style.cardBg
      } ${style.cardBorder} ${style.cardGlow} ${isReversed ? styles.reversed : ''} ${className}`}
    >
      <span className={`${styles.fallbackNumber} ${style.cardText}`}>
        {card.suit === 'major' ? romanNumeral(card.number) : card.number}
      </span>
      <span className={styles.fallbackSymbol}>{card.symbol}</span>
      <span className={`${styles.fallbackTitle} ${style.cardText}`}>
        <strong>{card.nameZh}</strong>
        <small>{card.nameEn}</small>
      </span>
      {isReversed && <span className={styles.reverseSeal}>逆位</span>}
    </div>
  );
}

function cardGlyph(card: TarotCard): string {
  const glyphs: Record<TarotCard['suit'], string> = {
    major: '✦',
    wands: '火',
    cups: '水',
    swords: '風',
    pentacles: '土',
  };

  return glyphs[card.suit];
}

function romanNumeral(n: number): string {
  const map: Record<number, string> = {
    0: '0',
    1: 'Ⅰ', 2: 'Ⅱ', 3: 'Ⅲ', 4: 'Ⅳ', 5: 'Ⅴ',
    6: 'Ⅵ', 7: 'Ⅶ', 8: 'Ⅷ', 9: 'Ⅸ', 10: 'Ⅹ',
    11: 'Ⅺ', 12: 'Ⅻ', 13: 'ⅩⅢ', 14: 'ⅩⅣ',
    15: 'ⅩⅤ', 16: 'ⅩⅥ', 17: 'ⅩⅦ', 18: 'ⅩⅧ',
    19: 'ⅩⅨ', 20: 'ⅩⅩ', 21: 'ⅩⅪ',
  };
  return map[n] ?? String(n);
}
