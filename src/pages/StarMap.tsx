import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { planets, unlockRequirements } from '../data/planets';
import { StarCounter } from '../components/ui/StarCounter';
import { DinoCharacter } from '../components/game/DinoCharacter';

// Pre-generated star positions (computed once at module load)
const STAR_POSITIONS = Array.from({ length: 50 }).map((_, i) => ({
  left: ((i * 37) % 100),
  top: ((i * 73) % 100),
  duration: 2 + (i % 3),
  delay: (i % 5) * 0.4,
}));

function SettingsButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
      whileHover={{ scale: 1.1, rotate: 90 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Socruithe"
    >
      <span className="text-xl">⚙️</span>
    </motion.button>
  );
}

function ChangeNameModal({ 
  isOpen, 
  currentName, 
  onSave, 
  onClose 
}: { 
  isOpen: boolean; 
  currentName: string; 
  onSave: (name: string) => void; 
  onClose: () => void;
}) {
  const [name, setName] = useState(currentName);
  const [initialized, setInitialized] = useState(false);

  // Reset name when modal opens
  if (isOpen && !initialized) {
    setName(currentName);
    setInitialized(true);
  } else if (!isOpen && initialized) {
    setInitialized(false);
  }

  if (!isOpen) return null;

  const trimmedName = name.trim();
  const isValid = trimmedName.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onSave(trimmedName);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        className="relative bg-gradient-to-br from-[#1a1033] to-[#162447] rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-white/10"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Athraigh d'ainm ✏️
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full text-xl p-4 rounded-2xl bg-white/10 backdrop-blur-sm 
                       border-2 border-white/20 text-white placeholder-white/50
                       focus:outline-none focus:border-yellow-400"
            autoFocus
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 p-3 rounded-xl bg-white/10 text-white font-semibold
                         hover:bg-white/20 transition-colors"
            >
              Cealaigh
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className="flex-1 p-3 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500
                         text-white font-bold shadow-lg
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sábháil ✓
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export function StarMap() {
  const { state, isPlanetAvailable, getPlanetStars, setPlayerName } = useGame();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  return (
    <div className="min-h-screen p-4 md:p-8 relative overflow-hidden">
      {/* Background stars */}
      <div className="fixed inset-0 pointer-events-none">
        {STAR_POSITIONS.map((star, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
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
        <div className="flex items-center gap-3">
          <StarCounter stars={state.totalStars} />
          <SettingsButton onClick={() => setIsSettingsOpen(true)} />
        </div>
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
          const planetStarsEarned = getPlanetStars(planet.id);
          
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
                      ⭐ {Math.min(planetStarsEarned, planet.starsTotal)}/{planet.starsTotal}
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

      {/* Settings modal */}
      <ChangeNameModal
        isOpen={isSettingsOpen}
        currentName={state.playerName || ''}
        onSave={(name) => setPlayerName(name)}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
