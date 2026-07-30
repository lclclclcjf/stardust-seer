'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ThemeId } from '@/types';
import { THEME_LIST } from '@/styles/themes';
import StylePicker from './StylePicker';
import { spreads } from '@/data/spreads';

export default function HomePage() {
  const router = useRouter();
  const [themeId, setThemeId] = useState<ThemeId>('sakura');
  const [spreadId, setSpreadId] = useState('single');
  const [question, setQuestion] = useState('');

  const handleStart = () => {
    const params = new URLSearchParams({ spread: spreadId, theme: themeId });
    if (question.trim()) {
      params.set('question', question.trim());
    }
    router.push(`/draw?${params.toString()}`);
  };

  return (
    <div className="flex flex-col flex-1 items-center min-h-screen bg-bg-primary">
      {/* 顶部导航 */}
      <header className="w-full max-w-lg mx-auto px-6 pt-6 pb-4">
        <nav className="flex items-center justify-between">
          <span className="text-ink-400 text-sm font-medium">🌸</span>
          <div className="flex gap-4">
            <a href="/history" className="text-ink-400 text-sm hover:text-ink-600 transition-colors">
              历史
            </a>
            <a href="/settings" className="text-ink-400 text-sm hover:text-ink-600 transition-colors">
              设置
            </a>
          </div>
        </nav>
      </header>

      {/* 主内容 */}
      <main className="flex flex-col flex-1 w-full max-w-lg mx-auto px-6 pb-12 gap-8">
        {/* Logo */}
        <div className="text-center pt-4">
          <div className="text-6xl mb-3 drop-shadow-sm">🌸</div>
          <h1 className="text-3xl font-bold text-ink-700 mb-2 tracking-wide">
            樱花塔罗牌
          </h1>
          <p className="text-ink-300 text-sm leading-relaxed">
            静心凝神，聆听内心的声音
          </p>
        </div>

        {/* 风格选择 */}
        <StylePicker selected={themeId} onSelect={setThemeId} />

        {/* 牌阵选择 */}
        <div>
          <h3 className="text-sm font-medium text-ink-500 mb-3 text-center">
            选择牌阵
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {spreads.map((spread) => {
              const isSelected = spreadId === spread.id;
              return (
                <button
                  key={spread.id}
                  onClick={() => setSpreadId(spread.id)}
                  className={`
                    flex flex-col items-center gap-1.5 p-4 rounded-2xl border-2
                    transition-all duration-200
                    ${isSelected
                      ? 'border-sakura-400 bg-sakura-50 shadow-md shadow-sakura-200/30'
                      : 'border-transparent bg-white/60 hover:bg-white hover:border-sakura-200'
                    }
                  `}
                >
                  <span className="text-xl">
                    {spread.cardCount === 1 ? '🃏' : spread.cardCount === 3 ? '📐' : '🔮'}
                  </span>
                  <span className={`text-sm font-semibold ${isSelected ? 'text-ink-700' : 'text-ink-500'}`}>
                    {spread.nameZh}
                  </span>
                  <span className="text-[10px] text-ink-300">{spread.nameEn}</span>
                  <span className="text-[10px] text-ink-200">{spread.cardCount} 张牌</span>
                </button>
              );
            })}
          </div>
          {/* 牌阵描述 */}
          <p className="text-xs text-ink-300 text-center mt-2 px-2">
            {spreads.find((s) => s.id === spreadId)?.description}
          </p>
        </div>

        {/* 问题输入 */}
        <div>
          <h3 className="text-sm font-medium text-ink-500 mb-2 text-center">
            你想问什么？（可选）
          </h3>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="例如：我的感情运势如何？这个项目会顺利吗？"
            rows={2}
            className="w-full rounded-2xl border-2 border-sakura-200/50 bg-white/80 px-4 py-3 text-sm text-ink-700 placeholder:text-ink-200 focus:outline-none focus:border-sakura-400 resize-none transition-colors"
          />
        </div>

        {/* 开始按钮 */}
        <button
          onClick={handleStart}
          className="w-full h-14 bg-gradient-to-r from-sakura-400 to-sakura-500 text-white text-lg font-semibold rounded-2xl shadow-lg shadow-sakura-400/30 hover:from-sakura-500 hover:to-sakura-600 active:scale-[0.98] transition-all duration-200"
        >
          🔮 开始占卜
        </button>
      </main>
    </div>
  );
}
