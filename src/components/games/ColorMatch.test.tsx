import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { ColorMatch } from './ColorMatch'

// Mock framer-motion more completely
vi.mock('framer-motion', () => {
  const createMotionComponent = (tag: string) => {
    return ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      // Filter out framer-motion specific props
      const domProps: Record<string, unknown> = {}
      const frameMprops = ['initial', 'animate', 'exit', 'transition', 'variants', 'whileHover', 'whileTap', 'whileInView']
      Object.entries(props).forEach(([key, value]) => {
        if (!frameMprops.includes(key)) {
          domProps[key] = value
        }
      })
      const Tag = tag as keyof JSX.IntrinsicElements
      // @ts-expect-error - dynamic tag
      return <Tag {...domProps}>{children}</Tag>
    }
  }
  
  return {
    motion: {
      div: createMotionComponent('div'),
      button: createMotionComponent('button'),
      span: createMotionComponent('span'),
      h2: createMotionComponent('h2'),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  }
})

// Mock DinoCharacter
vi.mock('../game/DinoCharacter', () => ({
  DinoCharacter: ({ mood }: { mood?: string }) => (
    <div data-testid="dino-character" data-mood={mood}>
      <span role="img" aria-label="Dino the dinosaur">🦕</span>
    </div>
  ),
}))

// Mock Button to be simpler
vi.mock('../ui/Button', () => ({
  Button: ({ children, onClick, ...props }: React.PropsWithChildren<{ onClick?: () => void }>) => (
    <button onClick={onClick} {...props}>{children}</button>
  ),
}))

// Helper to find correct button by exact text match
function findCorrectButton(colorId: string): HTMLElement {
  const buttons = screen.getAllByRole('button')
  const button = buttons.find(btn => btn.textContent === colorId)
  if (!button) {
    throw new Error(`Button with exact text "${colorId}" not found`)
  }
  return button
}

describe('ColorMatch', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  
  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  describe('Initial render', () => {
    it('displays progress indicator starting at 0 / 5', () => {
      render(<ColorMatch />)
      expect(screen.getByText(/0 \/ 5/)).toBeInTheDocument()
      // Star emoji is part of the text node
      expect(screen.getByText(/0 \/ 5 ⭐/)).toBeInTheDocument()
    })

    it('displays a color swatch', () => {
      render(<ColorMatch />)
      expect(screen.getByTestId('color-swatch')).toBeInTheDocument()
    })

    it('displays 4 answer buttons with Irish color words', () => {
      render(<ColorMatch />)
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBe(4)
    })

    it('displays the dinosaur character', () => {
      render(<ColorMatch />)
      expect(screen.getByRole('img', { name: /dino/i })).toBeInTheDocument()
    })
  })

  describe('Gameplay - correct answer', () => {
    it('shows "Maith thú!" when correct answer is selected', async () => {
      render(<ColorMatch />)
      
      const swatch = screen.getByTestId('color-swatch')
      const swatchColor = swatch.getAttribute('data-color-id')!
      
      const correctButton = findCorrectButton(swatchColor)
      fireEvent.click(correctButton)
      
      expect(screen.getByText(/maith thú/i)).toBeInTheDocument()
    })

    it('increments progress after correct answer', async () => {
      render(<ColorMatch />)
      
      const swatch = screen.getByTestId('color-swatch')
      const swatchColor = swatch.getAttribute('data-color-id')!
      
      const correctButton = findCorrectButton(swatchColor)
      fireEvent.click(correctButton)
      
      expect(screen.getByText(/1 \/ 5/)).toBeInTheDocument()
    })
  })

  describe('Gameplay - wrong answer', () => {
    it('shows "Triail arís!" when wrong answer is selected', async () => {
      render(<ColorMatch />)
      
      const swatch = screen.getByTestId('color-swatch')
      const swatchColor = swatch.getAttribute('data-color-id')!
      
      const buttons = screen.getAllByRole('button')
      const wrongButton = buttons.find(btn => btn.textContent !== swatchColor)
      
      expect(wrongButton).toBeDefined()
      fireEvent.click(wrongButton!)
      
      expect(screen.getByText(/triail arís/i)).toBeInTheDocument()
    })

    it('does not increment progress after wrong answer', async () => {
      render(<ColorMatch />)
      
      const swatch = screen.getByTestId('color-swatch')
      const swatchColor = swatch.getAttribute('data-color-id')!
      
      const buttons = screen.getAllByRole('button')
      const wrongButton = buttons.find(btn => btn.textContent !== swatchColor)
      
      expect(wrongButton).toBeDefined()
      fireEvent.click(wrongButton!)
      
      expect(screen.getByText(/0 \/ 5/)).toBeInTheDocument()
    })
  })

  describe('Victory screen', () => {
    it('shows victory screen with 3 stars after 5 correct answers', async () => {
      render(<ColorMatch />)
      
      // Answer 5 questions correctly
      for (let i = 0; i < 5; i++) {
        const swatch = screen.getByTestId('color-swatch')
        const swatchColor = swatch.getAttribute('data-color-id')!
        const correctButton = findCorrectButton(swatchColor)
        fireEvent.click(correctButton)
        
        if (i < 4) {
          // Advance timer to trigger next round
          await act(async () => {
            vi.advanceTimersByTime(1600)
          })
        }
      }
      
      expect(screen.getByText('⭐⭐⭐')).toBeInTheDocument()
    })

    it('shows "Imir arís!" (Play again) button on victory', async () => {
      render(<ColorMatch />)
      
      for (let i = 0; i < 5; i++) {
        const swatch = screen.getByTestId('color-swatch')
        const swatchColor = swatch.getAttribute('data-color-id')!
        const correctButton = findCorrectButton(swatchColor)
        fireEvent.click(correctButton)
        
        if (i < 4) {
          await act(async () => {
            vi.advanceTimersByTime(1600)
          })
        }
      }
      
      expect(screen.getByRole('button', { name: /imir arís/i })).toBeInTheDocument()
    })

    it('resets game when play again is clicked', async () => {
      render(<ColorMatch />)
      
      for (let i = 0; i < 5; i++) {
        const swatch = screen.getByTestId('color-swatch')
        const swatchColor = swatch.getAttribute('data-color-id')!
        const correctButton = findCorrectButton(swatchColor)
        fireEvent.click(correctButton)
        
        if (i < 4) {
          await act(async () => {
            vi.advanceTimersByTime(1600)
          })
        }
      }
      
      const playAgainButton = screen.getByRole('button', { name: /imir arís/i })
      fireEvent.click(playAgainButton)
      
      expect(screen.getByText(/0 \/ 5/)).toBeInTheDocument()
    })
  })
})
