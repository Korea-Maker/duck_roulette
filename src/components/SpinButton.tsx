import { motion } from 'framer-motion';
import type { SpinButtonProps } from '../types';

export function SpinButton({ onClick, disabled, isSpinning, onPlayClick }: SpinButtonProps) {
  const handleClick = () => {
    onPlayClick?.();
    onClick();
  };
  return (
    <motion.button
      onClick={handleClick}
      disabled={disabled}
      className="spin-button uppercase tracking-wider"
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      animate={isSpinning ? {
        boxShadow: [
          '0 0 20px rgba(255, 215, 0, 0.4)',
          '0 0 40px rgba(255, 215, 0, 0.8)',
          '0 0 20px rgba(255, 215, 0, 0.4)',
        ]
      } : {}}
      transition={isSpinning ? {
        duration: 0.5,
        repeat: Infinity,
        ease: 'easeInOut'
      } : {}}
    >
      {isSpinning ? (
        <span className="flex items-center gap-2">
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            🎰
          </motion.span>
          운명을 결정중...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          🎲 운명의 주사위
        </span>
      )}
    </motion.button>
  );
}
