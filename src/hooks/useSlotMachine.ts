import { useState, useCallback, useRef, useEffect } from 'react';
import type { SlotMachineState } from '../types';
import { CHAMPIONS } from '../data/champions';
import { LANES } from '../data/lanes';
import { DAMAGE_TYPES } from '../data/damageTypes';
import { SLOT_CONFIG } from '../config/constants';

const getRandomIndex = (max: number): number => Math.floor(Math.random() * max);

interface UseSlotMachineOptions {
  onSpinComplete?: (champion: string, lane: string, type: string) => void;
}

export function useSlotMachine(options?: UseSlotMachineOptions) {
  const [state, setState] = useState<SlotMachineState>({
    lane: {
      enabled: true,
      currentValue: LANES[0].id,
      isSpinning: false,
    },
    champion: {
      enabled: true,
      currentValue: CHAMPIONS[0],
      isSpinning: false,
    },
    damageType: {
      enabled: true,
      currentValue: DAMAGE_TYPES[0].id,
      isSpinning: false,
    },
  });

  const [showResult, setShowResult] = useState(false);
  const [selectedIndices, setSelectedIndices] = useState({
    lane: 0,
    champion: 0,
    damageType: 0,
  });

  // setTimeout cleanup ref
  const spinTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (spinTimeoutRef.current) {
        clearTimeout(spinTimeoutRef.current);
      }
    };
  }, []);

  // 토글 핸들러
  const toggleLane = useCallback(() => {
    setState((prev) => ({
      ...prev,
      lane: { ...prev.lane, enabled: !prev.lane.enabled },
    }));
  }, []);

  const toggleChampion = useCallback(() => {
    setState((prev) => ({
      ...prev,
      champion: { ...prev.champion, enabled: !prev.champion.enabled },
    }));
  }, []);

  const toggleDamageType = useCallback(() => {
    setState((prev) => ({
      ...prev,
      damageType: { ...prev.damageType, enabled: !prev.damageType.enabled },
    }));
  }, []);

  // 스핀 핸들러
  const spin = useCallback(() => {
    const { lane, champion, damageType } = state;

    // 모든 필드가 비활성화되면 스핀하지 않음
    if (!lane.enabled && !champion.enabled && !damageType.enabled) {
      return;
    }

    setShowResult(false);

    // 랜덤 결과 미리 계산
    const newLaneIndex = lane.enabled ? getRandomIndex(LANES.length) : selectedIndices.lane;
    const newChampionIndex = champion.enabled ? getRandomIndex(CHAMPIONS.length) : selectedIndices.champion;
    const newDamageIndex = damageType.enabled ? getRandomIndex(DAMAGE_TYPES.length) : selectedIndices.damageType;

    setSelectedIndices({
      lane: newLaneIndex,
      champion: newChampionIndex,
      damageType: newDamageIndex,
    });

    // 스피닝 상태 시작
    setState((prev) => ({
      lane: { ...prev.lane, isSpinning: prev.lane.enabled },
      champion: { ...prev.champion, isSpinning: prev.champion.enabled },
      damageType: { ...prev.damageType, isSpinning: prev.damageType.enabled },
    }));

    // 이전 타이머 정리
    if (spinTimeoutRef.current) {
      clearTimeout(spinTimeoutRef.current);
    }

    // 스피닝 종료 후 결과 설정
    spinTimeoutRef.current = setTimeout(() => {
      const finalLane = lane.enabled ? LANES[newLaneIndex].id : state.lane.currentValue;
      const finalChampion = champion.enabled ? CHAMPIONS[newChampionIndex] : state.champion.currentValue;
      const finalType = damageType.enabled ? DAMAGE_TYPES[newDamageIndex].id : state.damageType.currentValue;

      setState((prev) => ({
        lane: {
          ...prev.lane,
          isSpinning: false,
          currentValue: finalLane,
        },
        champion: {
          ...prev.champion,
          isSpinning: false,
          currentValue: finalChampion,
        },
        damageType: {
          ...prev.damageType,
          isSpinning: false,
          currentValue: finalType,
        },
      }));
      setShowResult(true);

      // 히스토리에 추가 (모든 값이 있을 때만)
      if (finalChampion && finalLane && finalType && options?.onSpinComplete) {
        options.onSpinComplete(finalChampion.id, finalLane, finalType);
      }
    }, SLOT_CONFIG.SPIN_DURATION);
  }, [state, selectedIndices, options]);

  // 결과 닫기
  const hideResult = useCallback(() => {
    setShowResult(false);
  }, []);

  // 스피닝 중인지 확인
  const isSpinning = state.lane.isSpinning || state.champion.isSpinning || state.damageType.isSpinning;

  // 모든 필드가 비활성화되었는지 확인
  const allDisabled = !state.lane.enabled && !state.champion.enabled && !state.damageType.enabled;

  return {
    state,
    selectedIndices,
    showResult,
    isSpinning,
    allDisabled,
    toggleLane,
    toggleChampion,
    toggleDamageType,
    spin,
    hideResult,
  };
}
