/**
 * 0 이상 max 미만의 랜덤 정수를 반환합니다.
 */
export const getRandomIndex = (max: number): number => Math.floor(Math.random() * max);

/**
 * 배열에서 랜덤 요소 하나를 반환합니다.
 */
export const getRandomElement = <T,>(array: T[]): T => {
  if (array.length === 0) throw new Error('getRandomElement: empty array');
  return array[getRandomIndex(array.length)];
};

/**
 * Fisher-Yates 알고리즘으로 배열을 균일하게 셔플합니다.
 * 원본 배열을 변경하지 않고 새 배열을 반환합니다.
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
