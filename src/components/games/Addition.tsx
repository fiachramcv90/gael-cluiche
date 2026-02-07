import { useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { useGame } from '../../context/GameContext'
import { numbers1to20 } from '../../data/numbers'
import { DinoCharacter } from '../game/DinoCharacter'
import { Button } from '../ui/Button'

interface GameQuestion {
  num1: number
  num2: number
  answer: number
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
  // Keep numbers small for young kids: 1-5 + 1-5 = max 10
  const num1 = Math.floor(Math.random() * 5) + 1
  const num2 = Math.floor(Math.random() * 5) + 1
  const answer = num1 + num2
  
  // Generate wrong answers close to the correct one
  const wrongAnswers = new Set<number>()
  while (wrongAnswers.size < 3) {
    // Generate answers within ±3 of correct, but valid (1-10)
    const offset = Math.floor(Math.random() * 7) - 3 // -3 to +3
    const wrongAnswer = answer + offset
    if (wrongAnswer !== answer && wrongAnswer >= 1 && wrongAnswer <= 10) {
      wrongAnswers.add(wrongAnswer)
    }
  }
  
  const options = shuffleArray([answer, ...Array.from(wrongAnswers)])
  
  return { num1, num2, answer, options }
}

function getIrishWord(number: number): string {
  const numberData = numbers1to20.find(n => n.value === number)
  return numberData?.irish || String(number)
}

export function Addition() {
  const { gameId } = useParams<{ gameId: string }>()
  const { addStars } = useGame()
  const [currentQuestion, setCurrentQuestion] = useState<GameQuestion>(generateQuestion)
  const [correctCount, setCorrectCount] = useState(0)
  const [feedback, setFeedback] = useState<FeedbackState>('none')
  const [isGameComplete, setIsGameComplete] = useState(false)

  const fireConfetti = useCallback(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3', '#dda0dd'],
    })
  }, [])

  const handleAnswer = useCallback((selectedNumber: number) => {
    if (feedback !== 'none') return

    if (selectedNumber === currentQuestion.answer) {
      setFeedback('correct')
      fireConfetti()
      
      const newCorrectCount = correctCount + 1
      setCorrectCount(newCorrectCount)

      if (newCorrectCount >= TOTAL_ROUNDS) {
        setTimeout(() => {
          setIsGameComplete(true)
          addStars(gameId!, STARS_PER_GAME)
          fireConfetti()
        }, 1000)
      } else {
        setTimeout(() => {
          setFeedback('none')
          setCurrentQuestion(generateQuestion())
        }, 1200)
      }
    } else {
      setFeedback('wrong')
      setTimeout(() => {
        setFeedback('none')
      }, 1000)
    }
  }, [currentQuestion.answer, correctCount, feedback, fireConfetti, addStars, gameId])

  const handlePlayAgain = useCallback(() => {
    setCurrentQuestion(generateQuestion())
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
          Maith an suimiú!
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
      <div className="mb-6 text-white/70 text-lg">
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

      {/* Math problem display */}
      <motion.div
        className="my-8 bg-white/10 backdrop-blur-sm rounded-3xl p-8 border-2 border-white/20"
        key={`${currentQuestion.num1}-${currentQuestion.num2}`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <div className="flex items-center justify-center gap-4 text-4xl md:text-5xl font-bold text-white">
          <motion.span
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {currentQuestion.num1}
          </motion.span>
          <motion.span
            className="text-yellow-400"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            +
          </motion.span>
          <motion.span
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {currentQuestion.num2}
          </motion.span>
          <motion.span
            className="text-white/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            =
          </motion.span>
          <motion.span
            className="text-yellow-400"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
          >
            ?
          </motion.span>
        </div>
      </motion.div>

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
            className={`
              p-6 rounded-2xl text-xl md:text-2xl font-bold
              bg-white/10 backdrop-blur-sm
              border-2 border-white/20
              text-white
              touch-manipulation
              transition-all duration-200
              active:scale-95
              ${feedback === 'correct' && number === currentQuestion.answer
                ? 'bg-green-500/30 border-green-400'
                : 'hover:bg-white/20 hover:border-white/40'
              }
            `}
            onClick={() => handleAnswer(number)}
            disabled={feedback === 'correct'}
            whileHover={{ scale: feedback === 'none' ? 1.02 : 1 }}
            whileTap={{ scale: feedback === 'none' ? 0.98 : 1 }}
          >
            <span className="block text-3xl mb-1">{number}</span>
            <span className="block text-sm text-white/60">{getIrishWord(number)}</span>
          </motion.button>
        ))}
      </div>

      {/* Instructions */}
      <p className="mt-8 text-white/50 text-center text-sm">
        Cuir na huimhreacha le chéile
      </p>
    </div>
  )
}
