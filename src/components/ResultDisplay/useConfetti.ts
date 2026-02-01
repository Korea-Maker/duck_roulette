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

  useEffect(() => {
    if (show && hasAnyResult) {
      // Dynamic import for bundle size optimization
      import('canvas-confetti').then((module) => {
        confettiRef.current = module.default as ConfettiFn;

        const animationEnd = Date.now() + ANIMATION_CONFIG.CONFETTI_DURATION;

        const interval = setInterval(() => {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0 || !confettiRef.current) {
            clearInterval(interval);
            return;
          }

          // 왼쪽에서 발사
          confettiRef.current({
            particleCount: ANIMATION_CONFIG.CONFETTI_PARTICLE_COUNT,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.6 },
            colors: [...CONFETTI_COLORS],
            gravity: 1.2,
            scalar: 1.2,
          });

          // 오른쪽에서 발사
          confettiRef.current({
            particleCount: ANIMATION_CONFIG.CONFETTI_PARTICLE_COUNT,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.6 },
            colors: [...CONFETTI_COLORS],
            gravity: 1.2,
            scalar: 1.2,
          });
        }, ANIMATION_CONFIG.CONFETTI_INTERVAL);

        return () => clearInterval(interval);
      });
    }
  }, [show, hasAnyResult]);
}
