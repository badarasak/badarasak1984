export type Player = 0 | 1;
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type GameMode = 'ai' | 'human';
export type Language = 'en' | 'yo';

export interface GameState {
  board: number[];           // 12 pits — indices 0-5 = player 0 (bottom), 6-11 = player 1 (top)
  currentPlayer: Player;
  scores: [number, number];  // captured seeds for each player
  gameOver: boolean;
  winner: Player | null | -1;  // -1 = draw
  lastMove: number | null;
  capturedFromLastMove: number[];
}

export interface GameSettings {
  mode: GameMode;
  difficulty: Difficulty;
  language: Language;
  character: number;
  soundEnabled: boolean;
}

export interface Character {
  id: number;
  nameEn: string;
  nameYo: string;
  emoji: string;
}

export const PITS_PER_PLAYER = 6;
export const TOTAL_PITS = 12;
export const INITIAL_SEEDS = 4;

export const CHARACTERS: Character[] = [
  { id: 0, nameEn: 'Bàbá (Father)',     nameYo: 'Bàbá',     emoji: '👨🏾' },
  { id: 1, nameEn: 'Ìyá (Mother)',      nameYo: 'Ìyá',      emoji: '👩🏾' },
  { id: 2, nameEn: 'Ọdẹ (Hunter)',     nameYo: 'Ọdẹ',      emoji: '🏹' },
  { id: 3, nameEn: 'Àgbà (Elder)',      nameYo: 'Àgbà',     emoji: '🧓🏾' },
];
