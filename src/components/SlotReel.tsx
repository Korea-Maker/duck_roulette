import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import type { SlotReelProps, SlotItem as SlotItemType } from '../types';
import { SlotItem } from './SlotItem';
import { ToggleSwitch } from './ToggleSwitch';

const ITEM_HEIGHT = 64; // h-16 = 64px
const VISIBLE_ITEMS = 3;
const SPIN_DURATION = 2000; // 2초
const SPIN_ITEMS_COUNT = 30; // 스핀 중 보여줄 아이템 수

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
    if (!isSpinning) return [];

    const shuffled: SlotItemType[] = [];
    for (let i = 0; i < SPIN_ITEMS_COUNT; i++) {
      const randomItem = items[Math.floor(Math.random() * items.length)];
      shuffled.push(randomItem);
    }
    // 마지막에 선택된 아이템 추가
    shuffled.push(items[selectedIndex]);
    return shuffled;
  }, [isSpinning, items, selectedIndex]);

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
        style={{ height: ITEM_HEIGHT * VISIBLE_ITEMS }}
        animate={isSpinning && enabled ? {
          scale: [1, 1.02, 1],
        } : {}}
        transition={{
          duration: 0.3,
          repeat: isSpinning && enabled ? Infinity : 0,
          ease: 'easeInOut',
        }}
      >
        {/* 중앙 하이라이트 */}
        <motion.div
          className="absolute left-0 right-0 z-10 pointer-events-none border-y-4 border-yellow-400"
          style={{
            top: ITEM_HEIGHT,
            height: ITEM_HEIGHT,
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
            height: ITEM_HEIGHT,
            background: 'linear-gradient(to bottom, rgba(17,24,39,1) 0%, rgba(17,24,39,0) 100%)'
          }}
        />

        {/* 하단 그라데이션 */}
        <div
          className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none"
          style={{
            height: ITEM_HEIGHT,
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
                y: -(spinItems.length - VISIBLE_ITEMS + 1) * ITEM_HEIGHT
              }}
              transition={{
                duration: SPIN_DURATION / 1000,
                ease: [0.25, 0.1, 0.25, 1], // 감속 이징
              }}
              style={{ top: ITEM_HEIGHT }}
            >
              {spinItems.map((item, index) => (
                <SlotItem
                  key={`spin-${index}`}
                  item={item}
                  isActive={index === spinItems.length - 1}
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
                scale: [0.8, 1.15, 1],
                opacity: 1,
                rotateX: 0,
              }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 15,
                duration: 0.6,
              }}
              style={{ top: ITEM_HEIGHT }}
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
