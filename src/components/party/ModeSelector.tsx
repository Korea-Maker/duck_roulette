import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ModeSelectorProps, AppMode } from '../../types';

type MainCategory = 'roulette' | 'minigame';

const mainCategories: { type: MainCategory; label: string; icon: string }[] = [
  { type: 'roulette', label: '룰렛', icon: '🎰' },
  { type: 'minigame', label: '미니게임', icon: '🎮' },
];

const rouletteModes: { type: AppMode; label: string; icon: string }[] = [
  { type: 'single', label: '솔로', icon: '👤' },
  { type: 'party', label: '파티', icon: '👥' },
];

const minigameModes: { type: AppMode; label: string; icon: string; desc: string }[] = [
  { type: 'strategy', label: '스트랫 룰렛', icon: '🎯', desc: '랜덤 전략 도전' },
  { type: 'gold-pressure', label: '골드 프레셔', icon: '💰', desc: '골드 제한 빌드' },
  { type: 'color-blender', label: '컬러 블렌더', icon: '🎨', desc: '챔피언 색상 믹스' },
  { type: 'fate-trade', label: '운명의 트레이드', icon: '🔄', desc: '챔피언 교환' },
  { type: 'synergy', label: '시너지 보드', icon: '⚡', desc: '빌드 시너지 분석' },
];

function isRouletteMode(mode: AppMode): boolean {
  return mode === 'single' || mode === 'party';
}

export function ModeSelector({ currentMode, onModeChange }: ModeSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<MainCategory>(
    isRouletteMode(currentMode) ? 'roulette' : 'minigame'
  );

  const handleCategoryChange = (cat: MainCategory) => {
    setActiveCategory(cat);
    if (cat === 'roulette' && !isRouletteMode(currentMode)) {
      onModeChange('single');
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {/* 상단: 메인 카테고리 */}
      <div className="flex items-center gap-1 p-1 bg-gray-800/80 rounded-full border border-gray-700/50">
        {mainCategories.map(({ type, label, icon }) => (
          <motion.button
            key={type}
            className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${activeCategory === type
                ? 'text-yellow-400'
                : 'text-gray-400 hover:text-gray-200'
              }`}
            onClick={() => handleCategoryChange(type)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div
              className={`absolute inset-0 rounded-full border transition-all duration-150 ${
                activeCategory === type
                  ? 'bg-yellow-500/20 border-yellow-500/50 opacity-100'
                  : 'bg-transparent border-transparent opacity-0'
              }`}
            />
            <span className="relative z-10">
              {icon} {label}
            </span>
          </motion.button>
        ))}
      </div>

      {/* 하단: 서브 모드 */}
      <AnimatePresence mode="wait" initial={false}>
        {activeCategory === 'roulette' ? (
          <motion.div
            key="roulette-sub"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.12 }}
            className="flex items-center gap-1 p-1 bg-gray-800/60 rounded-full border border-gray-700/30"
          >
            {rouletteModes.map(({ type, label, icon }) => (
              <motion.button
                key={type}
                className={`relative px-3 py-1.5 rounded-full text-xs font-medium transition-colors
                  ${currentMode === type
                    ? 'text-yellow-400'
                    : 'text-gray-400 hover:text-gray-200'
                  }`}
                onClick={() => onModeChange(type)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className={`absolute inset-0 rounded-full border transition-all duration-150 ${
                    currentMode === type
                      ? 'bg-yellow-500/15 border-yellow-500/40 opacity-100'
                      : 'bg-transparent border-transparent opacity-0'
                  }`}
                />
                <span className="relative z-10">
                  {icon} {label}
                </span>
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="minigame-sub"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.12 }}
            className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 p-1.5 bg-gray-800/60 rounded-xl border border-gray-700/30"
          >
            {minigameModes.map(({ type, label, icon, desc }) => (
              <motion.button
                key={type}
                className={`relative flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors
                  ${currentMode === type
                    ? 'text-yellow-400 bg-yellow-500/10 border border-yellow-500/40'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50 border border-transparent'
                  }`}
                onClick={() => onModeChange(type)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="text-base">{icon}</span>
                <span className="font-bold text-[11px] whitespace-nowrap">{label}</span>
                <span className="text-[9px] text-gray-500 whitespace-nowrap">{desc}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
