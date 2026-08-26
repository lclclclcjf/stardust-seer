'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { DrawResult, ThemeId } from '@/types';
import { getFromStorage } from '@/hooks/useLocalStorage';
import { getSpreadById } from '@/data/spreads';
import { getThemeById } from '@/styles/themes';
import styles from './history.module.css';

export default function HistoryPage() {
  const [history, setHistory] = useState<DrawResult[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setHistory(getFromStorage<DrawResult[]>('tarot-history', []));
      setMounted(true);
    }, 0);

    return () => window.clearTimeout(timer);
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
      <div className={styles.page}>
        <p className={styles.loading} role="status">加载中...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className="flex items-center justify-between">
          <Link href="/" className={styles.backLink}>← 返回首页</Link>
          <h1 className={styles.title}>历史记录</h1>
          {history.length > 0 ? (
            <button onClick={handleClearAll} className={styles.clearButton}>清空</button>
          ) : (
            <span className={styles.headerSpacer} aria-hidden="true" />
          )}
        </div>
      </header>

      <main className={styles.main}>
        {history.length === 0 ? (
          <section className={styles.emptyState} aria-labelledby="empty-history-title">
            <span className={styles.emptyIcon} aria-hidden="true">✦</span>
            <h2 id="empty-history-title">暂无占卜记录</h2>
            <p>庭院很安静，你的第一则指引会留在这里。</p>
            <Link href="/" className={styles.startLink}>开始第一次占卜</Link>
          </section>
        ) : (
          <section className={styles.historyList} aria-label="占卜历史记录">
            {history.map((item) => {
              const spread = getSpreadById(item.spreadId);
              const theme = getThemeById(item.themeId as ThemeId);
              const date = new Date(item.timestamp);
              const spreadName = spread?.nameZh || '未知牌阵';

              return (
                <article key={item.id} className={styles.historyCard}>
                  <Link
                    href={`/reading?drawId=${item.id}`}
                    className={styles.cardLink}
                    aria-label={`查看${spreadName}占卜记录`}
                  >
                    <div className={styles.cardTop}>
                      <div className={styles.cardIdentity}>
                        <span className={styles.themeIcon} aria-hidden="true">
                          {theme?.preview || '🃏'}
                        </span>
                        <div>
                          <h2>{spreadName}</h2>
                          <p>{spread?.nameEn} · {item.cards.length} 张牌</p>
                        </div>
                      </div>
                      <time dateTime={date.toISOString()}>
                        {date.toLocaleDateString('zh-CN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </time>
                    </div>
                    {item.question && <p className={styles.question}>“{item.question}”</p>}
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className={styles.deleteButton}
                    title="删除"
                    aria-label={`删除${spreadName}占卜记录`}
                  >
                    ×
                  </button>
                </article>
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
}
