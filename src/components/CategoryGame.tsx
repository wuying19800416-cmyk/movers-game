
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
// Comprehensive category mapping
const ALL_CATEGORIES = [
    { id: 'n', label: 'Noun (Thing)', color: 'bg-emerald-500', icon: '📦' },
    { id: 'v', label: 'Verb (Action)', color: 'bg-blue-500', icon: '🏃' },
    { id: 'adj', label: 'Adjective (Desc)', color: 'bg-amber-500', icon: '✨' },
    { id: 'adv', label: 'Adverb (How)', color: 'bg-purple-500', icon: '🐢' },
    { id: 'prep', label: 'Preposition (Pos)', color: 'bg-rose-500', icon: '📍' },
    { id: 'pron', label: 'Pronoun (Person)', color: 'bg-cyan-500', icon: '👤' },
    { id: 'det', label: 'Determiner', color: 'bg-slate-500', icon: '👈' },
];

interface CategoryOption {
    id: string;
    label: string;
    color: string;
    icon: string;
    isCorrect: boolean;
}

export const CategoryGame: React.FC<CategoryGameProps> = ({ currentWord, onSpeak, onBack, onScoreUpdate, nextWord }) => {
    const [shaking, setShaking] = useState<string | null>(null);
    const [options, setOptions] = useState<CategoryOption[]>([]);

    // Generate options when word changes
    React.useEffect(() => {
        const keys = currentWord.key.split('+'); // e.g. "adj+adv" -> ["adj", "adv"]

        // Find valid categories for this word
        const validCats = ALL_CATEGORIES.filter(c => keys.includes(c.id));

        // Pick ONE correct category to effectively be the "answer" for this round
        // (Even if word has multiple types, we pick one to ensure it exists in options)
        const correctCat = validCats[Math.floor(Math.random() * validCats.length)];

        if (!correctCat) {
            console.error("No matching category found for key:", currentWord.key);
            return;
        }

        // Pick 3 distractors
        const distractors = ALL_CATEGORIES
            .filter(c => !keys.includes(c.id)) // Ensure distractors are NOT valid types
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);

        // Combine and shuffle
        const gameOptions = [
            { ...correctCat, isCorrect: true },
            ...distractors.map(d => ({ ...d, isCorrect: false }))
        ].sort(() => 0.5 - Math.random());

        setOptions(gameOptions);
    }, [currentWord]);

    const handleCategorySelect = (option: CategoryOption) => {
        // We check if the selected OPTION maps to a valid key for the word
        // But since we pre-calculated correctness, we can use that.
        // Wait, strictly speaking, a word like "adj+adv" might have both ADJ and ADV in options if we were unlucky with distractors logic?
        // My distractor logic prevents that: .filter(c => !keys.includes(c.id))
        // So only correct types are valid.

        // Double check validation: does the selected category ID match any of the word's keys?
        const keys = currentWord.key.split('+');
        const isMatch = keys.includes(option.id);

        if (isMatch) {
            onSpeak("Correct! It is a " + option.label.split('(')[0].trim());
            onScoreUpdate(10);
            nextWord();
        } else {
            setShaking(option.id);
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
                    {options.map(opt => (
                        <button
                            key={opt.id}
                            onClick={() => handleCategorySelect(opt)}
                            className={clsx(
                                "p-4 rounded-xl text-white font-bold text-lg shadow-md transition-all active:scale-95 flex items-center justify-between group",
                                opt.color,
                                shaking === opt.id && "animate-shake ring-4 ring-red-300"
                            )}
                        >
                            <span>{opt.label}</span>
                            <span className="text-2xl group-hover:scale-125 transition-transform">{opt.icon}</span>
                        </button>
                    ))}
                </div>
            </div>
            <p className="text-slate-400 text-xs mt-4">Select the correct word type</p>
        </div>
    );
};
