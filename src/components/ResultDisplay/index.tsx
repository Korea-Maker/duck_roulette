import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import type { ResultDisplayProps } from '../../types';
import { useConfetti } from './useConfetti';
import { ChampionPortrait } from './ChampionPortrait';
import { ResultInfo } from './ResultInfo';
import { hexToRgba } from '../../utils/colorFilters';

export function ResultDisplay({ lane, champion, damageType, show, onClose }: ResultDisplayProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const hasAnyResult = lane || champion || damageType;

  // 컨페티 효과
  useConfetti(show, !!hasAnyResult);

  // ESC 키로 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && show) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [show, onClose]);

  // 모달이 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [show]);

  // 이미지 상태 리셋
  useEffect(() => {
    if (show) {
      setImageLoaded(false);
      setImageError(false);
    }
  }, [show]);

  if (!show || !hasAnyResult) return null;

  // 챔피언 색상 가져오기 (기본값: 골드)
  const championColor = champion?.color || '#FFD700';

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* 배경 오버레이 - 챔피언 색상으로 빛남 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40"
            style={{
              backdropFilter: 'blur(8px)',
              background: `radial-gradient(circle at center, ${hexToRgba(championColor, 0.2)} 0%, rgba(0, 0, 0, 0.85) 60%, rgba(0, 0, 0, 0.95) 100%)`,
            }}
            onClick={onClose}
          />

          {/* 모달 컨텐츠 */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.7, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: 50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative result-card max-w-lg w-full"
              style={{
                resize: 'none',
                borderColor: championColor,
                boxShadow: `0 0 40px ${hexToRgba(championColor, 0.6)}, 0 0 80px ${hexToRgba(championColor, 0.3)}, 0 20px 60px rgba(0, 0, 0, 0.7)`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 닫기 버튼 */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-800/80 hover:bg-gray-700/80 text-gray-300 hover:text-white transition-all duration-200 z-10"
                style={{
                  boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* 헤더 */}
              <motion.h3
                className="text-3xl font-black text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400"
                style={{
                  fontFamily: "'Bebas Neue', 'Orbitron', sans-serif",
                  letterSpacing: '0.1em',
                  textShadow: '0 0 30px rgba(255, 215, 0, 0.6)',
                }}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                🎯 당신의 운명 🎯
              </motion.h3>

              {/* 챔피언 이미지 (크게 강조) */}
              {champion && (
                <ChampionPortrait
                  champion={champion}
                  imageLoaded={imageLoaded}
                  setImageLoaded={setImageLoaded}
                  imageError={imageError}
                  setImageError={setImageError}
                />
              )}

              {/* 라인과 타입 정보 */}
              <ResultInfo lane={lane || undefined} damageType={damageType || undefined} />

              {/* 다시 돌리기 버튼 */}
              <motion.button
                onClick={onClose}
                className="w-full py-4 rounded-xl font-black text-xl text-white bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-400 hover:via-orange-400 hover:to-red-400 transition-all duration-300"
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  letterSpacing: '0.05em',
                  boxShadow: '0 8px 30px rgba(255, 165, 0, 0.5), 0 0 40px rgba(255, 100, 50, 0.3)',
                }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🎰 다시 돌리기
              </motion.button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
