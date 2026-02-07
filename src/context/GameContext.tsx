/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer, useEffect, useCallback, type ReactNode } from 'react';
import type { GameState, Achievement, Sticker, RocketPart } from '../types';
import { isPlanetUnlocked, planets } from '../data/planets';
import { getPlayerName, setPlayerName as savePlayerName } from '../utils/playerName';

// Extended state with player name
interface ExtendedGameState extends GameState {
  playerName: string | null;
}

// Initial state
const initialState: ExtendedGameState = {
  currentPlanet: null,
  currentGame: null,
  totalStars: 0,
  gameStars: {}, // Stars earned per game, keyed by gameId
  unlockedPlanets: ['numbers'], // First planet always unlocked
  achievements: [],
  stickers: [],
  rocketParts: [],
  playerName: null,
};

// Actions
type GameAction =
  | { type: 'SET_CURRENT_PLANET'; payload: string | null }
  | { type: 'SET_CURRENT_GAME'; payload: string | null }
  | { type: 'ADD_STARS'; payload: { gameId: string; stars: number } }
  | { type: 'UNLOCK_PLANET'; payload: string }
  | { type: 'ADD_ACHIEVEMENT'; payload: Achievement }
  | { type: 'COLLECT_STICKER'; payload: Sticker }
  | { type: 'UNLOCK_ROCKET_PART'; payload: RocketPart }
  | { type: 'RESET_GAME' }
  | { type: 'LOAD_SAVED_STATE'; payload: GameState }
  | { type: 'SET_PLAYER_NAME'; payload: string };

// Reducer
function gameReducer(state: ExtendedGameState, action: GameAction): ExtendedGameState {
  switch (action.type) {
    case 'SET_CURRENT_PLANET':
      return { ...state, currentPlanet: action.payload };
    
    case 'SET_CURRENT_GAME':
      return { ...state, currentGame: action.payload };
    
    case 'ADD_STARS': {
      const { gameId, stars } = action.payload;
      
      // Normalize incoming stars to a finite, non-negative integer
      const normalizedStars = Number.isFinite(stars) ? Math.max(0, Math.floor(stars)) : 0;
      
      // Safely access current state values (handle old localStorage without gameStars)
      const currentGameStars = Math.max(0, Math.floor(state.gameStars?.[gameId] ?? 0));
      const safeTotalStars = Math.max(0, Math.floor(state.totalStars ?? 0));
      
      // Only add the difference if new score is higher (don't penalize replays)
      const starsToAdd = Math.max(0, normalizedStars - currentGameStars);
      const newTotal = safeTotalStars + starsToAdd;
      
      // Update per-game stars (keep the best score)
      const newGameStars = {
        ...(state.gameStars ?? {}),
        [gameId]: Math.max(currentGameStars, normalizedStars),
      };
      
      // Check for newly unlocked planets (derive IDs from data to stay in sync)
      const newUnlocked = [...state.unlockedPlanets];
      const planetIds = planets.map(p => p.id);
      
      planetIds.forEach(id => {
        if (!newUnlocked.includes(id) && isPlanetUnlocked(id, newTotal)) {
          newUnlocked.push(id);
        }
      });
      
      return {
        ...state,
        totalStars: newTotal,
        gameStars: newGameStars,
        unlockedPlanets: newUnlocked,
      };
    }
    
    case 'UNLOCK_PLANET':
      if (state.unlockedPlanets.includes(action.payload)) {
        return state;
      }
      return {
        ...state,
        unlockedPlanets: [...state.unlockedPlanets, action.payload],
      };
    
    case 'ADD_ACHIEVEMENT':
      return {
        ...state,
        achievements: [...state.achievements, action.payload],
      };
    
    case 'COLLECT_STICKER':
      return {
        ...state,
        stickers: [...state.stickers, { ...action.payload, collected: true }],
      };
    
    case 'UNLOCK_ROCKET_PART':
      return {
        ...state,
        rocketParts: [...state.rocketParts, { ...action.payload, unlocked: true }],
      };
    
    case 'RESET_GAME':
      return { ...initialState, playerName: state.playerName };
    
    case 'LOAD_SAVED_STATE':
      // Merge with initialState to ensure all fields exist (handles old saves missing gameStars)
      return { ...initialState, ...state, ...action.payload, gameStars: { ...action.payload.gameStars } };
    
    case 'SET_PLAYER_NAME':
      return { ...state, playerName: action.payload };
    
    default:
      return state;
  }
}

// Context
interface GameContextType {
  state: ExtendedGameState;
  dispatch: React.Dispatch<GameAction>;
  setCurrentPlanet: (planet: string | null) => void;
  setCurrentGame: (game: string | null) => void;
  addStars: (gameId: string, stars: number) => void;
  getGameStars: (gameId: string) => number;
  getPlanetStars: (planetId: string) => number;
  isPlanetAvailable: (planetId: string) => boolean;
  setPlayerName: (name: string) => void;
}

const GameContext = createContext<GameContextType | null>(null);

// Storage key
const STORAGE_KEY = 'gael-cluiche-save';

// Provider
export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  // Load saved state and player name on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'LOAD_SAVED_STATE', payload: parsed });
      } catch (e) {
        console.error('Failed to load saved game:', e);
      }
    }
    
    // Load player name separately
    const name = getPlayerName();
    if (name) {
      dispatch({ type: 'SET_PLAYER_NAME', payload: name });
    }
  }, []);
  
  // Save state on change (excluding playerName which has its own storage)
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { playerName: _playerName, ...stateToSave } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [state]);
  
  // Helper functions
  const setCurrentPlanet = (planet: string | null) => {
    dispatch({ type: 'SET_CURRENT_PLANET', payload: planet });
  };
  
  const setCurrentGame = (game: string | null) => {
    dispatch({ type: 'SET_CURRENT_GAME', payload: game });
  };
  
  const addStars = (gameId: string, stars: number) => {
    dispatch({ type: 'ADD_STARS', payload: { gameId, stars } });
  };
  
  const getGameStars = useCallback((gameId: string): number => {
    return state.gameStars?.[gameId] ?? 0;
  }, [state.gameStars]);
  
  const getPlanetStars = useCallback((planetId: string): number => {
    const planet = planets.find(p => p.id === planetId);
    if (!planet) return 0;
    return planet.miniGames.reduce((total, game) => {
      return total + (state.gameStars?.[game.id] ?? 0);
    }, 0);
  }, [state.gameStars]);
  
  const isPlanetAvailable = (planetId: string) => {
    return state.unlockedPlanets.includes(planetId);
  };
  
  const setPlayerName = (name: string) => {
    savePlayerName(name);
    dispatch({ type: 'SET_PLAYER_NAME', payload: name });
  };
  
  return (
    <GameContext.Provider value={{
      state,
      dispatch,
      setCurrentPlanet,
      setCurrentGame,
      addStars,
      getGameStars,
      getPlanetStars,
      isPlanetAvailable,
      setPlayerName,
    }}>
      {children}
    </GameContext.Provider>
  );
}

// Hook
export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
