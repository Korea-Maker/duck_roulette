import { motion } from 'framer-motion';
import type { PartyLayoutProps } from '../../../types';
import { LANES } from '../../../data/lanes';

export function VerticalLayout({ members }: PartyLayoutProps) {
  return (
    <motion.div
      className="flex flex-col gap-3 w-full max-w-md mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {members.map((member, index) => {
        const laneInfo = LANES.find(l => l.id === member.lane) || LANES[index];
        return (
          <motion.div
            key={member.lane}
            className="w-full"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08 }}
          >
            <div className="flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-gray-800/80 to-gray-900/60 border border-gray-700/50">
              {/* 라인 아이콘 및 라벨 */}
              <div className="flex items-center gap-2 w-24 flex-shrink-0">
                {laneInfo.image && (
                  <img
                    src={laneInfo.image}
                    alt={laneInfo.label}
                    className="w-8 h-8 object-contain"
                  />
                )}
                <span
                  className={`font-bold text-sm ${laneInfo.color}`}
                  style={{ textShadow: '0 0 10px currentColor' }}
                >
                  {laneInfo.koreanLabel}
                </span>
              </div>

              {/* 챔피언 표시 */}
              <div className="flex-1 flex items-center justify-center">
                <motion.div
                  className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-900/50"
                  animate={member.champion.isSpinning ? {
                    boxShadow: [
                      '0 0 10px rgba(255, 215, 0, 0.3)',
                      '0 0 20px rgba(255, 215, 0, 0.6)',
                      '0 0 10px rgba(255, 215, 0, 0.3)',
                    ],
                  } : {}}
                  transition={{ duration: 0.5, repeat: member.champion.isSpinning ? Infinity : 0 }}
                >
                  {member.champion.currentValue && (
                    <>
                      <motion.span
                        className="text-base font-semibold text-white"
                        animate={member.champion.isSpinning ? { opacity: [1, 0.5, 1] } : {}}
                        transition={{ duration: 0.2, repeat: member.champion.isSpinning ? Infinity : 0 }}
                      >
                        {member.champion.isSpinning ? '???' : member.champion.currentValue.koreanName}
                      </motion.span>
                    </>
                  )}
                </motion.div>
              </div>

              {/* 데미지 타입 */}
              <motion.div
                className={`px-3 py-1.5 rounded-full text-sm font-bold flex-shrink-0
                  ${member.damageType.currentValue === 'AD'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                    : 'bg-purple-500/20 text-purple-400 border border-purple-500/50'}`}
                animate={member.damageType.isSpinning ? {
                  opacity: [1, 0.5, 1],
                } : {}}
                transition={{ duration: 0.3, repeat: member.damageType.isSpinning ? Infinity : 0 }}
              >
                {member.damageType.isSpinning ? '??' : member.damageType.currentValue}
              </motion.div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
