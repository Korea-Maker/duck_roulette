import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PartyLayoutType } from '../../types';
import { usePartySlotMachine } from '../../hooks/usePartySlotMachine';
import { useSound } from '../../hooks/useSound';
import { SpinButton } from '../SpinButton';
import { LayoutSelector } from './LayoutSelector';
import { PartyResultDisplay } from './PartyResultDisplay';
import { HorizontalLayout, VerticalLayout, CircularLayout } from './layouts';
import { PARTY_CONFIG } from '../../config/constants';

export function PartySlotMachine() {
  const [layout, setLayout] = useState<PartyLayoutType>(PARTY_CONFIG.DEFAULT_LAYOUT);
  const sound = useSound();

  const {
    state,
    isSpinning,
    showResult,
    spin,
    hideResult,
    getResults,
  } = usePartySlotMachine();

  const handleSpin = useCallback(() => {
    if (isSpinning) return;
    sound.playClick();
    sound.startSpin();
    spin();

    // 스핀 종료 시 사운드
    setTimeout(() => {
      sound.stopSpin();
      sound.playWin();
    }, 3000 + (PARTY_CONFIG.MEMBER_COUNT - 1) * PARTY_CONFIG.STAGGER_DELAY);
  }, [isSpinning, sound, spin]);

  const handleClose = useCallback(() => {
    sound.playResult();
    hideResult();
  }, [sound, hideResult]);

  // 레이아웃 렌더링
  const LayoutComponent = useMemo(() => {
    switch (layout) {
      case 'vertical':
        return VerticalLayout;
      case 'circular':
        return CircularLayout;
      case 'horizontal':
      default:
        return HorizontalLayout;
    }
  }, [layout]);

  // 배경 파티클 (스핀 중에만)
  const particles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 2,
    }));
  }, []);

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-start py-6 px-4">
      {/* 배경 파티클 */}
      <AnimatePresence>
        {isSpinning && (
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute rounded-full bg-yellow-400/30"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  width: particle.size,
                  height: particle.size,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                  y: [-20, -60],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1.5,
                  delay: particle.delay,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* 헤더 */}
      <motion.div
        className="text-center mb-6 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2
          className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 mb-2"
          style={{
            fontFamily: "'Bebas Neue', 'Orbitron', sans-serif",
            letterSpacing: '0.1em',
            textShadow: '0 0 30px rgba(255, 215, 0, 0.4)',
          }}
        >
          🎰 파티 룰렛 🎰
        </h2>
        <p className="text-gray-400 text-sm">5명의 챔피언을 한 번에!</p>
      </motion.div>

      {/* 레이아웃 선택기 */}
      <motion.div
        className="mb-6 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <LayoutSelector
          currentLayout={layout}
          onLayoutChange={setLayout}
        />
      </motion.div>

      {/* 슬롯 레이아웃 */}
      <motion.div
        className="w-full flex-1 flex items-center justify-center z-10 mb-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={layout}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <LayoutComponent
              members={state.members}
              isSpinning={isSpinning}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* 스핀 버튼 */}
      <motion.div
        className="z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <SpinButton
          onClick={handleSpin}
          disabled={isSpinning}
          isSpinning={isSpinning}
        />
      </motion.div>

      {/* 파티 결과 모달 */}
      <PartyResultDisplay
        results={getResults()}
        show={showResult}
        onClose={handleClose}
      />
    </div>
  );
}
