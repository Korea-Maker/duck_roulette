import { useCallback, useRef, useState, useEffect } from 'react';
import {
  createPlayClick,
  createStartSpin,
  createStopSpin,
  createStartLottoSpin,
  createStopLottoSpin,
  createPlayEliminate,
  createPlayWin,
  createPlayResult,
} from '../utils/sounds';
import type { SpinSoundRefs, LottoSoundRefs } from '../utils/sounds';

const SOUND_MUTED_KEY = 'duck-roulette-sound-muted';

export function useSound() {
  const audioContextRef = useRef<AudioContext | null>(null);

  // 스핀 사운드 refs
  const spinRefs = useRef<SpinSoundRefs>({
    oscillator: null,
    gain: null,
    lfo: null,
  });

  // 로또 사운드 refs
  const lottoRefs = useRef<LottoSoundRefs>({
    oscillator: null,
    gain: null,
    noise: null,
    interval: undefined,
  });

  // 음소거 상태 (localStorage에서 불러오기)
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(SOUND_MUTED_KEY) === 'true';
    }
    return false;
  });

  // useRef로 최신 isMuted 값 추적 (콜백 참조 안정성 확보)
  const isMutedRef = useRef(isMuted);
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // 음소거 상태 저장
  useEffect(() => {
    localStorage.setItem(SOUND_MUTED_KEY, String(isMuted));
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    return audioContextRef.current;
  }, []);

  // AudioContext cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  // 팩토리 함수들을 사용하여 사운드 콜백 생성
  const playClick = useCallback(() => {
    const ctx = getAudioContext();
    createPlayClick(ctx, isMutedRef)();
  }, [getAudioContext]);

  const startSpin = useCallback(() => {
    const ctx = getAudioContext();
    createStartSpin(ctx, isMutedRef, spinRefs.current)();
  }, [getAudioContext]);

  const stopSpin = useCallback(() => {
    const ctx = getAudioContext();
    createStopSpin(ctx, spinRefs.current)();
  }, [getAudioContext]);

  const stopLottoSpin = useCallback(() => {
    const ctx = getAudioContext();
    createStopLottoSpin(ctx, lottoRefs.current)();
  }, [getAudioContext]);

  const startLottoSpin = useCallback(() => {
    const ctx = getAudioContext();
    createStartLottoSpin(ctx, isMutedRef, lottoRefs.current, stopLottoSpin)();
  }, [getAudioContext, stopLottoSpin]);

  const playEliminate = useCallback(() => {
    const ctx = getAudioContext();
    createPlayEliminate(ctx, isMutedRef)();
  }, [getAudioContext]);

  const playWin = useCallback(() => {
    const ctx = getAudioContext();
    createPlayWin(ctx, isMutedRef)();
  }, [getAudioContext]);

  const playResult = useCallback(() => {
    const ctx = getAudioContext();
    createPlayResult(ctx, isMutedRef)();
  }, [getAudioContext]);

  return {
    playClick,
    startSpin,
    stopSpin,
    startLottoSpin,
    stopLottoSpin,
    playEliminate,
    playWin,
    playResult,
    toggleMute,
    isMuted,
  };
}
