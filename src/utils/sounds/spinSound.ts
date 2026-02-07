export interface SpinSoundRefs {
  oscillator: OscillatorNode | null;
  gain: GainNode | null;
  lfo: OscillatorNode | null;
}

/**
 * 스핀 사운드 - 카지노 슬롯머신 릴 회전음
 */
import type { MutableRef } from './types';

export function createStartSpin(
  ctx: AudioContext,
  isMutedRef: MutableRef<boolean>,
  refs: SpinSoundRefs,
) {
  return () => {
    if (isMutedRef.current) return;

    // 기존 스핀 사운드 정지
    if (refs.oscillator) {
      refs.oscillator.stop();
      refs.oscillator = null;
    }
    if (refs.lfo) {
      refs.lfo.stop();
      refs.lfo = null;
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

    refs.oscillator = oscillator;
    refs.gain = gainNode;
    refs.lfo = lfo;
  };
}

/**
 * 스핀 정지 사운드
 */
export function createStopSpin(
  ctx: AudioContext,
  refs: SpinSoundRefs,
) {
  return () => {
    if (refs.oscillator && refs.gain) {
      refs.gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + 0.3
      );
      refs.oscillator.stop(ctx.currentTime + 0.3);
      refs.oscillator = null;
      refs.gain = null;
    }
    if (refs.lfo) {
      refs.lfo.stop(ctx.currentTime + 0.3);
      refs.lfo = null;
    }
  };
}
