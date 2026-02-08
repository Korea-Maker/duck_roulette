import { useState, useCallback } from 'react';
import type { Champion, Lane } from '../types';
import { CHAMPIONS } from '../data/champions';

type TradeMode = 'random' | 'manual';

interface TradeResult {
  champion: Champion | null;
  lane: Lane;
}

interface FateTradeState {
  teamSize: number;
  mode: TradeMode;
  teamA: TradeResult[];
  teamB: TradeResult[];
  isTraded: boolean;
  isAnimating: boolean;
}

const ALL_LANES: Lane[] = ['TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT'];

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getRandomChampions(count: number, exclude: Champion[] = []): Champion[] {
  const excludeIds = new Set(exclude.map(c => c.id));
  const available = CHAMPIONS.filter(c => !excludeIds.has(c.id));
  const shuffled = shuffleArray(available);
  return shuffled.slice(0, count);
}

function assignLanes(count: number): Lane[] {
  if (count <= 5) {
    return shuffleArray(ALL_LANES).slice(0, count);
  }
  return shuffleArray(ALL_LANES).slice(0, count);
}

function createEmptyTeam(size: number): TradeResult[] {
  const lanes = assignLanes(size);
  return lanes.map(lane => ({ champion: null, lane }));
}

export function useFateTrade() {
  const [state, setState] = useState<FateTradeState>({
    teamSize: 5,
    mode: 'random',
    teamA: createEmptyTeam(5),
    teamB: createEmptyTeam(5),
    isTraded: false,
    isAnimating: false,
  });

  const setTeamSize = useCallback((size: number) => {
    const clamped = Math.max(1, Math.min(5, size));
    setState(prev => ({
      ...prev,
      teamSize: clamped,
      teamA: createEmptyTeam(clamped),
      teamB: createEmptyTeam(clamped),
      isTraded: false,
    }));
  }, []);

  const setMode = useCallback((mode: TradeMode) => {
    setState(prev => ({ ...prev, mode, isTraded: false }));
  }, []);

  const trade = useCallback(() => {
    setState(prev => ({ ...prev, isAnimating: true }));

    setTimeout(() => {
      setState(prev => {
        const lanesA = assignLanes(prev.teamSize);
        const lanesB = assignLanes(prev.teamSize);

        // 팀 A를 위한 챔피언 (팀 B가 지정해주는 것)
        const champsForA = getRandomChampions(prev.teamSize);
        // 팀 B를 위한 챔피언 (팀 A가 지정해주는 것, 중복 허용 가능하지만 다르게)
        const champsForB = getRandomChampions(prev.teamSize, champsForA);

        const teamA: TradeResult[] = lanesA.map((lane, i) => ({
          champion: champsForA[i],
          lane,
        }));

        const teamB: TradeResult[] = lanesB.map((lane, i) => ({
          champion: champsForB[i],
          lane,
        }));

        return { ...prev, teamA, teamB, isTraded: true, isAnimating: false };
      });
    }, 1000);
  }, []);

  const selectChampion = useCallback(
    (team: 'A' | 'B', index: number, champion: Champion) => {
      setState(prev => {
        const key = team === 'A' ? 'teamA' : 'teamB';
        const updated = [...prev[key]];
        updated[index] = { ...updated[index], champion };
        return { ...prev, [key]: updated };
      });
    },
    []
  );

  const reset = useCallback(() => {
    setState(prev => ({
      ...prev,
      teamA: createEmptyTeam(prev.teamSize),
      teamB: createEmptyTeam(prev.teamSize),
      isTraded: false,
      isAnimating: false,
    }));
  }, []);

  return {
    ...state,
    setTeamSize,
    setMode,
    trade,
    selectChampion,
    reset,
  };
}
