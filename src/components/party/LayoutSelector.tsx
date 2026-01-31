import { motion } from 'framer-motion';
import type { LayoutSelectorProps, PartyLayoutType } from '../../types';

const layouts: { type: PartyLayoutType; label: string; icon: string }[] = [
  { type: 'circular', label: '원형', icon: '⭕' },
  { type: 'horizontal', label: '가로', icon: '⬜⬜⬜' },
];

export function LayoutSelector({ currentLayout, onLayoutChange }: LayoutSelectorProps) {
  return (
    <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-xl border border-gray-700/50">
      {layouts.map(({ type, label, icon }) => (
        <motion.button
          key={type}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors
            ${currentLayout === type
              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
              : 'bg-gray-700/50 text-gray-400 border border-transparent hover:bg-gray-600/50'
            }`}
          onClick={() => onLayoutChange(type)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="mr-1">{icon}</span>
          <span className="hidden sm:inline">{label}</span>
        </motion.button>
      ))}
    </div>
  );
}
