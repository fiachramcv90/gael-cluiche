import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { NumberMatch } from './NumberMatch'
import { GameProvider } from '../../context/GameContext'
import confetti from 'canvas-confetti'

// Wrapper to provide context
const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <GameProvider>
        {ui}
      </GameProvider>
    </BrowserRouter>
  )
}

describe('NumberMatch', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Initial render', () => {
    it('displays a number in digits', () => {
      renderWithProviders(<NumberMatch />)
      
      // Should show a number between 1-10
      const numberDisplay = screen.getByTestId('number-display')
      expect(numberDisplay).toBeInTheDocument()
      const numberValue = parseInt(numberDisplay.textContent || '0')
      expect(numberValue).toBeGreaterThanOrEqual(1)
      expect(numberValue).toBeLessThanOrEqual(10)
    })

    it('displays 4 answer buttons with Irish number words', () => {
      renderWithProviders(<NumberMatch />)
      
      const buttons = screen.getAllByRole('button', { name: /^a /i })
      expect(buttons.length).toBe(4)
    })

    it('shows progress indicator starting at 0/5', () => {
      renderWithProviders(<NumberMatch />)
      
      // Look for the progress container with data-testid
      const progressIndicator = screen.getByTestId('progress-indicator')
      expect(progressIndicator).toHaveTextContent('0')
      expect(progressIndicator).toHaveTextContent('5')
    })
  })

  describe('Game interaction', () => {
    it('shows "Maith thú!" on correct answer', async () => {
      renderWithProviders(<NumberMatch />)
      
      const numberDisplay = screen.getByTestId('number-display')
      const targetNumber = parseInt(numberDisplay.textContent || '0')
      
      // Find the correct answer button
      const correctButton = screen.getByTestId(`answer-${targetNumber}`)
      
      await act(async () => {
        fireEvent.click(correctButton)
      })
      
      expect(screen.getByText(/Maith thú/i)).toBeInTheDocument()
    })

    it('triggers confetti on correct answer', async () => {
      renderWithProviders(<NumberMatch />)
      
      const numberDisplay = screen.getByTestId('number-display')
      const targetNumber = parseInt(numberDisplay.textContent || '0')
      
      const correctButton = screen.getByTestId(`answer-${targetNumber}`)
      
      await act(async () => {
        fireEvent.click(correctButton)
      })
      
      expect(confetti).toHaveBeenCalled()
    })

    it('shows "Triail arís!" on wrong answer', async () => {
      renderWithProviders(<NumberMatch />)
      
      const numberDisplay = screen.getByTestId('number-display')
      const targetNumber = parseInt(numberDisplay.textContent || '0')
      
      // Find a wrong answer button
      const allButtons = screen.getAllByRole('button', { name: /^a /i })
      const wrongButton = allButtons.find(btn => {
        const testId = btn.getAttribute('data-testid')
        return testId && !testId.includes(`answer-${targetNumber}`)
      })
      
      if (wrongButton) {
        await act(async () => {
          fireEvent.click(wrongButton)
        })
        
        expect(screen.getByText(/Triail arís/i)).toBeInTheDocument()
      }
    })

    it('does not fire confetti on wrong answer', async () => {
      renderWithProviders(<NumberMatch />)
      
      const numberDisplay = screen.getByTestId('number-display')
      const targetNumber = parseInt(numberDisplay.textContent || '0')
      
      const allButtons = screen.getAllByRole('button', { name: /^a /i })
      const wrongButton = allButtons.find(btn => {
        const testId = btn.getAttribute('data-testid')
        return testId && !testId.includes(`answer-${targetNumber}`)
      })
      
      if (wrongButton) {
        await act(async () => {
          fireEvent.click(wrongButton)
        })
        
        expect(confetti).not.toHaveBeenCalled()
      }
    })
  })

  describe('Progress tracking', () => {
    it('increments progress after correct answer', async () => {
      renderWithProviders(<NumberMatch />)
      
      const numberDisplay = screen.getByTestId('number-display')
      const targetNumber = parseInt(numberDisplay.textContent || '0')
      
      const correctButton = screen.getByTestId(`answer-${targetNumber}`)
      
      await act(async () => {
        fireEvent.click(correctButton)
      })
      
      // Progress should now show 1
      const progressIndicator = screen.getByTestId('progress-indicator')
      expect(progressIndicator).toHaveTextContent('1')
    })
  })

  describe('Game completion', () => {
    it('shows victory screen after 5 correct answers', async () => {
      renderWithProviders(<NumberMatch />)
      
      // Answer 5 questions correctly
      for (let i = 0; i < 5; i++) {
        const numberDisplay = screen.getByTestId('number-display')
        const targetNumber = parseInt(numberDisplay.textContent || '0')
        
        const correctButton = screen.getByTestId(`answer-${targetNumber}`)
        
        await act(async () => {
          fireEvent.click(correctButton)
        })
        
        // Advance timers to handle the transition
        await act(async () => {
          vi.advanceTimersByTime(1500)
        })
      }
      
      // Should show victory screen
      expect(screen.getByText(/Comhghairdeas/i)).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has accessible buttons', () => {
      renderWithProviders(<NumberMatch />)
      
      const buttons = screen.getAllByRole('button', { name: /^a /i })
      buttons.forEach(button => {
        expect(button).toBeVisible()
      })
    })
  })
})
