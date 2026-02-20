
import { useState, useCallback } from 'react';
import type { WordItem, GameMode } from '../types';
import { ALL_VOCAB } from '../data/words';
import confetti from 'canvas-confetti';

export const useGameLogic = () => {
    const [mode, setMode] = useState<GameMode>('menu');
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(() => {
        try {
            const saved = localStorage.getItem('movers-highscore');
            return saved ? parseInt(saved) : 0;
        } catch (e) {
            console.warn('Failed to read high score from localStorage:', e);
            return 0;
        }
    });
    const [currentWord, setCurrentWord] = useState<WordItem | null>(null);
    const [wordDeck, setWordDeck] = useState<WordItem[]>([]);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);



    const speak = useCallback((text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Keep existing cancel logic
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = 0.9; // Keep existing rate logic
            window.speechSynthesis.speak(utterance);
        }
    }, []);

    const startGame = (newMode: GameMode) => {
        if (newMode === 'menu') return;
        setMode(newMode);

        // For typing mode, we might not need to pre-select a currentWord
        // but we'll shuffle the deck regardless
        const shuffled = [...ALL_VOCAB].sort(() => Math.random() - 0.5);
        setWordDeck(shuffled);

        if (newMode !== 'typing' && newMode !== 'adventure') {
            const firstWord = shuffled[0];
            setCurrentWord(firstWord);
            speak(firstWord.word);
            setWordDeck(shuffled.slice(1));
        } else {
            setCurrentWord(null);
        }
    };

    const nextWord = useCallback(() => {
        setFeedback(null);

        // Check if deck is empty, reshuffle if needed
        let currentDeck = [...wordDeck];
        if (currentDeck.length === 0) {
            currentDeck = [...ALL_VOCAB].sort(() => Math.random() - 0.5);
        }

        // Draw the next card from deck
        const next = currentDeck[0];
        setCurrentWord(next);
        speak(next.word);

        // Remove used card from deck
        setWordDeck(currentDeck.slice(1));
    }, [wordDeck, speak]);

    const updateScoreAndHighscore = (points: number) => {
        setScore(prevScore => {
            const newScore = prevScore + points;
            setHighScore(prevHigh => {
                if (newScore > prevHigh) {
                    localStorage.setItem('movers-highscore', newScore.toString());
                    return newScore;
                }
                return prevHigh;
            });
            return newScore;
        });
    };

    const checkAnswer = (input: string) => {
        if (!currentWord) return false;

        if (input.trim().toLowerCase() === currentWord.word.toLowerCase()) {
            setFeedback('correct');
            updateScoreAndHighscore(20);
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
        updateScoreAndHighscore(points);
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
