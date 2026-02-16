
import { useState, useCallback, useEffect } from 'react';
import type { WordItem } from '../types';
import { ALL_VOCAB } from '../data/words';
import confetti from 'canvas-confetti';

export type GameMode = 'menu' | 'memory' | 'spelling' | 'fillBlanks' | 'listening' | 'category';

export const useGameLogic = () => {
    const [mode, setMode] = useState<GameMode>('menu');
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(() => {
        const saved = localStorage.getItem('movers-highscore');
        return saved ? parseInt(saved) : 0;
    });
    const [currentWord, setCurrentWord] = useState<WordItem | null>(null);
    const [wordDeck, setWordDeck] = useState<WordItem[]>([]);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

    useEffect(() => {
        if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('movers-highscore', score.toString());
        }
    }, [score, highScore]);

    const speak = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Keep existing cancel logic
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = 0.9; // Keep existing rate logic
            window.speechSynthesis.speak(utterance);
        }
    };

    const startGame = (selectedMode: GameMode) => {
        setMode(selectedMode);
        setScore(0);

        // Memory game handles its own word selection
        if (selectedMode === 'memory') {
            return;
        }

        // Re-shuffle deck for a new game
        const shuffled = [...ALL_VOCAB].sort(() => 0.5 - Math.random());
        setWordDeck(shuffled);
        nextWord();
    };

    const nextWord = useCallback(() => {
        setFeedback(null);

        setWordDeck(prevDeck => {
            let newDeck = [...prevDeck];

            if (newDeck.length === 0) {
                // Refill deck if empty
                newDeck = [...ALL_VOCAB].sort(() => 0.5 - Math.random());
            }

            const next = newDeck.pop();
            if (next) {
                setCurrentWord(next);
                speak(next.word);
            }

            return newDeck;
        });
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
