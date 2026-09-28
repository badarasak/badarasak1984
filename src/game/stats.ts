import { GameMode, Difficulty } from './types';

export interface GameRecord {
  id: string;
  date: number;
  mode: GameMode;
  difficulty: Difficulty;
  character: number;
  result: 'win' | 'loss' | 'draw';
  playerScore: number;
  opponentScore: number;
}

const STORAGE_KEY = 'ayo-game-stats';

export function loadStats(): GameRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as GameRecord[]) : [];
  } catch {
    return [];
  }
}

export function saveGame(record: GameRecord): void {
  const stats = loadStats();
  stats.unshift(record);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats.slice(0, 100)));
}

export function clearStats(): void {
  localStorage.removeItem(STORAGE_KEY);
}
