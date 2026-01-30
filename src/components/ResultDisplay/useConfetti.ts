import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ANIMATION_CONFIG, CONFETTI_COLORS } from '../../config/constants';

export function useConfetti(show: boolean, hasAnyResult: boolean) {
  useEffect(() => {
    if (show && hasAnyResult) {
      const animationEnd = Date.now() + ANIMATION_CONFIG.CONFETTI_DURATION;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        // 왼쪽에서 발사
        confetti({
          particleCount: ANIMATION_CONFIG.CONFETTI_PARTICLE_COUNT,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors: [...CONFETTI_COLORS],
          gravity: 1.2,
          scalar: 1.2,
        });

        // 오른쪽에서 발사
        confetti({
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
    }
  }, [show, hasAnyResult]);
}
