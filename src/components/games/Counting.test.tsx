import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Counting } from './Counting';
import { GameProvider } from '../../context/GameContext';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => {
  // Filter out framer-motion specific props
  const filterMotionProps = (props: Record<string, unknown>) => {
    const motionProps = ['whileHover', 'whileTap', 'initial', 'animate', 'exit', 'transition', 'variants', 'layout'];
    const filtered: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(props)) {
      if (!motionProps.includes(key)) {
        filtered[key] = value;
      }
    }
    return filtered;
  };
  
  return {
    motion: {
      div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...filterMotionProps(props)}>{children}</div>,
      button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...filterMotionProps(props)}>{children}</button>,
      span: ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => <span {...filterMotionProps(props)}>{children}</span>,
      h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => <h2 {...filterMotionProps(props)}>{children}</h2>,
      p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => <p {...filterMotionProps(props)}>{children}</p>,
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

// Test wrapper with providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <GameProvider>
      {children}
    </GameProvider>
  </BrowserRouter>
);

describe('Counting Game', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the game title', () => {
    render(
      <TestWrapper>
        <Counting planetColor="#ff6b6b" onComplete={() => {}} />
      </TestWrapper>
    );
    
    expect(screen.getByText('Comhair na Réaltaí')).toBeInTheDocument();
  });

  it('displays countable objects (stars)', () => {
    render(
      <TestWrapper>
        <Counting planetColor="#ff6b6b" onComplete={() => {}} />
      </TestWrapper>
    );
    
    // Should display a stars container
    const starsContainer = screen.getByTestId('stars-container');
    expect(starsContainer).toBeInTheDocument();
  });

  it('displays 4 answer buttons with Irish number words', () => {
    render(
      <TestWrapper>
        <Counting planetColor="#ff6b6b" onComplete={() => {}} />
      </TestWrapper>
    );
    
    // Should have exactly 4 answer buttons
    const buttons = screen.getAllByRole('button', { name: /^a (haon|dó|trí|ceathair|cúig|sé|seacht|hocht|naoi|deich)$/i });
    expect(buttons.length).toBe(4);
  });

  it('shows "Maith thú!" and progress star on correct answer', async () => {
    render(
      <TestWrapper>
        <Counting planetColor="#ff6b6b" onComplete={() => {}} />
      </TestWrapper>
    );
    
    // Find the correct answer by checking which number matches the star count
    const starsContainer = screen.getByTestId('stars-container');
    const starCount = (starsContainer.textContent?.match(/⭐/g) || []).length;
    
    // Click the button with the correct Irish number
    const correctButton = screen.getByTestId(`answer-${starCount}`);
    fireEvent.click(correctButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Maith thú!/i)).toBeInTheDocument();
    });
  });

  it('shows "Triail arís!" on wrong answer and allows retry', async () => {
    render(
      <TestWrapper>
        <Counting planetColor="#ff6b6b" onComplete={() => {}} />
      </TestWrapper>
    );
    
    // Find the correct answer by counting stars
    const starsContainer = screen.getByTestId('stars-container');
    const starSpans = starsContainer.querySelectorAll('span.absolute');
    const starCount = starSpans.length;
    
    // Get all answer buttons and find one that's NOT the correct answer
    const buttons = screen.getAllByRole('button');
    const wrongButton = buttons.find(btn => !btn.getAttribute('data-testid')?.endsWith(`-${starCount}`));
    
    expect(wrongButton).toBeDefined();
    fireEvent.click(wrongButton!);
    
    await waitFor(() => {
      expect(screen.getByText(/Triail arís!/i)).toBeInTheDocument();
    });
    
    // Buttons should still be visible for retry
    expect(screen.getAllByRole('button').length).toBeGreaterThanOrEqual(4);
  });

  it('shows progress indicator (stars earned)', () => {
    render(
      <TestWrapper>
        <Counting planetColor="#ff6b6b" onComplete={() => {}} />
      </TestWrapper>
    );
    
    // Should show 0/5 progress initially
    expect(screen.getByTestId('progress-indicator')).toBeInTheDocument();
  });

  it('advances to next round after correct answer', async () => {
    render(
      <TestWrapper>
        <Counting planetColor="#ff6b6b" onComplete={() => {}} />
      </TestWrapper>
    );
    
    // Get the initial star count
    const starsContainer = screen.getByTestId('stars-container');
    const initialStarCount = (starsContainer.textContent?.match(/⭐/g) || []).length;
    
    // Click correct answer
    const correctButton = screen.getByTestId(`answer-${initialStarCount}`);
    fireEvent.click(correctButton);
    
    // Wait for next round (star count may be different)
    await waitFor(() => {
      const progressIndicator = screen.getByTestId('progress-indicator');
      expect(progressIndicator).toHaveTextContent('1');
    }, { timeout: 2000 });
  });

  it('calls onComplete with 3 stars after 5 correct answers', async () => {
    const mockOnComplete = vi.fn();
    
    render(
      <TestWrapper>
        <Counting planetColor="#ff6b6b" onComplete={mockOnComplete} />
      </TestWrapper>
    );
    
    // Helper to get star count (only countable stars with data-star attribute)
    const getStarCount = () => {
      const starsContainer = screen.getByTestId('stars-container');
      return starsContainer.querySelectorAll('[data-star="true"]').length;
    };
    
    // Complete 5 rounds
    for (let i = 0; i < 5; i++) {
      // Get the current star count before clicking
      const starCount = getStarCount();
      const correctButton = screen.getByTestId(`answer-${starCount}`);
      fireEvent.click(correctButton);
      
      // Wait for "Maith thú!" feedback
      await waitFor(() => {
        expect(screen.getByText(/Maith thú!/i)).toBeInTheDocument();
      });
      
      if (i < 4) {
        // Wait for feedback to disappear (round reset)
        await waitFor(() => {
          expect(screen.queryByText(/Maith thú!/i)).not.toBeInTheDocument();
        }, { timeout: 2000 });
      }
    }
    
    // Should show victory screen with "Iontach!" text
    await waitFor(() => {
      expect(screen.getByText(/Iontach!/)).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Should call onComplete with 3 stars
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledWith(3);
    }, { timeout: 2000 });
  }, 15000); // 15 second timeout for this long-running integration test

  it('displays stars in a visually scattered layout', () => {
    render(
      <TestWrapper>
        <Counting planetColor="#ff6b6b" onComplete={() => {}} />
      </TestWrapper>
    );
    
    const starsContainer = screen.getByTestId('stars-container');
    // Container should have the scattered/grid layout class
    expect(starsContainer).toHaveClass('stars-layout');
  });

  it('shows DinoCharacter', () => {
    render(
      <TestWrapper>
        <Counting planetColor="#ff6b6b" onComplete={() => {}} />
      </TestWrapper>
    );
    
    // Dino should be visible
    expect(screen.getByLabelText(/dino/i)).toBeInTheDocument();
  });
});
