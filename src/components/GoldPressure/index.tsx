import { motion, AnimatePresence } from 'framer-motion';
import { useGoldPressure } from '../../hooks/useGoldPressure';
import { API_CONFIG } from '../../config/api';
import type { Item } from '../../types';

function ItemCard({
  item,
  onSelect,
  disabled,
  selected,
}: {
  item: Item;
  onSelect: (item: Item) => void;
  disabled: boolean;
  selected: boolean;
}) {
  return (
    <motion.button
      whileHover={!disabled && !selected ? { scale: 1.05 } : {}}
      whileTap={!disabled && !selected ? { scale: 0.95 } : {}}
      onClick={() => !disabled && !selected && onSelect(item)}
      className={`flex flex-col items-center p-2 rounded-lg border transition-all ${
        selected
          ? 'border-yellow-500/50 bg-yellow-900/20 opacity-50 cursor-default'
          : disabled
          ? 'border-gray-700 bg-gray-800/30 opacity-30 cursor-not-allowed'
          : 'border-gray-700 bg-gray-800/60 hover:border-yellow-500/40 cursor-pointer'
      }`}
      disabled={disabled || selected}
    >
      <div className="w-10 h-10 mb-1">
        <img
          src={API_CONFIG.getItemImageUrl(item.image)}
          alt={item.koreanName}
          className="w-full h-full object-contain rounded"
        />
      </div>
      <span className="text-xs text-gray-300 text-center leading-tight line-clamp-1">
        {item.koreanName}
      </span>
      <span className="text-xs text-yellow-400 font-semibold">{item.gold}g</span>
    </motion.button>
  );
}

function SelectedSlot({
  item,
  index,
  onRemove,
  isComplete,
}: {
  item: Item | null;
  index: number;
  onRemove: (id: string) => void;
  isComplete: boolean;
}) {
  return (
    <motion.div
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      className={`w-14 h-14 rounded-lg border-2 flex items-center justify-center ${
        item ? 'border-yellow-500/60 bg-gray-800' : 'border-gray-700 border-dashed bg-gray-800/30'
      }`}
    >
      {item ? (
        <button
          onClick={() => !isComplete && onRemove(item.id)}
          className="relative w-full h-full flex items-center justify-center group"
          disabled={isComplete}
        >
          <img
            src={API_CONFIG.getItemImageUrl(item.image)}
            alt={item.koreanName}
            className="w-10 h-10 object-contain rounded"
          />
          {!isComplete && (
            <div className="absolute inset-0 bg-red-900/0 group-hover:bg-red-900/60 rounded-lg transition-colors flex items-center justify-center">
              <span className="text-white text-lg opacity-0 group-hover:opacity-100 transition-opacity">
                ✕
              </span>
            </div>
          )}
        </button>
      ) : (
        <span className="text-gray-600 text-xs">{index + 1}</span>
      )}
    </motion.div>
  );
}

export default function GoldPressure() {
  const {
    budget,
    selectedItems,
    remainingGold,
    selectedBootCount,
    isComplete,
    score,
    boots,
    completedItems,
    selectItem,
    removeItem,
    completeRound,
    newRound,
  } = useGoldPressure();

  const slots = Array.from({ length: 6 }, (_, i) => selectedItems[i] ?? null);
  const goldPercentUsed = ((budget - remainingGold) / budget) * 100;

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6">
      <h2 className="text-xl font-bold text-white text-center mb-4">
        💰 골드 프레셔 챌린지
      </h2>

      {/* 골드 예산 바 */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-400">예산</span>
          <span className="text-yellow-400 font-bold">
            {remainingGold.toLocaleString()}g / {budget.toLocaleString()}g
          </span>
        </div>
        <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, #eab308, ${
                goldPercentUsed > 80 ? '#ef4444' : '#f59e0b'
              })`,
            }}
            initial={{ width: '0%' }}
            animate={{ width: `${Math.min(goldPercentUsed, 100)}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* 선택된 아이템 슬롯 */}
      <div className="flex justify-center gap-2 mb-5">
        {slots.map((item, i) => (
          <SelectedSlot
            key={i}
            item={item}
            index={i}
            onRemove={removeItem}
            isComplete={isComplete}
          />
        ))}
      </div>

      {/* 완료/결과 영역 */}
      <AnimatePresence mode="wait">
        {isComplete ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-gray-800 rounded-xl p-5 mb-5 text-center border border-yellow-500/30"
          >
            <h3 className="text-lg font-bold text-yellow-400 mb-3">🏆 결과</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">사용한 골드</span>
                <span className="text-white font-semibold">
                  {(budget - remainingGold).toLocaleString()}g
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">남은 골드</span>
                <span
                  className={`font-semibold ${
                    remainingGold < 300 ? 'text-green-400' : 'text-orange-400'
                  }`}
                >
                  {remainingGold.toLocaleString()}g
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">태그 다양성</span>
                <span className="text-blue-400 font-semibold">
                  {(() => {
                    const tags = new Set<string>();
                    selectedItems.forEach((i) => i.tags.forEach((t) => tags.add(t)));
                    return tags.size;
                  })()}
                  종류
                </span>
              </div>
              <div className="h-px bg-gray-700 my-2" />
              <div className="flex justify-between text-base">
                <span className="text-gray-300 font-bold">총 점수</span>
                <span className="text-yellow-400 font-bold text-xl">{score}점</span>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={newRound}
              className="mt-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors"
            >
              새 라운드
            </motion.button>
          </motion.div>
        ) : (
          <motion.div key="actions" className="flex justify-center mb-5">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={completeRound}
              disabled={selectedItems.length === 0}
              className={`px-6 py-2.5 rounded-xl font-bold text-white transition-colors ${
                selectedItems.length === 0
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-500'
              }`}
            >
              완료! ({selectedItems.length}/6)
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 아이템 그리드 */}
      {!isComplete && (
        <div className="space-y-4">
          {/* 부츠 섹션 */}
          <div>
            <h4 className="text-sm font-semibold text-gray-400 mb-2">
              👢 부츠 {selectedBootCount > 0 && <span className="text-yellow-500">(선택됨)</span>}
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {boots.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onSelect={selectItem}
                  disabled={item.gold > remainingGold || (selectedBootCount >= 1 && !selectedItems.some(i => i.id === item.id)) || selectedItems.length >= 6}
                  selected={selectedItems.some((i) => i.id === item.id)}
                />
              ))}
            </div>
          </div>

          {/* 완성 아이템 섹션 */}
          <div>
            <h4 className="text-sm font-semibold text-gray-400 mb-2">⚔️ 완성 아이템</h4>
            <div className="grid grid-cols-4 gap-2 max-h-72 overflow-y-auto pr-1">
              {completedItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onSelect={selectItem}
                  disabled={item.gold > remainingGold || selectedItems.length >= 6}
                  selected={selectedItems.some((i) => i.id === item.id)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
