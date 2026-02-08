import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFateTrade } from '../../hooks/useFateTrade';
import { CHAMPIONS } from '../../data/champions';
import { API_CONFIG } from '../../config/api';
import type { Champion, Lane } from '../../types';

const LANE_LABELS: Record<Lane, string> = {
  TOP: '탑',
  JUNGLE: '정글',
  MID: '미드',
  ADC: '원딜',
  SUPPORT: '서포터',
};

const LANE_COLORS: Record<Lane, string> = {
  TOP: '#f97316',
  JUNGLE: '#22c55e',
  MID: '#a855f7',
  ADC: '#ef4444',
  SUPPORT: '#3b82f6',
};

interface ChampionPickerModalProps {
  onSelect: (champion: Champion) => void;
  onClose: () => void;
  excludeIds: string[];
}

function ChampionPickerModal({ onSelect, onClose, excludeIds }: ChampionPickerModalProps) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return CHAMPIONS.filter(
      c =>
        !excludeIds.includes(c.id) &&
        (c.koreanName.toLowerCase().includes(term) ||
          c.name.toLowerCase().includes(term) ||
          c.id.toLowerCase().includes(term))
    );
  }, [search, excludeIds]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md max-h-[70vh] bg-gray-800 rounded-xl shadow-2xl overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-3 border-b border-gray-700">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="챔피언 검색..."
            className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        </div>
        <div className="overflow-y-auto flex-1 p-2">
          <div className="grid grid-cols-4 gap-1.5">
            {filtered.map(champion => (
              <button
                key={champion.id}
                onClick={() => onSelect(champion)}
                className="flex flex-col items-center p-1.5 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-600 hover:border-blue-400 transition-colors">
                  <img
                    src={API_CONFIG.getChampionImageUrl(champion.id)}
                    alt={champion.koreanName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-[10px] text-gray-300 mt-1 text-center truncate w-full">
                  {champion.koreanName}
                </span>
              </button>
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-gray-500 py-8 text-sm">검색 결과가 없습니다</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

interface TeamCardProps {
  teamName: string;
  teamColor: string;
  teamBg: string;
  results: { champion: Champion | null; lane: Lane }[];
  isTraded: boolean;
  isManual: boolean;
  onChampionClick?: (index: number) => void;
}

function TeamCard({ teamName, teamColor, teamBg, results, isTraded, isManual, onChampionClick }: TeamCardProps) {
  return (
    <div className={`flex-1 rounded-xl ${teamBg} border border-gray-700 overflow-hidden`}>
      <div className={`px-4 py-2 text-center font-bold text-white ${teamColor}`}>
        {teamName}
      </div>
      <div className="p-3 space-y-2">
        {results.map((result, index) => (
          <motion.div
            key={index}
            initial={isTraded ? { opacity: 0, x: teamName === '블루팀' ? -20 : 20 } : false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: isTraded ? index * 0.12 : 0 }}
            className="flex items-center gap-2 bg-gray-800/60 rounded-lg p-2"
          >
            {/* 라인 표시 */}
            <div
              className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold text-white shrink-0"
              style={{ backgroundColor: LANE_COLORS[result.lane] }}
            >
              {LANE_LABELS[result.lane][0]}
            </div>

            {/* 챔피언 */}
            {result.champion ? (
              <motion.div
                initial={isTraded ? { scale: 0 } : false}
                animate={{ scale: 1 }}
                transition={{ delay: isTraded ? index * 0.12 + 0.2 : 0, type: 'spring', stiffness: 300 }}
                className="flex items-center gap-2 flex-1 min-w-0"
              >
                <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-gray-600 shrink-0">
                  <img
                    src={API_CONFIG.getChampionImageUrl(result.champion.id)}
                    alt={result.champion.koreanName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-white text-xs font-medium truncate">{result.champion.koreanName}</p>
                  <p className="text-gray-500 text-[10px]">{LANE_LABELS[result.lane]}</p>
                </div>
              </motion.div>
            ) : (
              <button
                onClick={() => isManual && onChampionClick?.(index)}
                className={`flex items-center gap-2 flex-1 min-w-0 ${
                  isManual ? 'cursor-pointer hover:bg-gray-700/50 rounded p-1 -m-1 transition-colors' : ''
                }`}
              >
                <div className="w-9 h-9 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center shrink-0">
                  <span className="text-gray-500 text-sm">?</span>
                </div>
                <div className="min-w-0">
                  <p className="text-gray-500 text-xs">{isManual ? '선택하기' : '대기 중'}</p>
                  <p className="text-gray-600 text-[10px]">{LANE_LABELS[result.lane]}</p>
                </div>
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function FateTrade() {
  const {
    teamSize,
    mode,
    teamA,
    teamB,
    isTraded,
    isAnimating,
    setTeamSize,
    setMode,
    trade,
    selectChampion,
    reset,
  } = useFateTrade();

  const [pickerTarget, setPickerTarget] = useState<{ team: 'A' | 'B'; index: number } | null>(null);

  const usedChampionIds = [...teamA, ...teamB]
    .filter(r => r.champion !== null)
    .map(r => r.champion!.id);

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto px-4 py-6">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-white mb-1"
      >
        운명의 트레이드
      </motion.h2>
      <p className="text-gray-400 text-sm mb-6">상대팀이 당신의 챔피언을 정해줍니다!</p>

      {/* 설정 영역 */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {/* 인원 선택 */}
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">인원:</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                onClick={() => setTeamSize(n)}
                className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${
                  teamSize === n
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* 모드 토글 */}
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">모드:</span>
          <div className="flex bg-gray-700 rounded-lg overflow-hidden">
            <button
              onClick={() => setMode('random')}
              className={`px-4 py-1.5 text-sm font-medium transition-all ${
                mode === 'random'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              랜덤
            </button>
            <button
              onClick={() => setMode('manual')}
              className={`px-4 py-1.5 text-sm font-medium transition-all ${
                mode === 'manual'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              수동
            </button>
          </div>
        </div>
      </div>

      {/* 팀 카드 */}
      <div className="flex gap-3 w-full mb-6 items-stretch">
        <TeamCard
          teamName="블루팀"
          teamColor="bg-blue-600"
          teamBg="bg-blue-950/30"
          results={teamA}
          isTraded={isTraded}
          isManual={mode === 'manual' && !isTraded}
          onChampionClick={index => setPickerTarget({ team: 'A', index })}
        />

        {/* VS 구분선 */}
        <div className="flex flex-col items-center justify-center shrink-0">
          <motion.div
            animate={isAnimating ? { rotate: 360, scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 1, ease: 'easeInOut' }}
            className="w-12 h-12 rounded-full bg-gray-800 border-2 border-gray-600 flex items-center justify-center"
          >
            <span className="text-white font-bold text-sm">VS</span>
          </motion.div>
        </div>

        <TeamCard
          teamName="레드팀"
          teamColor="bg-red-600"
          teamBg="bg-red-950/30"
          results={teamB}
          isTraded={isTraded}
          isManual={mode === 'manual' && !isTraded}
          onChampionClick={index => setPickerTarget({ team: 'B', index })}
        />
      </div>

      {/* 액션 버튼 */}
      <div className="flex gap-3">
        {!isTraded ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={trade}
            disabled={isAnimating}
            className={`px-8 py-3 rounded-xl font-bold text-lg transition-all ${
              isAnimating
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-red-600 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            {isAnimating ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="inline-block"
              >
                🔄
              </motion.span>
            ) : (
              '트레이드!'
            )}
          </motion.button>
        ) : (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={reset}
            className="px-8 py-3 rounded-xl font-bold text-lg bg-gray-700 hover:bg-gray-600 text-white transition-all"
          >
            다시 하기
          </motion.button>
        )}
      </div>

      {/* 챔피언 선택 모달 (수동 모드) */}
      <AnimatePresence>
        {pickerTarget !== null && (
          <ChampionPickerModal
            onSelect={champion => {
              selectChampion(pickerTarget.team, pickerTarget.index, champion);
              setPickerTarget(null);
            }}
            onClose={() => setPickerTarget(null)}
            excludeIds={usedChampionIds}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
