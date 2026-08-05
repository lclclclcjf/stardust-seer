import type { AiDeckId } from '@/types';

export interface AiDeckConfig {
  id: AiDeckId;
  nameZh: string;
  backImage: string;
  faceImage: string;
  contentTone: 'light' | 'dark';
  labelTone: 'light' | 'dark';
}

export const AI_DECKS: readonly AiDeckConfig[] = [
  aiDeck('star-sea', '星海航线', 'light', 'dark'),
  aiDeck('cloud-river', '云端山河', 'dark', 'dark'),
  aiDeck('deep-space', '深空引力', 'light', 'light'),
  aiDeck('candy-planet', '糖果星球', 'dark', 'dark'),
  aiDeck('aurora-glacier', '极光冰川', 'dark', 'dark'),
  aiDeck('desert-meteor', '沙海流星', 'light', 'dark'),
];

export const DEFAULT_AI_DECK_ID: AiDeckId = AI_DECKS[0].id;

export function getAiDeck(id: AiDeckId = DEFAULT_AI_DECK_ID): AiDeckConfig {
  return AI_DECKS.find((deck) => deck.id === id) ?? AI_DECKS[0];
}

export function randomAiDeckId(): AiDeckId {
  return AI_DECKS[Math.floor(Math.random() * AI_DECKS.length)].id;
}

export function parseAiDeckId(value: string | string[] | undefined): AiDeckId {
  const candidate = Array.isArray(value) ? value[0] : value;
  return AI_DECKS.find((deck) => deck.id === candidate)?.id ?? DEFAULT_AI_DECK_ID;
}

function aiDeck(
  id: AiDeckId,
  nameZh: string,
  contentTone: AiDeckConfig['contentTone'],
  labelTone: AiDeckConfig['labelTone'],
): AiDeckConfig {
  return {
    id,
    nameZh,
    backImage: `/card-assets/ai-${id}-card-back-v1.png`,
    faceImage: `/card-assets/ai-${id}-card-face-v1.png`,
    contentTone,
    labelTone,
  };
}
