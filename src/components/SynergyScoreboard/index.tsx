import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Champion, ChampionTag } from '../../types';
import { CHAMPIONS, TAG_NAMES } from '../../data/champions';
import { COMPLETED_ITEMS } from '../../data/items';
import { API_CONFIG } from '../../config/api';
import { useSynergyScore, SYNERGY_MAP } from '../../hooks/useSynergyScore';
import type { ItemScore } from '../../hooks/useSynergyScore';

// 태그 색상 매핑
const TAG_COLORS: Record<ChampionTag, string> = {
  Fighter: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
  Tank: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  Mage: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
  Assassin: 'bg-red-500/20 text-red-400 border-red-500/50',
  Marksman: 'bg-green-500/20 text-green-400 border-green-500/50',
  Support: 'bg-teal-500/20 text-teal-400 border-teal-500/50',
};

function getScoreColor(score: number): string {
  if (score >= 70) return 'from-green-500 to-emerald-400';
  if (score >= 40) return 'from-yellow-500 to-amber-400';
  return 'from-red-500 to-orange-400';
}

function getScoreTextColor(score: number): string {
  if (score >= 70) return 'text-green-400';
  if (score >= 40) return 'text-yellow-400';
  return 'text-red-400';
}

function getScoreBorderColor(score: number): string {
  if (score >= 70) return 'border-green-500/60';
  if (score >= 40) return 'border-yellow-500/60';
  return 'border-red-500/40';
}

