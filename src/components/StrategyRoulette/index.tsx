import { motion, AnimatePresence } from 'framer-motion';
import { useStrategyRoulette } from '../../hooks/useStrategyRoulette';
import { API_CONFIG } from '../../config/api';
import {
  DIFFICULTY_COLORS,
  DIFFICULTY_LABELS,
  CATEGORY_LABELS,
  CATEGORY_ICONS,
  type Strategy,
} from '../../data/strategies';

const DIFFICULTIES = ['all', 'easy', 'medium', 'hard', 'extreme'] as const;

const DIFFICULTY_BUTTON_COLORS: Record<string, string> = {
  all: 'bg-gray-600 hover:bg-gray-500',
  easy: 'bg-green-700 hover:bg-green-600',
  medium: 'bg-yellow-700 hover:bg-yellow-600',
  hard: 'bg-orange-700 hover:bg-orange-600',
  extreme: 'bg-red-700 hover:bg-red-600',
};

const DIFFICULTY_BUTTON_LABELS: Record<string, string> = {
  all: '전체',
  easy: '쉬움',
  medium: '보통',
  hard: '어려움',
  extreme: '극한',
};

function StrategyCard({ strategy, index }: { strategy: Strategy; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.3 + index * 0.15, duration: 0.4, ease: 'easeOut' }}
      className="rounded-lg border p-3 bg-gray-800/80"
      style={{ borderColor: DIFFICULTY_COLORS[strategy.difficulty] + '60' }}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-lg">{CATEGORY_ICONS[strategy.category]}</span>
          <span className="font-bold text-white text-sm">{strategy.koreanName}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{CATEGORY_LABELS[strategy.category]}</span>
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: DIFFICULTY_COLORS[strategy.difficulty] + '20',
              color: DIFFICULTY_COLORS[strategy.difficulty],
            }}
          >
            {DIFFICULTY_LABELS[strategy.difficulty]}
          </span>
        </div>
      </div>
      <p className="text-gray-400 text-xs">{strategy.description}</p>
    </motion.div>
  );
}

export default function StrategyRoulette() {
  const { champion, strategies, isSpinning, difficulty, setDifficulty, spin, reset } =
    useStrategyRoulette();

  const hasResult = champion && strategies.length > 0;

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6">
      <h2 className="text-xl font-bold text-white text-center mb-4">
        🎲 스트랫 룰렛
      </h2>

      {/* 난이도 선택 */}
      <div className="flex flex-wrap justify-center gap-2 mb-5">
        {DIFFICULTIES.map((diff) => (
          <button
            key={diff}
            onClick={() => setDifficulty(diff)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium text-white transition-all ${
              difficulty === diff
                ? `${DIFFICULTY_BUTTON_COLORS[diff]} ring-2 ring-white/30 scale-105`
                : `${DIFFICULTY_BUTTON_COLORS[diff]} opacity-60`
            }`}
          >
            {DIFFICULTY_BUTTON_LABELS[diff]}
          </button>
        ))}
      </div>

      {/* 스핀 버튼 */}
      <div className="flex justify-center mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={hasResult ? reset : spin}
          disabled={isSpinning}
          className={`px-8 py-3 rounded-xl font-bold text-white text-base transition-colors ${
            isSpinning
              ? 'bg-gray-600 cursor-not-allowed'
              : hasResult
              ? 'bg-purple-600 hover:bg-purple-500'
              : 'bg-blue-600 hover:bg-blue-500'
          }`}
        >
          {isSpinning ? '돌리는 중...' : hasResult ? '다시 돌리기' : '스핀!'}
        </motion.button>
      </div>

      {/* 스피닝 애니메이션 */}
      <AnimatePresence>
        {isSpinning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3 mb-6"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
              className="w-20 h-20 rounded-full border-4 border-blue-500 border-t-transparent"
            />
            <p className="text-gray-400 text-sm">챔피언과 전략을 선정 중...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 결과 표시 */}
      <AnimatePresence>
        {hasResult && !isSpinning && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {/* 챔피언 카드 */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex flex-col items-center mb-5"
            >
              <div
                className="w-24 h-24 rounded-full overflow-hidden border-4 mb-2"
                style={{ borderColor: champion.color }}
              >
                <img
                  src={API_CONFIG.getChampionImageUrl(champion.id)}
                  alt={champion.koreanName}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-bold text-white">{champion.koreanName}</h3>
              <div className="flex gap-1 mt-1">
                {champion.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* 전략 카드 목록 */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-400 text-center mb-2">
                📋 미션 ({strategies.length}개)
              </h4>
              {strategies.map((strategy, i) => (
                <StrategyCard key={strategy.id} strategy={strategy} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
