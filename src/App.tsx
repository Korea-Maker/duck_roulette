import { useState, useCallback, lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { AppMode } from './types';
import { SlotMachine } from './components/SlotMachine';
import { ModeSelector } from './components/party/ModeSelector';
import { ErrorBoundary } from './components/ErrorBoundary';

const PartySlotMachine = lazy(() => import('./components/party/PartySlotMachine'));
const StrategyRoulette = lazy(() => import('./components/StrategyRoulette'));
const GoldPressure = lazy(() => import('./components/GoldPressure'));
const ColorBlender = lazy(() => import('./components/ColorBlender'));
const FateTrade = lazy(() => import('./components/FateTrade'));
const SynergyScoreboard = lazy(() => import('./components/SynergyScoreboard'));

const LoadingFallback = (
  <div className="flex items-center justify-center py-20 text-gray-400">
    로딩 중...
  </div>
);

function AppContent() {
  const [mode, setMode] = useState<AppMode>('single');

  const handleModeChange = useCallback((newMode: AppMode) => {
    setMode(newMode);
  }, []);

  const renderMode = () => {
    switch (mode) {
      case 'single':
        return (
          <motion.div
            key="single"
            className="w-full flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <SlotMachine />
          </motion.div>
        );
      case 'party':
        return (
          <motion.div
            key="party"
            className="w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Suspense fallback={LoadingFallback}>
              <PartySlotMachine />
            </Suspense>
          </motion.div>
        );
      case 'strategy':
        return (
          <motion.div
            key="strategy"
            className="w-full flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Suspense fallback={LoadingFallback}>
              <StrategyRoulette />
            </Suspense>
          </motion.div>
        );
      case 'gold-pressure':
        return (
          <motion.div
            key="gold-pressure"
            className="w-full flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Suspense fallback={LoadingFallback}>
              <GoldPressure />
            </Suspense>
          </motion.div>
        );
      case 'color-blender':
        return (
          <motion.div
            key="color-blender"
            className="w-full flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Suspense fallback={LoadingFallback}>
              <ColorBlender />
            </Suspense>
          </motion.div>
        );
      case 'fate-trade':
        return (
          <motion.div
            key="fate-trade"
            className="w-full flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Suspense fallback={LoadingFallback}>
              <FateTrade />
            </Suspense>
          </motion.div>
        );
      case 'synergy':
        return (
          <motion.div
            key="synergy"
            className="w-full flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Suspense fallback={LoadingFallback}>
              <SynergyScoreboard />
            </Suspense>
          </motion.div>
        );
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center p-4 gap-4">
      {/* 모드 선택기 */}
      <motion.div
        className="fixed top-4 left-0 right-0 z-30 flex justify-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <ModeSelector currentMode={mode} onModeChange={handleModeChange} />
      </motion.div>

      {/* 모드별 콘텐츠 */}
      <div className="w-full flex-1 flex flex-col items-center justify-center pt-24">
        <AnimatePresence mode="wait" initial={false}>
          {renderMode()}
        </AnimatePresence>
      </div>
    </main>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

export default App;
