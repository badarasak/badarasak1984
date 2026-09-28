import { useState, useRef, useCallback } from 'react';
import { GameState, Player, GameMode, Difficulty } from '../game/types';
import { createInitialState, getLegalMoves, makeMove, pitOwner } from '../game/engine';
import { getAIMove } from '../game/ai';
import { soundManager } from '../sound/soundManager';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface Options {
  mode: GameMode;
  difficulty: Difficulty;
  soundEnabled: boolean;
}

export function useAyoGame({ mode, difficulty, soundEnabled }: Options) {
  const [state, setState] = useState<GameState>(createInitialState);
  const [animating, setAnimating] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);
  const [highlightPits, setHighlightPits] = useState<number[]>([]);

  const animatingRef = useRef(false);
  const soundRef = useRef(soundEnabled);
  soundRef.current = soundEnabled;

  const performMove = useCallback(
    async (currentState: GameState, pit: number) => {
      if (animatingRef.current) return;
      animatingRef.current = true;
      setAnimating(true);

      const finalState = makeMove(currentState, pit);

      // --- animate sowing one seed at a time ---
      let board = [...currentState.board];
      const seeds = board[pit];
      board[pit] = 0;

      setState({ ...currentState, board, lastMove: pit, capturedFromLastMove: [] });
      await delay(150);

      let current = pit;
      for (let i = 0; i < seeds; i++) {
        current = (current + 1) % 12;
        if (current === pit) current = (current + 1) % 12;
        board = [...board];
        board[current]++;
        setState({ ...currentState, board, lastMove: pit, capturedFromLastMove: [] });
        if (soundRef.current) soundManager.playSeedDrop();
        await delay(90);
      }

      // --- highlight + sound for captures ---
      if (finalState.capturedFromLastMove.length > 0) {
        setHighlightPits(finalState.capturedFromLastMove);
        if (soundRef.current) soundManager.playCapture();
        await delay(500);
      }

      // --- commit final state ---
      setState(finalState);
      setHighlightPits([]);
      animatingRef.current = false;
      setAnimating(false);

      if (finalState.gameOver && soundRef.current) {
        soundManager.playWin();
      }

      // --- trigger AI if it's the computer's turn ---
      if (mode === 'ai' && !finalState.gameOver && finalState.currentPlayer === 1) {
        setAiThinking(true);
        await delay(650);
        const aiMove = getAIMove(finalState, difficulty);
        if (aiMove >= 0) {
          await performMove(finalState, aiMove);
        }
        setAiThinking(false);
      }
    },
    [mode, difficulty],
  );

  const handlePitClick = useCallback(
    (pit: number) => {
      if (animatingRef.current || state.gameOver) return;
      if (mode === 'ai' && state.currentPlayer === 1) return;

      const legal = getLegalMoves(state, state.currentPlayer);
      if (!legal.includes(pit)) return;

      performMove(state, pit);
    },
    [state, mode, performMove],
  );

  const reset = useCallback(() => {
    animatingRef.current = false;
    setState(createInitialState());
    setAnimating(false);
    setAiThinking(false);
    setHighlightPits([]);
  }, []);

  return { state, animating, aiThinking, highlightPits, handlePitClick, reset };
}
