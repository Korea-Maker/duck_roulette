import type { MutableRef } from './types';

/**
 * 공 탈락 사운드 - 퐁 하고 사라지는 소리
 */
export function createPlayEliminate(
  ctx: AudioContext,
  isMutedRef: MutableRef<boolean>,
) {
  return () => {
    if (isMutedRef.current) return;

    // 떨어지는 음
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    filter.type = 'lowpass';
    filter.frequency.value = 1000;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400 + Math.random() * 200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);

    // 버블 팝 효과
    const pop = ctx.createOscillator();
    const popGain = ctx.createGain();
    pop.connect(popGain);
    popGain.connect(ctx.destination);
    pop.type = 'sine';
    pop.frequency.setValueAtTime(800, ctx.currentTime);
    pop.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.05);
    popGain.gain.setValueAtTime(0.08, ctx.currentTime);
    popGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    pop.start(ctx.currentTime);
    pop.stop(ctx.currentTime + 0.08);
  };
}

/**
 * 당첨 사운드 - 화려한 팡파레
 */
export function createPlayWin(
  ctx: AudioContext,
  isMutedRef: MutableRef<boolean>,
) {
  return () => {
    if (isMutedRef.current) return;

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
  };
}

/**
 * 결과 확인 사운드 - 부드러운 벨 소리
 */
export function createPlayResult(
  ctx: AudioContext,
  isMutedRef: MutableRef<boolean>,
) {
  return () => {
    if (isMutedRef.current) return;

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
  };
}
