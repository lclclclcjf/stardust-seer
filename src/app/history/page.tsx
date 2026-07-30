'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { DrawResult, ThemeId } from '@/types';
import { getFromStorage } from '@/hooks/useLocalStorage';
import { getSpreadById } from '@/data/spreads';
import { getThemeById } from '@/styles/themes';

export default function HistoryPage() {
  const [history, setHistory] = useState<DrawResult[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setHistory(getFromStorage<DrawResult[]>('tarot-history', []));
  }, []);

  const handleDelete = (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    localStorage.setItem('tarot-history', JSON.stringify(updated));
  };

  const handleClearAll = () => {
    if (window.confirm('确定要清除所有历史记录吗？此操作不可撤销。')) {
      setHistory([]);
      localStorage.removeItem('tarot-history');
    }
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg-primary">
        <p className="text-ink-300">加载中...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-bg-primary">
      <header className="w-full max-w-lg mx-auto px-6 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-ink-400 text-sm hover:text-ink-600 transition-colors">
            ← 返回首页
          </Link>
          <h1 className="text-lg font-bold text-ink-700">历史记录</h1>
          {history.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs text-red-400 hover:text-red-500 transition-colors"
            >
              清空
            </button>
          )}
        </div>
      </header>

      <main className="flex flex-col w-full max-w-lg mx-auto px-6 pb-12">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <span className="text-5xl mb-4">📭</span>
            <p className="text-ink-400">暂无占卜记录</p>
            <Link
              href="/"
              className="mt-4 px-6 py-2.5 bg-sakura-400 text-white rounded-2xl text-sm font-medium hover:bg-sakura-500 transition-colors"
            >
              开始第一次占卜
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {history.map((item) => {
              const spread = getSpreadById(item.spreadId);
              const theme = getThemeById(item.themeId as ThemeId);
              const date = new Date(item.timestamp);
              return (
                <Link
                  key={item.id}
                  href={`/reading?drawId=${item.id}`}
                  className="block bg-white/70 rounded-2xl p-4 border border-sakura-100 hover:border-sakura-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{theme?.preview || '🃏'}</span>
                      <div>
                        <p className="text-sm font-semibold text-ink-700">
                          {spread?.nameZh || '未知牌阵'}
                        </p>
                        <p className="text-xs text-ink-400">
                          {spread?.nameEn} · {item.cards.length} 张牌
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-ink-300">
                        {date.toLocaleDateString('zh-CN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDelete(item.id);
                        }}
                        className="text-ink-200 hover:text-red-400 transition-colors text-sm"
                        title="删除"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  {item.question && (
                    <p className="text-xs text-ink-400 truncate">
                      💬 {item.question}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
