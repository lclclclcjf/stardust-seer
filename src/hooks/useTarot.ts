'use client';

import { useCallback } from 'react';
import { allCards, getCardById } from '@/data/cards';
import { getSpreadById } from '@/data/spreads';
import type { AiDeckId, DrawnCard, DrawResult, ThemeId, UiThemeMode } from '@/types';
import { drawRandom, randomReversed } from '@/lib/shuffle';
import { useLocalStorage, setToStorage, getFromStorage } from './useLocalStorage';

const HISTORY_KEY = 'tarot-history';
const CURRENT_DRAW_KEY = 'tarot-current-draw';
const MAX_HISTORY = 100;

/**
 * 执行抽牌
 */
export function performDraw(
  spreadId: string,
  themeId: ThemeId,
  question: string,
  aiDeckId?: AiDeckId,
  uiTheme: UiThemeMode = 'auto',
): DrawResult {
  const spread = getSpreadById(spreadId);
  if (!spread) throw new Error(`未知牌阵: ${spreadId}`);

  const count = spread.cardCount;
  const selected = drawRandom(allCards, count);

  const cards: DrawnCard[] = selected.map((card, position) => ({
    cardId: card.id,
    position,
    isReversed: randomReversed(),
  }));

  return persistDraw(spreadId, themeId, question, cards, aiDeckId, uiTheme);
}

export function performSelectedDraw(
  spreadId: string,
  themeId: ThemeId,
  question: string,
  cards: DrawnCard[],
  aiDeckId?: AiDeckId,
  uiTheme: UiThemeMode = 'auto',
): DrawResult {
  const spread = getSpreadById(spreadId);
  const uniqueCards = new Set(cards.map((card) => card.cardId));
  const hasOnlyKnownCards = cards.every((card) => getCardById(card.cardId));
  if (!spread || cards.length !== spread.cardCount || uniqueCards.size !== cards.length || !hasOnlyKnownCards) {
    throw new Error('选牌结果无效，请重新开始抽牌。');
  }

  return persistDraw(spreadId, themeId, question, cards, aiDeckId, uiTheme);
}

function persistDraw(
  spreadId: string,
  themeId: ThemeId,
  question: string,
  cards: DrawnCard[],
  aiDeckId?: AiDeckId,
  uiTheme: UiThemeMode = 'auto',
): DrawResult {
  const result: DrawResult = {
    id: generateId(),
    timestamp: Date.now(),
    spreadId,
    themeId,
    aiDeckId: themeId === 'ai' ? aiDeckId : undefined,
    uiTheme,
    question,
    cards,
  };

  // 保存到 localStorage
  setToStorage(CURRENT_DRAW_KEY, result);

  // 加入历史
  const history = getFromStorage<DrawResult[]>(HISTORY_KEY, []);
  history.unshift(result);
  if (history.length > MAX_HISTORY) history.pop();
  setToStorage(HISTORY_KEY, history);

  return result;
}

/**
 * 获取当前抽牌结果
 */
export function getCurrentDraw(): DrawResult | null {
  return getFromStorage<DrawResult | null>(CURRENT_DRAW_KEY, null);
}

/**
 * 获取抽牌结果的完整信息
 */
export function getDrawDetails(drawId: string) {
  const history = getFromStorage<DrawResult[]>(HISTORY_KEY, []);
  const draw = history.find((d) => d.id === drawId);
  if (!draw) return null;

  const spread = getSpreadById(draw.spreadId);
  if (!spread) return null;

  const cardsWithData = draw.cards.map((dc) => {
    const card = getCardById(dc.cardId);
    const position = spread.positions[dc.position];
    return { card, position, isReversed: dc.isReversed };
  });

  return {
    draw,
    spread,
    cards: cardsWithData,
  };
}

function generateId(): string {
  return `draw-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * 塔罗牌核心 Hook
 */
export function useTarot() {
  const [history, setHistory] = useLocalStorage<DrawResult[]>(HISTORY_KEY, []);
  const [currentDraw, setCurrentDraw] = useLocalStorage<DrawResult | null>(
    CURRENT_DRAW_KEY,
    null
  );

  const draw = useCallback(
    (spreadId: string, themeId: ThemeId, question: string, aiDeckId?: AiDeckId) => {
      const result = performDraw(spreadId, themeId, question, aiDeckId);
      setCurrentDraw(result);
      setHistory((prev) => {
        const updated = [result, ...prev];
        return updated.length > MAX_HISTORY ? updated.slice(0, MAX_HISTORY) : updated;
      });
      return result;
    },
    [setCurrentDraw, setHistory]
  );

  const clearCurrent = useCallback(() => {
    setCurrentDraw(null);
  }, [setCurrentDraw]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, [setHistory]);

  const deleteHistoryItem = useCallback(
    (id: string) => {
      setHistory((prev) => prev.filter((item) => item.id !== id));
    },
    [setHistory]
  );

  return {
    history,
    currentDraw,
    draw,
    clearCurrent,
    clearHistory,
    deleteHistoryItem,
  };
}
