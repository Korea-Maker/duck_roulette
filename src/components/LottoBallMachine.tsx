import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useLottoBalls } from '../hooks/useLottoBalls';
import { getChampionImageUrl } from '../utils/champion';
import type { Champion } from '../types';

interface LottoBallMachineProps {
  champions: Champion[];
  isSpinning: boolean;
  onComplete?: (champion: Champion) => void;
}

export function LottoBallMachine({
  champions,
  isSpinning,
  onComplete,
}: LottoBallMachineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 450 });

  // Update dimensions on mount and resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const { balls, selectedChampion } = useLottoBalls({
    champions,
    containerWidth: dimensions.width,
    containerHeight: dimensions.height,
    isSpinning,
    onComplete,
  });

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* Lottery Machine Container */}
      <motion.div
        ref={containerRef}
        className="relative rounded-3xl overflow-hidden"
        style={{
          height: '450px',
          background: 'linear-gradient(145deg, rgba(26, 26, 26, 0.95) 0%, rgba(18, 18, 18, 0.95) 50%, rgba(26, 26, 26, 0.95) 100%)',
          border: '4px solid var(--theme-primary)',
          boxShadow: `
            0 0 20px var(--theme-glow),
            0 0 40px rgba(0, 0, 0, 0.5),
            inset 0 0 60px rgba(0, 0, 0, 0.8)
          `,
        }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      >
        {/* Glass effect overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: `
              radial-gradient(ellipse at 30% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 40%),
              radial-gradient(ellipse at 70% 80%, rgba(255, 255, 255, 0.08) 0%, transparent 30%)
            `,
          }}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(var(--theme-primary) 1px, transparent 1px),
              linear-gradient(90deg, var(--theme-primary) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px',
          }}
        />

        {/* Spinning glow effect */}
        {isSpinning && (
          <motion.div
            className="absolute inset-0 rounded-3xl pointer-events-none z-20"
            style={{
              boxShadow: '0 0 20px var(--theme-primary), 0 0 40px var(--theme-glow)',
            }}
            animate={{
              boxShadow: [
                '0 0 20px #ff0000, 0 0 40px #ff000066',
                '0 0 20px #ffff00, 0 0 40px #ffff0066',
                '0 0 20px #00ff00, 0 0 40px #00ff0066',
                '0 0 20px #00ffff, 0 0 40px #00ffff66',
                '0 0 20px #0077ff, 0 0 40px #0077ff66',
                '0 0 20px #ff00ff, 0 0 40px #ff00ff66',
                '0 0 20px #ff0000, 0 0 40px #ff000066',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        )}

        {/* Balls */}
        <div className="absolute inset-0">
          <AnimatePresence>
            {balls.map((ball) => (
              <motion.div
                key={ball.id}
                className="absolute"
                style={{
                  left: ball.x - ball.radius,
                  top: ball.y - ball.radius,
                  width: ball.radius * 2,
                  height: ball.radius * 2,
                }}
                animate={{
                  scale: ball.isEliminated ? 0 : ball.isSelected ? [1, 1.5, 1.3] : 1,
                  opacity: ball.isEliminated ? 0 : 1,
                  rotate: ball.isEliminated ? 180 : 0,
                }}
                transition={{
                  scale: { duration: ball.isEliminated ? 0.4 : 0.5, ease: 'easeOut' },
                  opacity: { duration: 0.3 },
                  rotate: { duration: 0.4 },
                }}
              >
                {/* Ball shadow */}
                <div
                  className="absolute rounded-full"
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'radial-gradient(circle at center, rgba(0, 0, 0, 0.4) 0%, transparent 60%)',
                    filter: 'blur(8px)',
                    transform: 'translateY(8px)',
                  }}
                />

                {/* Ball body */}
                <motion.div
                  className="relative rounded-full overflow-hidden"
                  style={{
                    width: '100%',
                    height: '100%',
                    background: ball.isSelected
                      ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)'
                      : `linear-gradient(135deg, ${ball.champion.color} 0%, ${adjustBrightness(ball.champion.color, -20)} 100%)`,
                    border: ball.isSelected ? '3px solid #FFD700' : '3px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: ball.isSelected
                      ? '0 0 30px rgba(255, 215, 0, 0.8), 0 0 50px rgba(255, 215, 0, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.3)'
                      : '0 4px 15px rgba(0, 0, 0, 0.4), inset 0 2px 8px rgba(255, 255, 255, 0.2)',
                  }}
                  animate={ball.isSelected ? {
                    boxShadow: [
                      '0 0 30px rgba(255, 215, 0, 0.8), 0 0 50px rgba(255, 215, 0, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.3)',
                      '0 0 50px rgba(255, 215, 0, 1), 0 0 80px rgba(255, 215, 0, 0.7), inset 0 0 25px rgba(255, 255, 255, 0.5)',
                      '0 0 30px rgba(255, 215, 0, 0.8), 0 0 50px rgba(255, 215, 0, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.3)',
                    ],
                  } : {}}
                  transition={{ duration: 1, repeat: ball.isSelected ? Infinity : 0 }}
                >
                  {/* Shine effect */}
                  <div
                    className="absolute"
                    style={{
                      top: '15%',
                      left: '20%',
                      width: '40%',
                      height: '40%',
                      background: 'radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 70%)',
                      borderRadius: '50%',
                      filter: 'blur(4px)',
                    }}
                  />

                  {/* Champion icon */}
                  <div className="absolute inset-0 flex items-center justify-center p-2">
                    <img
                      src={getChampionImageUrl(ball.champion.id)}
                      alt={ball.champion.koreanName}
                      className="w-full h-full object-cover rounded-full"
                      style={{
                        filter: ball.isSelected ? 'brightness(1.2) contrast(1.1)' : 'brightness(0.95)',
                      }}
                    />
                  </div>

                  {/* Selected champion label */}
                  {ball.isSelected && (
                    <motion.div
                      className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div
                        className="px-3 py-1 rounded-full text-sm font-bold"
                        style={{
                          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                          color: '#1a1a1a',
                          boxShadow: '0 0 20px rgba(255, 215, 0, 0.6)',
                          fontFamily: "'Bebas Neue', 'Orbitron', sans-serif",
                          letterSpacing: '0.05em',
                        }}
                      >
                        {ball.champion.koreanName}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Bottom label */}
        <div
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center pointer-events-none z-30"
        >
          <motion.div
            className="text-sm font-bold tracking-wider"
            style={{
              color: 'var(--theme-text)',
              textShadow: '0 0 10px var(--theme-glow)',
              fontFamily: "'Orbitron', sans-serif",
            }}
            animate={isSpinning ? {
              opacity: [0.6, 1, 0.6],
              textShadow: [
                '0 0 10px var(--theme-glow)',
                '0 0 20px var(--theme-glow)',
                '0 0 10px var(--theme-glow)',
              ],
            } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {isSpinning
              ? `추첨 중... (${balls.filter(b => !b.isEliminated).length}명 남음)`
              : selectedChampion
                ? `🏆 ${selectedChampion.koreanName} 당첨!`
                : '챔피언 로또'}
          </motion.div>
        </div>
      </motion.div>

      {/* Machine stand */}
      <div
        className="h-8 mx-auto rounded-b-lg"
        style={{
          width: '90%',
          background: 'linear-gradient(180deg, var(--theme-primary) 0%, var(--theme-secondary) 100%)',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
          border: '2px solid var(--theme-primary)',
          borderTop: 'none',
        }}
      />
    </div>
  );
}

// Helper function to adjust color brightness
function adjustBrightness(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const r = Math.max(0, Math.min(255, parseInt(hex.substring(0, 2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(hex.substring(2, 4), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(hex.substring(4, 6), 16) + amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
