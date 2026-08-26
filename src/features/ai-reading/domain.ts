import { getCardById } from '@/data/cards';
import { getSpreadById } from '@/data/spreads';
import type { AiReadingContent, AiReadingRequest } from './schemas';

interface TrustedCardContext {
  position: number;
  positionName: string;
  positionMeaning: string;
  cardName: string;
  orientation: 'upright' | 'reversed';
  keywords: string[];
  meaning: string;
}

export interface TrustedReadingContext {
  question: string;
  spreadName: string;
  cards: TrustedCardContext[];
}

type DomainErrorCode = 'UNKNOWN_SPREAD' | 'INVALID_DRAW' | 'UNKNOWN_CARD';
export type DomainResult<T> =
  | { ok: true; value: T }
  | { ok: false; code: DomainErrorCode; message: string };

export function buildTrustedContext(
  request: AiReadingRequest,
): DomainResult<TrustedReadingContext> {
  const spread = getSpreadById(request.spreadId);
  if (!spread) return domainError('UNKNOWN_SPREAD', '未找到对应牌阵');
  if (!hasValidPositions(request, spread.cardCount)) {
    return domainError('INVALID_DRAW', '牌数或牌位与牌阵不一致');
  }

  const cards: TrustedCardContext[] = [];
  for (const drawn of request.cards) {
    const card = getCardById(drawn.cardId);
    const position = spread.positions[drawn.position];
    if (!card || !position) {
      return domainError('UNKNOWN_CARD', '牌面数据无法识别');
    }
    cards.push({
      position: drawn.position,
      positionName: position.nameZh,
      positionMeaning: position.meaning,
      cardName: card.nameZh,
      orientation: drawn.isReversed ? 'reversed' : 'upright',
      keywords: card.keywordsZh,
      meaning: drawn.isReversed ? card.meaningReversed : card.meaningUpright,
    });
  }

  return {
    ok: true,
    value: { question: request.question, spreadName: spread.nameZh, cards },
  };
}

export function validateReadingPositions(
  reading: AiReadingContent,
  expectedCount: number,
): DomainResult<AiReadingContent> {
  const positions = reading.cardReadings.map((item) => item.position).sort((a, b) => a - b);
  const valid = positions.length === expectedCount
    && positions.every((position, index) => position === index);
  return valid
    ? { ok: true, value: reading }
    : domainError('INVALID_DRAW', 'AI 返回的牌位不完整');
}

function hasValidPositions(request: AiReadingRequest, count: number): boolean {
  if (request.cards.length !== count) return false;
  const positions = request.cards.map((card) => card.position).sort((a, b) => a - b);
  return positions.every((position, index) => position === index);
}

function domainError(code: DomainErrorCode, message: string): DomainResult<never> {
  return { ok: false, code, message };
}
