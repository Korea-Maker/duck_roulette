import { useState, useCallback, useRef } from 'react';
import { CHAMPIONS } from '../data/champions';
import { STRATEGIES, type Strategy } from '../data/strategies';
import type { Champion } from '../types';

type Difficulty = Strategy['difficulty'] | 'all';

interface StrategyRouletteState {
  champion: Champion | null;
  strategies: Strategy[];
  isSpinning: boolean;
  difficulty: Difficulty;
}

export function useStrategyRoulette() {
  const [state, setState] = useState<StrategyRouletteState>({
    champion: null,
    strategies: [],
    isSpinning: false,
    difficulty: 'all',
  });
  const spinTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setDifficulty = useCallback((difficulty: Difficulty) => {
    setState((prev) => ({ ...prev, difficulty }));
  }, []);

  const getFilteredStrategies = useCallback(
    (diff: Difficulty): Strategy[] => {
      if (diff === 'all') return STRATEGIES;
      return STRATEGIES.filter((s) => s.difficulty === diff);
    },
    []
  );

  const spin = useCallback(() => {
    if (state.isSpinning) return;

    setState((prev) => ({ ...prev, isSpinning: true, champion: null, strategies: [] }));

    // 스핀 애니메이션 후 결과 표시
    if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);

    spinTimeoutRef.current = setTimeout(() => {
      const randomChampion = CHAMPIONS[Math.floor(Math.random() * CHAMPIONS.length)];

      const filtered = getFilteredStrategies(state.difficulty);
      const strategyCount = Math.floor(Math.random() * 3) + 1; // 1~3개
      const shuffled = [...filtered].sort(() => Math.random() - 0.5);
      const selectedStrategies = shuffled.slice(0, Math.min(strategyCount, shuffled.length));

      setState((prev) => ({
        ...prev,
        isSpinning: false,
        champion: randomChampion,
        strategies: selectedStrategies,
      }));
    }, 1500);
  }, [state.isSpinning, state.difficulty, getFilteredStrategies]);

  const reset = useCallback(() => {
    if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
    setState((prev) => ({
      ...prev,
      champion: null,
      strategies: [],
      isSpinning: false,
    }));
  }, []);

  return {
    champion: state.champion,
    strategies: state.strategies,
    isSpinning: state.isSpinning,
    difficulty: state.difficulty,
    setDifficulty,
    spin,
    reset,
  };
}
