import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { DinoCharacter } from '../components/game/DinoCharacter';

// Pre-generated star positions (computed once at module load)
const STAR_POSITIONS = Array.from({ length: 30 }).map((_, i) => ({
  left: ((i * 37) % 100),
  top: ((i * 73) % 100),
  duration: 2 + (i % 3),
  delay: (i % 5) * 0.4,
}));

interface OnboardingProps {
  onComplete: (name: string) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [name, setName] = useState('');

  const trimmedName = name.trim();
  const isValid = trimmedName.length > 0;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onComplete(trimmedName);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
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
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <motion.div
        className="relative z-10 flex flex-col items-center max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Dino character */}
        <motion.div
          data-testid="dino-character"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            delay: 0.2, 
            type: "spring",
            stiffness: 200,
          }}
        >
          <DinoCharacter mood="excited" size="large" />
        </motion.div>

        {/* Welcome text */}
        <motion.div
          className="text-center mt-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Dia duit! 👋
          </h1>
          <p className="text-xl text-white/80">
            Cad is ainm duit?
          </p>
        </motion.div>

        {/* Name input form */}
        <motion.form
          onSubmit={handleSubmit}
          className="w-full space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div>
            <label htmlFor="player-name" className="sr-only">
              D'ainm
            </label>
            <input
              id="player-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="D'ainm anseo..."
              className="w-full text-xl p-4 rounded-2xl bg-white/10 backdrop-blur-sm 
                         border-2 border-white/20 text-white placeholder-white/50
                         focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/50
                         transition-all duration-200"
              autoFocus
              autoComplete="off"
            />
          </div>

          <motion.button
            type="submit"
            disabled={!isValid}
            className="w-full p-4 rounded-2xl text-xl font-bold
                       bg-gradient-to-r from-yellow-400 to-orange-500
                       text-white shadow-lg
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500
                       transition-all duration-200"
            whileHover={isValid ? { scale: 1.02 } : {}}
            whileTap={isValid ? { scale: 0.98 } : {}}
          >
            Tosú! 🚀
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
}
