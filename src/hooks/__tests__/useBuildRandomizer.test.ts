import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useBuildRandomizer } from '../useBuildRandomizer';
import { BOOTS, COMPLETED_ITEMS } from '../../data/items';
import { RUNE_TREES } from '../../data/runes';
import { SUMMONER_SPELLS } from '../../data/summonerSpells';

describe('useBuildRandomizer', () => {
  it('generateRandomBuild가 모든 슬롯이 채워진 빌드를 반환한다', () => {
    const { result } = renderHook(() => useBuildRandomizer());
    const build = result.current.generateRandomBuild();

    expect(build.items).toHaveLength(6);
    expect(build.primaryRune.keystone).toBeDefined();
    expect(build.primaryRune.runes.length).toBeGreaterThan(0);
    expect(build.secondaryRune.runes).toHaveLength(2);
    expect(build.summonerSpells).toHaveLength(2);
    expect(['Q', 'W', 'E']).toContain(build.skillOrder);
  });

  it('일반 챔피언의 빌드에 부츠가 포함된다', () => {
    const { result } = renderHook(() => useBuildRandomizer());

    // 여러 번 실행하여 부츠 포함 확인
    for (let i = 0; i < 10; i++) {
      const build = result.current.generateRandomBuild('Aatrox');
      const bootIds = BOOTS.map((b) => b.id);
      const hasBoot = build.items.some((item) => bootIds.includes(item.id));
      expect(hasBoot).toBe(true);
    }
  });

  it('카시오페아는 부츠 없이 완성 아이템 6개를 받는다', () => {
    const { result } = renderHook(() => useBuildRandomizer());

    for (let i = 0; i < 10; i++) {
      const build = result.current.generateRandomBuild('Cassiopeia');
      const bootIds = BOOTS.map((b) => b.id);
      const hasBoot = build.items.some((item) => bootIds.includes(item.id));
      expect(hasBoot).toBe(false);
      expect(build.items).toHaveLength(6);

      const completedIds = COMPLETED_ITEMS.map((item) => item.id);
      build.items.forEach((item) => {
        expect(completedIds).toContain(item.id);
      });
    }
  });

  it('주 룬트리와 보조 룬트리가 서로 다르다', () => {
    const { result } = renderHook(() => useBuildRandomizer());

    for (let i = 0; i < 20; i++) {
      const build = result.current.generateRandomBuild();
      expect(build.primaryRune.tree.id).not.toBe(build.secondaryRune.tree.id);
    }
  });

  it('룬트리가 유효한 데이터에서 선택된다', () => {
    const { result } = renderHook(() => useBuildRandomizer());
    const build = result.current.generateRandomBuild();

    const treeIds = RUNE_TREES.map((t) => t.id);
    expect(treeIds).toContain(build.primaryRune.tree.id);
    expect(treeIds).toContain(build.secondaryRune.tree.id);
  });

  it('소환사 주문이 유효한 주문 목록에서 선택된다', () => {
    const { result } = renderHook(() => useBuildRandomizer());
    const build = result.current.generateRandomBuild();

    const spellIds = SUMMONER_SPELLS.map((s) => s.id);
    build.summonerSpells.forEach((spell) => {
      expect(spellIds).toContain(spell.id);
    });
  });
});
