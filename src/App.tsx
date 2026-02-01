import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { AppMode } from './types';
import { SlotMachine } from './components/SlotMachine';
import { SpinHistory } from './components/SpinHistory';
import { useSpinHistory } from './hooks/useSpinHistory';
import { PartySlotMachine } from './components/party';
import { ModeSelector } from './components/party/ModeSelector';

function App() {
  const [mode, setMode] = useState<AppMode>('single');
  const { history, addToHistory } = useSpinHistory();

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
              className="w-full flex flex-col items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <SlotMachine onSpinComplete={addToHistory} />
              <SpinHistory history={history} />
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
              <PartySlotMachine />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

export default App;
