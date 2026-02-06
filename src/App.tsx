import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GameProvider, useGame } from './context/GameContext';
import { StarMap } from './pages/StarMap';
import { Planet } from './pages/Planet';
import { Game } from './pages/Game';
import { Onboarding } from './pages/Onboarding';

function AppRoutes() {
  const { hasPlayerName, setPlayerName } = useGame();

  // Show onboarding if no player name
  if (!hasPlayerName) {
    return <Onboarding onComplete={setPlayerName} />;
  }

  return (
    <Routes>
      <Route path="/" element={<StarMap />} />
      <Route path="/planet/:planetId" element={<Planet />} />
      <Route path="/game/:planetId/:gameId" element={<Game />} />
    </Routes>
  );
}

function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-[#0f0a1e] via-[#1a1033] to-[#162447]">
          <AppRoutes />
        </div>
      </BrowserRouter>
    </GameProvider>
  );
}

export default App;
