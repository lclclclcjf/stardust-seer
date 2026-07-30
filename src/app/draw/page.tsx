'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import type { ThemeId, DrawnCard } from '@/types';
import { getSpreadById } from '@/data/spreads';
import { getCardById } from '@/data/cards';
import { performDraw } from '@/hooks/useTarot';
import CardBack from '@/components/CardBack';
import CardFace from '@/components/CardFace';

export default function DrawPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = use(searchParams);
  const router = useRouter();

  const spreadId = (params.spread as string) || 'single';
  const themeId = (params.theme as ThemeId) || 'sakura';
  const question = (params.question as string) || '';

  const spread = getSpreadById(spreadId);
  const [phase, setPhase] = useState<'shuffling' | 'selecting' | 'revealing'>('shuffling');
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [revealed, setRevealed] = useState<boolean[]>([]);
  const [drawId, setDrawId] = useState<string | null>(null);

  // 执行抽牌
  useEffect(() => {
    const timer = setTimeout(() => {
      const result = performDraw(spreadId, themeId, question);
      setDrawnCards(result.cards);
      setDrawId(result.id);
      setRevealed(new Array(result.cards.length).fill(false));
      setPhase('selecting');
    }, 1200);
    return () => clearTimeout(timer);
  }, [spreadId, themeId, question]);

  // 点击翻开一张牌
  const handleReveal = useCallback(
    (index: number) => {
      if (revealed[index]) return;
      const newRevealed = [...revealed];
      newRevealed[index] = true;
      setRevealed(newRevealed);

      // 全部翻开后跳转
      if (newRevealed.every(Boolean)) {
        setTimeout(() => {
          router.push(`/reading?drawId=${drawId}`);
        }, 800);
      }
    },
    [revealed, drawId, router]
  );

  if (!spread) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-bg-primary p-6">
        <p className="text-ink-500">无效的牌阵</p>
        <button onClick={() => router.push('/')} className="mt-4 text-sakura-500">
          返回首页
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-bg-primary p-6">
      {/* 页面标题 */}
      <div className="text-center mb-8 pt-4">
        <h1 className="text-2xl font-bold text-ink-700">{spread.nameZh}</h1>
        <p className="text-ink-300 text-sm mt-1">
          {phase === 'shuffling' && '正在洗牌...'}
          {phase === 'selecting' && `请翻开 ${spread.cardCount} 张牌`}
          {phase === 'revealing' && '解读准备中...'}
        </p>
      </div>

      {/* 洗牌动画 */}
      {phase === 'shuffling' && (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex gap-4 animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-16 h-24 bg-gradient-to-br from-sakura-300 to-sakura-500 rounded-xl shadow-lg animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* 选牌阶段 */}
      {(phase === 'selecting' || phase === 'revealing') && drawnCards.length > 0 && (
        <div className="flex-1 w-full max-w-lg">
          {/* 按牌阵布局排列 */}
          <div className={`
            grid gap-4 justify-items-center
            ${spread.cardCount === 1 ? 'grid-cols-1' : ''}
            ${spread.cardCount === 3 ? 'grid-cols-3' : ''}
            ${spread.cardCount === 10 ? 'grid-cols-4' : ''}
          `}>
            {drawnCards.map((dc, i) => {
              const card = getCardById(dc.cardId);
              if (!card) return null;
              const position = spread.positions[i];
              return (
                <div key={i} className="flex flex-col items-center gap-2">
                  {/* 位置标签 */}
                  <span className="text-xs text-ink-400 font-medium">
                    {position?.nameZh || `牌 ${i + 1}`}
                  </span>
                  {/* 牌面 */}
                  {revealed[i] ? (
                    <CardFace
                      card={card}
                      themeId={themeId}
                      isReversed={dc.isReversed}
                      size={spread.cardCount >= 10 ? 'sm' : 'md'}
                    />
                  ) : (
                    <CardBack
                      themeId={themeId}
                      onClick={() => handleReveal(i)}
                      size={spread.cardCount >= 10 ? 'sm' : 'md'}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 底部提示 */}
      {phase === 'selecting' && (
        <div className="mt-8 mb-6">
          <p className="text-ink-300 text-sm text-center">
            点击牌背翻开卡片
            <br />
            <span className="text-xs text-ink-200">
              已翻开 {revealed.filter(Boolean).length}/{spread.cardCount}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
