import { Spread } from '@/types';

export const spreads: Spread[] = [
  {
    id: 'single',
    nameZh: '单张牌',
    nameEn: 'Single Card',
    description: '最直接的指引——抽一张牌，获取今日的核心讯息。适合日常快速占卜。',
    cardCount: 1,
    positions: [
      {
        index: 0,
        nameZh: '今日指引',
        nameEn: 'Daily Guidance',
        meaning: '这张牌揭示了今天最重要的讯息或你需要关注的能量。',
      },
    ],
  },
  {
    id: 'three',
    nameZh: '三张牌',
    nameEn: 'Past · Present · Future',
    description: '经典的过去-现在-未来牌阵，帮助你理解事情发展的脉络和趋势。',
    cardCount: 3,
    positions: [
      {
        index: 0,
        nameZh: '过去',
        nameEn: 'Past',
        meaning: '影响当前状况的过去因素或根源。',
      },
      {
        index: 1,
        nameZh: '现在',
        nameEn: 'Present',
        meaning: '当前所处的位置和核心能量。',
      },
      {
        index: 2,
        nameZh: '未来',
        nameEn: 'Future',
        meaning: '按当前趋势发展的可能未来。不是注定的结局，而是方向和指引。',
      },
    ],
  },
  {
    id: 'celtic-cross',
    nameZh: '凯尔特十字',
    nameEn: 'Celtic Cross',
    description: '最全面的塔罗牌阵，深入探索问题的各个层面。适合重要决策和深度自省。',
    cardCount: 10,
    positions: [
      {
        index: 0,
        nameZh: '现状',
        nameEn: 'Present',
        meaning: '你当前所处的位置和核心状况。',
      },
      {
        index: 1,
        nameZh: '阻碍',
        nameEn: 'Challenge',
        meaning: '横跨在你面前的障碍或需要克服的挑战。',
      },
      {
        index: 2,
        nameZh: '目标',
        nameEn: 'Goal',
        meaning: '你潜意识中追求的理想或最佳可能的结果。',
      },
      {
        index: 3,
        nameZh: '过去',
        nameEn: 'Past',
        meaning: '影响当前状况的过去根源和基础。',
      },
      {
        index: 4,
        nameZh: '上方',
        nameEn: 'Above',
        meaning: '你有意识追求的目标和方向。',
      },
      {
        index: 5,
        nameZh: '近未来',
        nameEn: 'Near Future',
        meaning: '即将到来的事件或影响。',
      },
      {
        index: 6,
        nameZh: '自我',
        nameEn: 'Self',
        meaning: '你在此事中的态度和角色。',
      },
      {
        index: 7,
        nameZh: '环境',
        nameEn: 'Environment',
        meaning: '周围环境和他人的影响。',
      },
      {
        index: 8,
        nameZh: '希望/恐惧',
        nameEn: 'Hopes & Fears',
        meaning: '你内心的希望或恐惧，它们如何影响结果。',
      },
      {
        index: 9,
        nameZh: '结果',
        nameEn: 'Outcome',
        meaning: '综合所有因素后最可能的结果。',
      },
    ],
  },
];

export function getSpreadById(id: string): Spread | undefined {
  return spreads.find((s) => s.id === id);
}
