'use client';

import type { ThemeId } from '@/types';
import { THEME_LIST, themeStyles } from '@/styles/themes';

interface StylePickerProps {
  selected: ThemeId;
  onSelect: (themeId: ThemeId) => void;
}

export default function StylePicker({ selected, onSelect }: StylePickerProps) {
  return (
    <div className="w-full">
      <h3 className="text-sm font-medium text-ink-500 mb-3 text-center">
        选择牌面风格
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {THEME_LIST.map((theme) => {
          const style = themeStyles[theme.id];
          const isSelected = selected === theme.id;
          return (
            <button
              key={theme.id}
              onClick={() => onSelect(theme.id)}
              className={`
                flex flex-col items-center gap-2 p-3 rounded-2xl border-2
                transition-all duration-200
                ${isSelected
                  ? 'border-sakura-400 bg-sakura-50 shadow-md shadow-sakura-200/30'
                  : 'border-transparent bg-white/60 hover:bg-white hover:border-sakura-200'
                }
              `}
            >
              {/* 风格预览色块 */}
              <div
                className={`w-12 h-16 rounded-xl ${style.backBg} flex items-center justify-center shadow-sm`}
              >
                <span className="text-xl text-white/70">{theme.preview}</span>
              </div>
              <div className="text-center">
                <p className={`text-xs font-semibold ${isSelected ? 'text-ink-700' : 'text-ink-500'}`}>
                  {theme.nameZh}
                </p>
                <p className="text-[10px] text-ink-300">{theme.nameEn}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
