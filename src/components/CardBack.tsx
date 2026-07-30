'use client';

import type { ThemeId } from '@/types';
import { themeStyles } from '@/styles/themes';

interface CardBackProps {
  themeId: ThemeId;
  onClick?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function CardBack({
  themeId,
  onClick,
  disabled = false,
  size = 'md',
  className = '',
}: CardBackProps) {
  const style = themeStyles[themeId];

  const sizeClasses = {
    sm: 'w-24 h-36',
    md: 'w-36 h-52',
    lg: 'w-48 h-72',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${sizeClasses[size]}
        ${style.backBg}
        rounded-2xl border-2 border-white/30
        shadow-lg flex items-center justify-center
        select-none transition-all duration-300
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-xl active:scale-95 cursor-pointer'}
        ${className}
      `}
    >
      {/* 牌背装饰 */}
      <div className="flex flex-col items-center gap-1">
        {/* 外边框 */}
        <div className="border-2 border-white/40 rounded-lg p-3 sm:p-4">
          {/* 内框 */}
          <div className="border border-white/30 rounded-md p-2 sm:p-3">
            {/* 中心图案 */}
            <div className={`${size === 'sm' ? 'text-2xl' : size === 'lg' ? 'text-4xl' : 'text-3xl'} text-white/80`}>
              {style.backPattern}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
