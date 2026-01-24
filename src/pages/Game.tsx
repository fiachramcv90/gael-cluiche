import { useParams, Navigate, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { planets } from '../data/planets';
import { CountingGame } from '../components/game/CountingGame';
import { NumberMatchGame } from '../components/game/NumberMatchGame';
import { DinoCharacter } from '../components/game/DinoCharacter';

export function Game() {
  const { planetId, gameId } = useParams<{ planetId: string; gameId: string }>();
  const { isPlanetAvailable } = useGame();
  const navigate = useNavigate();
  
  const planet = planets.find(p => p.id === planetId);
  const game = planet?.miniGames.find(g => g.id === gameId);
  
  // Redirect if invalid
  if (!planet || !game || !isPlanetAvailable(planet.id)) {
    return <Navigate to="/" replace />;
  }
  
  // Handle game completion
  const handleGameComplete = (stars: number) => {
    console.log(`Game complete! Earned ${stars} stars`);
  };
  
  // Render the appropriate game component based on game type
  const renderGame = () => {
    switch (game.type) {
      case 'counting':
        return (
          <CountingGame 
            difficulty={game.difficulty} 
            onComplete={handleGameComplete}
          />
        );
      
      case 'number-match':
        return (
          <NumberMatchGame 
            difficulty={game.difficulty} 
            onComplete={handleGameComplete}
          />
        );
      
      // Placeholder for other game types (to be built in future PRs)
      case 'addition':
      case 'subtraction':
      case 'letter-match':
      case 'spelling':
      case 'color-match':
      case 'color-paint':
      case 'animal-match':
      case 'animal-quiz':
      case 'word-match':
      default:
        return (
          <motion.div 
            className="text-center p-6"
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
      <header className="flex justify-between items-center mb-4">
        <Link 
          to={`/planet/${planet.id}`}
          className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
        >
          <span>←</span>
          <span>Ar ais</span>
        </Link>
        <h2 className="text-lg md:text-xl font-bold text-white text-center flex-1">
          {game.nameIrish}
        </h2>
        <div className="text-yellow-400 text-sm">
          {'⭐'.repeat(game.starsEarned)}
          {'☆'.repeat(game.maxStars - game.starsEarned)}
        </div>
      </header>
      
      {/* Game area */}
      <div className="flex-1 flex flex-col">
        <motion.div 
          className="flex-1 bg-white/5 backdrop-blur-sm rounded-3xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {renderGame()}
        </motion.div>
      </div>
      
      {/* Bottom navigation */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => navigate(`/planet/${planet.id}`)}
          className="text-white/60 hover:text-white text-sm transition-colors"
        >
          ← Ar ais go dtí an pláinéad
        </button>
      </div>
    </div>
  );
}
