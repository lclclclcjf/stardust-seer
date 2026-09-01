import type { UserSettings } from '@/types';

type RitualSound = 'complete' | 'flip' | 'select';

function soundIsEnabled(): boolean {
  try {
    const stored = window.localStorage.getItem('tarot-settings');
    if (!stored) return false;
    return (JSON.parse(stored) as Partial<UserSettings>).soundEnabled === true;
  } catch {
    return false;
  }
}

export function playRitualSound(kind: RitualSound): void {
  if (typeof window === 'undefined' || !soundIsEnabled()) return;

  const AudioContextClass =
    window.AudioContext ??
    (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return;

  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const now = context.currentTime;
  const frequency = kind === 'select' ? 392 : kind === 'flip' ? 523.25 : 659.25;
  const duration = kind === 'select' ? 0.12 : kind === 'flip' ? 0.24 : 0.42;

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(frequency, now);
  if (kind === 'complete') oscillator.frequency.exponentialRampToValueAtTime(783.99, now + duration);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.08, now + 0.025);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + duration);
  oscillator.addEventListener('ended', () => void context.close(), { once: true });
}