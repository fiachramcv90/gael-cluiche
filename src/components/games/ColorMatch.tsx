import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DinoCharacter } from '../game/DinoCharacter'
import { Button } from '../ui/Button'
import { colors, type ColorWord } from '../../data/colors'

type DinoMood = 'happy' | 'excited' | 'thinking' | 'sad' | 'celebrating'

interface GameState {
  score: number
  currentColor: ColorWord
  options: ColorWord[]
  feedback: 'correct' | 'wrong' | null
  isComplete: boolean
  dinoMood: DinoMood
}

// Shuffle array utility
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Generate options: 1 correct + 3 random wrong
function generateOptions(correct: ColorWord): ColorWord[] {
  const otherColors = colors.filter(c => c.id !== correct.id)
  const wrongAnswers = shuffleArray(otherColors).slice(0, 3)
  return shuffleArray([correct, ...wrongAnswers])
}

// Pick a random color
function pickRandomColor(): ColorWord {
  return colors[Math.floor(Math.random() * colors.length)]
}

const ROUNDS_TO_WIN = 5

export function ColorMatch() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const firstColor = pickRandomColor()
    return {
      score: 0,
      currentColor: firstColor,
      options: generateOptions(firstColor),
      feedback: null,
      isComplete: false,
      dinoMood: 'happy',
    }
  })

  // Track timeout IDs for cleanup
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const nextRound = useCallback(() => {
    const newColor = pickRandomColor()
    setGameState(prev => ({
      ...prev,
      currentColor: newColor,
      options: generateOptions(newColor),
      feedback: null,
      dinoMood: 'happy',
    }))
  }, [])

  const handleAnswer = (selectedColor: ColorWord) => {
    if (gameState.feedback) return // Prevent double-clicks

    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    const isCorrect = selectedColor.id === gameState.currentColor.id

    if (isCorrect) {
      const newScore = gameState.score + 1
      const isComplete = newScore >= ROUNDS_TO_WIN

      setGameState(prev => ({
        ...prev,
        score: newScore,
        feedback: 'correct',
        isComplete,
        dinoMood: isComplete ? 'celebrating' : 'excited',
      }))

      // Auto-advance to next round after feedback
      if (!isComplete) {
        timeoutRef.current = setTimeout(nextRound, 1500)
      }
    } else {
      setGameState(prev => ({
        ...prev,
        feedback: 'wrong',
        dinoMood: 'sad',
      }))

      // Clear wrong feedback after a moment
      timeoutRef.current = setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          feedback: null,
          dinoMood: 'thinking',
        }))
      }, 1500)
    }
  }

  const resetGame = () => {
    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    const newColor = pickRandomColor()
    setGameState({
      score: 0,
      currentColor: newColor,
      options: generateOptions(newColor),
      feedback: null,
      isComplete: false,
      dinoMood: 'happy',
    })
  }

  // Victory screen
  if (gameState.isComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
        >
          <DinoCharacter size="large" mood="celebrating" />
        </motion.div>
        
        <motion.h2
          className="text-3xl font-bold text-white mt-6 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Maith thú! 🎉
        </motion.h2>
        
        <motion.div
          className="text-5xl mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          ⭐⭐⭐
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Button variant="success" size="large" onClick={resetGame}>
            Imir arís!
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
      {/* Progress */}
      <div className="text-xl text-white mb-4 font-bold">
        {gameState.score} / {ROUNDS_TO_WIN} ⭐
      </div>

      {/* Dino */}
      <div className="mb-6">
        <DinoCharacter size="medium" mood={gameState.dinoMood} />
      </div>

      {/* Color Swatch */}
      <motion.div
        data-testid="color-swatch"
        data-color-id={gameState.currentColor.id}
        className="w-32 h-32 rounded-2xl shadow-lg mb-8"
        style={{ backgroundColor: gameState.currentColor.hex }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        key={gameState.currentColor.id + gameState.score}
      />

      {/* Feedback */}
      <AnimatePresence>
        {gameState.feedback && (
          <motion.div
            className={`text-2xl font-bold mb-4 ${
              gameState.feedback === 'correct' ? 'text-green-400' : 'text-orange-400'
            }`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {gameState.feedback === 'correct' ? 'Maith thú! 🎉' : 'Triail arís! 💪'}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Answer Options */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-md">
        {gameState.options.map(option => (
          <motion.button
            key={option.id}
            onClick={() => handleAnswer(option)}
            disabled={gameState.feedback !== null}
            className={`
              py-4 px-6 rounded-xl text-lg font-bold
              transition-all duration-200
              ${
                gameState.feedback === 'correct' && option.id === gameState.currentColor.id
                  ? 'bg-green-500 text-white'
                  : gameState.feedback === 'wrong' && option.id === gameState.currentColor.id
                  ? 'bg-green-500/30 text-white border-2 border-green-500'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }
              disabled:cursor-not-allowed
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {option.irish}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
