import { useState, useCallback } from 'react';
import type { PartySlotMachineState, PartyMemberSlotState, Lane, PartyResult } from '../types';
import { PARTY_LANES } from '../types';
import { CHAMPIONS } from '../data/champions';
import { DAMAGE_TYPES } from '../data/damageTypes';
import { SLOT_CONFIG, PARTY_CONFIG } from '../config/constants';

const getRandomIndex = (max: number): number => Math.floor(Math.random() * max);

// 초기 멤버 상태 생성
const createInitialMember = (lane: Lane): PartyMemberSlotState => ({
  lane,
  champion: {
    enabled: true,
    currentValue: CHAMPIONS[getRandomIndex(CHAMPIONS.length)],
    isSpinning: false,
  },
  damageType: {
    enabled: true,
    currentValue: DAMAGE_TYPES[getRandomIndex(DAMAGE_TYPES.length)].id,
    isSpinning: false,
  },
});

// 초기 상태 생성
const createInitialState = (): PartySlotMachineState => ({
  members: PARTY_LANES.map(createInitialMember),
  isSpinning: false,
  showResult: false,
});

interface UsePartySlotMachineOptions {
  onSpinComplete?: (results: PartyResult[]) => void;
}

export function usePartySlotMachine(options?: UsePartySlotMachineOptions) {
  const [state, setState] = useState<PartySlotMachineState>(createInitialState);

  // 선택된 인덱스 (각 멤버별)
  const [selectedIndices, setSelectedIndices] = useState<{
    champion: number[];
    damageType: number[];
  }>({
    champion: PARTY_LANES.map(() => 0),
    damageType: PARTY_LANES.map(() => 0),
  });

  // 스핀 핸들러
  const spin = useCallback(() => {
    if (state.isSpinning) return;

    setState(prev => ({ ...prev, showResult: false, isSpinning: true }));

    // 각 멤버별 랜덤 결과 미리 계산
    const newChampionIndices = PARTY_LANES.map(() => getRandomIndex(CHAMPIONS.length));
    const newDamageIndices = PARTY_LANES.map(() => getRandomIndex(DAMAGE_TYPES.length));

    setSelectedIndices({
      champion: newChampionIndices,
      damageType: newDamageIndices,
    });

    // 모든 멤버 스피닝 시작 (stagger 효과)
    PARTY_LANES.forEach((_, index) => {
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          members: prev.members.map((member, i) =>
            i === index
              ? {
                  ...member,
                  champion: { ...member.champion, isSpinning: true },
                  damageType: { ...member.damageType, isSpinning: true },
                }
              : member
          ),
        }));
      }, index * PARTY_CONFIG.STAGGER_DELAY);
    });

    // 스피닝 종료 후 결과 설정
    setTimeout(() => {
      const results: PartyResult[] = PARTY_LANES.map((lane, index) => ({
        lane,
        champion: CHAMPIONS[newChampionIndices[index]],
        damageType: DAMAGE_TYPES[newDamageIndices[index]].id,
      }));

      setState(prev => ({
        ...prev,
        isSpinning: false,
        showResult: true,
        members: prev.members.map((member, index) => ({
          ...member,
          champion: {
            ...member.champion,
            isSpinning: false,
            currentValue: CHAMPIONS[newChampionIndices[index]],
          },
          damageType: {
            ...member.damageType,
            isSpinning: false,
            currentValue: DAMAGE_TYPES[newDamageIndices[index]].id,
          },
        })),
      }));

      // 콜백 호출
      if (options?.onSpinComplete) {
        options.onSpinComplete(results);
      }
    }, SLOT_CONFIG.SPIN_DURATION + (PARTY_LANES.length - 1) * PARTY_CONFIG.STAGGER_DELAY);
  }, [state.isSpinning, options]);

  // 결과 닫기
  const hideResult = useCallback(() => {
    setState(prev => ({ ...prev, showResult: false }));
  }, []);

  // 리셋
  const reset = useCallback(() => {
    setState(createInitialState());
    setSelectedIndices({
      champion: PARTY_LANES.map(() => 0),
      damageType: PARTY_LANES.map(() => 0),
    });
  }, []);

  // 현재 결과 가져오기
  const getResults = useCallback((): PartyResult[] => {
    return state.members.map(member => ({
      lane: member.lane,
      champion: member.champion.currentValue,
      damageType: member.damageType.currentValue,
    }));
  }, [state.members]);

  return {
    state,
    selectedIndices,
    isSpinning: state.isSpinning,
    showResult: state.showResult,
    spin,
    hideResult,
    reset,
    getResults,
  };
}
