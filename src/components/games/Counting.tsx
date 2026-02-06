import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DinoCharacter } from '../game/DinoCharacter';
import { numbers1to20 } from '../../data/numbers';

interface CountingProps {
  planetColor: string;
  onComplete: (stars: number) => void;
}

// Generate random positions for stars with fun scattered layout
function generateStarPositions(count: number): { x: number; y: number; rotation: number; scale: number }[] {
  const positions: { x: number; y: number; rotation: number; scale: number }[] = [];
  
  // Grid-based placement with randomness for organic feel
  const cols = Math.min(5, count);
  const rows = Math.ceil(count / cols);
  
  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    
    // Base grid position (percentage)
    const baseX = (col / (cols - 1 || 1)) * 70 + 15; // 15-85% range
    const baseY = (row / (rows - 1 || 1)) * 60 + 20; // 20-80% range
    
    // Add some randomness
    const x = baseX + (Math.random() - 0.5) * 15;
    const y = baseY + (Math.random() - 0.5) * 10;
    const rotation = (Math.random() - 0.5) * 30;
    const scale = 0.9 + Math.random() * 0.2;
    
    positions.push({ x, y, rotation, scale });
  }
  
  return positions;
}

// Shuffle array helper
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Generate wrong answers that are close to the correct answer
function generateOptions(correctValue: number): number[] {
  const options = new Set<number>([correctValue]);
  
  // Add nearby numbers first
  const nearby = [correctValue - 1, correctValue + 1, correctValue - 2, correctValue + 2]
    .filter(n => n >= 1 && n <= 10 && n !== correctValue);
  
  for (const n of nearby) {
    if (options.size < 4) options.add(n);
  }
  
  // Fill remaining with random numbers if needed
  while (options.size < 4) {
    const rand = Math.floor(Math.random() * 10) + 1;
    if (!options.has(rand)) options.add(rand);
  }
  
  return shuffleArray([...options]);
}

