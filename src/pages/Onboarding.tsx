import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { DinoCharacter } from '../components/game/DinoCharacter';

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
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
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
            type: 'spring', 
            stiffness: 200,
            damping: 15 
          }}
        >
          <DinoCharacter size="large" mood="excited" />
        </motion.div>

        {/* Welcome message */}
        <motion.div
          className="text-center mt-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Dia duit! 👋
          </h1>
          <p className="text-xl md:text-2xl text-white/90">
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
              D'ainm (Your name)
            </label>
            <input
              id="player-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="D'ainm anseo..."
              autoFocus
              autoComplete="off"
              className="w-full text-xl md:text-2xl p-4 rounded-2xl bg-white/10 backdrop-blur-sm 
                         border-2 border-white/20 text-white placeholder-white/50
                         focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/50
                         transition-all duration-200"
              aria-label="D'ainm"
            />
          </div>

          <motion.button
            type="submit"
            disabled={!isValid}
            className="w-full text-xl md:text-2xl font-bold p-4 min-h-[60px] rounded-2xl
                       bg-gradient-to-r from-yellow-400 to-orange-500
                       text-white shadow-lg shadow-orange-500/30
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500 disabled:shadow-none
                       hover:scale-[1.02] active:scale-[0.98]
                       transition-all duration-200"
            whileHover={isValid ? { scale: 1.02 } : {}}
            whileTap={isValid ? { scale: 0.98 } : {}}
          >
            Tosú! 🚀
          </motion.button>
        </motion.form>

        {/* Decorative rocket */}
        <motion.div
          className="absolute -bottom-20 right-0 text-6xl pointer-events-none"
          animate={{
            y: [0, -10, 0],
            rotate: [15, 20, 15],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          🚀
        </motion.div>
      </motion.div>
    </div>
  );
}
