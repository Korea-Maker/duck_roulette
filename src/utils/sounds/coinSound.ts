import type { MutableRef } from './types';

/**
 * 코인 투입 사운드 - 금속성 딸깍 소리
 */
export function createPlayClick(
  ctx: AudioContext,
  isMutedRef: MutableRef<boolean>,
) {
  return () => {
    if (isMutedRef.current) return;

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
  };
}
