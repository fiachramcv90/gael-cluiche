import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { StarMap } from './StarMap';
import { GameProvider } from '../context/GameContext';
import { PLAYER_NAME_KEY } from '../utils/playerName';

// Mock framer-motion
vi.mock('framer-motion', () => {
  const createMotionComponent = (tag: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return ({ children, whileHover, whileTap, animate, initial, transition, exit, ...domProps }: Record<string, unknown>) => {
      const Tag = tag as keyof JSX.IntrinsicElements;
      return <Tag {...domProps}>{children as React.ReactNode}</Tag>;
    };
  };
  
  return {
    motion: {
      div: createMotionComponent('div'),
      h1: createMotionComponent('h1'),
      span: createMotionComponent('span'),
      button: createMotionComponent('button'),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  };
});

function renderStarMap(playerName: string | null = 'Aoife') {
  vi.mocked(localStorage.getItem).mockImplementation((key) => {
    if (key === PLAYER_NAME_KEY) return playerName;
    return null;
  });

  return render(
    <GameProvider>
      <MemoryRouter>
        <StarMap />
      </MemoryRouter>
    </GameProvider>
  );
}

describe('StarMap', () => {
  beforeEach(() => {
    vi.mocked(localStorage.getItem).mockReset();
    vi.mocked(localStorage.setItem).mockReset();
  });

  it('displays the player name in the greeting', async () => {
    renderStarMap('Aoife');

    // Wait for the name to load from localStorage
    await vi.waitFor(() => {
      expect(screen.getByText(/Dia duit, a Aoife!/i)).toBeInTheDocument();
    });
  });

  it('displays different player names correctly', async () => {
    renderStarMap('Seán');

    await vi.waitFor(() => {
      expect(screen.getByText(/Dia duit, a Seán!/i)).toBeInTheDocument();
    });
  });

  it('displays the secondary greeting message', () => {
    renderStarMap('Test');

    expect(screen.getByText(/Roghnaigh pláinéad!/i)).toBeInTheDocument();
  });

  it('displays the page title', () => {
    renderStarMap('Test');

    expect(screen.getByText(/Turas na Réalta/i)).toBeInTheDocument();
  });
});
