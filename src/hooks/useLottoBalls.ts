import { useState, useEffect, useRef, useCallback } from 'react';
import type { Champion } from '../types';

interface Ball {
  id: string;
  champion: Champion;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  isSelected: boolean;
  isEliminated: boolean;
  eliminatedAt: number | null;
}

interface UseLottoBallsOptions {
  champions: Champion[];
  containerWidth: number;
  containerHeight: number;
  isSpinning: boolean;
  onComplete?: (champion: Champion) => void;
}

// Physics constants - super bouncy!
const GRAVITY = 0.25;
const BOUNCE_DAMPING = 0.92;
const FRICTION = 0.998;
const BALL_RADIUS = 22;

// Timing constants
const ELIMINATION_START = 1500; // Start eliminating after 1.5s
const ELIMINATION_INTERVAL = 180; // Eliminate one ball every 180ms
const WINNER_DELAY = 1500; // Delay after last ball before showing result

export function useLottoBalls({
  champions,
  containerWidth,
  containerHeight,
  isSpinning,
  onComplete,
}: UseLottoBallsOptions) {
  const [balls, setBalls] = useState<Ball[]>([]);
  const [selectedChampion, setSelectedChampion] = useState<Champion | null>(null);
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>(0);
  const lastEliminationRef = useRef<number>(0);
  const hasCompletedRef = useRef<boolean>(false);
  const onCompleteRef = useRef(onComplete);
  const ballsRef = useRef<Ball[]>([]);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    ballsRef.current = balls;
  }, [balls]);

  // Initialize balls
  const initializeBalls = useCallback(() => {
    if (champions.length === 0 || containerWidth === 0) return;

    const ballCount = Math.min(30, champions.length);
    const shuffled = [...champions].sort(() => Math.random() - 0.5);
    const selectedChampions = shuffled.slice(0, ballCount);

    const newBalls: Ball[] = selectedChampions.map((champion, index) => {
      const x = Math.random() * (containerWidth - BALL_RADIUS * 2) + BALL_RADIUS;
      const y = Math.random() * (containerHeight - BALL_RADIUS * 2) + BALL_RADIUS;

      return {
        id: `${champion.id}-${index}`,
        champion,
        x,
        y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        radius: BALL_RADIUS,
        isSelected: false,
        isEliminated: false,
        eliminatedAt: null,
      };
    });

    setBalls(newBalls);
  }, [champions, containerWidth, containerHeight]);

  // Combined physics update and collision detection (optimized - single setBalls call)
  const updateSimulation = useCallback((elapsed: number) => {
    setBalls((prevBalls) => {
      // Pre-calculate active balls count once
      const activeBallsCount = prevBalls.filter(b => !b.isEliminated).length;
      const minDistSq = (BALL_RADIUS * 2) * (BALL_RADIUS * 2); // Pre-calculate squared distance

      // Pre-calculate shake values once per frame
      const shakeIntensity = Math.sin(elapsed * 0.015) * 1.2;
      const shakeIntensity2 = Math.cos(elapsed * 0.02) * 0.8;
      const shouldShake = activeBallsCount > 1;

      // Step 1: Update physics for all balls
      const updatedBalls = prevBalls.map((ball) => {
        if (ball.isEliminated) return ball;

        let { x, y, vx, vy } = ball;
        const { radius } = ball;

        // Apply gravity and friction
        vy += GRAVITY;
        vx *= FRICTION;
        vy *= FRICTION;

        // Energy injection (only if multiple balls remain)
        if (shouldShake) {
          vx += shakeIntensity * (Math.random() - 0.5) * 2;
          vy += shakeIntensity2 * (Math.random() - 0.5) * 2;

          if (Math.random() < 0.05) {
            vx += (Math.random() - 0.5) * 15;
            vy += (Math.random() - 0.5) * 15 - 5;
          }
          if (Math.random() < 0.01) {
            vx += (Math.random() - 0.5) * 25;
            vy -= Math.random() * 20 + 10;
          }
        }

        // Update position
        x += vx;
        y += vy;

        // Wall collisions
        if (x - radius < 0) {
          x = radius;
          vx = Math.abs(vx) * BOUNCE_DAMPING;
        } else if (x + radius > containerWidth) {
          x = containerWidth - radius;
          vx = -Math.abs(vx) * BOUNCE_DAMPING;
        }

        if (y - radius < 0) {
          y = radius;
          vy = Math.abs(vy) * BOUNCE_DAMPING;
        } else if (y + radius > containerHeight) {
          y = containerHeight - radius;
          vy = -Math.abs(vy) * BOUNCE_DAMPING;

          if (Math.abs(vy) < 3 && shouldShake) {
            vy = -Math.random() * 12 - 8;
            vx += (Math.random() - 0.5) * 10;
          }
        }

        return { ...ball, x, y, vx, vy };
      });

      // Step 2: Ball-to-ball collisions (only on active balls)
      const activeBalls: Ball[] = [];
      const eliminatedBalls: Ball[] = [];

      for (const ball of updatedBalls) {
        if (ball.isEliminated) {
          eliminatedBalls.push(ball);
        } else {
          activeBalls.push({ ...ball });
        }
      }

      // Optimized collision detection with squared distance check
      for (let i = 0; i < activeBalls.length; i++) {
        for (let j = i + 1; j < activeBalls.length; j++) {
          const ball1 = activeBalls[i];
          const ball2 = activeBalls[j];

          const dx = ball2.x - ball1.x;
          const dy = ball2.y - ball1.y;
          const distSq = dx * dx + dy * dy;

          // Early exit with squared distance comparison (avoids sqrt)
          if (distSq >= minDistSq || distSq === 0) continue;

          const distance = Math.sqrt(distSq);
          const minDistance = ball1.radius + ball2.radius;

          const angle = Math.atan2(dy, dx);
          const sin = Math.sin(angle);
          const cos = Math.cos(angle);

          const vx1 = ball1.vx * cos + ball1.vy * sin;
          const vy1 = ball1.vy * cos - ball1.vx * sin;
          const vx2 = ball2.vx * cos + ball2.vy * sin;
          const vy2 = ball2.vy * cos - ball2.vx * sin;

          const finalVx1 = vx2 * BOUNCE_DAMPING;
          const finalVx2 = vx1 * BOUNCE_DAMPING;

          ball1.vx = finalVx1 * cos - vy1 * sin;
          ball1.vy = vy1 * cos + finalVx1 * sin;
          ball2.vx = finalVx2 * cos - vy2 * sin;
          ball2.vy = vy2 * cos + finalVx2 * sin;

          const overlap = minDistance - distance;
          const invDist = 1 / distance;
          const separationX = (overlap / 2 + 1) * dx * invDist;
          const separationY = (overlap / 2 + 1) * dy * invDist;

          ball1.x -= separationX;
          ball1.y -= separationY;
          ball2.x += separationX;
          ball2.y += separationY;
        }
      }

      return [...activeBalls, ...eliminatedBalls];
    });
  }, [containerWidth, containerHeight]);

  // Eliminate one random ball
  const eliminateRandomBall = useCallback((currentTime: number) => {
    setBalls((prevBalls) => {
      const activeBalls = prevBalls.filter(b => !b.isEliminated);

      // Keep at least 1 ball
      if (activeBalls.length <= 1) return prevBalls;

      const randomIndex = Math.floor(Math.random() * activeBalls.length);
      const ballToEliminate = activeBalls[randomIndex];

      return prevBalls.map(ball =>
        ball.id === ballToEliminate.id
          ? { ...ball, isEliminated: true, eliminatedAt: currentTime }
          : ball
      );
    });
  }, []);

  // Select the winner (last remaining ball)
  const selectWinner = useCallback(() => {
    if (hasCompletedRef.current) return;

    const currentBalls = ballsRef.current;
    const activeBalls = currentBalls.filter(b => !b.isEliminated);

    if (activeBalls.length === 0) return;

    hasCompletedRef.current = true;
    const winner = activeBalls[0];
    setSelectedChampion(winner.champion);

    setBalls(prevBalls =>
      prevBalls.map(ball => ({
        ...ball,
        isSelected: ball.id === winner.id,
      }))
    );

    // Notify after animation - using captured winner value
    const winnerChampion = winner.champion;
    // Clear any existing timeout
    if (onCompleteTimeoutRef.current) {
      clearTimeout(onCompleteTimeoutRef.current);
    }
    onCompleteTimeoutRef.current = setTimeout(() => {
      if (onCompleteRef.current) {
        onCompleteRef.current(winnerChampion);
      }
    }, 1000);
  }, []);

  // Shake balls when spinning starts
  const shakeBalls = useCallback(() => {
    // Clear any pending timeouts from previous game
    if (winnerTimeoutRef.current) {
      clearTimeout(winnerTimeoutRef.current);
      winnerTimeoutRef.current = undefined;
    }
    if (onCompleteTimeoutRef.current) {
      clearTimeout(onCompleteTimeoutRef.current);
      onCompleteTimeoutRef.current = undefined;
    }

    hasCompletedRef.current = false;
    lastEliminationRef.current = 0;
    setSelectedChampion(null);

    setBalls((prevBalls) => {
      const resetBalls = prevBalls.map((ball) => ({
        ...ball,
        vx: (Math.random() - 0.5) * 35,
        vy: (Math.random() - 0.5) * 30 - 15,
        isSelected: false,
        isEliminated: false,
        eliminatedAt: null,
      }));
      // Also update ref immediately for animation loop
      ballsRef.current = resetBalls;
      return resetBalls;
    });
  }, []);

  // Track active ball count for winner selection
  const activeBallCountRef = useRef<number>(0);
  const winnerTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const onCompleteTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // Animation loop
  useEffect(() => {
    if (!isSpinning) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (winnerTimeoutRef.current) {
        clearTimeout(winnerTimeoutRef.current);
      }
      return;
    }

    startTimeRef.current = Date.now();
    lastEliminationRef.current = 0;
    activeBallCountRef.current = 999; // Reset
    hasCompletedRef.current = false; // Reset completion flag

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;

      // Always update physics while spinning
      updateSimulation(elapsed);

      // Start eliminating balls after initial phase
      if (elapsed > ELIMINATION_START && !hasCompletedRef.current) {
        const timeSinceLastElimination = elapsed - lastEliminationRef.current;

        if (timeSinceLastElimination > ELIMINATION_INTERVAL || lastEliminationRef.current === 0) {
          eliminateRandomBall(elapsed);
          lastEliminationRef.current = elapsed;
        }
      }

      // Check if only 1 ball remains
      const currentActiveBalls = ballsRef.current.filter(b => !b.isEliminated).length;

      if (currentActiveBalls === 1 && activeBallCountRef.current !== 1 && !hasCompletedRef.current) {
        activeBallCountRef.current = 1;

        // Wait a bit before selecting winner for dramatic effect
        winnerTimeoutRef.current = setTimeout(() => {
          selectWinner();
        }, WINNER_DELAY);
      } else {
        activeBallCountRef.current = currentActiveBalls;
      }

      // Keep animating until winner is selected
      if (!hasCompletedRef.current) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (winnerTimeoutRef.current) {
        clearTimeout(winnerTimeoutRef.current);
      }
    };
  }, [isSpinning, updateSimulation, eliminateRandomBall, selectWinner]);

  // Initialize on mount or when champions change
  useEffect(() => {
    initializeBalls();
  }, [initializeBalls]);

  // Shake when spinning starts
  useEffect(() => {
    if (isSpinning) {
      shakeBalls();
    }
  }, [isSpinning, shakeBalls]);

  return {
    balls,
    selectedChampion,
  };
}
