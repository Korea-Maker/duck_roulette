export interface LottoSoundRefs {
  oscillator: OscillatorNode | null;
  gain: GainNode | null;
  noise: AudioBufferSourceNode | null;
  interval: ReturnType<typeof setInterval> | undefined;
}

/**
 * 로또 스핀 정지
 */
export function createStopLottoSpin(
  ctx: AudioContext,
  refs: LottoSoundRefs,
) {
  return () => {
    if (refs.oscillator && refs.gain) {
      refs.gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + 0.5
      );
      refs.oscillator.stop(ctx.currentTime + 0.5);
      refs.oscillator = null;
      refs.gain = null;
    }
    if (refs.noise) {
      refs.noise.stop();
      refs.noise = null;
    }
    if (refs.interval) {
      clearInterval(refs.interval);
      refs.interval = undefined;
    }
  };
}

/**
 * 로또 스핀 사운드 - 공이 통 안에서 튀기는 소리
 */
import type { MutableRef } from './types';

export function createStartLottoSpin(
  ctx: AudioContext,
  isMutedRef: MutableRef<boolean>,
  refs: LottoSoundRefs,
  stopLottoSpin: () => void,
) {
  return () => {
    if (isMutedRef.current) return;

    // 기존 로또 사운드 정지
    stopLottoSpin();

    // 깊은 드럼통 울림음
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    filter.type = 'lowpass';
    filter.frequency.value = 400;
    filter.Q.value = 5;

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(60, ctx.currentTime);

    gainNode.gain.setValueAtTime(0.08, ctx.currentTime);

    oscillator.start(ctx.currentTime);

    refs.oscillator = oscillator;
    refs.gain = gainNode;

    // 주기적인 공 튀기는 소리
    refs.interval = setInterval(() => {
      if (isMutedRef.current) return;

      // 랜덤한 공 충돌음
      const bounceOsc = ctx.createOscillator();
      const bounceGain = ctx.createGain();
      const bounceFilter = ctx.createBiquadFilter();

      bounceOsc.connect(bounceFilter);
      bounceFilter.connect(bounceGain);
      bounceGain.connect(ctx.destination);

      bounceFilter.type = 'bandpass';
      bounceFilter.frequency.value = 800 + Math.random() * 600;
      bounceFilter.Q.value = 3;

      // 플라스틱 공 소리
      bounceOsc.type = 'sine';
      bounceOsc.frequency.setValueAtTime(200 + Math.random() * 150, ctx.currentTime);
      bounceOsc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.08);

      bounceGain.gain.setValueAtTime(0.15 + Math.random() * 0.1, ctx.currentTime);
      bounceGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

      bounceOsc.start(ctx.currentTime);
      bounceOsc.stop(ctx.currentTime + 0.1);

      // 가끔 벽 충돌음 추가
      if (Math.random() < 0.3) {
        const wallOsc = ctx.createOscillator();
        const wallGain = ctx.createGain();
        wallOsc.connect(wallGain);
        wallGain.connect(ctx.destination);
        wallOsc.type = 'square';
        wallOsc.frequency.value = 100 + Math.random() * 50;
        wallGain.gain.setValueAtTime(0.05, ctx.currentTime);
        wallGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        wallOsc.start(ctx.currentTime);
        wallOsc.stop(ctx.currentTime + 0.05);
      }
    }, 80 + Math.random() * 40);
  };
}
