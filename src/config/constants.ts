// 슬롯 머신 설정
export const SLOT_CONFIG = {
  ITEM_HEIGHT: 64,      // 슬롯 아이템 높이 (px)
  VISIBLE_ITEMS: 3,     // 보이는 아이템 수
  SPIN_DURATION: 2000,  // 스핀 지속 시간 (ms)
  SPIN_ITEMS_COUNT: 20, // 스핀 중 보여줄 아이템 수
} as const;

// 애니메이션 설정
export const ANIMATION_CONFIG = {
  CONFETTI_DURATION: 2500,   // 컨페티 지속 시간 (ms)
  CONFETTI_INTERVAL: 100,    // 컨페티 발사 간격 (ms)
  CONFETTI_PARTICLE_COUNT: 3, // 한 번에 발사할 파티클 수
} as const;

// 컨페티 색상
export const CONFETTI_COLORS = ['#FFD700', '#FFA500', '#FF6347', '#00CED1', '#FF69B4'] as const;

// 타입 내보내기
export type SlotConfig = typeof SLOT_CONFIG;
export type AnimationConfig = typeof ANIMATION_CONFIG;
