export type DrawPhase =
  | 'shuffling'
  | 'mode-choice'
  | 'selecting'
  | 'auto-selecting'
  | 'ready'
  | 'revealing'
  | 'complete';

export interface ChosenCard {
  deckIndex: number;
  cardId: string;
  isReversed: boolean;
}

export interface RitualState {
  phase: DrawPhase;
  deck: string[];
  selected: ChosenCard[];
  revealed: boolean[];
  activeFlipIndex: number | null;
  drawId: string | null;
  error: string | null;
}

export type RitualAction =
  | { type: 'DECK_READY'; deck: string[]; needsModeChoice: boolean }
  | { type: 'BEGIN_MANUAL' }
  | { type: 'BEGIN_AUTO' }
  | { type: 'STOP_AUTO' }
  | { type: 'SELECT_CARD'; card: ChosenCard; required: number }
  | { type: 'REMOVE_CARD'; deckIndex: number }
  | { type: 'RESET_SELECTION' }
  | { type: 'CONFIRM'; drawId: string; cardCount: number }
  | { type: 'FLIP_START'; index: number }
  | { type: 'FLIP_END'; index: number }
  | { type: 'ERROR'; message: string };

export const initialRitualState: RitualState = {
  phase: 'shuffling',
  deck: [],
  selected: [],
  revealed: [],
  activeFlipIndex: null,
  drawId: null,
  error: null,
};

export function ritualReducer(state: RitualState, action: RitualAction): RitualState {
  switch (action.type) {
    case 'DECK_READY':
      return {
        ...initialRitualState,
        phase: action.needsModeChoice ? 'mode-choice' : 'selecting',
        deck: action.deck,
      };
    case 'BEGIN_MANUAL':
      return { ...state, phase: 'selecting' };
    case 'BEGIN_AUTO':
      return { ...state, phase: 'auto-selecting', selected: [], error: null };
    case 'STOP_AUTO':
      return { ...state, phase: 'selecting' };
    case 'SELECT_CARD': {
      if (state.selected.length >= action.required) return state;
      if (state.selected.some((card) => card.deckIndex === action.card.deckIndex)) return state;
      const selected = [...state.selected, action.card];
      return {
        ...state,
        selected,
        phase: selected.length === action.required ? 'ready' : state.phase,
        error: null,
      };
    }
    case 'REMOVE_CARD':
      return {
        ...state,
        phase: 'selecting',
        selected: state.selected.filter((card) => card.deckIndex !== action.deckIndex),
      };
    case 'RESET_SELECTION':
      return { ...state, phase: 'selecting', selected: [], error: null };
    case 'CONFIRM':
      return {
        ...state,
        phase: 'revealing',
        drawId: action.drawId,
        revealed: new Array(action.cardCount).fill(false),
        activeFlipIndex: null,
        error: null,
      };
    case 'FLIP_START': {
      if (state.phase !== 'revealing' || state.activeFlipIndex !== null || state.revealed[action.index]) {
        return state;
      }
      const revealed = [...state.revealed];
      revealed[action.index] = true;
      return { ...state, revealed, activeFlipIndex: action.index };
    }
    case 'FLIP_END':
      if (state.activeFlipIndex !== action.index) return state;
      return {
        ...state,
        activeFlipIndex: null,
        phase: state.revealed.every(Boolean) ? 'complete' : 'revealing',
      };
    case 'ERROR':
      return { ...state, error: action.message };
  }
}
