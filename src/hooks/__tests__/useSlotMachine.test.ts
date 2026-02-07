import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSlotMachine } from '../useSlotMachine';
import { CHAMPIONS } from '../../data/champions';
import { LANES } from '../../data/lanes';
import { DAMAGE_TYPES } from '../../data/damageTypes';

describe('useSlotMachine', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('초기 상태에서 모든 필드가 활성화되어 있다', () => {
    const { result } = renderHook(() => useSlotMachine());

    expect(result.current.state.lane.enabled).toBe(true);
    expect(result.current.state.champion.enabled).toBe(true);
    expect(result.current.state.damageType.enabled).toBe(true);
    expect(result.current.isSpinning).toBe(false);
    expect(result.current.allDisabled).toBe(false);
    expect(result.current.showResult).toBe(false);
  });

  it('토글 함수로 필드를 비활성화/활성화할 수 있다', () => {
    const { result } = renderHook(() => useSlotMachine());

    act(() => {
      result.current.toggleLane();
    });
    expect(result.current.state.lane.enabled).toBe(false);

    act(() => {
      result.current.toggleLane();
    });
    expect(result.current.state.lane.enabled).toBe(true);
  });

  it('모든 필드가 비활성화되면 allDisabled가 true이다', () => {
    const { result } = renderHook(() => useSlotMachine());

    act(() => {
      result.current.toggleLane();
      result.current.toggleChampion();
      result.current.toggleDamageType();
    });

    expect(result.current.allDisabled).toBe(true);
  });

  it('모든 필드가 비활성화 상태에서 spin을 호출해도 스피닝이 시작되지 않는다', () => {
    const { result } = renderHook(() => useSlotMachine());

    act(() => {
      result.current.toggleLane();
      result.current.toggleChampion();
      result.current.toggleDamageType();
    });

    act(() => {
      result.current.spin();
    });

    expect(result.current.isSpinning).toBe(false);
  });

  it('spin 호출 시 활성화된 필드가 스피닝 상태가 된다', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useSlotMachine());

    act(() => {
      result.current.toggleDamageType(); // damageType만 비활성화
    });

    act(() => {
      result.current.spin();
    });

    expect(result.current.state.lane.isSpinning).toBe(true);
    expect(result.current.state.champion.isSpinning).toBe(true);
    expect(result.current.state.damageType.isSpinning).toBe(false);

    vi.useRealTimers();
  });

  it('filterTags로 챔피언 필터링이 동작한다', () => {
    const { result } = renderHook(() =>
      useSlotMachine({ filterTags: ['Mage'] })
    );

    const expected = CHAMPIONS.filter((c) => c.tags.includes('Mage'));
    expect(result.current.filteredChampions).toEqual(expected);
    expect(result.current.filteredChampions.length).toBeGreaterThan(0);
    expect(result.current.filteredChampions.length).toBeLessThan(CHAMPIONS.length);
  });

  it('filterTags가 없으면 전체 챔피언 목록을 사용한다', () => {
    const { result } = renderHook(() => useSlotMachine());

    expect(result.current.filteredChampions).toEqual(CHAMPIONS);
  });

  it('스핀 완료 후 결과가 표시된다', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useSlotMachine());

    act(() => {
      result.current.spin();
    });

    expect(result.current.showResult).toBe(false);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.isSpinning).toBe(false);
    expect(result.current.showResult).toBe(true);

    // 결과값이 유효한 범위 내에 있는지 확인
    expect(LANES.map(l => l.id)).toContain(result.current.state.lane.currentValue);
    expect(CHAMPIONS).toContain(result.current.state.champion.currentValue);
    expect(DAMAGE_TYPES.map(d => d.id)).toContain(result.current.state.damageType.currentValue);

    vi.useRealTimers();
  });
});
