'use client';

import type { TarotCard, SpreadPosition } from '@/types';
import { themeStyles } from '@/styles/themes';
import type { ThemeId } from '@/types';

interface ReadingDisplayProps {
  card: TarotCard;
  position: SpreadPosition;
  isReversed: boolean;
  themeId: ThemeId;
}

export default function ReadingDisplay({
  card,
  position,
  isReversed,
  themeId,
}: ReadingDisplayProps) {
  const style = themeStyles[themeId];

  return (
    <div className={`${style.cardBg} border ${style.cardBorder} rounded-2xl p-5 ${style.cardGlow}`}>
      {/* 位置说明 */}
      <div className="mb-3 pb-3 border-b border-ink-100/50">
        <h3 className="text-base font-bold text-ink-700">
          {position.nameZh}
          <span className="text-xs font-normal text-ink-300 ml-2">
            {position.nameEn}
          </span>
        </h3>
        <p className="text-xs text-ink-400 mt-1">{position.meaning}</p>
      </div>

      {/* 牌名 + 正逆位 */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-lg font-bold text-ink-700">
            {card.nameZh}
            <span className="text-sm font-normal text-ink-300 ml-1.5">
              {card.nameEn}
            </span>
          </h4>
        </div>
        <span className={`inline-block text-xs rounded-full px-2.5 py-0.5 font-medium ${
          isReversed
            ? 'bg-ink-100 text-ink-600'
            : 'bg-sakura-100 text-sakura-700'
        }`}>
          {isReversed ? '逆位 ▼' : '正位 ▲'}
        </span>
      </div>

      {/* 关键词 */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {card.keywordsZh.map((kw) => (
          <span
            key={kw}
            className="text-xs bg-white/60 text-ink-600 rounded-full px-2.5 py-0.5 border border-ink-100"
          >
            {kw}
          </span>
        ))}
      </div>

      {/* 解读内容 */}
      <div className="space-y-3">
        <div>
          <h5 className="text-sm font-semibold text-ink-600 mb-1">
            {isReversed ? '逆位含义 ──' : '正位含义 ──'}
          </h5>
          <p className="text-sm text-ink-600 leading-relaxed">
            {isReversed ? card.meaningReversed : card.meaningUpright}
          </p>
        </div>

        {/* 元素/星座 */}
        {(card.element || card.zodiac) && (
          <div className="flex gap-3 text-xs text-ink-400 pt-1">
            {card.element && <span>元素：{card.element}</span>}
            {card.zodiac && <span>星座：{card.zodiac}</span>}
          </div>
        )}
      </div>

      {/* AI 解读预留区 */}
      <div className="mt-4 pt-3 border-t border-dashed border-ink-100/50">
        <p className="text-xs text-ink-200 italic">
          🔮 AI 深度解读即将开放（根据你的问题生成个性化解读）
        </p>
      </div>
    </div>
  );
}
