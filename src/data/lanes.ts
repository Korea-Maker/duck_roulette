import type { LaneInfo } from '../types';

export const LANES: LaneInfo[] = [
  {
    id: 'TOP',
    label: 'TOP',
    koreanLabel: '탑',
    color: 'text-red-400',
    image: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-top.png'
  },
  {
    id: 'JUNGLE',
    label: 'JUNGLE',
    koreanLabel: '정글',
    color: 'text-green-400',
    image: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-jungle.png'
  },
  {
    id: 'MID',
    label: 'MID',
    koreanLabel: '미드',
    color: 'text-blue-400',
    image: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-middle.png'
  },
  {
    id: 'ADC',
    label: 'ADC',
    koreanLabel: '원딜',
    color: 'text-yellow-400',
    image: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-bottom.png'
  },
  {
    id: 'SUPPORT',
    label: 'SUPPORT',
    koreanLabel: '서포터',
    color: 'text-pink-400',
    image: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-utility.png'
  },
];

export const getLaneInfo = (laneId: string): LaneInfo | undefined => {
  return LANES.find((lane) => lane.id === laneId);
};
