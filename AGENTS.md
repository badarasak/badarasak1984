# Ayo Ọ̀pẹ̀lẹ̀ — Development Notes

## Overview
Digital version of the traditional Yoruba board game Ayo (an Oware/Awalé mancala variant).
Built with **Vite + React + TypeScript**. All game logic and AI run client-side — no backend.

## Setup
```bash
docker compose -f docker-compose.base44.yml up -d --build
```
- App runs on host port **3000** (mapped to Vite dev server on 5173).
- No external services, databases, or credentials needed.

## Architecture
| Path | Purpose |
|------|---------|
| `src/game/types.ts` | Type definitions, constants, character roster |
| `src/game/engine.ts` | Game rules — sowing, capturing, feed rule, game-over |
| `src/game/ai.ts` | AI opponent — minimax with alpha-beta pruning, 3 difficulty levels |
| `src/i18n/` | English / Yorùbá translations + React context |
| `src/sound/soundManager.ts` | Web Audio API sound effects (no audio files) |
| `src/hooks/useAyoGame.ts` | Game state, animated sowing, AI turn orchestration |
| `src/components/` | MainMenu, GameScreen, Board |

## Game Rules (Oware/Ayo variant)
- 2 rows × 6 pits, 4 seeds per pit (48 total).
- Sow **counter-clockwise**, always skip the starting pit.
- **Capture**: if the last seed lands in an opponent's pit making it exactly 2 or 3, capture those seeds — chain backwards if preceding opponent pits also total 2 or 3.
- **Feed rule**: a move that leaves the opponent with zero seeds is only legal if no alternative exists.
- Game ends when a player cannot move; remaining seeds go to their owners. Most captured seeds wins.

## AI Difficulty
- **Beginner**: mostly random with occasional greedy picks.
- **Intermediate**: minimax depth 4 with alpha-beta pruning.
- **Advanced**: minimax depth 6 with alpha-beta pruning.

## Verify
- `docker compose -f docker-compose.base44.yml ps` — web service should be healthy.
- `curl -sf http://localhost:3000/` — should return the Vite HTML shell.
