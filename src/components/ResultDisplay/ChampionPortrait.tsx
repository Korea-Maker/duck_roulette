import { motion } from 'framer-motion';
import type { Champion } from '../../types';
import { getChampionImageUrl } from '../../utils/champion';
import { hexToRgba } from '../../utils/colorFilters';

interface ChampionPortraitProps {
  champion: Champion;
  imageLoaded: boolean;
  setImageLoaded: (loaded: boolean) => void;
  imageError: boolean;
  setImageError: (error: boolean) => void;
}

export function ChampionPortrait({
  champion,
  imageLoaded,
  setImageLoaded,
  imageError,
  setImageError,
}: ChampionPortraitProps) {
  const championImageUrl = getChampionImageUrl(champion.id);
  const championColor = champion.color || '#FFD700';

  return (
    <motion.div
      className="flex flex-col items-center gap-4 mb-8"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 20 }}
    >
      {!imageError && (
        <div className="relative">
          {!imageLoaded && (
            <div className="w-48 h-48 bg-gray-700/50 rounded-2xl animate-pulse" />
          )}
          <motion.img
            src={championImageUrl}
            alt={champion.koreanName}
            className={`w-48 h-48 rounded-2xl border-8 transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              borderColor: championColor,
              boxShadow: `0 0 40px ${hexToRgba(championColor, 0.9)}, 0 0 80px ${hexToRgba(championColor, 0.6)}, 0 20px 60px rgba(0, 0, 0, 0.7)`,
            }}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            initial={{ rotate: -180 }}
            animate={{ rotate: 0 }}
            transition={{ type: 'spring', stiffness: 150, damping: 15 }}
          />
        </div>
      )}
      <motion.span
        className="font-black text-4xl"
        style={{
          fontFamily: "'Orbitron', sans-serif",
          color: championColor,
          textShadow: `0 0 20px ${hexToRgba(championColor, 0.8)}, 0 0 40px ${hexToRgba(championColor, 0.5)}, 0 0 60px ${hexToRgba(championColor, 0.3)}`,
        }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {champion.koreanName}
      </motion.span>
    </motion.div>
  );
}
