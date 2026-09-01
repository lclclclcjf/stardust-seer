export type FanGesture = 'lift' | 'next' | 'none' | 'previous';

export function classifyFanGesture(
  deltaX: number,
  deltaY: number,
  hasPreviewedCard: boolean,
): FanGesture {
  const isUpwardSwipe = deltaY < -34 && Math.abs(deltaY) > Math.abs(deltaX) * 1.1;
  if (isUpwardSwipe) return 'lift';

  const isHorizontalSwipe = Math.abs(deltaX) > 38 && Math.abs(deltaX) > Math.abs(deltaY);
  if (!hasPreviewedCard || !isHorizontalSwipe) return 'none';
  return deltaX < 0 ? 'next' : 'previous';
}