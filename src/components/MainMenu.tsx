import { GameSettings, Difficulty, GameMode, Language, CHARACTERS } from '../game/types';
import { useLanguage } from '../i18n/LanguageContext';
import { soundManager } from '../sound/soundManager';

interface Props {
  settings: GameSettings;
  setSettings: React.Dispatch<React.SetStateAction<GameSettings>>;
  onStart: () => void;
  onToggleSound: () => void;
  onOpenDashboard: () => void;
}

export default function MainMenu({ settings, setSettings, onStart, onToggleSound, onOpenDashboard }: Props) {
  const { t, language, setLanguage } = useLanguage();

  const setMode = (mode: GameMode) => {
    soundManager.playClick();
    setSettings((s) => ({ ...s, mode }));
  };
  const setDifficulty = (difficulty: Difficulty) => {
    soundManager.playClick();
    setSettings((s) => ({ ...s, difficulty }));
  };
  const setCharacter = (character: number) => {
    soundManager.playClick();
    setSettings((s) => ({ ...s, character }));
  };
  const changeLanguage = (lang: Language) => {
    soundManager.playClick();
    setLanguage(lang);
  };

  return (
    <div className="menu-screen">
      <div className="menu-card">
        <div className="menu-decoration">🪘</div>
        <h1 className="menu-title">{t('title')}</h1>
        <p className="menu-subtitle">{t('subtitle')}</p>

        {/* Language + Sound row */}
        <div className="menu-toggle-row">
          <div className="toggle-group">
            <button
              className={`toggle-btn ${language === 'en' ? 'active' : ''}`}
              onClick={() => changeLanguage('en')}
            >
              EN
            </button>
            <button
              className={`toggle-btn ${language === 'yo' ? 'active' : ''}`}
              onClick={() => changeLanguage('yo')}
            >
              YO
            </button>
          </div>
          <button className="toggle-btn" onClick={onToggleSound}>
            {t('sound')}: {settings.soundEnabled ? '🔊' : '🔇'}
          </button>
        </div>

        {/* Mode selection */}
        <div className="menu-section">
          <label className="menu-label">{t('mode')}</label>
          <div className="option-row">
            <button
              className={`option-btn ${settings.mode === 'ai' ? 'active' : ''}`}
              onClick={() => setMode('ai')}
            >
              🤖 {t('playVsAI')}
            </button>
            <button
              className={`option-btn ${settings.mode === 'human' ? 'active' : ''}`}
              onClick={() => setMode('human')}
            >
              👥 {t('playVsFriend')}
            </button>
          </div>
        </div>

        {/* Difficulty (only for AI) */}
        {settings.mode === 'ai' && (
          <div className="menu-section">
            <label className="menu-label">{t('difficulty')}</label>
            <div className="option-row">
              {(['beginner', 'intermediate', 'advanced'] as Difficulty[]).map((d) => (
                <button
                  key={d}
                  className={`option-btn ${settings.difficulty === d ? 'active' : ''}`}
                  onClick={() => setDifficulty(d)}
                >
                  {t(d)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Character selection */}
        <div className="menu-section">
          <label className="menu-label">{t('selectCharacter')}</label>
          <div className="character-row">
            {CHARACTERS.map((c) => (
              <button
                key={c.id}
                className={`character-btn ${settings.character === c.id ? 'active' : ''}`}
                onClick={() => setCharacter(c.id)}
              >
                <span className="character-emoji">{c.emoji}</span>
                <span className="character-name">
                  {language === 'yo' ? c.nameYo : c.nameEn}
                </span>
              </button>
            ))}
          </div>
        </div>

        <button className="start-btn" onClick={onStart}>
          {t('startGame')} ▶
        </button>
        <button className="dashboard-btn" onClick={onOpenDashboard}>
          📊 {t('dashboard')}
        </button>
      </div>
    </div>
  );
}
