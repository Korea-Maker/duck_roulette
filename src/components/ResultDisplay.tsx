import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import type { ResultDisplayProps } from '../types';
import { getLaneInfo } from '../data/lanes';
import { getDamageTypeInfo } from '../data/damageTypes';

export function ResultDisplay({ lane, champion, damageType, show, onClose }: ResultDisplayProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const laneInfo = lane ? getLaneInfo(lane) : null;
  const damageInfo = damageType ? getDamageTypeInfo(damageType) : null;

  const hasAnyResult = lane || champion || damageType;

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

  const championImageUrl = champion
    ? `https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/${champion.id}.png`
    : null;

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* 배경 오버레이 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 z-40"
            style={{ backdropFilter: 'blur(8px)' }}
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
              style={{ resize: 'none' }}
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
                <motion.div
                  className="flex flex-col items-center gap-4 mb-8"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 20 }}
                >
                  {championImageUrl && !imageError && (
                    <div className="relative">
                      {!imageLoaded && (
                        <div className="w-48 h-48 bg-gray-700/50 rounded-2xl animate-pulse" />
                      )}
                      <motion.img
                        src={championImageUrl}
                        alt={champion.koreanName}
                        className={`w-48 h-48 rounded-2xl border-8 border-yellow-400 transition-opacity duration-300 ${
                          imageLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                        style={{
                          boxShadow: '0 0 40px rgba(255, 215, 0, 0.8), 0 0 80px rgba(255, 100, 50, 0.5), 0 20px 60px rgba(0, 0, 0, 0.7)',
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
                    className="font-black text-4xl text-cyan-300"
                    style={{
                      fontFamily: "'Orbitron', sans-serif",
                      textShadow: '0 0 20px rgba(0, 255, 255, 0.6), 0 0 40px rgba(0, 255, 255, 0.3)',
                    }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {champion.koreanName}
                  </motion.span>
                </motion.div>
              )}

              {/* 라인과 타입 정보 */}
              <div className="space-y-6 mb-8">
                {lane && laneInfo && (
                  <motion.div
                    className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-gray-800/50 to-gray-700/50"
                    style={{
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                    }}
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.35 }}
                  >
                    <span className="text-gray-300 font-semibold text-lg">라인:</span>
                    <div className="flex items-center gap-3">
                      {laneInfo.image && (
                        <img
                          src={laneInfo.image}
                          alt={laneInfo.label}
                          className="w-12 h-12 object-contain"
                          style={{
                            filter: laneInfo.color === 'text-red-400' ? 'brightness(0) saturate(100%) invert(56%) sepia(94%) saturate(2664%) hue-rotate(327deg) brightness(102%) contrast(92%)' :
                                   laneInfo.color === 'text-green-400' ? 'brightness(0) saturate(100%) invert(79%) sepia(26%) saturate(2089%) hue-rotate(75deg) brightness(93%) contrast(88%)' :
                                   laneInfo.color === 'text-blue-400' ? 'brightness(0) saturate(100%) invert(61%) sepia(89%) saturate(2372%) hue-rotate(191deg) brightness(101%) contrast(101%)' :
                                   laneInfo.color === 'text-yellow-400' ? 'brightness(0) saturate(100%) invert(84%) sepia(52%) saturate(1830%) hue-rotate(358deg) brightness(103%) contrast(104%)' :
                                   laneInfo.color === 'text-pink-400' ? 'brightness(0) saturate(100%) invert(70%) sepia(87%) saturate(3295%) hue-rotate(296deg) brightness(102%) contrast(101%)' : 'none'
                          }}
                        />
                      )}
                      <span className={`font-bold text-2xl ${laneInfo.color}`}>
                        {laneInfo.koreanLabel}
                      </span>
                    </div>
                  </motion.div>
                )}

                {damageType && damageInfo && (
                  <motion.div
                    className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-gray-800/50 to-gray-700/50"
                    style={{
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                    }}
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <span className="text-gray-300 font-semibold text-lg">타입:</span>
                    <div className="flex items-center gap-3">
                      {damageInfo.icon && (
                        <img
                          src={damageInfo.icon}
                          alt={damageInfo.label}
                          className="w-12 h-12 object-contain"
                        />
                      )}
                      <span className={`font-bold text-2xl ${damageInfo.color}`}>
                        {damageInfo.koreanLabel}
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>

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
