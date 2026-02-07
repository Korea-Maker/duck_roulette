import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import type { PartyMemberSlotState, SlotItem as SlotItemType } from '../../types';
import { SLOT_CONFIG } from '../../config/constants';
import { CHAMPIONS } from '../../data/champions';
import { LANES } from '../../data/lanes';
import { getChampionImageUrl } from '../../utils/champion';

const CHAMPION_ITEMS: SlotItemType[] = CHAMPIONS.map(champ => ({
  id: champ.id,
  label: champ.koreanName,
  color: champ.color,
  image: getChampionImageUrl(champ.id),
}));

interface MiniSlotReelProps {
  items: SlotItemType[];
  isSpinning: boolean;
  currentValue: SlotItemType | null;
  compact?: boolean;
}

function MiniSlotReel({ items, isSpinning, currentValue, compact }: MiniSlotReelProps) {
  const [spinItems, setSpinItems] = useState<SlotItemType[]>([]);

  // 크기 설정: compact=false일 때 솔로 모드와 비슷한 크기
  const itemHeight = compact ? 56 : 96;
  const itemWidth = compact ? 56 : 96;

  const selectedIndex = useMemo(() => {
    if (!currentValue) return 0;
    return items.findIndex(item => item.id === currentValue.id);
  }, [items, currentValue]);

  const generateSpinItems = useMemo(() => {
    if (items.length === 0) return [];

    const safeIndex = selectedIndex >= 0 ? Math.min(selectedIndex, items.length - 1) : 0;
    const shuffled: SlotItemType[] = [];
    for (let i = 0; i < 25; i++) {
      const randomItem = items[Math.floor(Math.random() * items.length)];
      shuffled.push(randomItem);
    }
    // SlotReel과 동일한 구조: [prevIndex, selectedIndex, nextIndex] 추가
    // 오버슈팅 시 nextIndex가 스쳐지나가고 selectedIndex에서 멈춤
    const prevIndex = (safeIndex - 1 + items.length) % items.length;
    const nextIndex = (safeIndex + 1) % items.length;
    shuffled.push(items[prevIndex]);
    shuffled.push(items[safeIndex]);
    shuffled.push(items[nextIndex]);
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
        width: itemWidth,
      }}
    >
      <AnimatePresence mode="wait">
        {isSpinning ? (
          <motion.div
            key="spinning"
            className="absolute w-full"
            initial={{ y: 0 }}
            animate={{
              // 오버슈팅(nextIndex가 스쳐지나감) 후 selectedIndex에서 진동하며 멈춤
              y: [
                0,
                -(spinItems.length - 1) * itemHeight, // 오버슈팅 (nextIndex가 스쳐지나감)
                -(spinItems.length - 2) * itemHeight - 2, // 진동 1 (selectedIndex 위치)
                -(spinItems.length - 2) * itemHeight + 1.5, // 진동 2
                -(spinItems.length - 2) * itemHeight - 0.5, // 진동 3
                -(spinItems.length - 2) * itemHeight, // 최종 위치 (selectedIndex = 모달 값)
              ],
            }}
            transition={{
              duration: SLOT_CONFIG.SPIN_DURATION / 1000 + 0.25,
              times: [0, 0.85, 0.9, 0.94, 0.97, 1],
              ease: [0.25, 0.1, 0.1, 1],
            }}
          >
            {spinItems.map((item, index) => {
              if (!item) return <div key={`spin-${index}`} style={{ height: itemHeight, width: itemWidth }} />;
              return (
                <div
                  key={`spin-${index}`}
                  className="flex items-center justify-center"
                  style={{ height: itemHeight, width: itemWidth }}
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.label}
                      className={compact ? "w-12 h-12 rounded object-cover" : "w-20 h-20 rounded-lg object-cover"}
                    />
                  ) : (
                    <span className={`${compact ? 'text-lg' : 'text-xl'} font-bold ${item.color || 'text-white'}`}>
                      {item.label}
                    </span>
                  )}
                </div>
              );
            })}
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
                className={compact ? "w-12 h-12 rounded object-cover" : "w-20 h-20 rounded-lg object-cover"}
              />
            ) : (
              <span className={`${compact ? 'text-lg' : 'text-xl'} font-bold ${currentValue?.color || 'text-white'}`}>
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
  const championItems = CHAMPION_ITEMS;

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
      className={`party-member-slot flex flex-col items-center rounded-xl
        bg-gradient-to-b from-gray-800/80 to-gray-900/80 border border-gray-700/50
        ${compact ? 'gap-2 p-2' : 'gap-3 p-4'}`}
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
            <span className={`${compact ? 'w-6 h-6' : 'w-8 h-8'} bg-gray-600 rounded animate-pulse`} />
            <span className={`font-bold text-gray-400 ${compact ? 'text-sm' : 'text-base'}`}>
              ???
            </span>
          </motion.div>
        ) : currentLaneInfo && (
          <>
            {currentLaneInfo.image && (
              <img
                src={currentLaneInfo.image}
                alt={currentLaneInfo.label}
                className={`${compact ? 'w-6 h-6' : 'w-8 h-8'} object-contain`}
              />
            )}
            <span
              className={`font-bold ${currentLaneInfo.color} ${compact ? 'text-sm' : 'text-base'}`}
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
        className={`${compact ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm'} rounded-full font-bold
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
