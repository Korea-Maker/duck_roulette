import { useState, useCallback, lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { AppMode } from './types';
import { SlotMachine } from './components/SlotMachine';
import { ModeSelector } from './components/party/ModeSelector';
import { ErrorBoundary } from './components/ErrorBoundary';

const PartySlotMachine = lazy(() => import('./components/party/PartySlotMachine'));

function AppContent() {
  const [mode, setMode] = useState<AppMode>('single');

  const handleModeChange = useCallback((newMode: AppMode) => {
    setMode(newMode);
  }, []);

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
      <div className="w-full flex-1 flex flex-col items-center justify-center pt-16">
        <AnimatePresence mode="wait" initial={false}>
          {mode === 'single' ? (
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
          ) : (
            <motion.div
              key="party"
              className="w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Suspense fallback={
                <div className="flex items-center justify-center py-20 text-gray-400">
                  로딩 중...
                </div>
              }>
                <PartySlotMachine />
              </Suspense>
            </motion.div>
          )}
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
