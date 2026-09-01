'use client';

import { use, useEffect, useReducer, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent, PointerEvent, TransitionEvent } from 'react';
import { useRouter } from 'next/navigation';
import type { DrawnCard, ThemeId } from '@/types';
import { parseAiDeckId } from '@/styles/ai-decks';
import { parseDemoTheme } from '@/components/design-demos/demo-theme';
import { getSpreadById } from '@/data/spreads';
import { allCards, getCardById } from '@/data/cards';
import { randomReversed, shuffle } from '@/lib/shuffle';
import { performSelectedDraw } from '@/hooks/useTarot';
import { playRitualSound } from '@/lib/ritual-sound';
import CardBack from '@/components/CardBack';
import CardFace from '@/components/CardFace';
import { classifyFanGesture } from './fan-interaction';
import { initialRitualState, ritualReducer } from './ritual-state';
import styles from './draw.module.css';

type FanCardStyle = CSSProperties & {
  '--fan-angle': string;
  '--fan-y': string;
  '--fan-order': number;
};

type FanGestureStart = {
  index: number;
  pointerId: number;
  x: number;
  y: number;
};

export default function DrawPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = use(searchParams);
  const router = useRouter();
  const fanViewportRef = useRef<HTMLDivElement>(null);
  const fanCardRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const fanGestureRef = useRef<FanGestureStart | null>(null);
  const suppressNextClickRef = useRef(false);
  const [previewedIndex, setPreviewedIndex] = useState<number | null>(null);
  const spreadId = (params.spread as string) || 'single';
  const themeId = (params.theme as ThemeId) || 'sakura';
  const aiDeckId = parseAiDeckId(params.aiDeck);
  const uiTheme = parseDemoTheme(params.uiTheme);
  const question = (params.question as string) || '';
  const spread = getSpreadById(spreadId);
  const [state, dispatch] = useReducer(ritualReducer, initialRitualState);
  const requiredCount = spread?.cardCount ?? 0;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      dispatch({
        type: 'DECK_READY',
        deck: shuffle(allCards).map((card) => card.id),
        needsModeChoice: requiredCount === 10,
      });
    }, 1500);
    return () => window.clearTimeout(timer);
  }, [requiredCount, spreadId, themeId, question, aiDeckId, uiTheme]);

  useEffect(() => {
    if (state.phase !== 'auto-selecting' || state.selected.length >= requiredCount) return;
    let frame = 0;
    let start: number | null = null;
    const selectNext = (time: number) => {
      start ??= time;
      if (time - start < 360) {
        frame = window.requestAnimationFrame(selectNext);
        return;
      }
      const target = Math.min(
        state.deck.length - 1,
        Math.floor(((state.selected.length + 0.5) * state.deck.length) / requiredCount),
      );
      const cardId = state.deck[target];
      if (cardId) {
        dispatch({
          type: 'SELECT_CARD',
          required: requiredCount,
          card: { deckIndex: target, cardId, isReversed: randomReversed() },
        });
      }
    };
    frame = window.requestAnimationFrame(selectNext);
    return () => window.cancelAnimationFrame(frame);
  }, [state.phase, state.selected.length, state.deck, requiredCount]);

  useEffect(() => {
    if (!['selecting', 'auto-selecting'].includes(state.phase)) return;
    const frame = window.requestAnimationFrame(() => {
      const viewport = fanViewportRef.current;
      if (viewport) viewport.scrollLeft = (viewport.scrollWidth - viewport.clientWidth) / 2;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [state.phase, state.deck.length]);

  if (!spread) {
    return (
      <main className={styles.page}>
        <div className={styles.invalidState}>
          <p>这个牌阵不存在。</p>
          <button type="button" onClick={() => router.push('/')}>返回首页</button>
        </div>
      </main>
    );
  }

  const selectedDeckIndices = new Set(state.selected.map((card) => card.deckIndex));
  const revealedCount = state.revealed.filter(Boolean).length;
  const layoutClass =
    spread.cardCount === 1 ? styles.singleGrid : spread.cardCount === 3 ? styles.threeGrid : styles.tenGrid;
  const trayClass =
    spread.cardCount === 1 ? styles.singleTray : spread.cardCount === 3 ? styles.threeTray : styles.tenTray;
  const cardSize = spread.cardCount === 1 ? 'lg' : spread.cardCount === 3 ? 'md' : 'sm';
  const isChoosing = ['selecting', 'auto-selecting', 'ready'].includes(state.phase);
  const isReading = state.phase === 'revealing' || state.phase === 'complete';
  const firstSelectableIndex = state.selected.length >= spread.cardCount
    ? -1
    : state.deck.findIndex((_, index) => !selectedDeckIndices.has(index));
  const fanTabStop = previewedIndex
    ?? (firstSelectableIndex >= 0 ? firstSelectableIndex : (state.selected[0]?.deckIndex ?? 0));

  const focusFanCard = (index: number) => {
    fanCardRefs.current[index]?.focus();
  };

  const findNextFanCard = (index: number, step: -1 | 1) => {
    const length = state.deck.length;
    for (let attempts = 1; attempts <= length; attempts += 1) {
      const target = (index + step * attempts + length) % length;
      const candidate = fanCardRefs.current[target];
      if (candidate && !candidate.disabled && !selectedDeckIndices.has(target)) return target;
    }
    return null;
  };

  const previewFanCard = (index: number) => {
    const candidate = fanCardRefs.current[index];
    if (!candidate || candidate.disabled || selectedDeckIndices.has(index)) return;
    setPreviewedIndex(index);
    focusFanCard(index);
  };

  const moveFanCard = (index: number, step: -1 | 1, keepPreviewed: boolean) => {
    const target = findNextFanCard(index, step);
    if (target === null) return;
    if (keepPreviewed) setPreviewedIndex(target);
    focusFanCard(target);
  };

  const handleDeckChoice = (deckIndex: number) => {
    if (state.phase !== 'selecting' && state.phase !== 'ready') return;
    setPreviewedIndex(null);
    if (selectedDeckIndices.has(deckIndex)) {
      dispatch({ type: 'REMOVE_CARD', deckIndex });
      return;
    }
    const cardId = state.deck[deckIndex];
    if (!cardId || state.selected.length >= spread.cardCount) return;
    playRitualSound('select');
    dispatch({
      type: 'SELECT_CARD',
      required: spread.cardCount,
      card: { deckIndex, cardId, isReversed: randomReversed() },
    });
  };

  const handleFanKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      previewFanCard(index);
      return;
    }
    if (event.key === 'ArrowDown' && previewedIndex !== null) {
      event.preventDefault();
      setPreviewedIndex(null);
      return;
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      moveFanCard(index, event.key === 'ArrowLeft' ? -1 : 1, previewedIndex !== null);
      return;
    }
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      const boundary = event.key === 'Home' ? -1 : state.deck.length;
      moveFanCard(boundary, event.key === 'Home' ? 1 : -1, previewedIndex !== null);
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (selectedDeckIndices.has(index) || previewedIndex === index) handleDeckChoice(index);
      else previewFanCard(index);
    }
  };

  const suppressNextFanClick = () => {
    suppressNextClickRef.current = true;
    window.requestAnimationFrame(() => { suppressNextClickRef.current = false; });
  };

  const handleFanPointerDown = (event: PointerEvent<HTMLButtonElement>, index: number) => {
    if (event.pointerType === 'mouse') return;
    fanGestureRef.current = {
      index,
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    };
  };

  const handleFanPointerUp = (event: PointerEvent<HTMLButtonElement>, index: number) => {
    const start = fanGestureRef.current;
    fanGestureRef.current = null;
    if (!start || start.pointerId !== event.pointerId || start.index !== index) return;
    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    const gesture = classifyFanGesture(deltaX, deltaY, previewedIndex !== null);
    if (gesture === 'lift') {
      event.preventDefault();
      suppressNextFanClick();
      previewFanCard(index);
      return;
    }
    if ((gesture === 'next' || gesture === 'previous') && previewedIndex !== null) {
      event.preventDefault();
      suppressNextFanClick();
      moveFanCard(previewedIndex, gesture === 'next' ? 1 : -1, true);
    }
  };

  const handleFanClick = (index: number) => {
    if (suppressNextClickRef.current) {
      suppressNextClickRef.current = false;
      return;
    }
    handleDeckChoice(index);
  };

  const handleConfirmSelection = () => {
    const cards: DrawnCard[] = state.selected.map((card, position) => ({
      cardId: card.cardId,
      position,
      isReversed: card.isReversed,
    }));
    try {
      const result = performSelectedDraw(spreadId, themeId, question, cards, aiDeckId, uiTheme);
      dispatch({ type: 'CONFIRM', drawId: result.id, cardCount: cards.length });
    } catch (error: unknown) {
      dispatch({
        type: 'ERROR',
        message: error instanceof Error ? error.message : '暂时无法保存选牌结果，请重试。',
      });
    }
  };

  const handleFlipEnd = (event: TransitionEvent<HTMLSpanElement>, index: number) => {
    if (event.propertyName !== 'transform') return;
    playRitualSound(revealedCount === spread.cardCount - 1 ? 'complete' : 'flip');
    dispatch({ type: 'FLIP_END', index });
  };

  let status = '静候牌组回应你的问题';
  if (state.phase === 'mode-choice') status = '选择你希望完成十张牌阵的方式';
  if (state.phase === 'selecting') status = `凭直觉选择 ${spread.cardCount} 张牌`;
  if (state.phase === 'auto-selecting') status = '牌组正在替你完成选择';
  if (state.phase === 'ready') status = '选择完成，确认后即可亲自翻牌';
  if (state.phase === 'revealing') {
    status = state.activeFlipIndex === null ? '点击任意牌背，让它慢慢显现' : '让这张牌慢慢显现';
  }
  if (state.phase === 'complete') status = '牌面已经全部显现';

  return (
    <main className={styles.page}>
      <div className={styles.backdrop} aria-hidden="true" />
      <div className={styles.mist} aria-hidden="true" />

      <header className={styles.topBar}>
        <button type="button" className={styles.backButton} onClick={() => router.back()}>
          <span aria-hidden="true">←</span>
          返回庭院
        </button>
        <p>SAKURA DIVINATION</p>
        <span className={styles.stepMark}>抽牌仪式 · 02</span>
      </header>

      <section className={styles.ritual}>
        <div className={styles.heading}>
          <p className={styles.eyebrow}>{spread.nameEn}</p>
          <h1>{spread.nameZh}</h1>
          <p className={styles.status} aria-live="polite">{status}</p>
          {question && <p className={styles.question}>「{question}」</p>}
        </div>

        {state.phase === 'shuffling' && (
          <div className={styles.shuffleStage}>
            <div className={styles.shuffleDeck} aria-label="正在洗牌">
              {[0, 1, 2].map((index) => (
                <div key={index} className={styles.shuffleCard}>
                  <CardBack themeId={themeId} aiDeckId={aiDeckId} size="md" className={styles.fillCard} />
                </div>
              ))}
            </div>
            <p>让呼吸慢下来，答案正在靠近</p>
          </div>
        )}

        {state.phase === 'mode-choice' && (
          <div className={styles.modeStage}>
            <div className={styles.modeDeck} aria-hidden="true">
              <CardBack themeId={themeId} aiDeckId={aiDeckId} size="md" className={styles.fillCard} />
            </div>
            <div className={styles.modeChoices}>
              <button type="button" onClick={() => dispatch({ type: 'BEGIN_MANUAL' })}>
                <strong>亲自选择十张</strong>
                <span>从整副牌中，凭直觉逐张选择</span>
              </button>
              <button type="button" onClick={() => dispatch({ type: 'BEGIN_AUTO' })}>
                <strong>自动完成选牌</strong>
                <span>观看牌组依次落入十个位置</span>
              </button>
            </div>
          </div>
        )}

        {isChoosing && (
          <div className={styles.selectionStage}>
            <div className={`${styles.selectionTray} ${trayClass}`} aria-label="已选牌阵">
              {Array.from({ length: spread.cardCount }, (_, index) => {
                const chosen = state.selected[index];
                const position = spread.positions[index];
                return (
                  <button
                    key={position?.index ?? index}
                    type="button"
                    className={`${styles.traySlot} ${chosen ? styles.trayFilled : ''}`}
                    disabled={!chosen || state.phase === 'auto-selecting'}
                    onClick={() => chosen && dispatch({ type: 'REMOVE_CARD', deckIndex: chosen.deckIndex })}
                    aria-label={chosen ? `撤回${position?.nameZh || `第 ${index + 1} 张牌`}` : `${position?.nameZh || `第 ${index + 1} 张牌`}尚未选择`}
                  >
                    {chosen ? (
                      <CardBack themeId={themeId} aiDeckId={aiDeckId} size="sm" className={styles.fillCard} />
                    ) : (
                      <span className={styles.emptySlot}>{String(index + 1).padStart(2, '0')}</span>
                    )}
                    <small>{position?.nameZh || `牌 ${index + 1}`}</small>
                  </button>
                );
              })}
            </div>

            <p id="fan-instructions" className={styles.fanInstructions}>
              键盘：↑ 抽出、← → 换牌、↓ 放回、Enter 选择；手机：上滑抽出、左右滑换牌、点击选择。
            </p>
            <div ref={fanViewportRef} className={styles.fanViewport}>
              <div
                className={styles.fanRail}
                role="group"
                aria-label="可选择的塔罗牌"
                aria-describedby="fan-instructions fan-preview-status selection-progress"
              >
                {state.deck.map((cardId, index) => {
                  const center = (state.deck.length - 1) / 2;
                  const normalized = center === 0 ? 0 : (index - center) / center;
                  const isSelected = selectedDeckIndices.has(index);
                  const isPreviewed = previewedIndex === index;
                  const fanStyle: FanCardStyle = {
                    '--fan-angle': `${normalized * 7}deg`,
                    '--fan-y': `${Math.abs(normalized) * 24}px`,
                    '--fan-order': index,
                  };
                  return (
                    <button
                      key={cardId}
                      ref={(node) => {
                        fanCardRefs.current[index] = node;
                        return () => {
                          fanCardRefs.current[index] = null;
                        };
                      }}
                      type="button"
                      style={fanStyle}
                      tabIndex={index === fanTabStop ? 0 : -1}
                      onKeyDown={(event) => handleFanKeyDown(event, index)}
                      className={`${styles.fanCard} ${isSelected ? styles.fanCardSelected : ''} ${isPreviewed ? styles.fanCardPreviewed : ''}`}
                      onClick={() => handleFanClick(index)}
                      onPointerDown={(event) => handleFanPointerDown(event, index)}
                      onPointerUp={(event) => handleFanPointerUp(event, index)}
                      onPointerCancel={() => { fanGestureRef.current = null; }}
                      disabled={state.phase === 'auto-selecting' || (!isSelected && state.selected.length >= spread.cardCount)}
                      aria-pressed={isSelected}
                      aria-current={isPreviewed ? 'true' : undefined}
                      aria-label={isSelected
                        ? `撤回第 ${index + 1} 张候选牌`
                        : isPreviewed
                          ? `第 ${index + 1} 张候选牌已抽出，按 Enter 选择`
                          : `第 ${index + 1} 张候选牌，按上方向键抽出`}
                    >
                      <CardBack themeId={themeId} aiDeckId={aiDeckId} size="sm" className={styles.fillCard} />
                      {isSelected && <span className={styles.selectedMark} aria-hidden="true">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
            <p id="fan-preview-status" className={styles.fanPreviewStatus} aria-live="polite" aria-atomic="true">
              {previewedIndex === null
                ? '还没有抽出候选牌'
                : `第 ${previewedIndex + 1} 张牌已抽出，左右切换，按 Enter 或点击选择`}
            </p>

            <div className={styles.selectionActions}>
              <p id="selection-progress" aria-live="polite" aria-atomic="true">
                {state.phase === 'auto-selecting' ? '自动选牌中' : '已选择'}
                <strong>{state.selected.length} / {spread.cardCount}</strong>
              </p>
              <div>
                {state.phase === 'auto-selecting' ? (
                  <button type="button" className={styles.secondaryRitualButton} onClick={() => dispatch({ type: 'STOP_AUTO' })}>
                    停止，改为手动
                  </button>
                ) : (
                  state.selected.length > 0 && (
                    <button type="button" className={styles.secondaryRitualButton} onClick={() => dispatch({ type: 'RESET_SELECTION' })}>
                      重新选择
                    </button>
                  )
                )}
                {state.phase === 'ready' && (
                  <button type="button" className={styles.primaryRitualButton} onClick={handleConfirmSelection}>
                    确认这组牌
                  </button>
                )}
              </div>
            </div>
            {state.error && <p className={styles.selectionError} role="alert">{state.error}</p>}
          </div>
        )}

        {isReading && state.selected.length > 0 && (
          <div className={styles.cardViewport}>
            <div className={`${styles.cardGrid} ${layoutClass}`}>
              {state.selected.map((drawnCard, index) => {
                const card = getCardById(drawnCard.cardId);
                if (!card) return null;
                const isRevealed = state.revealed[index];
                const position = spread.positions[index];
                return (
                  <article key={`${drawnCard.cardId}-${index}`} className={styles.cardSlot}>
                    <div className={styles.positionLabel}>
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <strong>{position?.nameZh || `牌 ${index + 1}`}</strong>
                      <small>{position?.nameEn}</small>
                    </div>
                    <button
                      type="button"
                      className={`${styles.flipCard} ${isRevealed ? styles.isRevealed : ''}`}
                      onClick={() => dispatch({ type: 'FLIP_START', index })}
                      disabled={isRevealed || state.activeFlipIndex !== null || state.phase === 'complete'}
                      aria-label={isRevealed ? `${position?.nameZh || '牌卡'}已翻开` : `翻开${position?.nameZh || '牌卡'}`}
                    >
                      <span className={styles.flipInner} onTransitionEnd={(event) => handleFlipEnd(event, index)}>
                        <span className={`${styles.cardSide} ${styles.backSide}`}>
                          <CardBack themeId={themeId} aiDeckId={aiDeckId} size={cardSize} className={styles.fillCard} />
                          {!isRevealed && <span className={styles.flipHint}>点击翻牌</span>}
                        </span>
                        <span className={`${styles.cardSide} ${styles.faceSide}`}>
                          <CardFace
                            card={card}
                            themeId={themeId}
                            aiDeckId={aiDeckId}
                            isReversed={drawnCard.isReversed}
                            size={cardSize}
                            className={styles.fillCard}
                          />
                        </span>
                      </span>
                    </button>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {state.phase === 'revealing' && (
        <footer className={styles.progress}>
          <span className={styles.progressLine} aria-hidden="true">
            <i style={{ width: `${(revealedCount / spread.cardCount) * 100}%` }} />
          </span>
          <p><span>点击任意牌背翻牌</span><span>{revealedCount} / {spread.cardCount}</span></p>
        </footer>
      )}

      {state.phase === 'complete' && state.drawId && (
        <footer className={styles.completeFooter}>
          <p>请停留片刻，感受牌面的第一印象</p>
          <button type="button" onClick={() => router.push(`/reading?drawId=${state.drawId}&uiTheme=${uiTheme}`)}>
            查看完整解读
          </button>
        </footer>
      )}
    </main>
  );
}
