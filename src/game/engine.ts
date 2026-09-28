import { GameState, Player, PITS_PER_PLAYER, TOTAL_PITS, INITIAL_SEEDS } from './types';

export function createInitialState(): GameState {
  return {
    board: Array(TOTAL_PITS).fill(INITIAL_SEEDS),
    currentPlayer: 0,
    scores: [0, 0],
    gameOver: false,
    winner: null,
    lastMove: null,
    capturedFromLastMove: [],
  };
}

export function getPlayerPits(player: Player): number[] {
  return Array.from({ length: PITS_PER_PLAYER }, (_, i) => player * PITS_PER_PLAYER + i);
}

export function pitOwner(pit: number): Player {
  return pit < PITS_PER_PLAYER ? 0 : 1;
}

/**
 * Compute all pits that would receive a seed when sowing from `pit`.
 * Does NOT modify any state — pure helper for animation + legality checks.
 */
export function getSowingPath(board: number[], pit: number): number[] {
  const path: number[] = [];
  let seeds = board[pit];
  let current = pit;
  while (seeds > 0) {
    current = (current + 1) % TOTAL_PITS;
    if (current === pit) continue;
    path.push(current);
    seeds--;
  }
  return path;
}

/**
 * Returns the list of legal moves for `player`, respecting the Oware "feed" rule:
 * a move that leaves the opponent with zero seeds is only allowed if no
 * alternative exists.
 */
export function getLegalMoves(state: GameState, player: Player): number[] {
  const myPits = getPlayerPits(player);
  const movesWithSeeds = myPits.filter((p) => state.board[p] > 0);
  if (movesWithSeeds.length === 0) return [];

  const opponent: Player = player === 0 ? 1 : 0;
  const oppPits = getPlayerPits(opponent);
  const oppHasSeeds = oppPits.some((p) => state.board[p] > 0);

  if (!oppHasSeeds) return movesWithSeeds; // opponent already empty — any move is fine

  // Filter to moves that leave the opponent with at least one seed
  const feedingMoves = movesWithSeeds.filter((pit) => {
    const next = makeMove(state, pit);
    return oppPits.some((p) => next.board[p] > 0);
  });

  return feedingMoves.length > 0 ? feedingMoves : movesWithSeeds;
}

/**
 * Apply a full move: sow seeds, resolve captures, switch player, check game-over.
 * Returns a brand-new GameState — does not mutate the input.
 */
export function makeMove(state: GameState, pit: number): GameState {
  const board = [...state.board];
  const player = state.currentPlayer;
  const opponent: Player = player === 0 ? 1 : 0;

  // --- Sow ---
  let seeds = board[pit];
  board[pit] = 0;
  let current = pit;
  while (seeds > 0) {
    current = (current + 1) % TOTAL_PITS;
    if (current === pit) continue; // never sow back into the starting pit
    board[current]++;
    seeds--;
  }

  // --- Capture (chain backwards from the last sown pit) ---
  const captured: number[] = [];
  let cc = current;
  while (pitOwner(cc) === opponent && (board[cc] === 2 || board[cc] === 3)) {
    captured.push(cc);
    cc = (cc - 1 + TOTAL_PITS) % TOTAL_PITS;
    if (cc === pit || pitOwner(cc) === player) break;
  }

  const scores: [number, number] = [...state.scores] as [number, number];
  for (const c of captured) {
    scores[player] += board[c];
    board[c] = 0;
  }

  // --- Game-over check ---
  const oppPits = getPlayerPits(opponent);
  const oppHasSeeds = oppPits.some((p) => board[p] > 0);

  let gameOver = false;
  let winner: Player | null | -1 = null;

  if (!oppHasSeeds) {
    gameOver = true;
    // remaining seeds on the board go to their owners
    for (let i = 0; i < TOTAL_PITS; i++) {
      scores[pitOwner(i)] += board[i];
      board[i] = 0;
    }
    if (scores[0] > scores[1]) winner = 0;
    else if (scores[1] > scores[0]) winner = 1;
    else winner = -1;
  }

  return {
    board,
    currentPlayer: opponent,
    scores,
    gameOver,
    winner,
    lastMove: pit,
    capturedFromLastMove: captured,
  };
}
