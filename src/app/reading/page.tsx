'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { ThemeId } from '@/types';
import { DEFAULT_AI_DECK_ID } from '@/styles/ai-decks';
import { getDrawDetails } from '@/hooks/useTarot';
import CardFace from '@/components/CardFace';
import ReadingDisplay from '@/components/ReadingDisplay';

export default function ReadingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = use(searchParams);
  const router = useRouter();
  const drawId = (params.drawId as string) || '';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg-primary">
        <p className="text-ink-300">加载中...</p>
      </div>
    );
  }

  const details = getDrawDetails(drawId);

  if (!details) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-bg-primary p-6">
        <p className="text-ink-500 text-lg">未找到占卜记录</p>
        <button
          onClick={() => router.push('/')}
          className="mt-4 px-6 py-3 bg-sakura-400 text-white rounded-2xl hover:bg-sakura-500 transition-colors"
        >
          返回首页
        </button>
      </div>
    );
  }

  const { draw, spread, cards } = details;
  const themeId = draw.themeId as ThemeId;
  const aiDeckId = draw.aiDeckId ?? DEFAULT_AI_DECK_ID;
  const retryHref = `/draw?spread=${draw.spreadId}&theme=${themeId}${
    themeId === 'ai' ? `&aiDeck=${aiDeckId}` : ''
  }`;

  return (
    <div className="flex flex-col items-center min-h-screen bg-bg-primary">
      {/* 顶部 */}
      <header className="w-full max-w-lg mx-auto px-6 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-ink-400 text-sm hover:text-ink-600 transition-colors">
            ← 返回首页
          </Link>
          <h1 className="text-lg font-bold text-ink-700">{spread.nameZh}</h1>
          <Link href={retryHref} className="text-sakura-500 text-sm font-medium hover:text-sakura-600 transition-colors">
            再抽一次
          </Link>
        </div>
      </header>

      <main className="flex flex-col w-full max-w-lg mx-auto px-6 pb-12 gap-6">
        {/* 用户问题 */}
        {draw.question && (
          <div className="bg-white/60 rounded-2xl px-5 py-3 border border-sakura-100">
            <p className="text-xs text-ink-300 mb-1">你的问题</p>
            <p className="text-sm text-ink-600">{draw.question}</p>
          </div>
        )}

        {/* 抽取的牌面展示 */}
        <div>
          <h3 className="text-sm font-medium text-ink-500 mb-3 text-center">
            你的牌面
          </h3>
          <div className={`
            grid gap-4 justify-items-center
            ${spread.cardCount === 1 ? 'grid-cols-1' : ''}
            ${spread.cardCount === 3 ? 'grid-cols-3' : ''}
            ${spread.cardCount === 10 ? 'grid-cols-4' : ''}
          `}>
            {cards.map(({ card, position, isReversed }, i) => {
              if (!card || !position) return null;
              return (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <span className="text-xs text-ink-400">{position.nameZh}</span>
                  <CardFace
                    card={card}
                    themeId={themeId}
                    aiDeckId={aiDeckId}
                    isReversed={isReversed}
                    size={spread.cardCount >= 10 ? 'sm' : 'md'}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* 逐张解读 */}
        <div>
          <h3 className="text-sm font-medium text-ink-500 mb-4 text-center">
            详细解读
          </h3>
          <div className="flex flex-col gap-4">
            {cards.map(({ card, position, isReversed }, i) => {
              if (!card || !position) return null;
              return (
                <ReadingDisplay
                  key={i}
                  card={card}
                  position={position}
                  isReversed={isReversed}
                  themeId={themeId}
                />
              );
            })}
          </div>
        </div>

        {/* 底部操作 */}
        <div className="flex gap-3 pt-4">
          <Link
            href="/"
            className="flex-1 h-12 flex items-center justify-center rounded-2xl border-2 border-sakura-200 text-ink-500 font-medium hover:bg-sakura-50 transition-colors"
          >
            重新占卜
          </Link>
          <Link
            href="/history"
            className="flex-1 h-12 flex items-center justify-center rounded-2xl bg-ink-100 text-ink-600 font-medium hover:bg-ink-200 transition-colors"
          >
            查看历史
          </Link>
        </div>
      </main>
    </div>
  );
}
