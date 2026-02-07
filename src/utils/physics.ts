// Physics constants
export const GRAVITY = 0.25;
export const BOUNCE_DAMPING = 0.92;
export const FRICTION = 0.998;
export const BALL_RADIUS = 22;

export interface PhysicsBall {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  isEliminated: boolean;
}

/**
 * Update a single ball's physics: gravity, friction, energy injection, wall collisions.
 * Returns a new object with updated position and velocity.
 */
export function updateBallPhysics<T extends PhysicsBall>(
  ball: T,
  containerWidth: number,
  containerHeight: number,
  shouldShake: boolean,
  shakeIntensity: number,
  shakeIntensity2: number,
): T {
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
}

/**
 * Resolve ball-to-ball collisions for a list of active (non-eliminated) balls.
 * Mutates the balls in-place for performance, returns the same array.
 */
export function resolveBallCollisions<T extends PhysicsBall>(activeBalls: T[]): void {
  const minDistSq = (BALL_RADIUS * 2) * (BALL_RADIUS * 2);

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
}
