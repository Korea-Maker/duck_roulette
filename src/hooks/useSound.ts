import { useCallback, useRef } from 'react';

export function useSound() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const spinningOscillatorRef = useRef<OscillatorNode | null>(null);
  const spinningGainRef = useRef<GainNode | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    return audioContextRef.current;
  }, []);

  // Click sound - sharp beep
  const playClick = useCallback(() => {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  }, [getAudioContext]);

  // Spinning sound - continuous rising tone
  const startSpin = useCallback(() => {
    const ctx = getAudioContext();

    // Stop existing spin sound if any
    if (spinningOscillatorRef.current) {
      spinningOscillatorRef.current.stop();
      spinningOscillatorRef.current = null;
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    filter.type = 'lowpass';
    filter.frequency.value = 1000;

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(200, ctx.currentTime);
    oscillator.frequency.linearRampToValueAtTime(400, ctx.currentTime + 2);

    gainNode.gain.setValueAtTime(0.15, ctx.currentTime);

    oscillator.start(ctx.currentTime);

    spinningOscillatorRef.current = oscillator;
    spinningGainRef.current = gainNode;
  }, [getAudioContext]);

  // Stop spinning sound
  const stopSpin = useCallback(() => {
    if (spinningOscillatorRef.current && spinningGainRef.current) {
      const ctx = getAudioContext();
      spinningGainRef.current.gain.exponentialRampToValueAtTime(
        0.01,
        ctx.currentTime + 0.2
      );
      spinningOscillatorRef.current.stop(ctx.currentTime + 0.2);
      spinningOscillatorRef.current = null;
      spinningGainRef.current = null;
    }
  }, [getAudioContext]);

  // Win sound - triumphant ascending chime
  const playWin = useCallback(() => {
    const ctx = getAudioContext();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

    notes.forEach((freq, index) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = freq;
      oscillator.type = 'sine';

      const startTime = ctx.currentTime + index * 0.15;
      gainNode.gain.setValueAtTime(0.4, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.5);
    });
  }, [getAudioContext]);

  // Result sound - satisfying ding
  const playResult = useCallback(() => {
    const ctx = getAudioContext();

    // Main bell tone
    [1, 2, 3].forEach((harmonic) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = 800 * harmonic;
      oscillator.type = 'sine';

      const volume = 0.3 / harmonic;
      gainNode.gain.setValueAtTime(volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 1.5);
    });
  }, [getAudioContext]);

  return {
    playClick,
    startSpin,
    stopSpin,
    playWin,
    playResult,
  };
}
