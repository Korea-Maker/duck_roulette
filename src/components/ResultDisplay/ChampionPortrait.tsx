import { motion } from 'framer-motion';
import { useState } from 'react';
import type { Champion } from '../../types';
import { getChampionImageUrl } from '../../utils/champion';
import { hexToRgba } from '../../utils/colorFilters';

interface ChampionPortraitProps {
  champion: Champion;
}

export function ChampionPortrait({ champion }: ChampionPortraitProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

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
        <div className="relative w-48 h-48">
          {/* Placeholder - absolute positioned */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-700/50 rounded-2xl animate-pulse" />
          )}
          {/* Image - absolute positioned to overlay placeholder */}
          <motion.img
            src={championImageUrl}
            alt={champion.koreanName}
            className="absolute inset-0 w-48 h-48 rounded-2xl border-8"
            style={{
              borderColor: championColor,
              boxShadow: `0 0 40px ${hexToRgba(championColor, 0.9)}, 0 0 80px ${hexToRgba(championColor, 0.6)}, 0 20px 60px rgba(0, 0, 0, 0.7)`,
              opacity: imageLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
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
