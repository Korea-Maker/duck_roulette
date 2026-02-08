import { useState, useMemo, useCallback } from 'react';
import type { Champion, ChampionTag, Item } from '../types';
import { ALL_ITEMS } from '../data/items';

// 챔피언 태그 → 시너지 아이템 태그 매핑
const SYNERGY_MAP: Record<ChampionTag, string[]> = {
  Fighter: ['Damage', 'LifeSteal', 'Health', 'AttackSpeed'],
  Tank: ['Health', 'Armor', 'SpellBlock', 'Tenacity'],
  Mage: ['SpellDamage', 'Mana', 'ManaRegen', 'CooldownReduction'],
  Assassin: ['Damage', 'CriticalStrike', 'ArmorPenetration', 'Lethality'],
  Marksman: ['AttackSpeed', 'CriticalStrike', 'Damage', 'LifeSteal'],
  Support: ['ManaRegen', 'CooldownReduction', 'Health', 'Armor'],
};

const MAX_ITEMS = 6;

interface ItemScore {
  item: Item;
  score: number;
  matchedTags: string[];
}

interface SynergyState {
  selectedChampion: Champion | null;
  selectedItems: Item[];
  overallScore: number;
  itemScores: ItemScore[];
  recommendedItems: ItemScore[];
}

function calcItemSynergy(item: Item, synergyTags: Set<string>): ItemScore {
  if (item.tags.length === 0) {
    return { item, score: 0, matchedTags: [] };
  }
  const matchedTags = item.tags.filter(tag => synergyTags.has(tag));
  const score = Math.round((matchedTags.length / item.tags.length) * 100);
  return { item, score, matchedTags };
}

export function useSynergyScore() {
  const [selectedChampion, setSelectedChampion] = useState<Champion | null>(null);
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);

  // 챔피언 태그 기반 시너지 태그 집합
  const synergyTags = useMemo<Set<string>>(() => {
    if (!selectedChampion) return new Set();
    const tags = new Set<string>();
    for (const champTag of selectedChampion.tags) {
      const mapped = SYNERGY_MAP[champTag];
      if (mapped) {
        for (const t of mapped) tags.add(t);
      }
    }
    return tags;
  }, [selectedChampion]);

  // 선택된 아이템별 시너지 점수
  const itemScores = useMemo<ItemScore[]>(() => {
    if (!selectedChampion || selectedItems.length === 0) return [];
    return selectedItems.map(item => calcItemSynergy(item, synergyTags));
  }, [selectedChampion, selectedItems, synergyTags]);

  // 전체 시너지 점수 (평균)
  const overallScore = useMemo<number>(() => {
    if (itemScores.length === 0) return 0;
    const sum = itemScores.reduce((acc, s) => acc + s.score, 0);
    return Math.round(sum / itemScores.length);
  }, [itemScores]);

  // 추천 아이템 (선택되지 않은 아이템 중 시너지 높은 순 상위 6개)
  const recommendedItems = useMemo<ItemScore[]>(() => {
    if (!selectedChampion) return [];
    const selectedIds = new Set(selectedItems.map(i => i.id));
    return ALL_ITEMS
      .filter(item => !selectedIds.has(item.id) && !item.tags.includes('Boots'))
      .map(item => calcItemSynergy(item, synergyTags))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  }, [selectedChampion, selectedItems, synergyTags]);

  const selectChampion = useCallback((champion: Champion | null) => {
    setSelectedChampion(champion);
    setSelectedItems([]);
  }, []);

  const addItem = useCallback((item: Item) => {
    setSelectedItems(prev => {
      if (prev.length >= MAX_ITEMS) return prev;
      if (prev.some(i => i.id === item.id)) return prev;
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setSelectedItems(prev => prev.filter(i => i.id !== itemId));
  }, []);

  const reset = useCallback(() => {
    setSelectedChampion(null);
    setSelectedItems([]);
  }, []);

  const state: SynergyState = {
    selectedChampion,
    selectedItems,
    overallScore,
    itemScores,
    recommendedItems,
  };

  return {
    ...state,
    synergyTags,
    selectChampion,
    addItem,
    removeItem,
    reset,
  };
}

export type { ItemScore, SynergyState };
export { SYNERGY_MAP };
