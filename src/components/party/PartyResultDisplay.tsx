import { motion, AnimatePresence } from 'framer-motion';
import type { PartyResultDisplayProps } from '../../types';
import { useConfetti } from '../ResultDisplay/useConfetti';
import { LANES } from '../../data/lanes';
import { DAMAGE_TYPES } from '../../data/damageTypes';
import { getChampionImageUrl } from '../../utils/champion';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { useEscapeKey } from '../../hooks/useEscapeKey';

export function PartyResultDisplay({ results, show, onClose, onSpinAgain }: PartyResultDisplayProps) {
  // 컨페티 효과
  useConfetti(show, results.length > 0);

  // ESC 키로 닫기
  useEscapeKey(show, onClose);

  // 모달이 열릴 때 body 스크롤 방지
  useBodyScrollLock(show);

  if (!show || results.length === 0) return null;

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* 배경 오버레이 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40"
            style={{
              backdropFilter: 'blur(8px)',
              background: 'radial-gradient(circle at center, rgba(255, 215, 0, 0.15) 0%, rgba(0, 0, 0, 0.85) 60%, rgba(0, 0, 0, 0.95) 100%)',
            }}
            onClick={onClose}
          />

          {/* 모달 컨텐츠 */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.7, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: 50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative w-full max-w-4xl bg-gradient-to-b from-gray-900/95 to-gray-950/95 rounded-2xl border-2 border-yellow-500/50 p-6 sm:p-8"
              style={{
                boxShadow: '0 0 40px rgba(255, 215, 0, 0.4), 0 0 80px rgba(255, 215, 0, 0.2), 0 20px 60px rgba(0, 0, 0, 0.7)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 닫기 버튼 */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-800/80 hover:bg-gray-700/80 text-gray-300 hover:text-white transition-all duration-200 z-10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* 헤더 */}
              <motion.h3
                className="text-2xl sm:text-3xl font-black text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400"
                style={{
                  fontFamily: "'Bebas Neue', 'Orbitron', sans-serif",
                  letterSpacing: '0.1em',
                  textShadow: '0 0 30px rgba(255, 215, 0, 0.6)',
                }}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                🎯 파티의 운명 🎯
              </motion.h3>

              {/* 5인 결과 그리드 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                {results.map((result, index) => {
                  const laneInfo = LANES.find(l => l.id === result.lane);
                  const damageTypeInfo = DAMAGE_TYPES.find(d => d.id === result.damageType);

                  return (
                    <motion.div
                      key={result.lane}
                      className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-b from-gray-800/80 to-gray-900/80 border border-gray-700/50"
                      initial={{ opacity: 0, y: 30, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.15 + index * 0.1 }}
                      whileHover={{ scale: 1.03, borderColor: 'rgba(255, 215, 0, 0.5)' }}
                    >
                      {/* 라인 */}
                      <div className="flex items-center gap-2 mb-3">
                        {laneInfo?.image && (
                          <img
                            src={laneInfo.image}
                            alt={laneInfo.label}
                            className="w-6 h-6 object-contain"
                          />
                        )}
                        <span
                          className={`font-bold text-sm ${laneInfo?.color || 'text-white'}`}
                          style={{ textShadow: '0 0 10px currentColor' }}
                        >
                          {laneInfo?.koreanLabel || result.lane}
                        </span>
                      </div>

                      {/* 챔피언 이미지 */}
                      {result.champion && (
                        <motion.div
                          className="relative mb-3"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
                        >
                          <img
                            src={getChampionImageUrl(result.champion.id)}
                            alt={result.champion.koreanName}
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover border-2"
                            style={{
                              borderColor: result.champion.color,
                              boxShadow: `0 0 15px ${result.champion.color}40`,
                            }}
                          />
                        </motion.div>
                      )}

                      {/* 챔피언 이름 */}
                      <span className="text-sm font-semibold text-white text-center mb-2">
                        {result.champion?.koreanName || '???'}
                      </span>

                      {/* 데미지 타입 배지 */}
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-bold
                          ${result.damageType === 'AD'
                            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                            : 'bg-purple-500/20 text-purple-400 border border-purple-500/50'}`}
                      >
                        {damageTypeInfo?.koreanLabel || result.damageType}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* 다시 돌리기 버튼 */}
              <motion.button
                onClick={() => {
                  onClose();
                  onSpinAgain?.();
                }}
                className="w-full py-4 rounded-xl font-black text-xl text-white bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-400 hover:via-orange-400 hover:to-red-400 transition-all duration-300"
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  letterSpacing: '0.05em',
                  boxShadow: '0 8px 30px rgba(255, 165, 0, 0.5), 0 0 40px rgba(255, 100, 50, 0.3)',
                }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                🎰 다시 돌리기
              </motion.button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
