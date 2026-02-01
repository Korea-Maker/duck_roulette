import { motion, AnimatePresence } from 'framer-motion';
import { LANES } from '../data/lanes';
import { DAMAGE_TYPES } from '../data/damageTypes';

export interface SpinHistoryItem {
  champion: string;
  lane: string;
  type: string;
  timestamp: number;
}

interface SpinHistoryProps {
  history: SpinHistoryItem[];
}

export function SpinHistory({ history }: SpinHistoryProps) {
  if (history.length === 0) {
    return null;
  }

  return (
    <motion.div
      className="w-full max-w-3xl mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h3 className="text-xl font-bold text-gray-300 mb-4 text-center">
        📜 최근 스핀 기록
      </h3>

      <div className="flex justify-center gap-3 flex-wrap">
        <AnimatePresence mode="popLayout">
          {history.map((item, index) => {
            const laneInfo = LANES.find(l => l.id === item.lane);
            const typeInfo = DAMAGE_TYPES.find(t => t.id === item.type);

            return (
              <motion.div
                key={item.timestamp}
                className="relative group"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 15,
                  delay: index * 0.05
                }}
                whileHover={{ scale: 1.1, y: -5 }}
              >
                <div className="relative flex items-center gap-2 bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm p-3 rounded-xl border border-gray-700/50 shadow-lg">
                  {/* 챔피언 아이콘 */}
                  <div className="relative">
                    <img
                      src={`https://ddragon.leagueoflegends.com/cdn/16.2.1/img/champion/${item.champion}.png`}
                      alt={item.champion}
                      className="w-12 h-12 rounded-lg border-2 border-cyan-500/50 shadow-md"
                    />
                    {/* 라인 아이콘 오버레이 */}
                    {laneInfo?.image && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-900/90 rounded-full border border-gray-700 flex items-center justify-center">
                        <img
                          src={laneInfo.image}
                          alt={laneInfo.koreanLabel}
                          className="w-4 h-4"
                        />
                      </div>
                    )}
                  </div>

                  {/* 타입 아이콘 */}
                  {typeInfo?.icon && (
                    <div className="w-8 h-8 flex items-center justify-center">
                      <img
                        src={typeInfo.icon}
                        alt={typeInfo.koreanLabel}
                        className="w-6 h-6"
                      />
                    </div>
                  )}

                  {/* 호버 시 상세 정보 툴팁 */}
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    <div className="bg-gray-900/95 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-700 shadow-xl whitespace-nowrap">
                      <div className="text-xs text-gray-300 space-y-1">
                        <div className="text-cyan-400 font-bold">{item.champion}</div>
                        <div className="flex items-center gap-1">
                          <span className={laneInfo?.color}>{laneInfo?.koreanLabel}</span>
                          <span className="text-gray-500">•</span>
                          <span className={typeInfo?.color}>{typeInfo?.koreanLabel}</span>
                        </div>
                      </div>
                      {/* 툴팁 화살표 */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
                        <div className="border-4 border-transparent border-t-gray-700"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 순서 표시 */}
                <div className="absolute -top-2 -left-2 w-5 h-5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-gray-900 shadow-lg">
                  {history.length - index}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* 안내 메시지 */}
      <motion.p
        className="text-gray-500 text-xs text-center mt-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        최근 5개까지 저장됩니다 • 호버하면 상세 정보를 볼 수 있습니다
      </motion.p>
    </motion.div>
  );
}
