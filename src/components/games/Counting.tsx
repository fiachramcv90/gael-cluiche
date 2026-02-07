import { useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { useGame } from '../../context/GameContext'
import { numbers1to20 } from '../../data/numbers'
import { DinoCharacter } from '../game/DinoCharacter'
import { Button } from '../ui/Button'

// Use only numbers 1-10 for this game
const numbers1to10 = numbers1to20.slice(0, 10)

interface GameQuestion {
  starCount: number
  options: number[]
}

type FeedbackState = 'none' | 'correct' | 'wrong'

const TOTAL_ROUNDS = 5
const STARS_PER_GAME = 3

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function generateQuestion(): GameQuestion {
  const starCount = Math.floor(Math.random() * 10) + 1
  
  // Get 3 random wrong answers
  const wrongOptions = numbers1to10
    .filter(n => n.value !== starCount)
    .map(n => n.value)
  
  const shuffledWrong = shuffleArray(wrongOptions).slice(0, 3)
  
  // Combine and shuffle all options
  const options = shuffleArray([starCount, ...shuffledWrong])
  
  return { starCount, options }
}

function getIrishWord(number: number): string {
  const numberData = numbers1to10.find(n => n.value === number)
  return numberData?.irish || ''
}

// Pre-generate star positions for visual interest
function generateStarPositions(count: number): Array<{ x: number; y: number; rotation: number; scale: number }> {
  const positions: Array<{ x: number; y: number; rotation: number; scale: number }> = []
  
  // Grid-based placement with some randomness for natural look
  const cols = Math.ceil(Math.sqrt(count * 1.5))
  const cellWidth = 100 / cols
  const cellHeight = 100 / Math.ceil(count / cols)
  
  for (let i = 0; i < count; i++) {
    const col = i % cols
    const row = Math.floor(i / cols)
    
    // Base position with some randomness
    const baseX = col * cellWidth + cellWidth / 2
    const baseY = row * cellHeight + cellHeight / 2
    
    // Add controlled randomness (using index for determinism within render)
    const offsetX = ((i * 17) % 20) - 10
    const offsetY = ((i * 13) % 20) - 10
    
    positions.push({
      x: Math.max(10, Math.min(90, baseX + offsetX)),
      y: Math.max(10, Math.min(90, baseY + offsetY)),
      rotation: ((i * 37) % 30) - 15,
      scale: 0.9 + ((i * 7) % 3) * 0.1,
    })
  }
  
  return positions
}

export function Counting() {
  const { gameId } = useParams<{ gameId: string }>()
  const { addStars } = useGame()
  const [currentQuestion, setCurrentQuestion] = useState<GameQuestion>(generateQuestion)
  const [correctCount, setCorrectCount] = useState(0)
  const [feedback, setFeedback] = useState<FeedbackState>('none')
  const [isGameComplete, setIsGameComplete] = useState(false)
  const [starPositions, setStarPositions] = useState(() => generateStarPositions(currentQuestion.starCount))

  const fireConfetti = useCallback(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3', '#dda0dd'],
    })
  }, [])

  const handleAnswer = useCallback((selectedNumber: number) => {
    if (feedback !== 'none') return // Prevent double clicks

    if (selectedNumber === currentQuestion.starCount) {
      // Correct answer
      setFeedback('correct')
      fireConfetti()
      
      const newCorrectCount = correctCount + 1
      setCorrectCount(newCorrectCount)

      if (newCorrectCount >= TOTAL_ROUNDS) {
        // Game complete
        setTimeout(() => {
          setIsGameComplete(true)
          addStars(gameId!, STARS_PER_GAME)
          fireConfetti()
        }, 1000)
      } else {
        // Next question after delay
        setTimeout(() => {
          setFeedback('none')
          const newQuestion = generateQuestion()
          setCurrentQuestion(newQuestion)
          setStarPositions(generateStarPositions(newQuestion.starCount))
        }, 1200)
      }
    } else {
      // Wrong answer - let them try again
      setFeedback('wrong')
      setTimeout(() => {
        setFeedback('none')
      }, 1000)
    }
  }, [currentQuestion.starCount, correctCount, feedback, fireConfetti, addStars])

  const handlePlayAgain = useCallback(() => {
    const newQuestion = generateQuestion()
    setCurrentQuestion(newQuestion)
    setStarPositions(generateStarPositions(newQuestion.starCount))
    setCorrectCount(0)
    setFeedback('none')
    setIsGameComplete(false)
  }, [])

  if (isGameComplete) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <DinoCharacter size="large" mood="celebrating" />
        
        <motion.h2 
          className="text-4xl font-bold text-white mt-6 mb-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          🎉 Comhghairdeas! 🎉
        </motion.h2>
        
        <motion.p 
          className="text-xl text-white/80 mb-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          D'éirigh leat!
        </motion.p>
        
        <motion.div 
          className="text-3xl mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: 'spring' }}
        >
          {'⭐'.repeat(STARS_PER_GAME)}
        </motion.div>
        
        <Button 
          variant="success" 
          size="large" 
          onClick={handlePlayAgain}
        >
          Imir arís! 🔄
        </Button>
      </motion.div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      {/* Progress indicator */}
      <div className="mb-6 text-white/70 text-lg" data-testid="progress-indicator">
        <span className="font-bold text-white">{correctCount}</span>
        <span> / </span>
        <span>{TOTAL_ROUNDS}</span>
        <span className="ml-2">⭐</span>
      </div>

      {/* Dino helper */}
      <DinoCharacter 
        size="medium" 
        mood={feedback === 'correct' ? 'celebrating' : feedback === 'wrong' ? 'thinking' : 'happy'} 
      />

      {/* Star display area */}
      <motion.div
        data-testid="star-display"
        className="relative w-64 h-40 md:w-80 md:h-48 my-6 bg-white/5 rounded-3xl border-2 border-white/10"
        key={currentQuestion.starCount}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {starPositions.map((pos, i) => (
          <motion.span
            key={i}
            className="absolute text-3xl md:text-4xl"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: `translate(-50%, -50%) rotate(${pos.rotation}deg) scale(${pos.scale})`,
            }}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: pos.scale, rotate: pos.rotation }}
            transition={{ 
              delay: i * 0.05,
              type: 'spring',
              stiffness: 200,
            }}
          >
            ⭐
          </motion.span>
        ))}
      </motion.div>

      {/* Question prompt */}
      <p className="text-xl text-white/80 mb-4">
        Cé mhéad réalta?
      </p>

      {/* Feedback message */}
      <AnimatePresence mode="wait">
        {feedback !== 'none' && (
          <motion.div
            className={`text-2xl font-bold mb-4 ${
              feedback === 'correct' ? 'text-green-400' : 'text-orange-400'
            }`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {feedback === 'correct' ? '✨ Maith thú! ✨' : '🤔 Triail arís!'}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Answer buttons */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {currentQuestion.options.map((number) => (
          <motion.button
            key={number}
            data-testid={`answer-${number}`}
            className={`
              p-6 rounded-2xl text-xl md:text-2xl font-bold
              bg-white/10 backdrop-blur-sm
              border-2 border-white/20
              text-white
              touch-manipulation
              transition-all duration-200
              active:scale-95
              ${feedback === 'correct' && number === currentQuestion.starCount
                ? 'bg-green-500/30 border-green-400'
                : feedback === 'wrong' && number !== currentQuestion.starCount
                ? ''
                : 'hover:bg-white/20 hover:border-white/40'
              }
            `}
            onClick={() => handleAnswer(number)}
            disabled={feedback === 'correct'}
            whileHover={{ scale: feedback === 'none' ? 1.02 : 1 }}
            whileTap={{ scale: feedback === 'none' ? 0.98 : 1 }}
          >
            {getIrishWord(number)}
          </motion.button>
        ))}
      </div>

      {/* Instructions */}
      <p className="mt-8 text-white/50 text-center text-sm">
        Comhair na réaltaí agus roghnaigh an freagra ceart
      </p>
    </div>
  )
}
