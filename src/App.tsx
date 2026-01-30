import { SlotMachine } from './components/SlotMachine';
import { SpinHistory } from './components/SpinHistory';
import { useSpinHistory } from './hooks/useSpinHistory';

function App() {
  const { history, addToHistory } = useSpinHistory();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 gap-4">
      <SlotMachine onSpinComplete={addToHistory} />
      <SpinHistory history={history} />
    </main>
  );
}

export default App;
