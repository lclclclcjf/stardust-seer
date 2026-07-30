'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { UserSettings, ThemeId } from '@/types';
import { getFromStorage, setToStorage } from '@/hooks/useLocalStorage';

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    soundEnabled: false,
    lastThemeId: 'sakura',
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setSettings(getFromStorage<UserSettings>('tarot-settings', {
      soundEnabled: false,
      lastThemeId: 'sakura',
    }));
  }, []);

  const updateSetting = <K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K]
  ) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    setToStorage('tarot-settings', updated);
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
          <h1 className="text-lg font-bold text-ink-700">设置</h1>
          <div className="w-16" />
        </div>
      </header>

      <main className="flex flex-col w-full max-w-lg mx-auto px-6 pb-12 gap-4">
        {/* 音效开关 */}
        <div className="bg-white/70 rounded-2xl p-5 border border-sakura-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-ink-700">🔈 音效</h3>
              <p className="text-xs text-ink-400 mt-0.5">抽牌和翻牌时播放音效</p>
            </div>
            <button
              onClick={() => updateSetting('soundEnabled', !settings.soundEnabled)}
              className={`
                relative w-12 h-7 rounded-full transition-colors duration-200
                ${settings.soundEnabled ? 'bg-sakura-400' : 'bg-ink-200'}
              `}
            >
              <span
                className={`
                  absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-sm
                  transition-transform duration-200
                  ${settings.soundEnabled ? 'translate-x-5' : 'translate-x-0'}
                `}
              />
            </button>
          </div>
        </div>

        {/* 清除历史 */}
        <div className="bg-white/70 rounded-2xl p-5 border border-sakura-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-ink-700">🗑️ 清除历史记录</h3>
              <p className="text-xs text-ink-400 mt-0.5">删除所有占卜记录</p>
            </div>
            <button
              onClick={() => {
                if (window.confirm('确定要清除所有历史记录吗？')) {
                  localStorage.removeItem('tarot-history');
                  alert('已清除');
                }
              }}
              className="px-4 py-2 text-sm text-red-400 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
            >
              清除
            </button>
          </div>
        </div>

        {/* AI API Key（预留） */}
        <div className="bg-white/70 rounded-2xl p-5 border border-ink-100/50 opacity-60">
          <div>
            <h3 className="text-sm font-semibold text-ink-700">
              🤖 AI 解读（即将开放）
            </h3>
            <p className="text-xs text-ink-400 mt-0.5 mb-3">
              配置 AI API Key 后，可使用 AI 根据你的问题生成个性化解读
            </p>
            <input
              type="password"
              placeholder="API Key — 功能开发中"
              disabled
              className="w-full rounded-xl border border-ink-100 bg-ink-50 px-4 py-2.5 text-sm text-ink-300 cursor-not-allowed"
            />
          </div>
        </div>

        {/* 关于 */}
        <div className="text-center mt-8">
          <p className="text-xs text-ink-200">🌸 樱花塔罗牌 v0.1.0</p>
          <p className="text-xs text-ink-200 mt-1">Made with ❤️</p>
        </div>
      </main>
    </div>
  );
}
