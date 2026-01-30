/**
 * Tailwind 색상 클래스에 대응하는 CSS 필터 맵핑
 * SVG/이미지 색상 변환에 사용됩니다.
 */
const COLOR_FILTERS: Record<string, string> = {
  'text-red-400': 'brightness(0) saturate(100%) invert(56%) sepia(94%) saturate(2664%) hue-rotate(327deg) brightness(102%) contrast(92%)',
  'text-green-400': 'brightness(0) saturate(100%) invert(79%) sepia(26%) saturate(2089%) hue-rotate(75deg) brightness(93%) contrast(88%)',
  'text-blue-400': 'brightness(0) saturate(100%) invert(61%) sepia(89%) saturate(2372%) hue-rotate(191deg) brightness(101%) contrast(101%)',
  'text-yellow-400': 'brightness(0) saturate(100%) invert(84%) sepia(52%) saturate(1830%) hue-rotate(358deg) brightness(103%) contrast(104%)',
  'text-pink-400': 'brightness(0) saturate(100%) invert(70%) sepia(87%) saturate(3295%) hue-rotate(296deg) brightness(102%) contrast(101%)',
};

/**
 * Tailwind 색상 클래스에 대응하는 CSS 필터를 반환합니다.
 * @param colorClass - Tailwind 색상 클래스 (예: 'text-red-400')
 * @returns CSS 필터 문자열 또는 'none'
 */
export function getColorFilter(colorClass: string): string {
  return COLOR_FILTERS[colorClass] || 'none';
}

/**
 * Hex 색상을 RGBA로 변환합니다.
 * @param hex - Hex 색상 코드 (예: '#FFD700')
 * @param alpha - 투명도 (0-1, 기본: 1)
 * @returns RGBA 문자열
 */
export function hexToRgba(hex: string, alpha: number = 1): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
