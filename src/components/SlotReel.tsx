import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import type { SlotReelProps, SlotItem as SlotItemType } from '../types';
import { SlotItem } from './SlotItem';
import { ToggleSwitch } from './ToggleSwitch';
import { SLOT_CONFIG } from '../config/constants';

export function SlotReel({
  items,
  isSpinning,
  selectedIndex,
  enabled,
  label,
  onToggle,
}: SlotReelProps) {
  const [displayIndex, setDisplayIndex] = useState(selectedIndex);
  const [spinItems, setSpinItems] = useState<SlotItemType[]>([]);

  // 스핀용 아이템 배열 생성 (랜덤하게 섞인 아이템들 + 최종 결과)
  const generateSpinItems = useMemo(() => {
    const shuffled: SlotItemType[] = [];
    // 랜덤 아이템들 추가
    for (let i = 0; i < SLOT_CONFIG.SPIN_ITEMS_COUNT; i++) {
      const randomItem = items[Math.floor(Math.random() * items.length)];
      shuffled.push(randomItem);
    }
    // 마지막 3개 아이템: 중앙에 최종 선택 아이템이 정확히 멈추도록
    // [위의 아이템, 선택된 아이템(중앙), 아래 아이템]
    const prevIndex = (selectedIndex - 1 + items.length) % items.length;
    const nextIndex = (selectedIndex + 1) % items.length;

    shuffled.push(items[prevIndex]);
    shuffled.push(items[selectedIndex]); // 이것이 중앙에 위치할 최종 아이템
    shuffled.push(items[nextIndex]);

    return shuffled;
  }, [items, selectedIndex]);

  useEffect(() => {
    if (isSpinning && enabled) {
      setSpinItems(generateSpinItems);
    }
  }, [isSpinning, enabled, generateSpinItems]);

  useEffect(() => {
    if (!isSpinning) {
      setDisplayIndex(selectedIndex);
    }
  }, [isSpinning, selectedIndex]);

  const currentItem = items[displayIndex];

  return (
    <div className="flex flex-col items-center gap-4">
      {/* 라벨 */}
      <motion.div
        className="text-xl font-black text-yellow-400"
        style={{
          fontFamily: "'Bebas Neue', 'Orbitron', sans-serif",
          letterSpacing: '0.1em',
          textShadow: '0 0 15px rgba(255, 215, 0, 0.6), 0 0 30px rgba(255, 215, 0, 0.3)',
        }}
        animate={{
          textShadow: isSpinning && enabled
            ? [
                '0 0 15px rgba(255, 215, 0, 0.6), 0 0 30px rgba(255, 215, 0, 0.3)',
                '0 0 25px rgba(255, 215, 0, 0.9), 0 0 50px rgba(255, 215, 0, 0.5)',
                '0 0 15px rgba(255, 215, 0, 0.6), 0 0 30px rgba(255, 215, 0, 0.3)',
              ]
            : '0 0 15px rgba(255, 215, 0, 0.6), 0 0 30px rgba(255, 215, 0, 0.3)',
        }}
        transition={isSpinning && enabled ? {
          duration: 0.5,
          repeat: Infinity,
          ease: 'easeInOut',
        } : {}}
      >
        {label}
      </motion.div>

      {/* 토글 스위치 */}
      <ToggleSwitch enabled={enabled} onToggle={onToggle} />

      {/* 슬롯 릴 */}
      <motion.div
        className={`slot-reel w-44 relative ${!enabled ? 'opacity-50' : ''}`}
        style={{
          height: SLOT_CONFIG.ITEM_HEIGHT * SLOT_CONFIG.VISIBLE_ITEMS,
          willChange: isSpinning && enabled ? 'transform' : 'auto',
        }}
        animate={isSpinning && enabled ? {
          x: [0, -1, 1, 0],
          y: [0, -0.5, 0.5, 0],
        } : {}}
        transition={{
          duration: 0.2,
          repeat: isSpinning && enabled ? Infinity : 0,
          ease: 'linear',
        }}
      >
        {/* 중앙 하이라이트 */}
        <motion.div
          className="absolute left-0 right-0 z-10 pointer-events-none border-y-4 border-yellow-400"
          style={{
            top: SLOT_CONFIG.ITEM_HEIGHT,
            height: SLOT_CONFIG.ITEM_HEIGHT,
            background: 'linear-gradient(90deg, rgba(255,215,0,0.15) 0%, rgba(255,215,0,0.3) 50%, rgba(255,215,0,0.15) 100%)',
          }}
          animate={isSpinning && enabled ? {
            borderColor: [
              'rgba(255, 215, 0, 1)',
              'rgba(255, 100, 50, 1)',
              'rgba(255, 215, 0, 1)',
            ],
            boxShadow: [
              '0 0 20px rgba(255, 215, 0, 0.5)',
              '0 0 40px rgba(255, 100, 50, 0.8)',
              '0 0 20px rgba(255, 215, 0, 0.5)',
            ],
          } : {}}
          transition={{
            duration: 0.5,
            repeat: isSpinning && enabled ? Infinity : 0,
            ease: 'easeInOut',
          }}
        />

        {/* 상단 그라데이션 */}
        <div
          className="absolute top-0 left-0 right-0 z-20 pointer-events-none"
          style={{
            height: SLOT_CONFIG.ITEM_HEIGHT,
            background: 'linear-gradient(to bottom, rgba(17,24,39,1) 0%, rgba(17,24,39,0) 100%)'
          }}
        />

        {/* 하단 그라데이션 */}
        <div
          className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none"
          style={{
            height: SLOT_CONFIG.ITEM_HEIGHT,
            background: 'linear-gradient(to top, rgba(17,24,39,1) 0%, rgba(17,24,39,0) 100%)'
          }}
        />

        <AnimatePresence mode="wait">
          {isSpinning && enabled ? (
            // 스피닝 애니메이션
            <motion.div
              key="spinning"
              className="absolute w-full"
              initial={{ y: 0 }}
              animate={{
                // 최종 아이템이 중앙(ITEM_HEIGHT 위치)에 정확히 멈추도록 계산
                // spinItems.length - 2 = 선택된 아이템의 인덱스 (마지막에서 두번째)
                // 마지막에 한 칸 더 올라갔다가 (긴장감) 진동하며 내려오는 효과
                y: [
                  0,
                  -(spinItems.length - 1) * SLOT_CONFIG.ITEM_HEIGHT, // 한 칸 더 위로 (오버슈팅)
                  -(spinItems.length - 2) * SLOT_CONFIG.ITEM_HEIGHT - 3, // 진동 1
                  -(spinItems.length - 2) * SLOT_CONFIG.ITEM_HEIGHT + 2, // 진동 2
                  -(spinItems.length - 2) * SLOT_CONFIG.ITEM_HEIGHT - 1, // 진동 3
                  -(spinItems.length - 2) * SLOT_CONFIG.ITEM_HEIGHT, // 최종 위치
                ],
              }}
              transition={{
                duration: SLOT_CONFIG.SPIN_DURATION / 1000 + 0.3, // 진동 시간 추가
                times: [0, 0.85, 0.9, 0.94, 0.97, 1], // 키프레임 타이밍
                ease: [0.25, 0.1, 0.1, 1], // 극적인 감속 커브
              }}
              style={{ top: 0 }}
            >
              {spinItems.map((item, index) => (
                <SlotItem
                  key={`spin-${index}`}
                  item={item}
                  isActive={index === spinItems.length - 2} // 마지막에서 두번째가 선택된 아이템
                />
              ))}
            </motion.div>
          ) : (
            // 정지 상태
            <motion.div
              key="stopped"
              className="absolute w-full flex flex-col items-center justify-center"
              initial={{ scale: 0.8, opacity: 0, rotateX: 90 }}
              animate={{
                scale: [0.8, 1.3, 0.95, 1.1, 1],
                opacity: 1,
                rotateX: 0,
                y: [0, -8, 4, -2, 0],
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 12,
                duration: 0.8,
                times: [0, 0.3, 0.5, 0.75, 1],
              }}
              style={{ top: SLOT_CONFIG.ITEM_HEIGHT }}
            >
              {currentItem && (
                <SlotItem item={currentItem} isActive />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
