import { motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SlotReel } from './SlotReel';
import { SpinButton } from './SpinButton';
import { ResultDisplay } from './ResultDisplay';
import { ThemeSelector } from './ThemeSelector';
import { SoundToggle } from './SoundToggle';
import { ChampionFilter } from './ChampionFilter';
import { ToggleSwitch } from './ToggleSwitch';
import { LottoBallMachine } from './LottoBallMachine';
import { useSlotMachine } from '../hooks/useSlotMachine';
import { useSound } from '../hooks/useSound';
import { useBuildRandomizer } from '../hooks/useBuildRandomizer';
import { LANES } from '../data/lanes';
import { DAMAGE_TYPES } from '../data/damageTypes';
import { getChampionImageUrl } from '../utils/champion';
import type { SlotItem, ChampionTag, RandomBuild, Champion } from '../types';

// 데이터를 SlotItem 형태로 변환
const laneItems: SlotItem[] = LANES.map((lane) => ({
  id: lane.id,
  label: lane.koreanLabel,
  color: lane.color,
  image: lane.image,
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
  // 챔피언 필터 상태
  const [filterTags, setFilterTags] = useState<ChampionTag[]>([]);

  // 빌드 랜덤화 토글 상태
  const [buildRandomEnabled, setBuildRandomEnabled] = useState(false);

  // 현재 빌드 상태
  const [currentBuild, setCurrentBuild] = useState<RandomBuild | null>(null);

  // 로또 모드 상태
  const [isLottoMode, setIsLottoMode] = useState(false);

  // 로또 모드 스피닝 상태
  const [isLottoSpinning, setIsLottoSpinning] = useState(false);
  const lottoResultTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 로또 선택된 챔피언 저장
  const [lottoSelectedChampion, setLottoSelectedChampion] = useState<Champion | null>(null);
  const [lottoShowResult, setLottoShowResult] = useState(false);

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
    filteredChampions,
  } = useSlotMachine({ onSpinComplete, filterTags });

  const { generateRandomBuild } = useBuildRandomizer();

  // 필터링된 챔피언 목록을 SlotItem으로 변환
  const championItems: SlotItem[] = useMemo(
    () =>
      filteredChampions.map((champ) => ({
        id: champ.id,
        label: champ.koreanName,
        color: 'text-cyan-300',
        image: getChampionImageUrl(champ.id),
      })),
    [filteredChampions]
  );

  const { playClick, startSpin, stopSpin, startLottoSpin, stopLottoSpin, playWin, isMuted, toggleMute } = useSound();

  // Pre-calculate particle positions (only once)
  const particlePositions = useMemo(() =>
    Array.from({ length: 6 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      xOffset: (Math.random() - 0.5) * 40,
    })),
  []);

  // Handle slot spinning sound
  useEffect(() => {
    if (isSpinning) {
      startSpin();
    } else {
      stopSpin();
      if (showResult) {
        playWin();
        // 스핀이 완료되면 빌드 생성
        if (buildRandomEnabled && state.champion.currentValue) {
          const build = generateRandomBuild(state.champion.currentValue.id);
          setCurrentBuild(build);
        } else {
          setCurrentBuild(null);
        }
      }
    }
  }, [isSpinning, showResult, startSpin, stopSpin, playWin, buildRandomEnabled, state.champion.currentValue, generateRandomBuild]);

  // Handle lotto spinning sound (separate from slot)
  useEffect(() => {
    if (isLottoSpinning) {
      startLottoSpin();
    } else {
      stopLottoSpin();
      if (lottoShowResult) {
        playWin();
      }
    }
  }, [isLottoSpinning, lottoShowResult, startLottoSpin, stopLottoSpin, playWin]);

  // 컴포넌트 언마운트 시 사운드 및 타이머 정리
  useEffect(() => {
    return () => {
      stopSpin();
      stopLottoSpin();
      if (lottoResultTimeoutRef.current) {
        clearTimeout(lottoResultTimeoutRef.current);
      }
    };
  }, [stopSpin, stopLottoSpin]);

  // 로또 모드 스핀 핸들러
  const handleLottoSpin = useCallback(() => {
    if (isLottoSpinning) return;
    hideResult();
    setLottoShowResult(false);
    setLottoSelectedChampion(null);
    setIsLottoSpinning(true);
  }, [isLottoSpinning, hideResult]);

  // 로또 모드 완료 핸들러
  const handleLottoComplete = useCallback((champion: Champion) => {
    setIsLottoSpinning(false);
    setLottoSelectedChampion(champion);

    // 빌드 생성
    if (buildRandomEnabled) {
      const build = generateRandomBuild(champion.id);
      setCurrentBuild(build);
    } else {
      setCurrentBuild(null);
    }

    // 이전 타이머 정리
    if (lottoResultTimeoutRef.current) {
      clearTimeout(lottoResultTimeoutRef.current);
    }

    // 결과 표시
    lottoResultTimeoutRef.current = setTimeout(() => {
      setLottoShowResult(true);
      if (onSpinComplete) {
        onSpinComplete(champion.id, state.lane.currentValue || 'MID', state.damageType.currentValue || 'AD');
      }
    }, 100);
  }, [buildRandomEnabled, generateRandomBuild, onSpinComplete, state.lane.currentValue, state.damageType.currentValue]);

  return (
    <div className="flex flex-col items-center gap-4 p-2">
      {/* 테마 선택기 */}
      <ThemeSelector />

      {/* 타이틀 */}
      <motion.h1
        className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"
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

      <p className="text-gray-400 text-sm text-center max-w-md">
        오늘의 챔피언, 라인, 템트리를 랜덤으로 정해보세요!
      </p>

      {/* 챔피언 필터 */}
      <ChampionFilter selectedTags={filterTags} onTagsChange={setFilterTags} />

      {/* 모드 토글 (슬롯 vs 로또) */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="flex items-center gap-4 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 px-4 py-2 rounded-lg border border-indigo-500/30"
      >
        <span className="text-sm text-gray-300 font-medium">🎰 슬롯</span>
        <ToggleSwitch
          enabled={isLottoMode}
          onToggle={() => setIsLottoMode(!isLottoMode)}
        />
        <span className="text-sm text-gray-300 font-medium">🎱 로또 [TEST]</span>
      </motion.div>

      {/* 빌드 랜덤화 토글 */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center bg-gradient-to-r from-purple-900/30 to-pink-900/30 px-2 py-1 rounded border border-purple-500/30 mb-4"
      >
        <ToggleSwitch
          enabled={buildRandomEnabled}
          onToggle={() => setBuildRandomEnabled(!buildRandomEnabled)}
          label="🎲 빌드 랜덤화 (Ultimate Bravery) [TEST]"
        />
      </motion.div>

      {/* 슬롯 머신 또는 로또 머신 */}
      {isLottoMode ? (
        // 로또 볼 머신
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full"
        >
          <LottoBallMachine
            champions={filteredChampions}
            isSpinning={isLottoSpinning}
            onComplete={handleLottoComplete}
          />

          {/* 스핀 버튼 */}
          <div className="flex justify-center items-center mt-6">
            <SpinButton
              onClick={handleLottoSpin}
              disabled={isLottoSpinning || filteredChampions.length === 0}
              isSpinning={isLottoSpinning}
              onPlayClick={playClick}
            />
          </div>

          {/* 챔피언 없음 경고 */}
          {filteredChampions.length === 0 && (
            <motion.p
              className="text-red-400 text-center mt-4 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              ⚠️ 선택 가능한 챔피언이 없습니다!
            </motion.p>
          )}
        </motion.div>
      ) : (
        // 기존 슬롯 머신
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
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 p-3">
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

        {/* 스핀 버튼 */}
        <div className="flex justify-center items-center mt-4">
          <SpinButton
            onClick={spin}
            disabled={isSpinning || allDisabled}
            isSpinning={isSpinning}
            onPlayClick={playClick}
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
      )}

      {/* 결과 표시 모달 */}
      <ResultDisplay
        lane={isLottoMode ? null : (state.lane.enabled ? state.lane.currentValue : null)}
        champion={isLottoMode ? lottoSelectedChampion : (state.champion.enabled ? state.champion.currentValue : null)}
        damageType={isLottoMode ? null : (state.damageType.enabled ? state.damageType.currentValue : null)}
        show={isLottoMode ? lottoShowResult : (showResult && !isSpinning)}
        onClose={isLottoMode ? () => setLottoShowResult(false) : hideResult}
        onSpinAgain={isLottoMode ? handleLottoSpin : spin}
        build={currentBuild}
      />

      {/* 소리 토글 버튼 */}
      <SoundToggle isMuted={isMuted} onToggle={toggleMute} />

      {/* 푸터 */}
      <motion.footer
        className="text-gray-400 text-sm mt-6 mb-4 flex flex-col items-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex items-center gap-2">
          <span className="text-yellow-500">★</span>
          <span>
            {filterTags.length > 0
              ? `${filteredChampions.length}명 선택됨`
              : `총 ${filteredChampions.length}개의 챔피언 지원`}
          </span>
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
