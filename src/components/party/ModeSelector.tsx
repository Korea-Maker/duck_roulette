import { motion } from 'framer-motion';
import type { ModeSelectorProps, AppMode } from '../../types';

const modes: { type: AppMode; label: string; icon: string }[] = [
  { type: 'single', label: '솔로', icon: '👤' },
  { type: 'party', label: '파티 (5인)', icon: '👥' },
];

export function ModeSelector({ currentMode, onModeChange }: ModeSelectorProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-gray-800/80 rounded-full border border-gray-700/50">
      {modes.map(({ type, label, icon }) => (
        <motion.button
          key={type}
          className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors
            ${currentMode === type
              ? 'text-yellow-400'
              : 'text-gray-400 hover:text-gray-200'
            }`}
          onClick={() => onModeChange(type)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {currentMode === type && (
            <motion.div
              className="absolute inset-0 bg-yellow-500/20 rounded-full border border-yellow-500/50"
              layoutId="mode-indicator"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
          <span className="relative z-10">
            {icon} {label}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
