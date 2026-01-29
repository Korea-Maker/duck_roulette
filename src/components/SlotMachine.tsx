import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { SlotReel } from './SlotReel';
import { SpinButton } from './SpinButton';
import { ResultDisplay } from './ResultDisplay';
import { ThemeSelector } from './ThemeSelector';
import { useSlotMachine } from '../hooks/useSlotMachine';
import { useSound } from '../hooks/useSound';
import { LANES } from '../data/lanes';
import { CHAMPIONS } from '../data/champions';
import { DAMAGE_TYPES } from '../data/damageTypes';
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
  image: `https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/${champ.id}.png`,
}));

const damageTypeItems: SlotItem[] = DAMAGE_TYPES.map((type) => ({
  id: type.id,
  label: `${type.koreanLabel} (${type.label})`,
  color: type.color,
  image: type.icon,
}));

export function SlotMachine() {
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
  } = useSlotMachine();

  const { startSpin, stopSpin, playResult } = useSound();

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
        className="slot-container"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
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
            label="💥 타입"
            onToggle={toggleDamageType}
          />
        </div>

        {/* 스핀 버튼 */}
        <div className="flex justify-center mt-6">
          <SpinButton
            onClick={spin}
            disabled={isSpinning || allDisabled}
            isSpinning={isSpinning}
          />
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
