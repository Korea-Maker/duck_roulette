import { useState, useCallback, useMemo } from 'react';
import { BOOTS, COMPLETED_ITEMS } from '../data/items';
import type { Item } from '../types';

interface GoldPressureState {
  budget: number;
  selectedItems: Item[];
  isComplete: boolean;
}

function generateBudget(): number {
  return Math.floor(Math.random() * (18000 - 8000 + 1)) + 8000;
}

function calculateTagDiversity(items: Item[]): number {
  const allTags = new Set<string>();
  items.forEach((item) => item.tags.forEach((tag) => allTags.add(tag)));
  return allTags.size;
}

export function useGoldPressure() {
  const [state, setState] = useState<GoldPressureState>({
    budget: generateBudget(),
    selectedItems: [],
    isComplete: false,
  });

  const remainingGold = useMemo(() => {
    const spent = state.selectedItems.reduce((sum, item) => sum + item.gold, 0);
    return state.budget - spent;
  }, [state.budget, state.selectedItems]);

  const selectedBootCount = useMemo(
    () => state.selectedItems.filter((item) => item.tags.includes('Boots')).length,
    [state.selectedItems]
  );

  const score = useMemo(() => {
    if (state.selectedItems.length === 0) return 0;
    const goldEfficiency = Math.max(0, 100 - Math.floor(remainingGold / 50));
    const tagDiversity = calculateTagDiversity(state.selectedItems) * 10;
    const slotBonus = state.selectedItems.length * 15;
    return goldEfficiency + tagDiversity + slotBonus;
  }, [state.selectedItems, remainingGold]);

  const selectItem = useCallback(
    (item: Item) => {
      setState((prev) => {
        if (prev.isComplete) return prev;
        if (prev.selectedItems.length >= 6) return prev;
        if (prev.selectedItems.some((i) => i.id === item.id)) return prev;

        const spent = prev.selectedItems.reduce((sum, i) => sum + i.gold, 0);
        if (spent + item.gold > prev.budget) return prev;

        // 부츠 1개 제한
        const isBoot = item.tags.includes('Boots');
        const hasBoots = prev.selectedItems.some((i) => i.tags.includes('Boots'));
        if (isBoot && hasBoots) return prev;

        return { ...prev, selectedItems: [...prev.selectedItems, item] };
      });
    },
    []
  );

  const removeItem = useCallback((itemId: string) => {
    setState((prev) => {
      if (prev.isComplete) return prev;
      return {
        ...prev,
        selectedItems: prev.selectedItems.filter((i) => i.id !== itemId),
      };
    });
  }, []);

  const completeRound = useCallback(() => {
    setState((prev) => ({ ...prev, isComplete: true }));
  }, []);

  const newRound = useCallback(() => {
    setState({
      budget: generateBudget(),
      selectedItems: [],
      isComplete: false,
    });
  }, []);

  return {
    budget: state.budget,
    selectedItems: state.selectedItems,
    remainingGold,
    selectedBootCount,
    isComplete: state.isComplete,
    score,
    boots: BOOTS,
    completedItems: COMPLETED_ITEMS,
    selectItem,
    removeItem,
    completeRound,
    newRound,
  };
}
