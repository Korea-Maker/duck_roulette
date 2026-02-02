import { useEffect, useRef } from 'react';
import { ANIMATION_CONFIG, CONFETTI_COLORS } from '../../config/constants';

type ConfettiFn = (options?: {
  particleCount?: number;
  angle?: number;
  spread?: number;
  origin?: { x: number; y: number };
  colors?: string[];
  gravity?: number;
  scalar?: number;
}) => void;

export function useConfetti(show: boolean, hasAnyResult: boolean) {
  const confettiRef = useRef<ConfettiFn | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (show && hasAnyResult) {
      // Dynamic import for bundle size optimization
      import('canvas-confetti').then((module) => {
        confettiRef.current = module.default as ConfettiFn;

        // 초기 대형 폭발 효과
        confettiRef.current({
          particleCount: 80,
          spread: 100,
          origin: { x: 0.5, y: 0.5 },
          colors: [...CONFETTI_COLORS],
          gravity: 0.8,
          scalar: 1.5,
        });

        const animationEnd = Date.now() + ANIMATION_CONFIG.CONFETTI_DURATION;

        intervalRef.current = setInterval(() => {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0 || !confettiRef.current) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            return;
          }

          // 왼쪽에서 발사
          confettiRef.current({
            particleCount: ANIMATION_CONFIG.CONFETTI_PARTICLE_COUNT,
            angle: 60,
            spread: 70,
            origin: { x: 0, y: 0.7 },
            colors: [...CONFETTI_COLORS],
            gravity: 1.0,
            scalar: 1.3,
          });

          // 오른쪽에서 발사
          confettiRef.current({
            particleCount: ANIMATION_CONFIG.CONFETTI_PARTICLE_COUNT,
            angle: 120,
            spread: 70,
            origin: { x: 1, y: 0.7 },
            colors: [...CONFETTI_COLORS],
            gravity: 1.0,
            scalar: 1.3,
          });
        }, ANIMATION_CONFIG.CONFETTI_INTERVAL);
      });
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [show, hasAnyResult]);
}
