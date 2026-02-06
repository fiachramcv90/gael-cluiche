import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GameProvider, useGame } from './context/GameContext';
import { StarMap } from './pages/StarMap';
import { Planet } from './pages/Planet';
import { Game } from './pages/Game';
import { Onboarding } from './pages/Onboarding';

function AppContent() {
  const { state, setPlayerName } = useGame();

  // Show onboarding if no player name
  if (!state.playerName) {
    return (
      <Onboarding
        onComplete={(name) => {
          setPlayerName(name);
        }}
      />
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StarMap />} />
        <Route path="/planet/:planetId" element={<Planet />} />
        <Route path="/game/:planetId/:gameId" element={<Game />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <GameProvider>
      <div className="min-h-screen bg-gradient-to-br from-[#0f0a1e] via-[#1a1033] to-[#162447]">
        <AppContent />
      </div>
    </GameProvider>
  );
}

export default App;
