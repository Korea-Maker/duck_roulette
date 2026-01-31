import { motion } from 'framer-motion';
import { useEffect, useMemo } from 'react';
import { SlotReel } from './SlotReel';
import { SpinButton } from './SpinButton';
import { ResultDisplay } from './ResultDisplay';
import { ThemeSelector } from './ThemeSelector';
import { useSlotMachine } from '../hooks/useSlotMachine';
import { useSound } from '../hooks/useSound';
import { LANES } from '../data/lanes';
import { CHAMPIONS } from '../data/champions';
import { DAMAGE_TYPES } from '../data/damageTypes';
import { getChampionImageUrl } from '../utils/champion';
import type { SlotItem } from '../types';

// 데이터를 SlotItem 형태로 변환
const laneItems: SlotItem[] = LANES.map((lane) => ({
  id: lane.id,
  label: lane.koreanLabel,
  color: lane.color,
  image: lane.image,
}));

const championItems: SlotItem[] = CHAMPIONS.map((champ) => ({
  id: champ.id,
  label: champ.koreanName,
  color: 'text-cyan-300',
  image: getChampionImageUrl(champ.id),
}));

const damageTypeItems: SlotItem[] = DAMAGE_TYPES.map((type) => ({
  id: type.id,
  label: `${type.koreanLabel} (${type.label})`,
  color: type.color,
  image: type.icon,
}));

interface SlotMachineProps {
  onSpinComplete?: (champion: string, lane: string, type: string) => void;
}

export function SlotMachine({ onSpinComplete }: SlotMachineProps) {
  const {
    state,
    selectedIndices,
    showResult,
    isSpinning,
    allDisabled,
    toggleLane,
    toggleChampion,
    toggleDamageType,
    spin,
    hideResult,
  } = useSlotMachine({ onSpinComplete });

  const { startSpin, stopSpin, playResult } = useSound();

  // Pre-calculate particle positions (only once)
  const particlePositions = useMemo(() =>
    Array.from({ length: 6 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      xOffset: (Math.random() - 0.5) * 40,
    })),
  []);

  // Handle spinning sound
  useEffect(() => {
    if (isSpinning) {
      startSpin();
    } else {
      stopSpin();
      if (showResult) {
        playResult();
      }
    }
  }, [isSpinning, showResult, startSpin, stopSpin, playResult]);

  return (
    <div className="flex flex-col items-center gap-8 p-4">
      {/* 테마 선택기 */}
      <ThemeSelector />

      {/* 타이틀 */}
      <motion.h1
        className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"
        style={{
          fontFamily: "'Bebas Neue', 'Orbitron', sans-serif",
          letterSpacing: '0.1em',
          textShadow: '0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 100, 50, 0.3)',
        }}
        initial={{ y: -50, opacity: 0, scale: 0.8 }}
        animate={{
          y: 0,
          opacity: 1,
          scale: 1,
        }}
        transition={{ type: 'spring', stiffness: 100, damping: 10 }}
      >
        🎰 LoL 슬롯 머신 🎰
      </motion.h1>

      <p className="text-gray-400 text-center max-w-md">
        오늘의 챔피언, 라인, 타입을 랜덤으로 정해보세요!
        <br />
        각 슬롯을 ON/OFF하여 원하는 항목만 돌릴 수 있습니다.
      </p>

      {/* 슬롯 머신 컨테이너 */}
      <motion.div
        className={`slot-container ${isSpinning ? 'spinning' : ''}`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* 배경 파티클 효과 - 스핀 중 */}
        {isSpinning && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-0 rounded-3xl overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {particlePositions.map((pos, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-yellow-400"
                style={{
                  left: `${pos.left}%`,
                  top: `${pos.top}%`,
                  boxShadow: '0 0 10px rgba(255, 215, 0, 0.8)',
                  willChange: 'transform, opacity',
                }}
                animate={{
                  y: [0, -20, 0],
                  x: [0, pos.xOffset, 0],
                  opacity: [0, 0.8, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.25,
                  ease: 'easeOut',
                }}
              />
            ))}
          </motion.div>
        )}

        {/* LED Frame */}
        <div className="led-frame" />

        {/* 슬롯 릴들 */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 p-4">
          <SlotReel
            items={laneItems}
            isSpinning={state.lane.isSpinning}
            selectedIndex={selectedIndices.lane}
            enabled={state.lane.enabled}
            label="🗺️ 라인"
            onToggle={toggleLane}
          />

          <SlotReel
            items={championItems}
            isSpinning={state.champion.isSpinning}
            selectedIndex={selectedIndices.champion}
            enabled={state.champion.enabled}
            label="⚔️ 챔피언"
            onToggle={toggleChampion}
          />

          <SlotReel
            items={damageTypeItems}
            isSpinning={state.damageType.isSpinning}
            selectedIndex={selectedIndices.damageType}
            enabled={state.damageType.enabled}
            label="💥 템트리"
            onToggle={toggleDamageType}
          />
        </div>

        {/* 스핀 버튼 & 레버 */}
        <div className="flex justify-center items-end gap-8 mt-6">
          <SpinButton
            onClick={spin}
            disabled={isSpinning || allDisabled}
            isSpinning={isSpinning}
          />

          {/* 슬롯 머신 레버 */}
          <motion.button
            className="lever-container"
            onClick={spin}
            disabled={isSpinning || allDisabled}
            whileHover={!isSpinning && !allDisabled ? { scale: 1.05 } : {}}
            whileTap={!isSpinning && !allDisabled ? { scale: 0.95 } : {}}
          >
            {/* 레버 베이스 (고정부) */}
            <div className="lever-base" />

            {/* 코인 투입구 (숨김) */}
            <div className="lever-arm" />

            {/* 코인 - 투입 애니메이션 */}
            <motion.div
              className="lever-handle"
              style={{ x: '-50%' }}
              animate={isSpinning ? {
                y: [0, 55, 55],
                scale: [1, 0.8, 0],
                rotateZ: [0, 180, 360],
                opacity: [1, 1, 0],
              } : {
                y: 0,
                scale: 1,
                rotateZ: 0,
                opacity: 1,
              }}
              transition={isSpinning ? {
                duration: 0.7,
                times: [0, 0.5, 1],
                ease: 'easeIn',
              } : {
                type: 'spring',
                stiffness: 300,
                damping: 20,
                delay: 0.3,
              }}
            />
          </motion.button>
        </div>

        {/* 비활성화 경고 */}
        {allDisabled && (
          <motion.p
            className="text-red-400 text-center mt-4 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            ⚠️ 최소 하나의 슬롯을 활성화해주세요!
          </motion.p>
        )}
      </motion.div>

      {/* 결과 표시 모달 */}
      <ResultDisplay
        lane={state.lane.enabled ? state.lane.currentValue : null}
        champion={state.champion.enabled ? state.champion.currentValue : null}
        damageType={state.damageType.enabled ? state.damageType.currentValue : null}
        show={showResult && !isSpinning}
        onClose={hideResult}
      />

      {/* 푸터 */}
      <motion.footer
        className="text-gray-400 text-sm mt-8 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex items-center gap-2">
          <span className="text-yellow-500">★</span>
          <span>총 {CHAMPIONS.length}개의 챔피언 지원</span>
          <span className="text-yellow-500">★</span>
        </div>
        <div
          className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 font-bold"
          style={{
            fontFamily: "'Orbitron', sans-serif",
            letterSpacing: '0.05em',
            textShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
          }}
        >
          Made by 제로콕
        </div>
      </motion.footer>
    </div>
  );
}
