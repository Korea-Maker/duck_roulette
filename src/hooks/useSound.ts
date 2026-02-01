import { useCallback, useRef, useState, useEffect, useMemo } from 'react';

const SOUND_MUTED_KEY = 'duck-roulette-sound-muted';

export function useSound() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const spinningOscillatorRef = useRef<OscillatorNode | null>(null);
  const spinningGainRef = useRef<GainNode | null>(null);
  const spinningLfoRef = useRef<OscillatorNode | null>(null);

  // 음소거 상태 (localStorage에서 불러오기)
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(SOUND_MUTED_KEY) === 'true';
    }
    return false;
  });

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

  // 코인 투입 사운드 - 금속성 딸깍 소리
  const playClick = useCallback(() => {
    if (isMuted) return;
    const ctx = getAudioContext();

    // 금속 코인 소리 (여러 주파수 조합)
    const frequencies = [2400, 3200, 4000];
    frequencies.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      filter.type = 'highpass';
      filter.frequency.value = 2000;

      oscillator.frequency.value = freq;
      oscillator.type = 'sine';

      const startTime = ctx.currentTime + i * 0.01;
      gainNode.gain.setValueAtTime(0.15, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.08);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.08);
    });

    // 저음 임팩트
    const impactOsc = ctx.createOscillator();
    const impactGain = ctx.createGain();
    impactOsc.connect(impactGain);
    impactGain.connect(ctx.destination);
    impactOsc.frequency.value = 150;
    impactOsc.type = 'sine';
    impactGain.gain.setValueAtTime(0.2, ctx.currentTime);
    impactGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    impactOsc.start(ctx.currentTime);
    impactOsc.stop(ctx.currentTime + 0.1);
  }, [getAudioContext, isMuted]);

  // 스핀 사운드 - 카지노 슬롯머신 릴 회전음
  const startSpin = useCallback(() => {
    if (isMuted) return;
    const ctx = getAudioContext();

    // 기존 스핀 사운드 정지
    if (spinningOscillatorRef.current) {
      spinningOscillatorRef.current.stop();
      spinningOscillatorRef.current = null;
    }
    if (spinningLfoRef.current) {
      spinningLfoRef.current.stop();
      spinningLfoRef.current = null;
    }

    // 메인 릴 회전음
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // LFO로 릴 클릭음 효과
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();

    lfo.connect(lfoGain);
    lfoGain.connect(gainNode.gain);

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    filter.type = 'bandpass';
    filter.frequency.value = 800;
    filter.Q.value = 2;

    // 노이즈 같은 효과를 위한 톱니파
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(80, ctx.currentTime);
    oscillator.frequency.linearRampToValueAtTime(40, ctx.currentTime + 2.5);

    // LFO로 클릭 리듬 생성
    lfo.type = 'square';
    lfo.frequency.setValueAtTime(20, ctx.currentTime);
    lfo.frequency.linearRampToValueAtTime(8, ctx.currentTime + 2.5);
    lfoGain.gain.value = 0.1;

    gainNode.gain.setValueAtTime(0.12, ctx.currentTime);

    oscillator.start(ctx.currentTime);
    lfo.start(ctx.currentTime);

    spinningOscillatorRef.current = oscillator;
    spinningGainRef.current = gainNode;
    spinningLfoRef.current = lfo;
  }, [getAudioContext, isMuted]);

  // 스핀 정지 사운드
  const stopSpin = useCallback(() => {
    if (spinningOscillatorRef.current && spinningGainRef.current) {
      const ctx = getAudioContext();
      spinningGainRef.current.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + 0.3
      );
      spinningOscillatorRef.current.stop(ctx.currentTime + 0.3);
      spinningOscillatorRef.current = null;
      spinningGainRef.current = null;
    }
    if (spinningLfoRef.current) {
      const ctx = getAudioContext();
      spinningLfoRef.current.stop(ctx.currentTime + 0.3);
      spinningLfoRef.current = null;
    }
  }, [getAudioContext]);

  // 당첨 사운드 - 화려한 팡파레
  const playWin = useCallback(() => {
    if (isMuted) return;
    const ctx = getAudioContext();

    // 팡파레 멜로디 (도-미-솔-도-미-솔-도)
    const melody = [
      { freq: 523.25, time: 0, duration: 0.15 },      // C5
      { freq: 659.25, time: 0.12, duration: 0.15 },   // E5
      { freq: 783.99, time: 0.24, duration: 0.15 },   // G5
      { freq: 1046.50, time: 0.36, duration: 0.3 },   // C6
      { freq: 783.99, time: 0.55, duration: 0.15 },   // G5
      { freq: 1046.50, time: 0.67, duration: 0.5 },   // C6 (롱)
    ];

    melody.forEach(({ freq, time, duration }) => {
      // 메인 톤
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = freq;
      oscillator.type = 'sine';

      const startTime = ctx.currentTime + time;
      gainNode.gain.setValueAtTime(0.25, startTime);
      gainNode.gain.setValueAtTime(0.25, startTime + duration * 0.7);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);

      // 하모닉 추가
      const harmonic = ctx.createOscillator();
      const harmGain = ctx.createGain();
      harmonic.connect(harmGain);
      harmGain.connect(ctx.destination);
      harmonic.frequency.value = freq * 2;
      harmonic.type = 'sine';
      harmGain.gain.setValueAtTime(0.08, startTime);
      harmGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      harmonic.start(startTime);
      harmonic.stop(startTime + duration);
    });

    // 스파클 효과음
    for (let i = 0; i < 8; i++) {
      const sparkle = ctx.createOscillator();
      const sparkleGain = ctx.createGain();
      sparkle.connect(sparkleGain);
      sparkleGain.connect(ctx.destination);
      sparkle.frequency.value = 3000 + Math.random() * 2000;
      sparkle.type = 'sine';
      const sparkleTime = ctx.currentTime + 0.4 + Math.random() * 0.6;
      sparkleGain.gain.setValueAtTime(0.05, sparkleTime);
      sparkleGain.gain.exponentialRampToValueAtTime(0.001, sparkleTime + 0.1);
      sparkle.start(sparkleTime);
      sparkle.stop(sparkleTime + 0.1);
    }
  }, [getAudioContext, isMuted]);

  // 결과 확인 사운드 - 부드러운 벨 소리
  const playResult = useCallback(() => {
    if (isMuted) return;
    const ctx = getAudioContext();

    // 벨 하모닉스
    const harmonics = [1, 2, 3, 4, 5];
    const baseFreq = 880; // A5

    harmonics.forEach((h) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = baseFreq * h;
      oscillator.type = 'sine';

      const volume = 0.2 / (h * 0.8);
      const decay = 0.8 + (1 / h) * 0.5;

      gainNode.gain.setValueAtTime(volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + decay);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + decay);
    });

    // 서브 벨 (옥타브 아래)
    const subBell = ctx.createOscillator();
    const subGain = ctx.createGain();
    subBell.connect(subGain);
    subGain.connect(ctx.destination);
    subBell.frequency.value = 440;
    subBell.type = 'sine';
    subGain.gain.setValueAtTime(0.15, ctx.currentTime);
    subGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
    subBell.start(ctx.currentTime);
    subBell.stop(ctx.currentTime + 1.2);
  }, [getAudioContext, isMuted]);

  return useMemo(() => ({
    playClick,
    startSpin,
    stopSpin,
    playWin,
    playResult,
    isMuted,
    toggleMute,
  }), [playClick, startSpin, stopSpin, playWin, playResult, isMuted, toggleMute]);
}
