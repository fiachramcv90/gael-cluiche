import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { planets, unlockRequirements } from '../data/planets';
import { StarCounter } from '../components/ui/StarCounter';
import { DinoCharacter } from '../components/game/DinoCharacter';

export function StarMap() {
  const { state, isPlanetAvailable } = useGame();
  
  return (
    <div className="min-h-screen p-4 md:p-8 relative overflow-hidden">
      {/* Background stars */}
      <div className="fixed inset-0 pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      
      {/* Header */}
      <header className="relative z-10 flex justify-between items-center mb-8">
        <motion.h1 
          className="text-2xl md:text-4xl font-bold text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Turas na Réalta ✨
        </motion.h1>
        <StarCounter stars={state.totalStars} />
      </header>
      
      {/* Dino greeting */}
      <motion.div 
        className="relative z-10 flex items-center gap-4 mb-8 bg-white/10 backdrop-blur-sm rounded-2xl p-4 max-w-md mx-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <DinoCharacter size="small" mood="happy" />
        <div>
          <p className="text-white font-semibold">Dia duit, a {state.playerName}! 👋</p>
          <p className="text-white/80 text-sm">Roghnaigh pláinéad!</p>
        </div>
      </motion.div>
      
      {/* Planet Grid */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 max-w-5xl mx-auto">
        {planets.map((planet, index) => {
          const isUnlocked = isPlanetAvailable(planet.id);
          const starsNeeded = unlockRequirements[planet.id] ?? 0;
          
          return (
            <motion.div
              key={planet.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              {isUnlocked ? (
                <Link to={`/planet/${planet.id}`}>
                  <motion.div
                    className="relative aspect-square rounded-full flex flex-col items-center justify-center p-4 cursor-pointer"
                    style={{ backgroundColor: planet.color }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-4xl md:text-5xl mb-2">{planet.icon}</span>
                    <span className="text-white font-bold text-center text-sm md:text-base">
                      {planet.nameIrish}
                    </span>
                    <span className="text-white/80 text-xs mt-1">
                      ⭐ {planet.starsEarned}/{planet.starsTotal}
                    </span>
                    
                    {/* Glow effect */}
                    <div 
                      className="absolute inset-0 rounded-full opacity-50 blur-xl -z-10"
                      style={{ backgroundColor: planet.color }}
                    />
                  </motion.div>
                </Link>
              ) : (
                <motion.div
                  className="relative aspect-square rounded-full flex flex-col items-center justify-center p-4 bg-gray-600/50 cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="text-4xl md:text-5xl mb-2 grayscale opacity-50">
                    {planet.icon}
                  </span>
                  <span className="text-white/50 font-bold text-center text-sm">
                    🔒
                  </span>
                  <span className="text-white/50 text-xs mt-1">
                    {starsNeeded} ⭐ ag teastáil
                  </span>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
      
      {/* Rocket decoration */}
      <motion.div 
        className="fixed bottom-4 right-4 text-6xl"
        animate={{ 
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        🚀
      </motion.div>
    </div>
  );
}
