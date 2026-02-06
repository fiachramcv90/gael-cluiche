import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { GameProvider, useGame } from './GameContext';
import { PLAYER_NAME_KEY } from '../utils/playerName';

// Test component to access context
function TestComponent() {
  const { state, setPlayerName } = useGame();
  return (
    <div>
      <span data-testid="player-name">{state.playerName ?? 'no-name'}</span>
      <button onClick={() => setPlayerName('Aoife')}>Set Name</button>
    </div>
  );
}

describe('GameContext - Player Name', () => {
  beforeEach(() => {
    vi.mocked(localStorage.getItem).mockReset();
    vi.mocked(localStorage.setItem).mockReset();
  });

  it('loads player name from localStorage on init', async () => {
    vi.mocked(localStorage.getItem).mockImplementation((key) => {
      if (key === PLAYER_NAME_KEY) return 'Ciarán';
      return null;
    });

    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('player-name')).toHaveTextContent('Ciarán');
    });
  });

  it('returns null when no name stored', async () => {
    vi.mocked(localStorage.getItem).mockReturnValue(null);

    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );

    // Initially null (no-name)
    expect(screen.getByTestId('player-name')).toHaveTextContent('no-name');
  });

  it('saves player name to localStorage when set', async () => {
    vi.mocked(localStorage.getItem).mockReturnValue(null);

    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );

    const button = screen.getByText('Set Name');
    await act(async () => {
      button.click();
    });

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith(PLAYER_NAME_KEY, 'Aoife');
    });
  });

  it('exposes hasPlayerName helper', async () => {
    vi.mocked(localStorage.getItem).mockImplementation((key) => {
      if (key === PLAYER_NAME_KEY) return 'Seán';
      return null;
    });

    function HasNameTest() {
      const { hasPlayerName } = useGame();
      return <span data-testid="has-name">{hasPlayerName ? 'yes' : 'no'}</span>;
    }

    render(
      <GameProvider>
        <HasNameTest />
      </GameProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('has-name')).toHaveTextContent('yes');
    });
  });
});
