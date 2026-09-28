import { useState, useMemo } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { loadStats, clearStats, GameRecord } from '../game/stats';
import { Difficulty, CHARACTERS } from '../game/types';
import { soundManager } from '../sound/soundManager';

interface Props {
  onBack: () => void;
}

export default function Dashboard({ onBack }: Props) {
  const { t, language } = useLanguage();
  const [records, setRecords] = useState<GameRecord[]>(() => loadStats());

  const stats = useMemo(() => {
    const total = records.length;
    const wins = records.filter((r) => r.result === 'win').length;
    const losses = records.filter((r) => r.result === 'loss').length;
    const draws = records.filter((r) => r.result === 'draw').length;
    const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;

    let currentStreak = 0;
    for (const r of records) {
      if (r.result === 'win') currentStreak++;
      else break;
    }

    let bestStreak = 0;
    let streak = 0;
    for (const r of records) {
      if (r.result === 'win') {
        streak++;
        bestStreak = Math.max(bestStreak, streak);
      } else {
        streak = 0;
      }
    }

    const byDifficulty: Record<Difficulty, { w: number; l: number; d: number }> = {
      beginner: { w: 0, l: 0, d: 0 },
      intermediate: { w: 0, l: 0, d: 0 },
      advanced: { w: 0, l: 0, d: 0 },
    };
    for (const r of records) {
      if (r.mode === 'ai') {
        if (r.result === 'win') byDifficulty[r.difficulty].w++;
        else if (r.result === 'loss') byDifficulty[r.difficulty].l++;
        else byDifficulty[r.difficulty].d++;
      }
    }

    const charUsage: Record<number, number> = {};
    for (const r of records) {
      charUsage[r.character] = (charUsage[r.character] || 0) + 1;
    }

    return { total, wins, losses, draws, winRate, currentStreak, bestStreak, byDifficulty, charUsage };
  }, [records]);

  const handleClear = () => {
    if (window.confirm(t('confirmClear'))) {
      clearStats();
      setRecords([]);
      soundManager.playClick();
    }
  };

  const handleBack = () => {
    soundManager.playClick();
    onBack();
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString(language === 'yo' ? 'yo-NG' : 'en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="dashboard-screen">
      <div className="dashboard-topbar">
        <button className="icon-btn" onClick={handleBack}>
          ←
        </button>
        <span className="topbar-title">{t('dashboard')}</span>
        <div style={{ width: 40 }} />
      </div>

      <div className="dashboard-content">
        {/* Summary stat cards */}
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">{t('totalGames')}</div>
          </div>
          <div className="stat-card stat-win">
            <div className="stat-value">{stats.wins}</div>
            <div className="stat-label">{t('wins')}</div>
          </div>
          <div className="stat-card stat-loss">
            <div className="stat-value">{stats.losses}</div>
            <div className="stat-label">{t('losses')}</div>
          </div>
          <div className="stat-card stat-draw">
            <div className="stat-value">{stats.draws}</div>
            <div className="stat-label">{t('draws')}</div>
          </div>
          <div className="stat-card stat-rate">
            <div className="stat-value">{stats.winRate}%</div>
            <div className="stat-label">{t('winRate')}</div>
          </div>
        </div>

        {/* Streak cards */}
        <div className="streak-row">
          <div className="streak-card">
            <span className="streak-icon">🔥</span>
            <div className="streak-info">
              <div className="streak-value">{stats.currentStreak}</div>
              <div className="streak-label">{t('currentStreak')}</div>
            </div>
          </div>
          <div className="streak-card">
            <span className="streak-icon">🏆</span>
            <div className="streak-info">
              <div className="streak-value">{stats.bestStreak}</div>
              <div className="streak-label">{t('bestStreak')}</div>
            </div>
          </div>
        </div>

        {/* By difficulty */}
        <div className="dashboard-section">
          <h3 className="dashboard-section-title">{t('byDifficulty')}</h3>
          {(['beginner', 'intermediate', 'advanced'] as Difficulty[]).map((d) => {
            const dd = stats.byDifficulty[d];
            const total = dd.w + dd.l + dd.d;
            const winPct = total > 0 ? (dd.w / total) * 100 : 0;
            return (
              <div key={d} className="difficulty-row">
                <span className="difficulty-name">{t(d)}</span>
                <div className="difficulty-bar">
                  <div className="difficulty-bar-fill" style={{ width: `${winPct}%` }} />
                </div>
                <span className="difficulty-stats">
                  {dd.w}W · {dd.l}L · {dd.d}D
                </span>
              </div>
            );
          })}
        </div>

        {/* Character usage */}
        <div className="dashboard-section">
          <h3 className="dashboard-section-title">{t('characterUsage')}</h3>
          <div className="char-usage-row">
            {CHARACTERS.map((c) => (
              <div key={c.id} className="char-usage-item">
                <span className="char-usage-emoji">{c.emoji}</span>
                <span className="char-usage-count">{stats.charUsage[c.id] || 0}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent games */}
        <div className="dashboard-section">
          <h3 className="dashboard-section-title">{t('recentGames')}</h3>
          {records.length === 0 ? (
            <p className="no-games">{t('noGames')}</p>
          ) : (
            <div className="recent-games-list">
              {records.slice(0, 15).map((r) => (
                <div key={r.id} className={`recent-game ${r.result}`}>
                  <span className="recent-game-icon">
                    {r.result === 'win' ? '✅' : r.result === 'loss' ? '❌' : '🤝'}
                  </span>
                  <div className="recent-game-info">
                    <span className="recent-game-mode">
                      {r.mode === 'ai' ? `🤖 ${t(r.difficulty)}` : `👥 ${t('vsHuman')}`}
                    </span>
                    <span className="recent-game-score">
                      {r.playerScore} – {r.opponentScore}
                    </span>
                  </div>
                  <span className="recent-game-date">{formatDate(r.date)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Clear button */}
        {records.length > 0 && (
          <button className="clear-stats-btn" onClick={handleClear}>
            🗑 {t('clearStats')}
          </button>
        )}
      </div>
    </div>
  );
}
