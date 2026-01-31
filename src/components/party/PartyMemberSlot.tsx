import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import type { PartyMemberSlotState, SlotItem as SlotItemType } from '../../types';
import { SLOT_CONFIG } from '../../config/constants';
import { CHAMPIONS } from '../../data/champions';
import { LANES } from '../../data/lanes';
import { getChampionImageUrl } from '../../utils/champion';

interface MiniSlotReelProps {
  items: SlotItemType[];
  isSpinning: boolean;
  currentValue: SlotItemType | null;
  compact?: boolean;
}

function MiniSlotReel({ items, isSpinning, currentValue, compact }: MiniSlotReelProps) {
  const [spinItems, setSpinItems] = useState<SlotItemType[]>([]);

  const itemHeight = compact ? 48 : 56;

  const selectedIndex = useMemo(() => {
    if (!currentValue) return 0;
    return items.findIndex(item => item.id === currentValue.id);
  }, [items, currentValue]);

  const generateSpinItems = useMemo(() => {
    const shuffled: SlotItemType[] = [];
    for (let i = 0; i < 25; i++) {
      const randomItem = items[Math.floor(Math.random() * items.length)];
      shuffled.push(randomItem);
    }
    if (selectedIndex >= 0) {
      shuffled.push(items[selectedIndex]);
    }
    return shuffled;
  }, [items, selectedIndex]);

  useEffect(() => {
    if (isSpinning) {
      setSpinItems(generateSpinItems);
    }
  }, [isSpinning, generateSpinItems]);

  return (
    <div
      className="relative overflow-hidden rounded-lg bg-gray-900/50"
      style={{
        height: itemHeight,
        width: compact ? 48 : 56,
      }}
    >
      <AnimatePresence mode="wait">
        {isSpinning ? (
          <motion.div
            key="spinning"
            className="absolute w-full"
            initial={{ y: 0 }}
            animate={{ y: -(spinItems.length - 1) * itemHeight }}
            transition={{
              duration: SLOT_CONFIG.SPIN_DURATION / 1000,
              ease: [0.25, 0.1, 0.1, 1],
            }}
          >
            {spinItems.map((item, index) => (
              <div
                key={`spin-${index}`}
                className="flex items-center justify-center"
                style={{ height: itemHeight, width: compact ? 48 : 56 }}
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.label}
                    className="w-10 h-10 rounded object-cover"
                  />
                ) : (
                  <span className={`text-lg font-bold ${item.color || 'text-white'}`}>
                    {item.label}
                  </span>
                )}
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="stopped"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {currentValue?.image ? (
              <img
                src={currentValue.image}
                alt={currentValue.label}
                className="w-10 h-10 rounded object-cover"
              />
            ) : (
              <span className={`text-lg font-bold ${currentValue?.color || 'text-white'}`}>
                {currentValue?.label || '?'}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface PartyMemberSlotProps {
  member: PartyMemberSlotState;
  isSpinning: boolean;
  compact?: boolean;
}

export function PartyMemberSlot({ member, isSpinning, compact }: PartyMemberSlotProps) {
  // 챔피언 슬롯 아이템으로 변환
  const championItems: SlotItemType[] = useMemo(() =>
    CHAMPIONS.map(champ => ({
      id: champ.id,
      label: champ.koreanName,
      color: champ.color,
      image: getChampionImageUrl(champ.id),
    })),
  []);

  // 현재 라인 정보
  const currentLaneInfo = useMemo(() => {
    if (!member.lane.currentValue) return null;
    return LANES.find(l => l.id === member.lane.currentValue) || null;
  }, [member.lane.currentValue]);

  // 현재 챔피언 값
  const currentChampion: SlotItemType | null = member.champion.currentValue
    ? {
        id: member.champion.currentValue.id,
        label: member.champion.currentValue.koreanName,
        color: member.champion.currentValue.color,
        image: getChampionImageUrl(member.champion.currentValue.id),
      }
    : null;

  return (
    <motion.div
      className={`party-member-slot flex flex-col items-center gap-2 p-3 rounded-xl
        bg-gradient-to-b from-gray-800/80 to-gray-900/80 border border-gray-700/50
        ${compact ? 'p-2' : 'p-3'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, borderColor: 'rgba(255, 215, 0, 0.5)' }}
      transition={{ duration: 0.2 }}
    >
      {/* 라인 슬롯 */}
      <motion.div
        className="flex items-center gap-2"
        animate={member.lane.isSpinning ? {
          opacity: [1, 0.7, 1],
        } : {}}
        transition={{ duration: 0.3, repeat: member.lane.isSpinning ? Infinity : 0 }}
      >
        {member.lane.isSpinning ? (
          <motion.div
            className="flex items-center gap-1"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.3, repeat: Infinity }}
          >
            <span className={`${compact ? 'w-5 h-5' : 'w-6 h-6'} bg-gray-600 rounded animate-pulse`} />
            <span className={`font-bold text-gray-400 ${compact ? 'text-xs' : 'text-sm'}`}>
              ???
            </span>
          </motion.div>
        ) : currentLaneInfo && (
          <>
            {currentLaneInfo.image && (
              <img
                src={currentLaneInfo.image}
                alt={currentLaneInfo.label}
                className={`${compact ? 'w-5 h-5' : 'w-6 h-6'} object-contain`}
              />
            )}
            <span
              className={`font-bold ${currentLaneInfo.color} ${compact ? 'text-xs' : 'text-sm'}`}
              style={{ textShadow: '0 0 10px currentColor' }}
            >
              {currentLaneInfo.koreanLabel}
            </span>
          </>
        )}
      </motion.div>

      {/* 챔피언 슬롯 */}
      <div className="relative">
        <MiniSlotReel
          items={championItems}
          isSpinning={member.champion.isSpinning}
          currentValue={currentChampion}
          compact={compact}
        />
        {isSpinning && member.champion.isSpinning && (
          <motion.div
            className="absolute inset-0 rounded-lg pointer-events-none"
            style={{
              boxShadow: '0 0 15px rgba(255, 215, 0, 0.5)',
            }}
            animate={{
              boxShadow: [
                '0 0 15px rgba(255, 215, 0, 0.5)',
                '0 0 25px rgba(255, 100, 50, 0.7)',
                '0 0 15px rgba(255, 215, 0, 0.5)',
              ],
            }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        )}
      </div>

      {/* 데미지 타입 배지 */}
      <motion.div
        className={`px-2 py-1 rounded-full text-xs font-bold
          ${member.damageType.currentValue === 'AD'
            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
            : 'bg-purple-500/20 text-purple-400 border border-purple-500/50'}`}
        animate={member.damageType.isSpinning ? {
          opacity: [1, 0.5, 1],
          scale: [1, 0.95, 1],
        } : {}}
        transition={{ duration: 0.3, repeat: member.damageType.isSpinning ? Infinity : 0 }}
      >
        {member.damageType.isSpinning ? '??' : member.damageType.currentValue || '??'}
      </motion.div>
    </motion.div>
  );
}
