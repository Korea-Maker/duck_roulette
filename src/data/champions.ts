import type { Champion } from '../types';

// Riot Data Dragon 기반 챔피언 목록 (0개) - 각 챔피언의 대표 색상 및 역할 포함
// 자동 생성됨 - 수동 수정 금지
// 최종 업데이트: 2026-02-07
// API 버전: 16.3.1
export const CHAMPIONS: Champion[] = [

];

// 모든 챔피언 역할 목록
export const CHAMPION_TAGS = ['Fighter', 'Tank', 'Mage', 'Assassin', 'Marksman', 'Support'] as const;

// 역할별 한글 이름
export const TAG_NAMES: Record<string, string> = {
  Fighter: '전사',
  Tank: '탱커',
  Mage: '마법사',
  Assassin: '암살자',
  Marksman: '원거리 딜러',
  Support: '서포터',
};
