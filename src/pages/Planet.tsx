import { Link, useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { planets } from '../data/planets';
import { StarCounter } from '../components/ui/StarCounter';
import { DinoCharacter } from '../components/game/DinoCharacter';
import { gamePhrases } from '../data/phrases';

export function Planet() {
  const { planetId } = useParams<{ planetId: string }>();
  const { state, isPlanetAvailable, getGameStars } = useGame();
  
  const planet = planets.find(p => p.id === planetId);
  
  // Redirect if planet doesn't exist or isn't unlocked
  if (!planet || !isPlanetAvailable(planet.id)) {
    return <Navigate to="/" replace />;
  }
  
  const welcomeMessage = gamePhrases.planets[planet.id as keyof typeof gamePhrases.planets]?.welcome 
    || `Fáilte go ${planet.nameIrish}!`;
  
  return (
    <div 
      className="min-h-screen p-4 md:p-8 relative"
      style={{ 
        background: `linear-gradient(135deg, ${planet.color}20 0%, #0f0a1e 100%)` 
      }}
    >
      {/* Back button */}
      <Link 
        to="/"
        className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
      >
        <span>←</span>
        <span>Ar ais</span>
      </Link>
      
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
            <span className="text-4xl md:text-5xl">{planet.icon}</span>
            {planet.nameIrish}
          </h1>
          <p className="text-white/70 mt-1">{planet.description}</p>
        </motion.div>
        <StarCounter stars={state.totalStars} />
      </header>
      
      {/* Dino welcome */}
      <motion.div 
        className="flex items-center gap-4 mb-8 bg-white/10 backdrop-blur-sm rounded-2xl p-4 max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <DinoCharacter size="small" mood="excited" />
        <p className="text-white font-medium">{welcomeMessage}</p>
      </motion.div>
      
      {/* Mini-games grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl">
        {planet.miniGames.map((game, index) => {
          const gameStarsEarned = getGameStars(game.id);
          return (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index + 0.3 }}
            >
              <Link to={`/game/${planet.id}/${game.id}`}>
                <motion.div
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 cursor-pointer border-2 border-transparent hover:border-white/30 transition-colors"
                  whileHover={{ scale: 1.03, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <h3 className="text-xl font-bold text-white mb-1">
                    {game.nameIrish}
                  </h3>
                  <p className="text-white/60 text-sm mb-3">
                    {game.name}
                  </p>
                  <p className="text-white/80 text-sm mb-4">
                    {game.description}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/50 capitalize">
                      {game.difficulty}
                    </span>
                    <span className="text-sm text-yellow-400">
                      {'⭐'.repeat(Math.min(gameStarsEarned, game.maxStars))}
                      {'☆'.repeat(Math.max(0, game.maxStars - gameStarsEarned))}
                    </span>
                  </div>
                  
                  {/* Play button */}
                  <motion.div 
                    className="mt-4 py-2 px-4 rounded-full text-center font-bold text-white"
                    style={{ backgroundColor: planet.color }}
                    whileHover={{ scale: 1.05 }}
                  >
                    Imir! 🎮
                  </motion.div>
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
