import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { GameState, Achievement, Sticker, RocketPart } from '../types';
import { isPlanetUnlocked } from '../data/planets';
import { getPlayerName, setPlayerName as savePlayerName, PLAYER_NAME_KEY } from '../utils/playerName';

// Initial state
const initialState: GameState = {
  currentPlanet: null,
  currentGame: null,
  totalStars: 0,
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
  | { type: 'ADD_STARS'; payload: number }
  | { type: 'UNLOCK_PLANET'; payload: string }
  | { type: 'ADD_ACHIEVEMENT'; payload: Achievement }
  | { type: 'COLLECT_STICKER'; payload: Sticker }
  | { type: 'UNLOCK_ROCKET_PART'; payload: RocketPart }
  | { type: 'RESET_GAME' }
  | { type: 'LOAD_SAVED_STATE'; payload: GameState }
  | { type: 'SET_PLAYER_NAME'; payload: string };

// Reducer
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_CURRENT_PLANET':
      return { ...state, currentPlanet: action.payload };
    
    case 'SET_CURRENT_GAME':
      return { ...state, currentGame: action.payload };
    
    case 'ADD_STARS': {
      const newTotal = state.totalStars + action.payload;
      // Check for newly unlocked planets
      const newUnlocked = [...state.unlockedPlanets];
      const planetIds = ['numbers', 'letters', 'colors', 'animals', 'words'];
      
      planetIds.forEach(id => {
        if (!newUnlocked.includes(id) && isPlanetUnlocked(id, newTotal)) {
          newUnlocked.push(id);
        }
      });
      
      return {
        ...state,
        totalStars: newTotal,
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
      return initialState;
    
    case 'LOAD_SAVED_STATE':
      return action.payload;
    
    case 'SET_PLAYER_NAME':
      return { ...state, playerName: action.payload };
    
    default:
      return state;
  }
}

// Context
interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  setCurrentPlanet: (planet: string | null) => void;
  setCurrentGame: (game: string | null) => void;
  addStars: (stars: number) => void;
  isPlanetAvailable: (planetId: string) => boolean;
  setPlayerName: (name: string) => void;
  hasPlayerName: boolean;
}

const GameContext = createContext<GameContextType | null>(null);

// Storage key
const STORAGE_KEY = 'gael-cluiche-save';

// Provider
export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  // Load saved state on mount
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
    
    // Load player name separately (stored in its own key)
    const playerName = getPlayerName();
    if (playerName) {
      dispatch({ type: 'SET_PLAYER_NAME', payload: playerName });
    }
  }, []);
  
  // Save state on change (excluding playerName which has its own storage)
  useEffect(() => {
    const { playerName: _, ...stateToSave } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [state]);
  
  // Helper functions
  const setCurrentPlanet = (planet: string | null) => {
    dispatch({ type: 'SET_CURRENT_PLANET', payload: planet });
  };
  
  const setCurrentGame = (game: string | null) => {
    dispatch({ type: 'SET_CURRENT_GAME', payload: game });
  };
  
  const addStars = (stars: number) => {
    dispatch({ type: 'ADD_STARS', payload: stars });
  };
  
  const isPlanetAvailable = (planetId: string) => {
    return state.unlockedPlanets.includes(planetId);
  };
  
  const setPlayerName = (name: string) => {
    savePlayerName(name); // Save to localStorage
    dispatch({ type: 'SET_PLAYER_NAME', payload: name });
  };
  
  const hasPlayerName = state.playerName !== null && state.playerName.length > 0;
  
  return (
    <GameContext.Provider value={{
      state,
      dispatch,
      setCurrentPlanet,
      setCurrentGame,
      addStars,
      isPlanetAvailable,
      setPlayerName,
      hasPlayerName,
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
