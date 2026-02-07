import { useState, useEffect, useRef, useCallback } from 'react';
import type { Champion } from '../types';
import { shuffleArray } from '../utils/random';
import { BALL_RADIUS, updateBallPhysics, resolveBallCollisions } from '../utils/physics';

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

  const updateBalls = useCallback((updater: (prev: Ball[]) => Ball[]) => {
    setBalls(prev => {
      const next = updater(prev);
      ballsRef.current = next;
      return next;
    });
  }, []);

  // Initialize balls
  const initializeBalls = useCallback(() => {
    if (champions.length === 0 || containerWidth === 0) return;

    const ballCount = Math.min(30, champions.length);
    const shuffled = shuffleArray(champions);
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

    updateBalls(() => newBalls);
  }, [champions, containerWidth, containerHeight, updateBalls]);

  // Combined physics update and collision detection (optimized - single setBalls call)
  const updateSimulation = useCallback((elapsed: number) => {
    updateBalls((prevBalls) => {
      // Pre-calculate active balls count once
      const activeBallsCount = prevBalls.filter(b => !b.isEliminated).length;

      // Pre-calculate shake values once per frame
      const shakeIntensity = Math.sin(elapsed * 0.015) * 1.2;
      const shakeIntensity2 = Math.cos(elapsed * 0.02) * 0.8;
      const shouldShake = activeBallsCount > 1;

      // Step 1: Update physics for all balls
      const updatedBalls = prevBalls.map((ball) =>
        updateBallPhysics(ball, containerWidth, containerHeight, shouldShake, shakeIntensity, shakeIntensity2)
      );

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

      // Resolve collisions (mutates activeBalls in-place)
      resolveBallCollisions(activeBalls);

      return [...activeBalls, ...eliminatedBalls];
    });
  }, [containerWidth, containerHeight, updateBalls]);

  // Eliminate one random ball
  const eliminateRandomBall = useCallback((currentTime: number) => {
    updateBalls((prevBalls) => {
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
  }, [updateBalls]);

  // Select the winner (last remaining ball)
  const selectWinner = useCallback(() => {
    if (hasCompletedRef.current) return;

    const currentBalls = ballsRef.current;
    const activeBalls = currentBalls.filter(b => !b.isEliminated);

    if (activeBalls.length === 0) return;

    hasCompletedRef.current = true;
    const winner = activeBalls[0];
    setSelectedChampion(winner.champion);

    updateBalls(prevBalls =>
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
  }, [updateBalls]);

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

    updateBalls((prevBalls) =>
      prevBalls.map((ball) => ({
        ...ball,
        vx: (Math.random() - 0.5) * 35,
        vy: (Math.random() - 0.5) * 30 - 15,
        isSelected: false,
        isEliminated: false,
        eliminatedAt: null,
      }))
    );
  }, [updateBalls]);

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
      if (onCompleteTimeoutRef.current) {
        clearTimeout(onCompleteTimeoutRef.current);
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
