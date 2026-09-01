'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import GardenIcon from '@/components/GardenIcon';
import { getSpreadById } from '@/data/spreads';
import { getFromStorage } from '@/hooks/useLocalStorage';
import type { DrawResult } from '@/types';
import styles from './history.module.css';

export default function HistoryPage() {
  const [history, setHistory] = useState<DrawResult[]>([]);
  const [deleted, setDeleted] = useState<DrawResult | null>(null);
  const [mounted, setMounted] = useState(false);
  const undoTimer = useRef<number | null>(null);
  const undoButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setHistory(getFromStorage<DrawResult[]>('tarot-history', []));
      setMounted(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => () => {
    if (undoTimer.current !== null) window.clearTimeout(undoTimer.current);
  }, []);

  useEffect(() => {
    if (deleted) undoButtonRef.current?.focus();
  }, [deleted]);

  const persistHistory = (updated: DrawResult[]) => {
    setHistory(updated);
    window.localStorage.setItem('tarot-history', JSON.stringify(updated));
  };

  const handleDelete = (id: string) => {
    const removed = history.find((item) => item.id === id);
    if (!removed) return;
    persistHistory(history.filter((item) => item.id !== id));
    setDeleted(removed);
    if (undoTimer.current !== null) window.clearTimeout(undoTimer.current);
    undoTimer.current = window.setTimeout(() => setDeleted(null), 7000);
  };

  const handleUndo = () => {
    if (!deleted) return;
    persistHistory([...history, deleted].sort((a, b) => b.timestamp - a.timestamp));
    setDeleted(null);
    if (undoTimer.current !== null) window.clearTimeout(undoTimer.current);
  };

  const handleClearAll = () => {
    if (!window.confirm('确定要清除所有历史记录吗？此操作不可撤销。')) return;
    setHistory([]);
    setDeleted(null);
    window.localStorage.removeItem('tarot-history');
  };

  if (!mounted) {
    return <div className={styles.page}><p className={styles.loading} role="status">加载中...</p></div>;
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className="flex items-center justify-between">
          <Link href="/" className={styles.backLink}>← 返回首页</Link>
          <h1 className={styles.title}>历史记录</h1>
          {history.length > 0 ? (
            <button type="button" onClick={handleClearAll} className={styles.clearButton}>清空</button>
          ) : (
            <span className={styles.headerSpacer} aria-hidden="true" />
          )}
        </div>
      </header>

      <main className={styles.main}>
        {history.length === 0 ? (
          <section className={styles.emptyState} aria-labelledby="empty-history-title">
            <GardenIcon name="blossom" className={styles.emptyIcon} />
            <h2 id="empty-history-title">暂无占卜记录</h2>
            <p>庭院很安静，你的第一则指引会留在这里。</p>
            <Link href="/" className={styles.startLink}>开始第一次占卜</Link>
          </section>
        ) : (
          <section className={styles.historyList} aria-label="占卜历史记录">
            {history.map((item) => {
              const spread = getSpreadById(item.spreadId);
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
                        <span className={styles.themeIcon} data-theme={item.themeId} aria-hidden="true">
                          <GardenIcon name="blossom" />
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
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className={styles.deleteButton}
                    title="删除"
                    aria-label={`删除${spreadName}占卜记录`}
                  >
                    <GardenIcon name="trash" />
                  </button>
                </article>
              );
            })}
          </section>
        )}
      </main>

      {deleted && (
        <div className={styles.undoBar} role="region" aria-live="polite" aria-label="删除结果">
          <span>记录已删除</span>
          <button ref={undoButtonRef} type="button" onClick={handleUndo}>撤销</button>
        </div>
      )}
    </div>
  );
}