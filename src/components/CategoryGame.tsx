
import React, { useState } from 'react';
import type { WordItem } from '../types';
import { Home } from 'lucide-react';
import clsx from 'clsx';

interface CategoryGameProps {
    currentWord: WordItem;
    onCheck: (input: string) => boolean; // We might need a special check for category, or reuse checkAnswer if we pass a "pass" flag
    onSpeak: (text: string) => void;
    onBack: () => void;
    onScoreUpdate: (points: number) => void; // Need direct score access or a way to handle custom logic
    nextWord: () => void;
}

// Simple mapping for demo purposes. 
// In a real app, word data should have explicit 'category' field matching these specific IDs if we want strict typing.
const CATEGORIES = [
    { id: 'n', label: 'Thing (Noun)', color: 'bg-emerald-500', icon: '📦' },
    { id: 'v', label: 'Action (Verb)', color: 'bg-blue-500', icon: '🏃' },
    { id: 'adj', label: 'Describe (Adj)', color: 'bg-amber-500', icon: '✨' },
];

export const CategoryGame: React.FC<CategoryGameProps> = ({ currentWord, onSpeak, onBack, onScoreUpdate, nextWord }) => {
    const [shaking, setShaking] = useState<string | null>(null);

    const handleCategorySelect = (catId: string) => {
        // Logic: Check if currentWord.key starts with the category id (e.g. 'n', 'n+v')
        // This is a heuristic. 'n+v' would match 'n' (Noun) and 'v' (Verb).

        let isMatch = false;

        if (catId === 'n' && currentWord.key.includes('n')) isMatch = true;
        else if (catId === 'v' && currentWord.key.includes('v')) isMatch = true;
        else if (catId === 'adj' && currentWord.key.includes('adj')) isMatch = true;

        if (isMatch) {
            onSpeak("Correct! It is a " + (catId === 'n' ? 'Noun' : catId === 'v' ? 'Verb' : 'Adjective'));
            onScoreUpdate(10);
            nextWord();
        } else {
            setShaking(catId);
            onSpeak("Try again");
            setTimeout(() => setShaking(null), 500);
        }
    };

    return (
        <div className="h-full flex flex-col items-center justify-center p-4 animate-fade-in relative">
            <button onClick={onBack} className="absolute top-4 left-4 p-2 bg-slate-100/50 rounded-full text-slate-400 hover:bg-slate-200 transition-colors">
                <Home size={20} />
            </button>

            <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm">
                <div className="text-center mb-8 bg-white p-8 rounded-3xl shadow-lg w-full">
                    <div className="text-6xl mb-4 animate-bounce-slow inline-block">
                        {currentWord.emoji}
                    </div>
                    <h2 onClick={() => onSpeak(currentWord.word)} className="text-3xl font-black text-slate-700 cursor-pointer hover:text-indigo-500 transition-colors">
                        {currentWord.word}
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-3 w-full">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategorySelect(cat.id)}
                            className={clsx(
                                "p-4 rounded-xl text-white font-bold text-lg shadow-md transition-all active:scale-95 flex items-center justify-between group",
                                cat.color,
                                shaking === cat.id && "animate-shake ring-4 ring-red-300"
                            )}
                        >
                            <span>{cat.label}</span>
                            <span className="text-2xl group-hover:scale-125 transition-transform">{cat.icon}</span>
                        </button>
                    ))}
                </div>
            </div>
            <p className="text-slate-400 text-xs mt-4">Select the correct word type</p>
        </div>
    );
};
