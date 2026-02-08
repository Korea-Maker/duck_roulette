import { useState, useCallback, useMemo } from 'react';
import type { Champion } from '../types';
import { CHAMPIONS } from '../data/champions';

interface ColorBlenderState {
  selectedChampions: (Champion | null)[];
  blendedColor: string | null;
  resultChampion: Champion | null;
  similarity: number;
  isBlending: boolean;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
}

function blendColors(colors: string[]): string {
  const rgbs = colors.map(hexToRgb);
  const avg: [number, number, number] = [0, 0, 0];
  for (const rgb of rgbs) {
    avg[0] += rgb[0];
    avg[1] += rgb[1];
    avg[2] += rgb[2];
  }
  return rgbToHex(avg[0] / rgbs.length, avg[1] / rgbs.length, avg[2] / rgbs.length);
}

function colorDistance(hex1: string, hex2: string): number {
  const [r1, g1, b1] = hexToRgb(hex1);
  const [r2, g2, b2] = hexToRgb(hex2);
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
}

function colorSimilarity(hex1: string, hex2: string): number {
  const maxDist = Math.sqrt(255 ** 2 * 3); // ~441.67
  const dist = colorDistance(hex1, hex2);
  return Math.round((1 - dist / maxDist) * 100);
}

export function useColorBlender() {
  const [state, setState] = useState<ColorBlenderState>({
    selectedChampions: [null, null, null],
    blendedColor: null,
    resultChampion: null,
    similarity: 0,
    isBlending: false,
  });

  const canBlend = useMemo(
    () => state.selectedChampions.every(c => c !== null),
    [state.selectedChampions]
  );

  const selectChampion = useCallback((index: number, champion: Champion) => {
    setState(prev => {
      const next = [...prev.selectedChampions];
      next[index] = champion;
      return { ...prev, selectedChampions: next, blendedColor: null, resultChampion: null, similarity: 0 };
    });
  }, []);

  const removeChampion = useCallback((index: number) => {
    setState(prev => {
      const next = [...prev.selectedChampions];
      next[index] = null;
      return { ...prev, selectedChampions: next, blendedColor: null, resultChampion: null, similarity: 0 };
    });
  }, []);

  const blend = useCallback(() => {
    const colors = state.selectedChampions
      .filter((c): c is Champion => c !== null)
      .map(c => c.color);
    if (colors.length < 3) return;

    setState(prev => ({ ...prev, isBlending: true }));

    // 약간의 지연으로 애니메이션 효과
    setTimeout(() => {
      const blended = blendColors(colors);
      const selectedIds = new Set(state.selectedChampions.map(c => c?.id));

      let closest: Champion = CHAMPIONS[0];
      let minDist = Infinity;
      for (const champ of CHAMPIONS) {
        if (selectedIds.has(champ.id)) continue;
        const dist = colorDistance(blended, champ.color);
        if (dist < minDist) {
          minDist = dist;
          closest = champ;
        }
      }

      setState(prev => ({
        ...prev,
        blendedColor: blended,
        resultChampion: closest,
        similarity: colorSimilarity(blended, closest.color),
        isBlending: false,
      }));
    }, 800);
  }, [state.selectedChampions]);

  const reset = useCallback(() => {
    setState({
      selectedChampions: [null, null, null],
      blendedColor: null,
      resultChampion: null,
      similarity: 0,
      isBlending: false,
    });
  }, []);

  return {
    ...state,
    canBlend,
    selectChampion,
    removeChampion,
    blend,
    reset,
  };
}
