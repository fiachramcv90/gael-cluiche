import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { numbers1to20, tens } from '../../data/numbers';
import { getPositiveFeedback, getEncouragement } from '../../data/phrases';
import { DinoCharacter } from './DinoCharacter';
import { Button } from '../ui/Button';

interface NumberMatchGameProps {
  difficulty?: 'éasca' | 'meánach' | 'deacair';
  onComplete?: (stars: number) => void;
}

// Difficulty settings
const difficultySettings = {
  éasca: { maxNumber: 10, optionCount: 4, rounds: 6 },
  meánach: { maxNumber: 20, optionCount: 5, rounds: 8 },
  deacair: { maxNumber: 50, optionCount: 6, rounds: 10 },
};

export function NumberMatchGame({ difficulty = 'éasca', onComplete }: NumberMatchGameProps) {
  const { addStars } = useGame();
  const settings = difficultySettings[difficulty];
  
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [targetNumber, setTargetNumber] = useState(1);
  const [options, setOptions] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState('');
  const [dinoMood, setDinoMood] = useState<'happy' | 'excited' | 'celebrating' | 'sad'>('happy');
  const [gameOver, setGameOver] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Get Irish number word
  const getIrishNumber = useCallback((n: number): string => {
    if (n <= 20) {
      const numWord = numbers1to20.find(num => num.value === n);
      return numWord?.irish || String(n);
    }
    // For numbers > 20, construct the word
    const tensDigit = Math.floor(n / 10);
    const unitsDigit = n % 10;
    
    if (unitsDigit === 0) {
      const tensWord = tens.find(t => t.value === n);
      return tensWord?.irish || String(n);
    }
    
    const tensWord = tens.find(t => t.value === tensDigit * 10);
    const unitsWord = numbers1to20.find(num => num.value === unitsDigit);
    
    return `${tensWord?.irish || ''} ${unitsWord?.irish || ''}`.trim();
  }, []);
  
  // Generate a new round
  const generateRound = useCallback(() => {
    // Pick random target number
    const target = Math.floor(Math.random() * settings.maxNumber) + 1;
    setTargetNumber(target);
    
    // Generate options (including correct answer)
    const opts = new Set<number>([target]);
    while (opts.size < settings.optionCount) {
      const randomNum = Math.floor(Math.random() * settings.maxNumber) + 1;
      opts.add(randomNum);
    }
    setOptions(Array.from(opts).sort(() => Math.random() - 0.5)); // Shuffle
    
    // Reset state
    setSelectedAnswer(null);
    setIsCorrect(null);
    setFeedback('');
    setDinoMood('happy');
    setIsAnimating(false);
  }, [settings]);
  
  // Initialize game
  useEffect(() => {
    generateRound();
  }, [generateRound]);
  
  // Handle answer selection
  const handleAnswer = (answer: number) => {
    if (isAnimating || selectedAnswer !== null) return;
    
    setSelectedAnswer(answer);
    setIsAnimating(true);
    
    const correct = answer === targetNumber;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(prev => prev + 10);
      setCorrectCount(prev => prev + 1);
      setFeedback(getPositiveFeedback());
      setDinoMood('celebrating');
    } else {
      setFeedback(getEncouragement());
      setDinoMood('sad');
    }
    
    // Move to next round after delay
    setTimeout(() => {
      if (round >= settings.rounds) {
        const starsEarned = calculateStars();
        addStars(starsEarned);
        setGameOver(true);
        onComplete?.(starsEarned);
      } else {
        setRound(prev => prev + 1);
        generateRound();
      }
    }, 1500);
  };
  
  // Calculate stars based on performance
  const calculateStars = () => {
    const percentage = correctCount / settings.rounds;
    if (percentage >= 0.9) return 3;
    if (percentage >= 0.7) return 2;
    if (percentage >= 0.5) return 1;
    return 0;
  };
  
  // Restart game
  const restartGame = () => {
    setRound(1);
    setScore(0);
    setCorrectCount(0);
    setGameOver(false);
    generateRound();
  };
  
  if (gameOver) {
    const starsEarned = calculateStars();
    return (
      <motion.div 
        className="text-center p-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <DinoCharacter size="large" mood="celebrating" />
        
        <h2 className="text-3xl font-bold text-white mt-6 mb-2">
          Críochnaithe! 🎉
        </h2>
        
        <p className="text-white/80 text-lg mb-4">
          Scór: {score} pointe
        </p>
        
        <div className="flex justify-center gap-1 text-4xl mb-6">
          {[1, 2, 3].map(star => (
            <motion.span
              key={star}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                rotate: star <= starsEarned ? [0, 360] : 0,
              }}
              transition={{ delay: star * 0.2 }}
            >
              {star <= starsEarned ? '⭐' : '☆'}
            </motion.span>
          ))}
        </div>
        
        <p className="text-white/60 mb-6">
          {correctCount} as {settings.rounds} ceart!
        </p>
        
        <div className="flex gap-4 justify-center">
          <Button onClick={restartGame} variant="primary">
            Imir Arís 🔄
          </Button>
        </div>
      </motion.div>
    );
  }
  
  return (
    <div className="p-4 max-w-lg mx-auto">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-white/60 mb-1">
          <span>Babhta {round}/{settings.rounds}</span>
          <span>Scór: {score}</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-purple-400 to-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${(round / settings.rounds) * 100}%` }}
          />
        </div>
      </div>
      
      {/* Dino instruction */}
      <motion.div 
        className="flex items-center gap-3 mb-6 bg-white/10 rounded-2xl p-3"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <DinoCharacter size="small" mood={dinoMood} />
        <p className="text-white font-medium">
          {feedback || 'Aimsigh an uimhir cheart!'}
        </p>
      </motion.div>
      
      {/* Target number in Irish */}
      <motion.div 
        className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl p-8 mb-6 text-center"
        key={`round-${round}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <p className="text-white/60 text-sm mb-2">Aimsigh an uimhir:</p>
        <motion.p 
          className="text-4xl md:text-5xl font-bold text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {getIrishNumber(targetNumber)}
        </motion.p>
      </motion.div>
      
      {/* Answer options (numbers) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {options.map((num, index) => (
          <motion.button
            key={num}
            onClick={() => handleAnswer(num)}
            disabled={selectedAnswer !== null}
            className={`
              p-6 rounded-2xl text-center font-bold text-3xl
              transition-all duration-200
              ${selectedAnswer === null 
                ? 'bg-white/10 hover:bg-white/20 text-white' 
                : selectedAnswer === num
                  ? isCorrect
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                  : num === targetNumber && selectedAnswer !== null
                    ? 'bg-green-500/50 text-white'
                    : 'bg-white/5 text-white/50'
              }
            `}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={selectedAnswer === null ? { scale: 1.05 } : {}}
            whileTap={selectedAnswer === null ? { scale: 0.95 } : {}}
          >
            {num}
          </motion.button>
        ))}
      </div>
      
      {/* Feedback overlay */}
      <AnimatePresence>
        {isCorrect !== null && (
          <motion.div
            className="fixed inset-0 pointer-events-none flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`text-8xl ${isCorrect ? 'text-green-400' : 'text-red-400'}`}
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
            >
              {isCorrect ? '✓' : '✗'}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
