import React, { useState, useEffect } from 'react';
import type { WordItem } from '../types';
import { ALL_VOCAB } from '../data/words'; // Used for distractors
import { Home, Volume2 } from 'lucide-react';
import clsx from 'clsx';

interface ListeningGameProps {
    currentWord: WordItem;
    onCheck: (input: string) => boolean;
    onSpeak: (text: string) => void;
    onBack: () => void;
}

export const ListeningGame: React.FC<ListeningGameProps> = ({ currentWord, onCheck, onSpeak, onBack }) => {
    const [options, setOptions] = useState<WordItem[]>([]);
    const [shaking, setShaking] = useState<number | null>(null);
    const lastWordRef = React.useRef<string>('');

    useEffect(() => {
        // Generate options: current word + 3 random distractors
        const distractors = ALL_VOCAB
            .filter(w => w.word !== currentWord.word)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);

        const allOptions = [...distractors, currentWord].sort(() => 0.5 - Math.random());
        setOptions(allOptions);
    }, [currentWord]);

    const handleOptionClick = (word: WordItem, index: number) => {
        const isCorrect = onCheck(word.word);
        if (!isCorrect) {
            setShaking(index);
            setTimeout(() => setShaking(null), 500);
        }
    };

    return (
        <div className="h-full flex flex-col items-center justify-center p-4 animate-fade-in relative">
            <button onClick={onBack} className="absolute top-4 left-4 p-2 bg-slate-100/50 rounded-full text-slate-400 hover:bg-slate-200 transition-colors">
                <Home size={20} />
            </button>

            <div className="text-center mb-8">
                <h2 className="text-2xl font-black text-slate-700 mb-2">Listen & Match</h2>
                <button
                    onClick={() => onSpeak(currentWord.word)}
                    className="p-6 bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-white rounded-full shadow-lg transition-all animate-bounce-slow"
                >
                    <Volume2 size={48} />
                </button>
                <p className="text-slate-400 text-sm mt-4">Click to hear the word again</p>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                {options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleOptionClick(option, index)}
                        className={clsx(
                            "aspect-square rounded-2xl bg-white shadow-md hover:shadow-lg transition-all flex flex-col items-center justify-center gap-2 border-2 border-transparent hover:border-indigo-200 active:scale-95 group",
                            shaking === index && "animate-shake border-red-400 bg-red-50"
                        )}
                    >
                        <span className="text-5xl group-hover:scale-110 transition-transform block">
                            {option.emoji}
                        </span>
                        {/* 
                           Optionally hide text for harder difficulty, 
                           but for Movers level, showing text helps reinforcement.
                           Let's show text but smaller.
                        */}
                        {/* <span className="text-slate-400 text-xs font-bold uppercase">{option.word}</span> */}
                    </button>
                ))}
            </div>
        </div>
    );
};
