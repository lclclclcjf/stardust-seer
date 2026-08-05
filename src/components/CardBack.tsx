'use client';

import type { AiDeckId, ThemeId } from '@/types';
import { getAiDeck } from '@/styles/ai-decks';
import { themeStyles } from '@/styles/themes';
import styles from './tarot-card.module.css';

interface CardBackProps {
  themeId: ThemeId;
  onClick?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  aiDeckId?: AiDeckId;
}

export default function CardBack({
  themeId,
  onClick,
  disabled = false,
  size = 'md',
  className = '',
  aiDeckId,
}: CardBackProps) {
  const style = themeStyles[themeId];
  const aiDeck = themeId === 'ai' ? getAiDeck(aiDeckId) : null;
  const illustratedBack =
    aiDeck
      ? styles.aiBack
      : themeId === 'sakura'
      ? styles.sakuraBack
      : themeId === 'dreamy'
        ? styles.dreamyBack
        : themeId === 'classic'
          ? styles.classicBack
          : null;
  const sheen =
    aiDeck
      ? styles.aiSheen
      : themeId === 'dreamy'
      ? styles.pearlSheen
      : themeId === 'classic'
        ? styles.classicSheen
        : styles.lacquerSheen;
  const classes = `${styles.card} ${styles[size]} ${
    illustratedBack ?? `${style.backBg} ${styles.fallbackBack}`
  } ${disabled ? styles.disabled : ''} ${className}`;

  const content = (
    <>
      {illustratedBack ? (
        <span className={sheen} aria-hidden="true" />
      ) : (
        <span className={styles.fallbackPattern} aria-hidden="true">
          {style.backPattern}
        </span>
      )}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`${classes} ${styles.interactive}`}
        style={aiDeck ? { backgroundImage: `url('${aiDeck.backImage}')` } : undefined}
        aria-label="翻开牌卡"
      >
        {content}
      </button>
    );
  }

  return (
    <div
      className={classes}
      style={aiDeck ? { backgroundImage: `url('${aiDeck.backImage}')` } : undefined}
    >
      {content}
    </div>
  );
}
