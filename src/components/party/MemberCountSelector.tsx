import { motion } from 'framer-motion';

interface MemberCountSelectorProps {
  count: number;
  onChange: (count: number) => void;
  disabled?: boolean;
}

const MEMBER_OPTIONS = [2, 3, 4, 5];

export function MemberCountSelector({ count, onChange, disabled }: MemberCountSelectorProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-gray-400 text-sm">인원:</span>
      <div className="flex items-center gap-1 p-1 bg-gray-800/50 rounded-full border border-gray-700/50">
        {MEMBER_OPTIONS.map((num) => (
          <motion.button
            key={num}
            className={`relative w-10 h-10 rounded-full text-sm font-bold transition-colors
              ${count === num
                ? 'text-yellow-400'
                : 'text-gray-400 hover:text-gray-200'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => !disabled && onChange(num)}
            whileHover={!disabled ? { scale: 1.1 } : {}}
            whileTap={!disabled ? { scale: 0.95 } : {}}
            disabled={disabled}
          >
            {count === num && (
              <motion.div
                className="absolute inset-0 bg-yellow-500/20 rounded-full border border-yellow-500/50"
                layoutId="member-count-indicator"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">{num}</span>
          </motion.button>
        ))}
      </div>
      <span className="text-gray-500 text-xs">명</span>
    </div>
  );
}
