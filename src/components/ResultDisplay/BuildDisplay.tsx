import { motion } from 'framer-motion';
import type { RandomBuild } from '../../types';
import { API_CONFIG } from '../../config/api';

interface BuildDisplayProps {
  build: RandomBuild;
}

export function BuildDisplay({ build }: BuildDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-4 mb-6 space-y-3 border-t border-gray-700/50 pt-4"
    >
      <h4 className="text-sm font-bold text-yellow-400 text-center">
        🎒 빌드 <span className="text-xs text-orange-500 bg-orange-500/20 px-1.5 py-0.5 rounded ml-1">[TEST]</span>
      </h4>

      {/* 아이템 섹션 - 컴팩트 그리드 */}
      <div className="grid grid-cols-6 gap-1.5 max-w-xs mx-auto">
        {build.items.map((item, index) => (
          <motion.div
            key={`${item.id}-${index}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + index * 0.03 }}
            className="relative group"
          >
            <div className="aspect-square rounded overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border border-yellow-600/30 hover:border-yellow-400/60 transition-all">
              <img
                src={API_CONFIG.getItemImageUrl(item.image)}
                alt={item.koreanName}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 bg-gray-900/95 text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              {item.koreanName}
            </div>
          </motion.div>
        ))}
      </div>

      {/* 룬 & 소환사 주문 & 스킬 - 한 줄로 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex items-center justify-center gap-4 flex-wrap"
      >
        {/* 주 룬 */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-purple-400 font-bold">주룬</span>
          <div className="relative group">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-purple-600 to-purple-900 border-2 border-purple-400">
              <img
                src={API_CONFIG.getRuneImageUrl(build.primaryRune.keystone.icon)}
                alt={build.primaryRune.keystone.koreanName}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 bg-gray-900/95 text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              {build.primaryRune.keystone.koreanName}
            </div>
          </div>
          {build.primaryRune.runes.slice(0, 3).map((rune, index) => (
            <div key={`p-${rune.id}-${index}`} className="relative group">
              <div className="w-5 h-5 rounded-full overflow-hidden bg-gray-800 border border-purple-500/50">
                <img
                  src={API_CONFIG.getRuneImageUrl(rune.icon)}
                  alt={rune.koreanName}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 bg-gray-900/95 text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {rune.koreanName}
              </div>
            </div>
          ))}
        </div>

        {/* 구분선 */}
        <div className="w-px h-6 bg-gray-600" />

        {/* 보조 룬 */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-blue-400 font-bold">보조</span>
          {build.secondaryRune.runes.map((rune, index) => (
            <div key={`s-${rune.id}-${index}`} className="relative group">
              <div className="w-5 h-5 rounded-full overflow-hidden bg-gray-800 border border-blue-500/50">
                <img
                  src={API_CONFIG.getRuneImageUrl(rune.icon)}
                  alt={rune.koreanName}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 bg-gray-900/95 text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {rune.koreanName}
              </div>
            </div>
          ))}
        </div>

        {/* 구분선 */}
        <div className="w-px h-6 bg-gray-600" />

        {/* 소환사 주문 */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-green-400 font-bold">주문</span>
          {build.summonerSpells.map((spell, index) => (
            <div key={`spell-${spell.id}-${index}`} className="relative group">
              <div className="w-7 h-7 rounded overflow-hidden bg-gray-800 border border-green-500/50">
                <img
                  src={API_CONFIG.getSummonerSpellImageUrl(spell.icon)}
                  alt={spell.koreanName}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 bg-gray-900/95 text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {spell.koreanName}
              </div>
            </div>
          ))}
        </div>

        {/* 구분선 */}
        <div className="w-px h-6 bg-gray-600" />

        {/* 스킬 순서 */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-orange-400 font-bold">스킬</span>
          <div className="px-2 py-1 bg-gradient-to-r from-orange-600 to-red-600 rounded border border-orange-400">
            <span className="text-sm font-black text-white">
              {build.skillOrder}
            </span>
            <span className="text-[8px] text-orange-200 ml-0.5">MAX</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
