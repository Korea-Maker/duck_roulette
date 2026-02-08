import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useColorBlender } from '../../hooks/useColorBlender';
import { CHAMPIONS } from '../../data/champions';
import { API_CONFIG } from '../../config/api';
import type { Champion } from '../../types';

interface ChampionPickerProps {
  onSelect: (champion: Champion) => void;
  onClose: () => void;
  excludeIds: string[];
}

function ChampionPicker({ onSelect, onClose, excludeIds }: ChampionPickerProps) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return CHAMPIONS.filter(
      c =>
        !excludeIds.includes(c.id) &&
        (c.koreanName.toLowerCase().includes(term) ||
          c.name.toLowerCase().includes(term) ||
          c.id.toLowerCase().includes(term))
    );
  }, [search, excludeIds]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md max-h-[70vh] bg-gray-800 rounded-xl shadow-2xl overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-3 border-b border-gray-700">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="챔피언 검색..."
            className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500"
            autoFocus
          />
        </div>
        <div className="overflow-y-auto flex-1 p-2">
          <div className="grid grid-cols-4 gap-1.5">
            {filtered.map(champion => (
              <button
                key={champion.id}
                onClick={() => onSelect(champion)}
                className="flex flex-col items-center p-1.5 rounded-lg hover:bg-gray-700 transition-colors group"
              >
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gray-600 group-hover:border-purple-400 transition-colors">
                  <img
                    src={API_CONFIG.getChampionImageUrl(champion.id)}
                    alt={champion.koreanName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-[10px] text-gray-300 mt-1 text-center leading-tight truncate w-full">
                  {champion.koreanName}
                </span>
                <div
                  className="w-3 h-3 rounded-full mt-0.5 border border-gray-600"
                  style={{ backgroundColor: champion.color }}
                />
              </button>
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-gray-500 py-8 text-sm">검색 결과가 없습니다</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ColorBlender() {
  const {
    selectedChampions,
    blendedColor,
    resultChampion,
    similarity,
    isBlending,
    canBlend,
    selectChampion,
    removeChampion,
    blend,
    reset,
  } = useColorBlender();

  const [pickerIndex, setPickerIndex] = useState<number | null>(null);

  const excludeIds = selectedChampions.filter((c): c is Champion => c !== null).map(c => c.id);

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto px-4 py-6">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-white mb-1"
      >
        챔피언 컬러 블렌더
      </motion.h2>
      <p className="text-gray-400 text-sm mb-6">3개 챔피언의 색상을 혼합하여 자식 챔피언을 찾아보세요!</p>

      {/* 3개 슬롯 */}
      <div className="flex items-center gap-2 mb-6">
        {selectedChampions.map((champion, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="flex flex-col items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (champion) {
                    removeChampion(index);
                  } else {
                    setPickerIndex(index);
                  }
                }}
                className="relative w-20 h-20 rounded-full border-2 border-dashed border-gray-500 flex items-center justify-center overflow-hidden hover:border-purple-400 transition-colors bg-gray-800"
              >
                {champion ? (
                  <>
                    <img
                      src={API_CONFIG.getChampionImageUrl(champion.id)}
                      alt={champion.koreanName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center">
                      <span className="text-white/0 hover:text-white/80 text-lg">✕</span>
                    </div>
                  </>
                ) : (
                  <span className="text-3xl text-gray-500">+</span>
                )}
              </motion.button>
              {champion ? (
                <div className="mt-1.5 flex flex-col items-center">
                  <div
                    className="w-5 h-5 rounded-full border border-gray-600"
                    style={{ backgroundColor: champion.color }}
                  />
                  <span className="text-[11px] text-gray-400 mt-0.5">{champion.koreanName}</span>
                </div>
              ) : (
                <span className="text-[11px] text-gray-500 mt-1.5">선택</span>
              )}
            </div>
            {index < 2 && (
              <span className="text-gray-500 text-xl font-bold">+</span>
            )}
          </div>
        ))}
      </div>

      {/* 블렌드 버튼 */}
      <motion.button
        whileHover={canBlend ? { scale: 1.05 } : {}}
        whileTap={canBlend ? { scale: 0.95 } : {}}
        onClick={blend}
        disabled={!canBlend || isBlending}
        className={`px-8 py-3 rounded-xl font-bold text-lg transition-all mb-6 ${
          canBlend
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40'
            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
        }`}
      >
        {isBlending ? (
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="inline-block"
          >
            🎨
          </motion.span>
        ) : (
          '블렌드!'
        )}
      </motion.button>

      {/* 결과 영역 */}
      <AnimatePresence>
        {blendedColor && resultChampion && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="flex flex-col items-center bg-gray-800/80 rounded-2xl p-6 border border-gray-700 w-full"
          >
            {/* 색상 혼합 시각화 */}
            <div className="flex items-center gap-2 mb-4">
              {selectedChampions.map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ x: i === 0 ? -20 : i === 2 ? 20 : 0, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.15 }}
                  className="w-8 h-8 rounded-full border border-gray-600"
                  style={{ backgroundColor: c?.color }}
                />
              ))}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-400 mx-1"
              >
                →
              </motion.span>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                className="w-10 h-10 rounded-full border-2 border-white/20 shadow-lg"
                style={{ backgroundColor: blendedColor }}
              />
            </div>

            <p className="text-gray-400 text-xs mb-3">
              혼합 색상: <span className="font-mono text-white">{blendedColor}</span>
            </p>

            {/* 결과 챔피언 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col items-center"
            >
              <p className="text-gray-400 text-sm mb-2">자식 챔피언</p>
              <div className="relative">
                <div
                  className="w-24 h-24 rounded-full overflow-hidden border-3 shadow-xl"
                  style={{ borderColor: resultChampion.color }}
                >
                  <img
                    src={API_CONFIG.getChampionImageUrl(resultChampion.id)}
                    alt={resultChampion.koreanName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full border-2 border-gray-800"
                  style={{ backgroundColor: resultChampion.color }}
                />
              </div>
              <p className="text-white font-bold text-lg mt-2">{resultChampion.koreanName}</p>
              <div className="flex items-center gap-2 mt-1">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: resultChampion.color }}
                />
                <span className="text-gray-400 text-xs font-mono">{resultChampion.color}</span>
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${similarity}%` }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="mt-3 w-full"
              >
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>색상 유사도</span>
                  <span className="text-white font-bold">{similarity}%</span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${similarity}%` }}
                    transition={{ delay: 0.9, duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* 다시 하기 버튼 */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={reset}
              className="mt-5 px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
            >
              다시 하기
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 챔피언 선택 모달 */}
      <AnimatePresence>
        {pickerIndex !== null && (
          <ChampionPicker
            onSelect={champion => {
              selectChampion(pickerIndex, champion);
              setPickerIndex(null);
            }}
            onClose={() => setPickerIndex(null)}
            excludeIds={excludeIds}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
