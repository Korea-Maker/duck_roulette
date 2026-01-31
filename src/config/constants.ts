// 슬롯 머신 설정
export const SLOT_CONFIG = {
  ITEM_HEIGHT: 64,      // 슬롯 아이템 높이 (px)
  VISIBLE_ITEMS: 3,     // 보이는 아이템 수
  SPIN_DURATION: 3000,  // 스핀 지속 시간 (ms) - 긴장감을 위해 증가
  SPIN_ITEMS_COUNT: 30, // 스핀 중 보여줄 아이템 수 - 더 많은 아이템 통과
} as const;

// 애니메이션 설정
export const ANIMATION_CONFIG = {
  CONFETTI_DURATION: 2500,   // 컨페티 지속 시간 (ms)
  CONFETTI_INTERVAL: 100,    // 컨페티 발사 간격 (ms)
  CONFETTI_PARTICLE_COUNT: 3, // 한 번에 발사할 파티클 수
} as const;

// 컨페티 색상
export const CONFETTI_COLORS = ['#FFD700', '#FFA500', '#FF6347', '#00CED1', '#FF69B4'] as const;

// 파티 모드 설정
export const PARTY_CONFIG = {
  MEMBER_COUNT: 5,                    // 파티원 수
  STAGGER_DELAY: 200,                 // 각 슬롯 시작 딜레이 (ms)
  RESULT_DELAY: 500,                  // 결과 표시 전 대기 (ms)
  CIRCULAR_RADIUS: 140,               // 원형 레이아웃 반지름 (px)
  DEFAULT_LAYOUT: 'circular' as const,
} as const;

// 라인별 각도 (원형 레이아웃용) - TOP이 12시 방향
export const CIRCULAR_ANGLES = {
  TOP: -90,      // 12시
  JUNGLE: -18,   // 2시
  MID: 54,       // 4시
  ADC: 126,      // 8시
  SUPPORT: 198,  // 10시
} as const;

// 타입 내보내기
export type SlotConfig = typeof SLOT_CONFIG;
export type AnimationConfig = typeof ANIMATION_CONFIG;
export type PartyConfig = typeof PARTY_CONFIG;
