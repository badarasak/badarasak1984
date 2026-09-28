import { useState, useCallback } from 'react';
import { GameSettings, Language } from './game/types';
import { LanguageProvider } from './i18n/LanguageContext';
import { soundManager } from './sound/soundManager';
import MainMenu from './components/MainMenu';
import GameScreen from './components/GameScreen';
import Dashboard from './components/Dashboard';

export default function App() {
  const [screen, setScreen] = useState<'menu' | 'game' | 'dashboard'>('menu');
  const [settings, setSettings] = useState<GameSettings>({
    mode: 'ai',
    difficulty: 'intermediate',
    language: 'en',
    character: 0,
    soundEnabled: true,
  });

  const setLanguage = useCallback((lang: Language) => {
    setSettings((s) => ({ ...s, language: lang }));
  }, []);

  const toggleSound = useCallback(() => {
    setSettings((s) => {
      const next = !s.soundEnabled;
      soundManager.setEnabled(next);
      if (next) soundManager.playClick();
      return { ...s, soundEnabled: next };
    });
  }, []);

  const startGame = useCallback(() => {
    soundManager.setEnabled(settings.soundEnabled);
    soundManager.playClick();
    setScreen('game');
  }, [settings.soundEnabled]);

  const openDashboard = useCallback(() => {
    soundManager.playClick();
    setScreen('dashboard');
  }, []);

  const backToMenu = useCallback(() => {
    soundManager.playClick();
    setScreen('menu');
  }, []);

  return (
    <LanguageProvider language={settings.language} setLanguage={setLanguage}>
      <div className="app">
        {screen === 'menu' && (
          <MainMenu
            settings={settings}
            setSettings={setSettings}
            onStart={startGame}
            onToggleSound={toggleSound}
            onOpenDashboard={openDashboard}
          />
        )}
        {screen === 'game' && (
          <GameScreen
            settings={settings}
            setSettings={setSettings}
            onBackToMenu={backToMenu}
            onToggleSound={toggleSound}
          />
        )}
        {screen === 'dashboard' && <Dashboard onBack={backToMenu} />}
      </div>
    </LanguageProvider>
  );
}
