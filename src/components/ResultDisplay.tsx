import { motion, AnimatePresence } from 'framer-motion';
import type { ResultDisplayProps } from '../types';
import { getLaneInfo } from '../data/lanes';
import { getDamageTypeInfo } from '../data/damageTypes';

export function ResultDisplay({ lane, champion, damageType, show }: ResultDisplayProps) {
  if (!show) return null;

  const laneInfo = lane ? getLaneInfo(lane) : null;
  const damageInfo = damageType ? getDamageTypeInfo(damageType) : null;

  const hasAnyResult = lane || champion || damageType;

  if (!hasAnyResult) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="result-card mt-8 min-w-[300px]"
      >
        <h3 className="text-xl font-bold text-center mb-4 text-yellow-300">
          🎯 결과
        </h3>

        <div className="space-y-3">
          {lane && laneInfo && (
            <motion.div
              className="flex justify-between items-center"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <span className="text-gray-300">라인:</span>
              <span className={`font-bold text-lg ${laneInfo.color}`}>
                {laneInfo.koreanLabel} ({laneInfo.label})
              </span>
            </motion.div>
          )}

          {champion && (
            <motion.div
              className="flex justify-between items-center"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-gray-300">챔피언:</span>
              <span className="font-bold text-lg text-cyan-300">
                {champion.koreanName}
              </span>
            </motion.div>
          )}

          {damageType && damageInfo && (
            <motion.div
              className="flex justify-between items-center"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-gray-300">타입:</span>
              <span className={`font-bold text-lg ${damageInfo.color}`}>
                {damageInfo.koreanLabel} ({damageInfo.label})
              </span>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
