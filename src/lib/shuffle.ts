/**
 * Fisher-Yates 洗牌算法
 * 原地随机打乱数组，每种排列概率均等
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * 从数组中随机抽取 n 个不重复元素
 */
export function drawRandom<T>(array: T[], n: number): T[] {
  return shuffle(array).slice(0, n);
}

/**
 * 随机决定正位(true)还是逆位(false)
 * 各 50% 概率
 */
export function randomReversed(): boolean {
  return Math.random() < 0.5;
}