export function Counting({ planetColor, onComplete }: CountingProps) {
  const [currentRound, setCurrentRound] = useState(1);
  const [correctCount, setCorrectCount] = useState(0);
  const [starCount, setStarCount] = useState(() => Math.floor(Math.random() * 10) + 1);
  const [options, setOptions] = useState<number[]>(() => generateOptions(starCount));
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showVictory, setShowVictory] = useState(false);
  const [starPositions, setStarPositions] = useState(() => generateStarPositions(starCount));
  
  const TOTAL_ROUNDS = 5;
  
  // Get Irish number word
  const getIrishNumber = useCallback((value: number): string => {
    return numbers1to20[value - 1]?.irish || '';
  }, []);
  
  // Start new round with new star count
  const startNewRound = useCallback(() => {
    const newCount = Math.floor(Math.random() * 10) + 1;
    setStarCount(newCount);
    setOptions(generateOptions(newCount));
    setStarPositions(generateStarPositions(newCount));
    setFeedback(null);
  }, []);
  
  // Handle answer click
  const handleAnswer = useCallback((selectedValue: number) => {
    if (feedback) return; // Prevent double clicks during feedback
    
    if (selectedValue === starCount) {
      setFeedback('correct');
      setCorrectCount(prev => prev + 1);
      
      // Check if game complete
      if (correctCount + 1 >= TOTAL_ROUNDS) {
        setTimeout(() => {
          setShowVictory(true);
          setTimeout(() => onComplete(3), 1500);
        }, 1200);
      } else {
        // Move to next round
        setTimeout(() => {
          setCurrentRound(prev => prev + 1);
          startNewRound();
        }, 1200);
      }
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 1000);
    }
  }, [starCount, feedback, correctCount, startNewRound, onComplete]);
  
  // Confetti for correct answers
  const showConfetti = feedback === 'correct';
  
  if (showVictory) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center min-h-[60vh] text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <DinoCharacter size="large" mood="celebrating" />
        <motion.h2
          className="text-4xl font-bold text-white mt-6 mb-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Iontach! 🎉
        </motion.h2>
        <motion.div
          className="text-5xl mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: 'spring' }}
        >
          ⭐⭐⭐
        </motion.div>
        <p className="text-white/80 text-lg">
          Fuair tú 3 réalta!
        </p>
      </motion.div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      {/* Header with title and progress */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Comhair na Réaltaí</h2>
        <div 
          data-testid="progress-indicator" 
          className="flex items-center gap-1 bg-white/10 px-4 py-2 rounded-full"
        >
          {Array.from({ length: TOTAL_ROUNDS }, (_, i) => (
            <span key={i} className="text-lg">
              {i < correctCount ? '⭐' : '☆'}
            </span>
          ))}
          <span className="text-white/80 ml-2 text-sm">{correctCount}/{TOTAL_ROUNDS}</span>
        </div>
      </div>
      
      {/* Stars display area */}
      <div 
        data-testid="stars-container"
        className="stars-layout relative bg-white/5 backdrop-blur-sm rounded-3xl p-6 mb-6 min-h-[200px] md:min-h-[280px] overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${planetColor}20 0%, transparent 100%)` }}
      >
        {starPositions.map((pos, index) => (
          <motion.span
            key={`star-${currentRound}-${index}`}
            className="absolute text-4xl md:text-5xl select-none"
            data-star="true"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: `translate(-50%, -50%) rotate(${pos.rotation}deg) scale(${pos.scale})`,
            }}
            initial={{ scale: 0, rotate: pos.rotation - 180 }}
            animate={{ 
              scale: pos.scale, 
              rotate: pos.rotation,
            }}
            transition={{ 
              delay: index * 0.05, 
              type: 'spring',
              stiffness: 300,
              damping: 20,
            }}
          >
            ⭐
          </motion.span>
        ))}
        
        {/* Confetti effect */}
        <AnimatePresence>
          {showConfetti && (
            <>
              {Array.from({ length: 20 }, (_, i) => (
                <motion.div
                  key={`confetti-${i}`}
                  className="absolute text-2xl"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: '50%',
                  }}
                  initial={{ y: 0, opacity: 1, scale: 0 }}
                  animate={{
                    y: -200 - Math.random() * 100,
                    x: (Math.random() - 0.5) * 100,
                    opacity: 0,
                    scale: 1,
                    rotate: Math.random() * 360,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                >
                  {['🌟', '✨', '💫', '⭐'][Math.floor(Math.random() * 4)]}
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>
      </div>
      
      {/* Dino and feedback */}
      <div className="flex items-center justify-center gap-4 mb-6 min-h-[80px]">
        <DinoCharacter 
          size="medium" 
          mood={feedback === 'correct' ? 'celebrating' : feedback === 'wrong' ? 'thinking' : 'happy'} 
        />
        <AnimatePresence mode="wait">
          {feedback && (
            <motion.div
              key={feedback}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`px-6 py-3 rounded-full font-bold text-lg ${
                feedback === 'correct' 
                  ? 'bg-green-500/20 text-green-300' 
                  : 'bg-orange-500/20 text-orange-300'
              }`}
            >
              {feedback === 'correct' ? 'Maith thú! 🎉' : 'Triail arís! 💪'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Answer buttons */}
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto w-full">
        {options.map((value) => (
          <motion.button
            key={value}
            data-testid={`answer-${value}`}
            onClick={() => handleAnswer(value)}
            disabled={feedback === 'correct'}
            className={`
              py-5 px-6 rounded-2xl font-bold text-xl
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              ${feedback === 'wrong' && value !== starCount 
                ? 'bg-white/5 text-white/50' 
                : 'bg-white/10 hover:bg-white/20 text-white'
              }
              active:scale-95
              touch-manipulation
            `}
            style={{
              background: feedback === 'correct' && value === starCount 
                ? `linear-gradient(135deg, ${planetColor}60 0%, ${planetColor}40 100%)`
                : undefined
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {getIrishNumber(value)}
          </motion.button>
        ))}
      </div>
      
      {/* Instructions for first round */}
      {currentRound === 1 && !feedback && (
        <motion.p
          className="text-center text-white/60 text-sm mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Comhair na réaltaí agus roghnaigh an uimhir cheart!
        </motion.p>
      )}
    </div>
  );
}
