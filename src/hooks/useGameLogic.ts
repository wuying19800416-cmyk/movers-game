
import { useState, useCallback, useEffect } from 'react';
import type { WordItem } from '../data/words';
import { ALL_VOCAB } from '../data/words';
import confetti from 'canvas-confetti';

export type GameMode = 'menu' | 'memory' | 'spelling' | 'fillBlanks' | 'gameOver';

export const useGameLogic = () => {
    const [mode, setMode] = useState<GameMode>('menu');
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(() => {
        const saved = localStorage.getItem('movers-highscore');
        return saved ? parseInt(saved) : 0;
    });
    const [currentWord, setCurrentWord] = useState<WordItem | null>(null);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

    useEffect(() => {
        if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('movers-highscore', score.toString());
        }
    }, [score, highScore]);

    const speak = useCallback((text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(text);
            u.lang = 'en-US';
            u.rate = 0.9;
            window.speechSynthesis.speak(u);
        }
    }, []);

    const startGame = (newMode: GameMode) => {
        setMode(newMode);
        setScore(0);
        nextWord();
    };

    const nextWord = useCallback(() => {
        const randomWord = ALL_VOCAB[Math.floor(Math.random() * ALL_VOCAB.length)];
        setCurrentWord(randomWord);
        setFeedback(null);
        // Auto speak the word after a slight delay
        setTimeout(() => speak(randomWord.word), 500);
    }, [speak]);

    const checkAnswer = (input: string) => {
        if (!currentWord) return false;

        if (input.trim().toLowerCase() === currentWord.word.toLowerCase()) {
            setFeedback('correct');
            setScore(s => s + 20);
            speak("Excellent!");
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
            setTimeout(() => {
                nextWord();
            }, 1500);
            return true;
        } else {
            setFeedback('wrong');
            speak("Try again");
            setTimeout(() => setFeedback(null), 1000);
            return false;
        }
    };

    const addScore = (points: number) => {
        setScore(s => s + points);
    };

    const goHome = () => {
        setMode('menu');
        setFeedback(null);
    };

    return {
        mode,
        score,
        highScore,
        currentWord,
        feedback,
        startGame,
        checkAnswer,
        addScore,
        goHome,
        speak,
        nextWord // exposed for skipping or specialized modes
    };
};
