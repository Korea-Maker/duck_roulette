import { useState } from 'react';
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

  return (
    <main className="min-h-screen flex flex-col items-center p-4 gap-4">
      {/* 모드 선택기 */}
      <motion.div
        className="fixed top-4 left-1/2 -translate-x-1/2 z-30"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <ModeSelector currentMode={mode} onModeChange={setMode} />
      </motion.div>

      {/* 모드별 콘텐츠 */}
      <div className="w-full flex-1 flex flex-col items-center justify-center pt-16">
        <AnimatePresence mode="wait">
          {mode === 'single' ? (
            <motion.div
              key="single"
              className="w-full flex flex-col items-center gap-4"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
            >
              <SlotMachine onSpinComplete={addToHistory} />
              <SpinHistory history={history} />
            </motion.div>
          ) : (
            <motion.div
              key="party"
              className="w-full"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
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
