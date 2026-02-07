import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getRandomIndex, getRandomElement, shuffleArray } from '../random';

describe('getRandomIndex', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('0 이상 max 미만의 정수를 반환한다', () => {
    const max = 10;
    for (let i = 0; i < 100; i++) {
      const result = getRandomIndex(max);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThan(max);
      expect(Number.isInteger(result)).toBe(true);
    }
  });

  it('max가 1이면 항상 0을 반환한다', () => {
    for (let i = 0; i < 20; i++) {
      expect(getRandomIndex(1)).toBe(0);
    }
  });

  it('Math.random 값에 따라 올바른 인덱스를 계산한다', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    expect(getRandomIndex(10)).toBe(5);

    vi.spyOn(Math, 'random').mockReturnValue(0);
    expect(getRandomIndex(10)).toBe(0);

    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    expect(getRandomIndex(10)).toBe(9);
  });
});

describe('getRandomElement', () => {
  it('배열에서 요소 하나를 반환한다', () => {
    const arr = ['a', 'b', 'c', 'd'];
    for (let i = 0; i < 50; i++) {
      const result = getRandomElement(arr);
      expect(arr).toContain(result);
    }
  });

  it('단일 요소 배열에서 해당 요소를 반환한다', () => {
    expect(getRandomElement([42])).toBe(42);
  });
});

describe('shuffleArray', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('원본 배열을 변경하지 않는다', () => {
    const original = [1, 2, 3, 4, 5];
    const copy = [...original];
    shuffleArray(original);
    expect(original).toEqual(copy);
  });

  it('같은 길이의 배열을 반환한다', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = shuffleArray(arr);
    expect(result).toHaveLength(arr.length);
  });

  it('같은 요소들을 포함한다', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = shuffleArray(arr);
    expect([...result].sort()).toEqual([...arr].sort());
  });

  it('빈 배열을 처리한다', () => {
    expect(shuffleArray([])).toEqual([]);
  });

  it('단일 요소 배열을 처리한다', () => {
    expect(shuffleArray([1])).toEqual([1]);
  });
});
