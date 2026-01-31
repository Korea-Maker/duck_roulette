import { motion } from 'framer-motion';
import type { Lane, DamageType } from '../../types';
import { getLaneInfo } from '../../data/lanes';
import { getDamageTypeInfo } from '../../data/damageTypes';
import { getColorFilter } from '../../utils/colorFilters';

interface ResultInfoProps {
  lane?: Lane;
  damageType?: DamageType;
}

export function ResultInfo({ lane, damageType }: ResultInfoProps) {
  const laneInfo = lane ? getLaneInfo(lane) : null;
  const damageInfo = damageType ? getDamageTypeInfo(damageType) : null;

  return (
    <div className="space-y-6 mb-8">
      {lane && laneInfo && (
        <motion.div
          className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-gray-800/50 to-gray-700/50"
          style={{
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          }}
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          <span className="text-gray-300 font-semibold text-lg">라인:</span>
          <div className="flex items-center gap-3">
            {laneInfo.image && (
              <img
                src={laneInfo.image}
                alt={laneInfo.label}
                className="w-12 h-12 object-contain"
                style={{
                  filter: getColorFilter(laneInfo.color),
                }}
              />
            )}
            <span className={`font-bold text-2xl ${laneInfo.color}`}>
              {laneInfo.koreanLabel}
            </span>
          </div>
        </motion.div>
      )}

      {damageType && damageInfo && (
        <motion.div
          className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-gray-800/50 to-gray-700/50"
          style={{
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          }}
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <span className="text-gray-300 font-semibold text-lg">템트리:</span>
          <div className="flex items-center gap-3">
            {damageInfo.icon && (
              <img
                src={damageInfo.icon}
                alt={damageInfo.label}
                className="w-12 h-12 object-contain"
              />
            )}
            <span className={`font-bold text-2xl ${damageInfo.color}`}>
              {damageInfo.koreanLabel}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
