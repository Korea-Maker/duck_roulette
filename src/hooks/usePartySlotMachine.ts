import { useState, useCallback, useEffect } from 'react';
import type { PartySlotMachineState, PartyMemberSlotState, Lane, PartyResult } from '../types';
import { PARTY_LANES } from '../types';
import { CHAMPIONS } from '../data/champions';
import { DAMAGE_TYPES } from '../data/damageTypes';
import { SLOT_CONFIG, PARTY_CONFIG } from '../config/constants';

const getRandomIndex = (max: number): number => Math.floor(Math.random() * max);

// 중복 없이 랜덤 라인 선택
const getRandomLanes = (count: number): Lane[] => {
  const shuffled = [...PARTY_LANES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

// 중복 없이 랜덤 챔피언 선택
const getRandomChampions = (count: number) => {
  const shuffled = [...CHAMPIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

// 초기 멤버 상태 생성
const createInitialMember = (index: number, lanes: Lane[], champions: typeof CHAMPIONS): PartyMemberSlotState => ({
  lane: {
    enabled: true,
    currentValue: lanes[index],
    isSpinning: false,
  },
  champion: {
    enabled: true,
    currentValue: champions[index],
    isSpinning: false,
  },
  damageType: {
    enabled: true,
    currentValue: DAMAGE_TYPES[getRandomIndex(DAMAGE_TYPES.length)].id,
    isSpinning: false,
  },
});

// 멤버 수에 따른 초기 상태 생성
const createInitialState = (memberCount: number): PartySlotMachineState => {
  const randomLanes = getRandomLanes(memberCount);
  const randomChampions = getRandomChampions(memberCount);
  return {
    members: Array.from({ length: memberCount }, (_, i) => createInitialMember(i, randomLanes, randomChampions)),
    isSpinning: false,
    showResult: false,
  };
};

interface UsePartySlotMachineOptions {
  memberCount?: number;
  onSpinComplete?: (results: PartyResult[]) => void;
}

export function usePartySlotMachine(options?: UsePartySlotMachineOptions) {
  const memberCount = options?.memberCount ?? 5;

  const [state, setState] = useState<PartySlotMachineState>(() => createInitialState(memberCount));

  // 선택된 인덱스 (각 멤버별)
  const [selectedIndices, setSelectedIndices] = useState<{
    lane: number[];
    champion: number[];
    damageType: number[];
  }>({
    lane: Array.from({ length: memberCount }, () => 0),
    champion: Array.from({ length: memberCount }, () => 0),
    damageType: Array.from({ length: memberCount }, () => 0),
  });

  // 멤버 수 변경 시 상태 재생성
  useEffect(() => {
    if (state.members.length !== memberCount) {
      setState(createInitialState(memberCount));
      setSelectedIndices({
        lane: Array.from({ length: memberCount }, () => 0),
        champion: Array.from({ length: memberCount }, () => 0),
        damageType: Array.from({ length: memberCount }, () => 0),
      });
    }
  }, [memberCount, state.members.length]);

  // 스핀 핸들러
  const spin = useCallback(() => {
    if (state.isSpinning) return;

    setState(prev => ({ ...prev, showResult: false, isSpinning: true }));

    // 각 멤버별 랜덤 결과 미리 계산 (라인, 챔피언 중복 없음)
    const newRandomLanes = getRandomLanes(memberCount);
    const newRandomChampions = getRandomChampions(memberCount);
    const newLaneIndices = newRandomLanes.map(lane => PARTY_LANES.indexOf(lane));
    const newChampionIndices = newRandomChampions.map(champ => CHAMPIONS.findIndex(c => c.id === champ.id));
    const newDamageIndices = Array.from({ length: memberCount }, () => getRandomIndex(DAMAGE_TYPES.length));

    setSelectedIndices({
      lane: newLaneIndices,
      champion: newChampionIndices,
      damageType: newDamageIndices,
    });

    // 모든 멤버 스피닝 시작 (stagger 효과)
    Array.from({ length: memberCount }).forEach((_, index) => {
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          members: prev.members.map((member, i) =>
            i === index
              ? {
                  ...member,
                  lane: { ...member.lane, isSpinning: true },
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
      const results: PartyResult[] = Array.from({ length: memberCount }, (_, index) => ({
        lane: newRandomLanes[index],
        champion: newRandomChampions[index],
        damageType: DAMAGE_TYPES[newDamageIndices[index]].id,
      }));

      setState(prev => ({
        ...prev,
        isSpinning: false,
        showResult: true,
        members: prev.members.map((member, index) => ({
          ...member,
          lane: {
            ...member.lane,
            isSpinning: false,
            currentValue: newRandomLanes[index],
          },
          champion: {
            ...member.champion,
            isSpinning: false,
            currentValue: newRandomChampions[index],
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
    }, SLOT_CONFIG.SPIN_DURATION + (memberCount - 1) * PARTY_CONFIG.STAGGER_DELAY);
  }, [state.isSpinning, memberCount, options]);

  // 결과 닫기
  const hideResult = useCallback(() => {
    setState(prev => ({ ...prev, showResult: false }));
  }, []);

  // 리셋
  const reset = useCallback(() => {
    setState(createInitialState(memberCount));
    setSelectedIndices({
      lane: Array.from({ length: memberCount }, () => 0),
      champion: Array.from({ length: memberCount }, () => 0),
      damageType: Array.from({ length: memberCount }, () => 0),
    });
  }, [memberCount]);

  // 현재 결과 가져오기
  const getResults = useCallback((): PartyResult[] => {
    return state.members.map(member => ({
      lane: member.lane.currentValue!,
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
