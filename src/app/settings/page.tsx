'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { parseDemoTheme } from '@/components/design-demos/demo-theme';
import GardenIcon from '@/components/GardenIcon';
import { getFromStorage, setToStorage } from '@/hooks/useLocalStorage';
import { playRitualSound } from '@/lib/ritual-sound';
import type { UserSettings } from '@/types';
import styles from './settings.module.css';

const DEFAULT_SETTINGS: UserSettings = {
  soundEnabled: false,
  lastThemeId: 'sakura',
};

export default function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ theme?: string | string[] }>;
}) {
  const params = use(searchParams);
  const themeMode = parseDemoTheme(params.theme);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [mounted, setMounted] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSettings(getFromStorage<UserSettings>('tarot-settings', DEFAULT_SETTINGS));
      setMounted(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const updateSound = () => {
    const updated = { ...settings, soundEnabled: !settings.soundEnabled };
    setSettings(updated);
    setToStorage('tarot-settings', updated);
    setNotice(updated.soundEnabled ? '占卜音效已开启' : '占卜音效已关闭');
    if (updated.soundEnabled) playRitualSound('select');
  };

  const clearHistory = () => {
    if (!window.confirm('确定要清除所有历史记录吗？此操作不可撤销。')) return;
    window.localStorage.removeItem('tarot-history');
    setNotice('历史记录已清除');
  };

  const homeHref = themeMode === 'auto' ? '/' : `/?theme=${themeMode}`;

  if (!mounted) {
    return (
      <main className={`${styles.page} ${styles[themeMode]}`}>
        <p className={styles.loading} role="status">加载设置...</p>
      </main>
    );
  }

  return (
    <div className={`${styles.page} ${styles[themeMode]}`}>
      <header className={styles.header}>
        <Link href={homeHref}>← 返回庭院</Link>
        <h1>设置</h1>
        <span aria-hidden="true" />
      </header>

      <main className={styles.main}>
        <section className={styles.settingCard} aria-labelledby="sound-title">
          <GardenIcon name="sound" className={styles.icon} />
          <div className={styles.settingCopy}>
            <h2 id="sound-title">占卜音效</h2>
            <p>选牌与翻牌时播放轻柔提示音，不打断仪式节奏。</p>
          </div>
          <button
            type="button"
            className={`${styles.switch} ${settings.soundEnabled ? styles.switchOn : ''}`}
            role="switch"
            aria-checked={settings.soundEnabled}
            aria-label="占卜音效"
            onClick={updateSound}
          >
            <span className={styles.switchTrack} aria-hidden="true"><i /></span>
            <span>{settings.soundEnabled ? '已开启' : '已关闭'}</span>
          </button>
        </section>

        <section className={styles.settingCard} aria-labelledby="ai-title">
          <GardenIcon name="sparkles" className={styles.icon} />
          <div className={styles.settingCopy}>
            <h2 id="ai-title">AI 个性化解读</h2>
            <p>服务已启用。填写问题后，解读页会结合牌阵与牌面生成专属讯息。</p>
          </div>
          <span className={styles.statusBadge}>已启用</span>
        </section>

        <section className={`${styles.settingCard} ${styles.dangerCard}`} aria-labelledby="history-title">
          <GardenIcon name="trash" className={styles.icon} />
          <div className={styles.settingCopy}>
            <h2 id="history-title">历史记录</h2>
            <p>删除保存在当前设备上的全部占卜记录。</p>
          </div>
          <button type="button" className={styles.clearButton} onClick={clearHistory}>清除</button>
        </section>

        {notice && <p className={styles.notice} role="status">{notice}</p>}

        <footer className={styles.footer}>
          <GardenIcon name="blossom" className={styles.footerIcon} />
          <p>樱花塔罗 · 樱雾庭院</p>
          <small>版本 0.1.0</small>
        </footer>
      </main>
    </div>
  );
}