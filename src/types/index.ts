// Core game types

export interface Planet {
  id: string;
  name: string;
  nameIrish: string;
  description: string;
  color: string;
  icon: string;
  unlocked: boolean;
  starsEarned: number;
  starsTotal: number;
  miniGames: MiniGame[];
}

export interface MiniGame {
  id: string;
  name: string;
  nameIrish: string;
  description: string;
  difficulty: 'éasca' | 'meánach' | 'deacair';
  starsEarned: number;
  maxStars: number;
  type: GameType;
}

export type GameType = 
  | 'counting'
  | 'number-match'
  | 'addition'
  | 'subtraction'
  | 'letter-match'
  | 'spelling'
  | 'color-match'
  | 'color-paint'
  | 'animal-match'
  | 'animal-quiz'
  | 'word-match';

export interface GameState {
  currentPlanet: string | null;
  currentGame: string | null;
  totalStars: number;
  unlockedPlanets: string[];
  achievements: Achievement[];
  stickers: Sticker[];
  rocketParts: RocketPart[];
}

export interface Achievement {
  id: string;
  name: string;
  nameIrish: string;
  description: string;
  icon: string;
  unlockedAt: Date | null;
}

export interface Sticker {
  id: string;
  name: string;
  image: string;
  collected: boolean;
}

export interface RocketPart {
  id: string;
  name: string;
  type: 'body' | 'wings' | 'engine' | 'decoration';
  image: string;
  unlocked: boolean;
}

// Audio types
export interface AudioClip {
  id: string;
  word: string;
  audioUrl: string;
  category: 'number' | 'letter' | 'color' | 'animal' | 'word' | 'feedback';
}

// Player progress
export interface PlayerProgress {
  playerName: string;
  totalStars: number;
  planetsCompleted: string[];
  gamesPlayed: number;
  correctAnswers: number;
  lastPlayed: Date;
}
