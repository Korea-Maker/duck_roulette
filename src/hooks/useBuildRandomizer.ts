import { useCallback } from 'react';
import type { RandomBuild, Item, Rune } from '../types';
import { BOOTS, COMPLETED_ITEMS } from '../data/items';
import { RUNE_TREES } from '../data/runes';
import { SUMMONER_SPELLS } from '../data/summonerSpells';
import { getRandomIndex, getRandomElement, shuffleArray } from '../utils/random';

const getRandomElements = <T,>(array: T[], count: number, excludeIndices: number[] = []): T[] => {
  const available = array.filter((_, index) => !excludeIndices.includes(index));
  return shuffleArray(available).slice(0, Math.min(count, available.length));
};

export function useBuildRandomizer() {
  const generateRandomBuild = useCallback((championId?: string): RandomBuild => {
    const isCassiopeia = championId === 'Cassiopeia';

    // 1. 랜덤 아이템 6개 (부츠 1개 포함, 카시오페아는 부츠 제외)
    const items: Item[] = [];

    if (!isCassiopeia) {
      // 부츠 1개 선택
      const randomBoot = getRandomElement(BOOTS);
      items.push(randomBoot);

      // 나머지 5개 완성 아이템
      const remainingItems = getRandomElements(COMPLETED_ITEMS, 5);
      items.push(...remainingItems);
    } else {
      // 카시오페아는 완성 아이템 6개
      const allItems = getRandomElements(COMPLETED_ITEMS, 6);
      items.push(...allItems);
    }

    // 2. 랜덤 룬 (주 룬트리 + 보조 룬트리)
    const primaryTreeIndex = getRandomIndex(RUNE_TREES.length);
    const primaryTree = RUNE_TREES[primaryTreeIndex];

    // 보조 룬트리는 주 룬트리와 다르게
    let secondaryTreeIndex = getRandomIndex(RUNE_TREES.length);
    let attempts = 0;
    while (secondaryTreeIndex === primaryTreeIndex && attempts < 100) {
      secondaryTreeIndex = getRandomIndex(RUNE_TREES.length);
      attempts++;
    }
    const secondaryTree = RUNE_TREES[secondaryTreeIndex];

    // 주 룬: 키스톤 1개 + 각 슬롯에서 1개씩 (총 3개)
    const keystone = getRandomElement(primaryTree.keystones);
    const primaryRunes: Rune[] = [];
    for (const slot of primaryTree.slots) {
      primaryRunes.push(getRandomElement(slot));
    }

    // 보조 룬: 2개 (다른 슬롯에서)
    const secondaryRunes: Rune[] = [];
    const usedSlotIndices: number[] = [];

    let slotAttempts = 0;
    while (secondaryRunes.length < 2 && slotAttempts < 100) {
      const slotIndex = getRandomIndex(secondaryTree.slots.length);
      if (!usedSlotIndices.includes(slotIndex)) {
        usedSlotIndices.push(slotIndex);
        secondaryRunes.push(getRandomElement(secondaryTree.slots[slotIndex]));
      }
      slotAttempts++;
    }

    // 3. 랜덤 소환사 주문 2개 (완전 랜덤, 점멸 필수 아님)
    const summonerSpells = getRandomElements(SUMMONER_SPELLS, 2);

    // 4. 랜덤 스킬 순서 (Q/W/E 중 첫 번째로 맥스할 스킬)
    const skills: ('Q' | 'W' | 'E')[] = ['Q', 'W', 'E'];
    const skillOrder = getRandomElement(skills);

    return {
      items,
      primaryRune: {
        tree: primaryTree,
        keystone,
        runes: primaryRunes,
      },
      secondaryRune: {
        tree: secondaryTree,
        runes: secondaryRunes,
      },
      summonerSpells,
      skillOrder,
    };
  }, []);

  return {
    generateRandomBuild,
  };
}
