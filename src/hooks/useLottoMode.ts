import { useCallback, useEffect, useRef, useState } from 'react';
import type { Champion, RandomBuild } from '../types';

interface UseLottoModeOptions {
  buildRandomEnabled: boolean;
  generateRandomBuild: (championId: string) => RandomBuild;
  onSpinComplete?: (champion: string, lane: string, type: string) => void;
  laneValue: string | null;
  damageTypeValue: string | null;
  hideResult: () => void;
}

export function useLottoMode({
  buildRandomEnabled,
  generateRandomBuild,
  onSpinComplete,
  laneValue,
  damageTypeValue,
  hideResult,
}: UseLottoModeOptions) {
  const [isLottoMode, setIsLottoMode] = useState(false);
  const [isLottoSpinning, setIsLottoSpinning] = useState(false);
  const [lottoSelectedChampion, setLottoSelectedChampion] = useState<Champion | null>(null);
  const [lottoShowResult, setLottoShowResult] = useState(false);
  const [currentBuild, setCurrentBuild] = useState<RandomBuild | null>(null);
  const lottoResultTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (lottoResultTimeoutRef.current) {
        clearTimeout(lottoResultTimeoutRef.current);
      }
    };
  }, []);

  const handleLottoSpin = useCallback(() => {
    if (isLottoSpinning) return;
    hideResult();
    setLottoShowResult(false);
    setLottoSelectedChampion(null);
    setIsLottoSpinning(true);
  }, [isLottoSpinning, hideResult]);

  const handleLottoComplete = useCallback((champion: Champion) => {
    setIsLottoSpinning(false);
    setLottoSelectedChampion(champion);

    if (buildRandomEnabled) {
      const build = generateRandomBuild(champion.id);
      setCurrentBuild(build);
    } else {
      setCurrentBuild(null);
    }

    // clear previous timer
    if (lottoResultTimeoutRef.current) {
      clearTimeout(lottoResultTimeoutRef.current);
    }

    lottoResultTimeoutRef.current = setTimeout(() => {
      setLottoShowResult(true);
      if (onSpinComplete) {
        onSpinComplete(champion.id, laneValue || 'MID', damageTypeValue || 'AD');
      }
    }, 100);
  }, [buildRandomEnabled, generateRandomBuild, onSpinComplete, laneValue, damageTypeValue]);

  return {
    isLottoMode,
    setIsLottoMode,
    isLottoSpinning,
    setIsLottoSpinning,
    lottoSelectedChampion,
    lottoShowResult,
    setLottoShowResult,
    handleLottoSpin,
    handleLottoComplete,
    lottoBuild: currentBuild,
    setLottoBuild: setCurrentBuild,
  };
}
