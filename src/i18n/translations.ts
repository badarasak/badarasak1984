import { Language } from '../game/types';

type TranslationKey =
  | 'title'
  | 'subtitle'
  | 'playVsAI'
  | 'playVsFriend'
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'english'
  | 'yoruba'
  | 'startGame'
  | 'yourTurn'
  | 'opponentTurn'
  | 'player1Turn'
  | 'player2Turn'
  | 'youWin'
  | 'youLose'
  | 'draw'
  | 'p1Wins'
  | 'p2Wins'
  | 'score'
  | 'seeds'
  | 'playAgain'
  | 'mainMenu'
  | 'settings'
  | 'sound'
  | 'on'
  | 'off'
  | 'selectCharacter'
  | 'thinking'
  | 'capture'
  | 'difficulty'
  | 'language'
  | 'mode'
  | 'vsAI'
  | 'vsHuman'
  | 'gameOver'
  | 'remaining'
  | 'back'
  | 'howToPlay'
  | 'rulesTitle'
  | 'rulesBody'
  | 'close';

export const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    title: 'Ayo Ọ̀pẹ̀lẹ̀',
    subtitle: 'The Ancient Yoruba Seed Game',
    playVsAI: 'Play vs Computer',
    playVsFriend: 'Play vs Friend',
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    english: 'English',
    yoruba: 'Yorùbá',
    startGame: 'Start Game',
    yourTurn: 'Your turn',
    opponentTurn: "Computer's turn",
    player1Turn: "Player 1's turn",
    player2Turn: "Player 2's turn",
    youWin: 'You Win! 🎉',
    youLose: 'Computer Wins!',
    draw: "It's a Draw!",
    p1Wins: 'Player 1 Wins! 🎉',
    p2Wins: 'Player 2 Wins! 🎉',
    score: 'Captured',
    seeds: 'seeds',
    playAgain: 'Play Again',
    mainMenu: 'Main Menu',
    settings: 'Settings',
    sound: 'Sound',
    on: 'On',
    off: 'Off',
    selectCharacter: 'Choose Your Character',
    thinking: 'Thinking…',
    capture: 'Capture!',
    difficulty: 'Difficulty',
    language: 'Language',
    mode: 'Game Mode',
    vsAI: 'vs Computer',
    vsHuman: 'vs Friend',
    gameOver: 'Game Over',
    remaining: 'remaining',
    back: 'Back',
    howToPlay: 'How to Play',
    rulesTitle: 'How to Play Ayo',
    rulesBody:
      'Each player owns one row of 6 pits with 4 seeds each. On your turn, pick up all seeds from one of your pits and sow them one-by-one into consecutive pits counter-clockwise (skipping the starting pit). If your last seed lands in an opponent\'s pit making it exactly 2 or 3, you capture those seeds — and keep capturing backwards if the previous pits also total 2 or 3. You cannot leave your opponent with zero seeds if another move is possible. The game ends when one side is empty; the player with the most captured seeds wins!',
    close: 'Close',
  },
  yo: {
    title: 'Ayo Ọ̀pẹ̀lẹ̀',
    subtitle: 'Eré Àtijọ́ Yorùbá',
    playVsAI: 'Ṣeré pẹ̀lú Kọ̀mpútà',
    playVsFriend: 'Ṣeré pẹ̀lú ọ̀rẹ́',
    beginner: 'Àkọ́bẹ̀rẹ̀',
    intermediate: 'Àárín',
    advanced: 'Onímọ̀',
    english: 'Gẹ̀ẹ́sì',
    yoruba: 'Yorùbá',
    startGame: 'Bẹ̀rẹ̀ Ìgbá',
    yourTurn: 'Ìyípadà Rẹ',
    opponentTurn: 'Ìyípadà Kọ̀mpútà',
    player1Turn: 'Ìyípadà Akọ́kọ́',
    player2Turn: 'Ìyípadà Kejì',
    youWin: 'Ìṣẹ́gun Rẹ! 🎉',
    youLose: 'Kọ̀mpútà Bori!',
    draw: 'Dọ́gọ̀!',
    p1Wins: 'Akọ́kọ́ Bori! 🎉',
    p2Wins: 'Kejì Bori! 🎉',
    score: 'Àyọ',
    seeds: 'orísun',
    playAgain: 'Ṣeré Lẹ́ẹ̀kan Si',
    mainMenu: 'Ètó Àkọ́bẹ̀rẹ̀',
    settings: 'Ètò',
    sound: 'Ohùn',
    on: 'Wà',
    off: 'Kò Sí',
    selectCharacter: 'Yan Ìṣẹ́ Rẹ',
    thinking: 'N rò…',
    capture: 'Mú!',
    difficulty: 'Iye Ìyì',
    language: 'Èdè',
    mode: 'Ìgbá',
    vsAI: 'pẹ̀lú Kọ̀mpútà',
    vsHuman: 'pẹ̀lú ọ̀rẹ́',
    gameOver: 'Ìgbá Parí',
    remaining: 'tó kù',
    back: 'Pada',
    howToPlay: 'Bẹ́wẹ̀ni A Ṣe Ìgbá',
    rulesTitle: 'Bẹ́wẹ̀ni A Ṣe Ìgbá Ayo',
    rulesBody:
      'Ọkọ̀ọ̀kan ló ní 6 gèè ọkọ̀ọ̀kan pẹ̀lú 4 orísun. Ní ìyípadà rẹ, mú gbogbo orísun nínú gèè kan, kí o sì wá wọ́n lẹ́ẹ̀kọ̀ọ̀kan sínú gèè tó ń bọ̀ lọ́wọ́ (kí o má wọ́ sínú gèè tí o ti mú kúrò). Tí orísun tí ó kẹ́yìn bá wọ́ sínú gèè ọ̀tá rẹ, kí ó sì jọ́kọ́ mẹ́rin tàbí mẹ́ta, o ti mú orísun náà — kí o sì tè sí ẹ̀yìn tí ó bá ń jọ́kọ́ mẹ́rin tàbí mẹ́ta. O lè má fi ọ̀tá rẹ lẹ́rùpẹ̀ tí ìyípadà mìíràn bá wà. Ìgbá ná á parí nígbà tí ẹgbẹ̀ kan bá kò ní orísun; ẹni tí ó mú orísun pọ̀ jọ ni olú-ọrọ̀!',
    close: 'Ti',
  },
};
