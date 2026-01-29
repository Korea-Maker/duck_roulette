import type { LaneInfo } from '../types';

export const LANES: LaneInfo[] = [
  { id: 'TOP', label: 'TOP', koreanLabel: '탑', color: 'text-red-400' },
  { id: 'JUNGLE', label: 'JUNGLE', koreanLabel: '정글', color: 'text-green-400' },
  { id: 'MID', label: 'MID', koreanLabel: '미드', color: 'text-blue-400' },
  { id: 'ADC', label: 'ADC', koreanLabel: '원딜', color: 'text-yellow-400' },
  { id: 'SUPPORT', label: 'SUPPORT', koreanLabel: '서포터', color: 'text-pink-400' },
];

export const getLaneInfo = (laneId: string): LaneInfo | undefined => {
  return LANES.find((lane) => lane.id === laneId);
};
