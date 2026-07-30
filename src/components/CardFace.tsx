'use client';

import type { TarotCard, ThemeId } from '@/types';
import { themeStyles } from '@/styles/themes';

interface CardFaceProps {
  card: TarotCard;
  themeId: ThemeId;
  isReversed?: boolean;
  revealed?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function CardFace({
  card,
  themeId,
  isReversed = false,
  revealed = true,
  size = 'md',
}: CardFaceProps) {
  const style = themeStyles[themeId];

  const sizeClasses = {
    sm: 'w-24 h-36 text-sm',
    md: 'w-36 h-52 text-base',
    lg: 'w-48 h-72 text-lg',
  };

  if (!revealed) return null;

  return (
    <div
      className={`
        ${sizeClasses[size]}
        ${style.cardBg}
        ${style.cardBorder}
        ${style.cardGlow}
        border-2 rounded-2xl flex flex-col items-center justify-center
        select-none transition-all duration-500
        ${isReversed ? 'rotate-180' : ''}
      `}
    >
      {/* 牌号 */}
      <div className={`text-center mb-1 ${size === 'sm' ? 'text-xs' : ''}`}>
        <span className={`font-bold ${style.cardText} opacity-60 font-mono`}>
          {card.suit === 'major' ? romanNumeral(card.number) : card.number}
        </span>
      </div>

      {/* 符号 */}
      <div className={`${size === 'sm' ? 'text-2xl' : 'text-3xl'} mb-2`}>
        <span>{card.symbol}</span>
      </div>

      {/* 牌名 */}
      <div className="text-center px-2">
        <p
          className={`font-bold leading-tight ${style.cardText} ${
            size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'
          }`}
        >
          {card.nameZh}
        </p>
        <p
          className={`${style.cardText} opacity-50 leading-tight mt-0.5 ${
            size === 'sm' ? 'text-[10px]' : size === 'lg' ? 'text-sm' : 'text-xs'
          }`}
        >
          {card.nameEn}
        </p>
      </div>

      {/* 逆位标记 */}
      {isReversed && (
        <span className="absolute top-2 right-2 text-xs bg-ink-700 text-white rounded-full px-2 py-0.5 rotate-180">
          逆
        </span>
      )}
    </div>
  );
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
