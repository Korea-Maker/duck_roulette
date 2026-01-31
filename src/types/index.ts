// 라인 타입: 5개
export type Lane = 'TOP' | 'JUNGLE' | 'MID' | 'ADC' | 'SUPPORT';

// 데미지 타입: 2개
export type DamageType = 'AD' | 'AP';

// 챔피언 인터페이스
export interface Champion {
  id: string;
  name: string;
  koreanName: string;
  color: string; // 챔피언 대표 색상 (hex)
}

// 슬롯 아이템 타입 (제네릭)
export interface SlotItem {
  id: string;
  label: string;
  color?: string;
  image?: string;
}

// 슬롯 필드 상태
export interface SlotField<T> {
  enabled: boolean;       // ON/OFF 토글 상태
  currentValue: T | null; // 현재 선택된 값
  isSpinning: boolean;    // 스피닝 중인지 여부
}

// 슬롯 머신 전체 상태
export interface SlotMachineState {
  lane: SlotField<Lane>;
  champion: SlotField<Champion>;
  damageType: SlotField<DamageType>;
}

// 슬롯 릴 Props
export interface SlotReelProps {
  items: SlotItem[];
  isSpinning: boolean;
  selectedIndex: number;
  enabled: boolean;
  label: string;
  onToggle: () => void;
}

// 토글 스위치 Props
export interface ToggleSwitchProps {
  enabled: boolean;
  onToggle: () => void;
  label?: string;
}

// 스핀 버튼 Props
export interface SpinButtonProps {
  onClick: () => void;
  disabled: boolean;
  isSpinning: boolean;
}

// 결과 표시 Props
export interface ResultDisplayProps {
  lane: Lane | null;
  champion: Champion | null;
  damageType: DamageType | null;
  show: boolean;
  onClose: () => void;
}

// 라인 정보 (표시용)
export interface LaneInfo {
  id: Lane;
  label: string;
  koreanLabel: string;
  color: string;
  image?: string;
}

// 데미지 타입 정보 (표시용)
export interface DamageTypeInfo {
  id: DamageType;
  label: string;
  koreanLabel: string;
  color: string;
  icon?: string;
}

// ============================================
// 파티 모드 타입 정의
// ============================================

// 라인 순서 (고정)
export const PARTY_LANES: Lane[] = ['TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT'];

// 파티 멤버 슬롯 상태
export interface PartyMemberSlotState {
  lane: Lane;                        // 고정 (TOP, JG, MID, ADC, SUP)
  champion: SlotField<Champion>;     // 랜덤
  damageType: SlotField<DamageType>; // 랜덤
}

// 5인 파티 전체 상태
export interface PartySlotMachineState {
  members: PartyMemberSlotState[]; // 5명
  isSpinning: boolean;
  showResult: boolean;
}

// 레이아웃 타입
export type PartyLayoutType = 'horizontal' | 'vertical' | 'circular';

// 앱 모드
export type AppMode = 'single' | 'party';

// 파티 결과 타입
export interface PartyResult {
  lane: Lane;
  champion: Champion | null;
  damageType: DamageType | null;
}

// 파티 결과 표시 Props
export interface PartyResultDisplayProps {
  results: PartyResult[];
  show: boolean;
  onClose: () => void;
}

// 파티 멤버 슬롯 Props
export interface PartyMemberSlotProps {
  member: PartyMemberSlotState;
  laneInfo: LaneInfo;
  isSpinning: boolean;
  compact?: boolean;
}

// 레이아웃 Props
export interface PartyLayoutProps {
  members: PartyMemberSlotState[];
  isSpinning: boolean;
}

// 레이아웃 선택기 Props
export interface LayoutSelectorProps {
  currentLayout: PartyLayoutType;
  onLayoutChange: (layout: PartyLayoutType) => void;
}

// 모드 선택기 Props
export interface ModeSelectorProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
}
