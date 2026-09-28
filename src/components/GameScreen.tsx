import { GameSettings } from '../game/types';
import { useLanguage } from '../i18n/LanguageContext';
import { useAyoGame } from '../hooks/useAyoGame';
import { getLegalMoves, pitOwner } from '../game/engine';
import { soundManager } from '../sound/soundManager';
import Board from './Board';
import { CHARACTERS } from '../game/types';

interface Props {
  settings: GameSettings;
  setSettings: React.Dispatch<React.SetStateAction<GameSettings>>;
  onBackToMenu: () => void;
  onToggleSound: () => void;
}

export default function GameScreen({ settings, onBackToMenu, onToggleSound }: Props) {
  const { t, language } = useLanguage();
  const { state, animating, aiThinking, highlightPits, handlePitClick, reset } = useAyoGame({
    mode: settings.mode,
    difficulty: settings.difficulty,
    soundEnabled: settings.soundEnabled,
  });

  const isPlayerTurn =
    !state.gameOver &&
    !animating &&
    (settings.mode === 'human' || state.currentPlayer === 0);

  const clickablePits = isPlayerTurn ? getLegalMoves(state, state.currentPlayer) : [];

  const myChar = CHARACTERS[settings.character];

  // Determine status text
  let statusText: string;
  if (state.gameOver) {
    statusText = t('gameOver');
  } else if (aiThinking) {
    statusText = t('thinking');
  } else if (settings.mode === 'ai') {
    statusText = state.currentPlayer === 0 ? t('yourTurn') : t('opponentTurn');
  } else {
    statusText = state.currentPlayer === 0 ? t('player1Turn') : t('player2Turn');
  }

  // Winner text
  let winnerText = '';
  if (state.gameOver) {
    if (state.winner === -1) {
      winnerText = t('draw');
    } else if (settings.mode === 'ai') {
      winnerText = state.winner === 0 ? t('youWin') : t('youLose');
    } else {
      winnerText = state.winner === 0 ? t('p1Wins') : t('p2Wins');
    }
  }

  const handlePlayAgain = () => {
    soundManager.playClick();
    reset();
  };

  const handleMenu = () => {
    soundManager.playClick();
    onBackToMenu();
  };

  return (
    <div className="game-screen">
      {/* Top bar */}
      <div className="game-topbar">
        <button className="icon-btn" onClick={handleMenu} title={t('mainMenu')}>
          ←
        </button>
        <div className="topbar-title">{t('title')}</div>
        <button className="icon-btn" onClick={onToggleSound} title={t('sound')}>
          {settings.soundEnabled ? '🔊' : '🔇'}
        </button>
      </div>

      {/* Player 2 (opponent) score */}
      <div className={`player-bar ${state.currentPlayer === 1 && !state.gameOver ? 'active' : ''}`}>
        <div className="player-info">
          <span className="player-emoji">{settings.mode === 'ai' ? '🤖' : '👥'}</span>
          <span className="player-name">
            {settings.mode === 'ai' ? t('opponentTurn').replace("'s turn", '') : t('player2Turn').replace("'s turn", '')}
          </span>
        </div>
        <div className="player-score">
          {state.scores[1]} <span className="score-unit">{t('seeds')}</span>
        </div>
      </div>

      {/* Board */}
      <Board
        state={state}
        onPitClick={handlePitClick}
        highlightPits={highlightPits}
        clickablePits={clickablePits}
        isAnimating={animating}
      />

      {/* Player 1 (you) score */}
      <div className={`player-bar ${state.currentPlayer === 0 && !state.gameOver ? 'active' : ''}`}>
        <div className="player-info">
          <span className="player-emoji">{myChar.emoji}</span>
          <span className="player-name">
            {language === 'yo' ? myChar.nameYo : myChar.nameEn}
          </span>
        </div>
        <div className="player-score">
          {state.scores[0]} <span className="score-unit">{t('seeds')}</span>
        </div>
      </div>

      {/* Status */}
      <div className="status-bar">{statusText}</div>

      {/* Game Over overlay */}
      {state.gameOver && (
        <div className="game-over-overlay">
          <div className="game-over-card">
            <h2 className="game-over-title">{winnerText}</h2>
            <div className="game-over-scores">
              <div className="go-score">
                <span>{myChar.emoji}</span>
                <strong>{state.scores[0]}</strong>
              </div>
              <div className="go-vs">—</div>
              <div className="go-score">
                <span>{settings.mode === 'ai' ? '🤖' : '👥'}</span>
                <strong>{state.scores[1]}</strong>
              </div>
            </div>
            <div className="game-over-buttons">
              <button className="btn-primary" onClick={handlePlayAgain}>
                {t('playAgain')}
              </button>
              <button className="btn-secondary" onClick={handleMenu}>
                {t('mainMenu')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