// ---- 챔피언 선택 영역 ----
function ChampionSelector({
  selectedChampion,
  onSelect,
}: {
  selectedChampion: Champion | null;
  onSelect: (champion: Champion) => void;
}) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return CHAMPIONS;
    const q = search.trim().toLowerCase();
    return CHAMPIONS.filter(
      c => c.koreanName.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">
        챔피언 선택
      </h3>

      {/* 선택된 챔피언 표시 */}
      {selectedChampion && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/80 border border-gray-700"
        >
          <img
            src={API_CONFIG.getChampionImageUrl(selectedChampion.id)}
            alt={selectedChampion.koreanName}
            className="w-12 h-12 rounded-lg border-2"
            style={{ borderColor: selectedChampion.color }}
          />
          <div>
            <p className="font-bold text-white">{selectedChampion.koreanName}</p>
            <div className="flex gap-1 mt-1">
              {selectedChampion.tags.map(tag => (
                <span
                  key={tag}
                  className={`text-xs px-2 py-0.5 rounded-full border ${TAG_COLORS[tag]}`}
                >
                  {TAG_NAMES[tag]}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* 검색 */}
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="챔피언 검색..."
        className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
      />

      {/* 챔피언 그리드 */}
      <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
        {filtered.map(champ => {
          const isSelected = selectedChampion?.id === champ.id;
          return (
            <motion.button
              key={champ.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(champ)}
              className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                isSelected
                  ? 'border-purple-500 ring-2 ring-purple-500/50'
                  : 'border-gray-700 hover:border-gray-500'
              }`}
              title={champ.koreanName}
            >
              <img
                src={API_CONFIG.getChampionImageUrl(champ.id)}
                alt={champ.koreanName}
                className="w-full aspect-square object-cover"
                loading="lazy"
              />
              {isSelected && (
                <div className="absolute inset-0 bg-purple-500/30" />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ---- 아이템 슬롯 영역 ----
function ItemSlots({
  selectedItems,
  itemScores,
  onRemove,
}: {
  selectedItems: { id: string; koreanName: string; image: string }[];
  itemScores: ItemScore[];
  onRemove: (id: string) => void;
}) {
  const slots = Array.from({ length: 6 }, (_, i) => {
    const item = selectedItems[i] || null;
    const scoreInfo = itemScores[i] || null;
    return { item, scoreInfo };
  });

  return (
    <div className="grid grid-cols-6 gap-2">
      {slots.map((slot, i) => (
        <motion.div
          key={i}
          layout
          className={`relative aspect-square rounded-lg border-2 flex items-center justify-center overflow-hidden ${
            slot.item
              ? `${getScoreBorderColor(slot.scoreInfo?.score ?? 0)} bg-gray-800`
              : 'border-gray-700 border-dashed bg-gray-800/50'
          }`}
        >
          {slot.item ? (
            <>
              <img
                src={API_CONFIG.getItemImageUrl(slot.item.image)}
                alt={slot.item.koreanName}
                className="w-full h-full object-cover"
              />
              {/* 개별 시너지 점수 */}
              {slot.scoreInfo && (
                <div
                  className={`absolute bottom-0 left-0 right-0 text-center text-xs font-bold py-0.5 bg-black/70 ${getScoreTextColor(slot.scoreInfo.score)}`}
                >
                  {slot.scoreInfo.score}%
                </div>
              )}
              {/* 제거 버튼 */}
              <button
                onClick={() => onRemove(slot.item!.id)}
                className="absolute top-0 right-0 bg-red-500/80 text-white text-xs w-4 h-4 flex items-center justify-center rounded-bl-md hover:bg-red-500 transition-colors"
              >
                x
              </button>
            </>
          ) : (
            <span className="text-gray-600 text-lg">+</span>
          )}
        </motion.div>
      ))}
    </div>
  );
}

// ---- 시너지 게이지 바 ----
function SynergyGauge({ score }: { score: number }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">
          시너지 점수
        </span>
        <motion.span
          key={score}
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`text-2xl font-black ${getScoreTextColor(score)}`}
        >
          {score}
        </motion.span>
      </div>
      <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          className={`h-full rounded-full bg-gradient-to-r ${getScoreColor(score)}`}
        />
      </div>
    </div>
  );
}

// ---- 아이템 그리드 (선택용) ----
function ItemGrid({
  synergyTags,
  selectedIds,
  disabled,
  onSelect,
}: {
  synergyTags: Set<string>;
  selectedIds: Set<string>;
  disabled: boolean;
  onSelect: (item: typeof COMPLETED_ITEMS[number]) => void;
}) {
  const [itemSearch, setItemSearch] = useState('');

  const scoredItems = useMemo(() => {
    let items = COMPLETED_ITEMS;
    if (itemSearch.trim()) {
      const q = itemSearch.trim().toLowerCase();
      items = items.filter(
        it => it.koreanName.toLowerCase().includes(q) || it.name.toLowerCase().includes(q)
      );
    }
    return items.map(item => {
      const matched = item.tags.filter(t => synergyTags.has(t));
      const score = item.tags.length > 0 ? Math.round((matched.length / item.tags.length) * 100) : 0;
      return { item, score, matched };
    }).sort((a, b) => b.score - a.score);
  }, [synergyTags, itemSearch]);

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">
        아이템 선택
      </h3>
      <input
        type="text"
        value={itemSearch}
        onChange={e => setItemSearch(e.target.value)}
        placeholder="아이템 검색..."
        className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
      />
      <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5 max-h-52 overflow-y-auto pr-1 scrollbar-thin">
        {scoredItems.map(({ item, score }) => {
          const isSelected = selectedIds.has(item.id);
          return (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={disabled || isSelected}
              onClick={() => onSelect(item)}
              className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                isSelected
                  ? 'border-purple-500 opacity-50 cursor-not-allowed'
                  : score >= 70
                    ? 'border-green-500/60 hover:border-green-400'
                    : score >= 40
                      ? 'border-yellow-500/40 hover:border-yellow-400'
                      : 'border-gray-700 hover:border-gray-500'
              }`}
              title={`${item.koreanName} (${item.gold}G) - 시너지 ${score}%`}
            >
              <img
                src={API_CONFIG.getItemImageUrl(item.image)}
                alt={item.koreanName}
                className="w-full aspect-square object-cover"
                loading="lazy"
              />
              {score > 0 && !isSelected && (
                <div
                  className={`absolute bottom-0 left-0 right-0 text-center text-[10px] font-bold py-px bg-black/70 ${getScoreTextColor(score)}`}
                >
                  {score}%
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ---- 추천 아이템 ----
function RecommendedItems({
  items,
  disabled,
  onSelect,
}: {
  items: ItemScore[];
  disabled: boolean;
  onSelect: (item: typeof COMPLETED_ITEMS[number]) => void;
}) {
  if (items.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">
        추천 아이템
      </h3>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {items.map(({ item, score }) => (
          <motion.button
            key={item.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={disabled}
            onClick={() => onSelect(item)}
            className="flex flex-col items-center gap-1 p-2 rounded-lg bg-gray-800/80 border border-green-500/40 hover:border-green-400 transition-all"
          >
            <div className="relative w-10 h-10 rounded overflow-hidden">
              <img
                src={API_CONFIG.getItemImageUrl(item.image)}
                alt={item.koreanName}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs text-gray-300 truncate w-full text-center">
              {item.koreanName}
            </span>
            <span className={`text-xs font-bold ${getScoreTextColor(score)}`}>
              {score}%
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ---- 시너지 태그 표시 ----
function SynergyTagsDisplay({ champion }: { champion: Champion }) {
  const allTags = new Set<string>();
  for (const tag of champion.tags) {
    const mapped = SYNERGY_MAP[tag];
    if (mapped) mapped.forEach(t => allTags.add(t));
  }

  return (
    <div className="flex flex-wrap gap-1">
      {Array.from(allTags).map(tag => (
        <span
          key={tag}
          className="text-xs px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

// ---- 메인 컴포넌트 ----
function SynergyScoreboard() {
  const {
    selectedChampion,
    selectedItems,
    overallScore,
    itemScores,
    recommendedItems,
    synergyTags,
    selectChampion,
    addItem,
    removeItem,
    reset,
  } = useSynergyScore();

  const selectedItemIds = useMemo(
    () => new Set(selectedItems.map(i => i.id)),
    [selectedItems]
  );
  const isFull = selectedItems.length >= 6;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-white tracking-tight">
          시너지 스코어보드
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={reset}
          className="px-3 py-1.5 text-xs font-bold rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
        >
          초기화
        </motion.button>
      </div>

      {/* 챔피언 선택 */}
      <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800">
        <ChampionSelector
          selectedChampion={selectedChampion}
          onSelect={selectChampion}
        />
      </div>

      <AnimatePresence>
        {selectedChampion && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 overflow-hidden"
          >
            {/* 시너지 태그 */}
            <div className="p-3 rounded-xl bg-gray-900/80 border border-gray-800">
              <p className="text-xs text-gray-500 mb-2">시너지 태그</p>
              <SynergyTagsDisplay champion={selectedChampion} />
            </div>

            {/* 시너지 게이지 */}
            <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800">
              <SynergyGauge score={overallScore} />
            </div>

            {/* 아이템 슬롯 */}
            <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800 space-y-3">
              <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">
                빌드 ({selectedItems.length}/6)
              </h3>
              <ItemSlots
                selectedItems={selectedItems}
                itemScores={itemScores}
                onRemove={removeItem}
              />
            </div>

            {/* 추천 아이템 */}
            <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800">
              <RecommendedItems
                items={recommendedItems}
                disabled={isFull}
                onSelect={addItem}
              />
            </div>

            {/* 아이템 그리드 */}
            <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800">
              <ItemGrid
                synergyTags={synergyTags}
                selectedIds={selectedItemIds}
                disabled={isFull}
                onSelect={addItem}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SynergyScoreboard;
