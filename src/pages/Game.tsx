import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { planets } from '../data/planets';
import { DinoCharacter } from '../components/game/DinoCharacter';
import { ColorMatch } from '../components/games/ColorMatch';

export function Game() {
  const { planetId, gameId } = useParams<{ planetId: string; gameId: string }>();
  const { isPlanetAvailable } = useGame();
  
  const planet = planets.find(p => p.id === planetId);
  const game = planet?.miniGames.find(g => g.id === gameId);
  
  // Redirect if invalid
  if (!planet || !game || !isPlanetAvailable(planet.id)) {
    return <Navigate to="/" replace />;
  }

  // Render game content based on type
  const renderGameContent = () => {
    switch (game.type) {
      case 'color-match':
        return <ColorMatch />;
      default:
        // Placeholder for unimplemented games
        return (
          <motion.div 
            className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 max-w-lg w-full text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <DinoCharacter size="large" mood="excited" />
            
            <h3 className="text-2xl font-bold text-white mt-6 mb-2">
              {game.nameIrish}
            </h3>
            <p className="text-white/70 mb-6">
              {game.description}
            </p>
            
            <div className="bg-white/5 rounded-xl p-6 mb-6">
              <p className="text-white/80 text-lg">
                🚧 Ag teacht go luath! 🚧
              </p>
              <p className="text-white/60 text-sm mt-2">
                Coming soon!
              </p>
            </div>
            
            <p className="text-white/50 text-sm">
              Game type: <code className="bg-white/10 px-2 py-1 rounded">{game.type}</code>
            </p>
          </motion.div>
        );
    }
  };
  
  return (
    <div 
      className="min-h-screen p-4 md:p-8 flex flex-col"
      style={{ 
        background: `linear-gradient(135deg, ${planet.color}30 0%, #0f0a1e 100%)` 
      }}
    >
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <Link 
          to={`/planet/${planet.id}`}
          className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
        >
          <span>←</span>
          <span>Ar ais</span>
        </Link>
        <h2 className="text-xl font-bold text-white">{game.nameIrish}</h2>
        <div className="text-yellow-400">
          {'⭐'.repeat(game.starsEarned)}
          {'☆'.repeat(game.maxStars - game.starsEarned)}
        </div>
      </header>
      
      {/* Game area */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {renderGameContent()}
      </div>
    </div>
  );
}
