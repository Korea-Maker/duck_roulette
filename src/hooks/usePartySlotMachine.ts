import { useState, useCallback, useEffect } from 'react';
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

// 멤버 수에 따른 초기 상태 생성
const createInitialState = (memberCount: number): PartySlotMachineState => ({
  members: PARTY_LANES.slice(0, memberCount).map(createInitialMember),
  isSpinning: false,
  showResult: false,
});

interface UsePartySlotMachineOptions {
  memberCount?: number;
  onSpinComplete?: (results: PartyResult[]) => void;
}

export function usePartySlotMachine(options?: UsePartySlotMachineOptions) {
  const memberCount = options?.memberCount ?? 5;
  const activeLanes = PARTY_LANES.slice(0, memberCount);

  const [state, setState] = useState<PartySlotMachineState>(() => createInitialState(memberCount));

  // 선택된 인덱스 (각 멤버별)
  const [selectedIndices, setSelectedIndices] = useState<{
    champion: number[];
    damageType: number[];
  }>({
    champion: activeLanes.map(() => 0),
    damageType: activeLanes.map(() => 0),
  });

  // 멤버 수 변경 시 상태 재생성
  useEffect(() => {
    if (state.members.length !== memberCount) {
      setState(createInitialState(memberCount));
      setSelectedIndices({
        champion: activeLanes.map(() => 0),
        damageType: activeLanes.map(() => 0),
      });
    }
  }, [memberCount, activeLanes, state.members.length]);

  // 스핀 핸들러
  const spin = useCallback(() => {
    if (state.isSpinning) return;

    setState(prev => ({ ...prev, showResult: false, isSpinning: true }));

    // 각 멤버별 랜덤 결과 미리 계산
    const newChampionIndices = activeLanes.map(() => getRandomIndex(CHAMPIONS.length));
    const newDamageIndices = activeLanes.map(() => getRandomIndex(DAMAGE_TYPES.length));

    setSelectedIndices({
      champion: newChampionIndices,
      damageType: newDamageIndices,
    });

    // 모든 멤버 스피닝 시작 (stagger 효과)
    activeLanes.forEach((_, index) => {
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
      const results: PartyResult[] = activeLanes.map((lane, index) => ({
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
    }, SLOT_CONFIG.SPIN_DURATION + (activeLanes.length - 1) * PARTY_CONFIG.STAGGER_DELAY);
  }, [state.isSpinning, activeLanes, options]);

  // 결과 닫기
  const hideResult = useCallback(() => {
    setState(prev => ({ ...prev, showResult: false }));
  }, []);

  // 리셋
  const reset = useCallback(() => {
    setState(createInitialState(memberCount));
    setSelectedIndices({
      champion: activeLanes.map(() => 0),
      damageType: activeLanes.map(() => 0),
    });
  }, [memberCount, activeLanes]);

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
    memberCount,
    isSpinning: state.isSpinning,
    showResult: state.showResult,
    spin,
    hideResult,
    reset,
    getResults,
  };
}
