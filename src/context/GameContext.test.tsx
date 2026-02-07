import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { GameProvider, useGame } from './GameContext';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    clear: () => { store = {}; },
    removeItem: (key: string) => { delete store[key]; },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('GameContext - Star Tracking', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <GameProvider>{children}</GameProvider>
  );

  it('starts with zero stars for all games', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    
    expect(result.current.getGameStars('counting')).toBe(0);
    expect(result.current.getGameStars('number-match')).toBe(0);
    expect(result.current.state.totalStars).toBe(0);
  });

  it('tracks stars per game when addStars is called', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    
    act(() => {
      result.current.addStars('counting', 3);
    });
    
    expect(result.current.getGameStars('counting')).toBe(3);
    expect(result.current.getGameStars('number-match')).toBe(0);
    expect(result.current.state.totalStars).toBe(3);
  });

  it('accumulates stars from multiple games', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    
    act(() => {
      result.current.addStars('counting', 3);
      result.current.addStars('number-match', 2);
    });
    
    expect(result.current.getGameStars('counting')).toBe(3);
    expect(result.current.getGameStars('number-match')).toBe(2);
    expect(result.current.state.totalStars).toBe(5);
  });

  it('only increases total when improving on a game (replay protection)', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    
    // First play: earn 2 stars
    act(() => {
      result.current.addStars('counting', 2);
    });
    expect(result.current.state.totalStars).toBe(2);
    
    // Replay with worse score: should not reduce
    act(() => {
      result.current.addStars('counting', 1);
    });
    expect(result.current.getGameStars('counting')).toBe(2); // Keeps best
    expect(result.current.state.totalStars).toBe(2); // No change
    
    // Replay with better score: should add difference
    act(() => {
      result.current.addStars('counting', 3);
    });
    expect(result.current.getGameStars('counting')).toBe(3); // New best
    expect(result.current.state.totalStars).toBe(3); // Added 1 more (3-2)
  });

  it('calculates planet stars correctly', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    
    // Numbers planet has: counting, number-match, addition, subtraction
    act(() => {
      result.current.addStars('counting', 3);
      result.current.addStars('number-match', 3);
    });
    
    expect(result.current.getPlanetStars('numbers')).toBe(6);
    expect(result.current.getPlanetStars('letters')).toBe(0);
  });

  it('persists state to localStorage', () => {
    const { result: result1 } = renderHook(() => useGame(), { wrapper });
    
    act(() => {
      result1.current.addStars('counting', 3);
    });
    
    // Check localStorage was updated
    const saved = JSON.parse(localStorageMock.getItem('gael-cluiche-save') || '{}');
    expect(saved.gameStars?.counting).toBe(3);
    expect(saved.totalStars).toBe(3);
  });

  it('unlocks planets based on total stars', () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    
    // Need 6 stars for letters planet
    expect(result.current.isPlanetAvailable('letters')).toBe(false);
    
    act(() => {
      result.current.addStars('counting', 3);
      result.current.addStars('number-match', 3);
    });
    
    expect(result.current.state.totalStars).toBe(6);
    expect(result.current.isPlanetAvailable('letters')).toBe(true);
  });
});
