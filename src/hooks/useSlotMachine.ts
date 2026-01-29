import { useState, useCallback } from 'react';
import type { SlotMachineState } from '../types';
import { CHAMPIONS } from '../data/champions';
import { LANES } from '../data/lanes';
import { DAMAGE_TYPES } from '../data/damageTypes';

const SPIN_DURATION = 2000; // 2초

const getRandomIndex = (max: number): number => Math.floor(Math.random() * max);

export function useSlotMachine() {
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

    // 스피닝 종료 후 결과 설정
    setTimeout(() => {
      setState((prev) => ({
        lane: {
          ...prev.lane,
          isSpinning: false,
          currentValue: prev.lane.enabled ? LANES[newLaneIndex].id : prev.lane.currentValue,
        },
        champion: {
          ...prev.champion,
          isSpinning: false,
          currentValue: prev.champion.enabled ? CHAMPIONS[newChampionIndex] : prev.champion.currentValue,
        },
        damageType: {
          ...prev.damageType,
          isSpinning: false,
          currentValue: prev.damageType.enabled ? DAMAGE_TYPES[newDamageIndex].id : prev.damageType.currentValue,
        },
      }));
      setShowResult(true);
    }, SPIN_DURATION);
  }, [state, selectedIndices]);

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
