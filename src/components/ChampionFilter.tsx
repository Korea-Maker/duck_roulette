import { motion } from 'framer-motion';
import type { ChampionTag } from '../types';
import { CHAMPION_TAGS, TAG_NAMES, CHAMPIONS } from '../data/champions';

interface ChampionFilterProps {
  selectedTags: ChampionTag[];
  onTagsChange: (tags: ChampionTag[]) => void;
}

// 역할별 아이콘 및 색상
const TAG_STYLES: Record<ChampionTag, { icon: string; color: string; bgColor: string }> = {
  Fighter: { icon: '⚔️', color: 'text-orange-400', bgColor: 'bg-orange-500/20 border-orange-500/50' },
  Tank: { icon: '🛡️', color: 'text-blue-400', bgColor: 'bg-blue-500/20 border-blue-500/50' },
  Mage: { icon: '🔮', color: 'text-purple-400', bgColor: 'bg-purple-500/20 border-purple-500/50' },
  Assassin: { icon: '🗡️', color: 'text-red-400', bgColor: 'bg-red-500/20 border-red-500/50' },
  Marksman: { icon: '🏹', color: 'text-green-400', bgColor: 'bg-green-500/20 border-green-500/50' },
  Support: { icon: '💚', color: 'text-teal-400', bgColor: 'bg-teal-500/20 border-teal-500/50' },
};

// 역할별 챔피언 수 계산
function getChampionCountByTag(tag: ChampionTag): number {
  return CHAMPIONS.filter((c) => c.tags.includes(tag)).length;
}

export function ChampionFilter({ selectedTags, onTagsChange }: ChampionFilterProps) {
  const toggleTag = (tag: ChampionTag) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const selectAll = () => {
    onTagsChange([...CHAMPION_TAGS]);
  };

  const clearAll = () => {
    onTagsChange([]);
  };

  // 필터링된 챔피언 수 계산
  const filteredCount =
    selectedTags.length === 0
      ? CHAMPIONS.length
      : CHAMPIONS.filter((c) => c.tags.some((t) => selectedTags.includes(t))).length;

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-400 flex items-center gap-2">
          <span>🎯</span>
          <span>챔피언 필터</span>
          <span className="text-xs text-gray-500">({filteredCount}명)</span>
        </h3>
        <div className="flex gap-2">
          <button
            onClick={selectAll}
            className="text-xs px-2 py-1 rounded bg-gray-700/50 text-gray-400 hover:bg-gray-600/50 hover:text-gray-300 transition-colors"
          >
            전체 선택
          </button>
          <button
            onClick={clearAll}
            className="text-xs px-2 py-1 rounded bg-gray-700/50 text-gray-400 hover:bg-gray-600/50 hover:text-gray-300 transition-colors"
          >
            초기화
          </button>
        </div>
      </div>

      {/* 필터 버튼들 - 가로 한 줄 */}
      <div className="flex gap-1.5 sm:gap-2 justify-center overflow-x-auto hide-scrollbar px-4">
        {CHAMPION_TAGS.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          const style = TAG_STYLES[tag];
          const count = getChampionCountByTag(tag);

          return (
            <motion.button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`
                flex items-center gap-0.5 px-1.5 py-0.5 rounded-full border text-[10px] sm:text-xs font-medium
                transition-all duration-200 whitespace-nowrap flex-shrink-0
                ${
                  isSelected
                    ? `${style.bgColor} ${style.color} border-current`
                    : 'bg-gray-800/50 text-gray-500 border-gray-700 hover:border-gray-600 hover:text-gray-400'
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-xs">{style.icon}</span>
              <span>{TAG_NAMES[tag]}</span>
              <span className="opacity-60">{count}</span>
            </motion.button>
          );
        })}
      </div>

      {/* 필터 없음 안내 */}
      {selectedTags.length === 0 && (
        <p className="text-xs text-gray-500 text-center mt-2">
          필터를 선택하지 않으면 전체 챔피언에서 랜덤 선택됩니다
        </p>
      )}
    </motion.div>
  );
}
