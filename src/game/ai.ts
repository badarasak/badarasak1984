import { GameState, Player, Difficulty } from './types';
import { getLegalMoves, makeMove, getPlayerPits } from './engine';

export function getAIMove(state: GameState, difficulty: Difficulty): number {
  const moves = getLegalMoves(state, state.currentPlayer);
  if (moves.length === 0) return -1;
  if (moves.length === 1) return moves[0];

  switch (difficulty) {
    case 'beginner':
      // mostly random, occasionally greedy — forgiving for new players
      if (Math.random() < 0.25) {
        return greedyMove(state, moves);
      }
      return moves[Math.floor(Math.random() * moves.length)];

    case 'intermediate':
      return minimax(state, 4, -Infinity, Infinity, state.currentPlayer).move!;

    case 'advanced':
      return minimax(state, 6, -Infinity, Infinity, state.currentPlayer).move!;
  }
}

function greedyMove(state: GameState, moves: number[]): number {
  let best = moves[0];
  let bestScore = -Infinity;
  for (const m of moves) {
    const next = makeMove(state, m);
    const s = evaluate(next, state.currentPlayer);
    if (s > bestScore) {
      bestScore = s;
      best = m;
    }
  }
  return best;
}

function evaluate(state: GameState, aiPlayer: Player): number {
  const opponent: Player = aiPlayer === 0 ? 1 : 0;

  if (state.gameOver) {
    if (state.winner === aiPlayer) return 10000;
    if (state.winner === opponent) return -10000;
    return 0;
  }

  const scoreDiff = state.scores[aiPlayer] - state.scores[opponent];

  const myPits = getPlayerPits(aiPlayer);
  const oppPits = getPlayerPits(opponent);
  const mySeeds = myPits.reduce((s, p) => s + state.board[p], 0);
  const oppSeeds = oppPits.reduce((s, p) => s + state.board[p], 0);
  const myMoves = myPits.filter((p) => state.board[p] > 0).length;
  const oppMoves = oppPits.filter((p) => state.board[p] > 0).length;

  // penalise very large piles (vulnerable to a big capture)
  let risk = 0;
  for (const p of myPits) {
    if (state.board[p] >= 12) risk -= 3;
  }

  return scoreDiff * 10 + (mySeeds - oppSeeds) * 0.5 + (myMoves - oppMoves) * 2 + risk;
}

interface MMResult {
  score: number;
  move?: number;
}

function minimax(
  state: GameState,
  depth: number,
  alpha: number,
  beta: number,
  aiPlayer: Player,
): MMResult {
  if (state.gameOver || depth === 0) {
    return { score: evaluate(state, aiPlayer) };
  }

  const moves = getLegalMoves(state, state.currentPlayer);
  if (moves.length === 0) {
    return { score: evaluate(state, aiPlayer) };
  }

  let bestMove = moves[0];

  if (state.currentPlayer === aiPlayer) {
    let maxScore = -Infinity;
    for (const move of moves) {
      const next = makeMove(state, move);
      const result = minimax(next, depth - 1, alpha, beta, aiPlayer);
      if (result.score > maxScore) {
        maxScore = result.score;
        bestMove = move;
      }
      alpha = Math.max(alpha, maxScore);
      if (beta <= alpha) break;
    }
    return { score: maxScore, move: bestMove };
  } else {
    let minScore = Infinity;
    for (const move of moves) {
      const next = makeMove(state, move);
      const result = minimax(next, depth - 1, alpha, beta, aiPlayer);
      if (result.score < minScore) {
        minScore = result.score;
        bestMove = move;
      }
      beta = Math.min(beta, minScore);
      if (beta <= alpha) break;
    }
    return { score: minScore, move: bestMove };
  }
}
