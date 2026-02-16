
export type GameMode = 'menu' | 'memory' | 'spelling' | 'fillBlanks' | 'gameOver';

export interface WordItem {
    word: string;
    key: string;
    emoji: string;
}

export interface GameState {
    mode: GameMode;
    score: number;
    highScore: number;
    currentWord: WordItem | null;
    feedback: 'correct' | 'wrong' | null;
}
