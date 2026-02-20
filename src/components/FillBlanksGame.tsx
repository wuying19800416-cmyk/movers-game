
import React, { useState } from 'react';
import type { WordItem } from '../types';
// Reuse the SpellingGame structure but with a prompt for the masked word?
// Or build a custom one. Let's build a custom one to show the mask visually.
import { Volume2, ArrowRight, Home } from 'lucide-react';
import clsx from 'clsx';

interface FillBlanksGameProps {
    currentWord: WordItem;
    onCheck: (answer: string) => boolean;
    onSpeak: (text: string) => void;
    onBack: () => void;
}

export const FillBlanksGame: React.FC<FillBlanksGameProps> = ({ currentWord, onCheck, onSpeak, onBack }) => {
    const [input, setInput] = useState('');
    const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

    // Generate mask on mount (component is re-mounted for new words via key)
    const [maskedWord] = useState(() => {
        const word = currentWord.word;
        const chars = word.split('');
        const len = chars.length;
        // Calculate how many chars to SHOW (min 30%, at least 1)
        const minVisible = Math.max(1, Math.ceil(len * 0.3));

        // Create indices array and shuffle it to pick which ones to show
        const indices = Array.from({ length: len }, (_, i) => i);
        // Shuffle indices
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }

        // Pick the first 'minVisible' indices to keep visible
        const visibleIndices = new Set(indices.slice(0, minVisible));

        return chars.map((c, i) => {
            if (c === ' ' || visibleIndices.has(i)) return c;
            return '_';
        }).join('');
    });

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        const isCorrect = onCheck(input);
        setStatus(isCorrect ? 'correct' : 'wrong');
        if (!isCorrect) setTimeout(() => setStatus('idle'), 800);
    };

    return (
        <div className="h-full flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <button onClick={onBack} className="absolute top-4 left-4 p-2 bg-slate-100/50 rounded-full text-slate-400 hover:bg-slate-200">
                <Home size={20} />
            </button>

            <div className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 rounded-full text-sm font-bold uppercase tracking-wider mb-8">
                Fill the Blanks
            </div>

            <div className="text-[100px] mb-4 leading-none drop-shadow-sm filter hover:brightness-110 active:scale-95 transition-transform cursor-pointer"
                onClick={() => onSpeak(currentWord.word)}>
                {currentWord.emoji}
            </div>

            {/* Visual Mask Display */}
            <div className="mb-8 flex gap-2 justify-center flex-wrap">
                {maskedWord.split('').map((char, i) => (
                    <span key={i} className={clsx(
                        "text-4xl font-mono font-black w-10 text-center border-b-4",
                        char === '_' ? "text-orange-300 border-orange-200" : "text-slate-700 border-transparent"
                    )}>
                        {char}
                    </span>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col items-center gap-6">
                <div className="relative w-full">
                    <button
                        type="button"
                        onClick={() => onSpeak(currentWord.word)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                    >
                        <Volume2 size={24} />
                    </button>

                    <input
                        autoFocus
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Complete the full word..."
                        className={clsx(
                            "w-full text-center text-2xl font-bold py-5 pl-12 pr-4 rounded-3xl outline-none border-4 transition-all shadow-sm",
                            status === 'idle' && "border-slate-100 focus:border-orange-300 focus:shadow-md",
                            status === 'correct' && "border-emerald-400 bg-emerald-50 text-emerald-700",
                            status === 'wrong' && "border-red-400 bg-red-50 text-red-700 animate-shake"
                        )}
                    />
                </div>

                <button
                    type="submit"
                    className={clsx(
                        "w-full py-4 text-xl font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2",
                        status === 'correct' ? "bg-emerald-500 text-white" : "bg-orange-500 text-white hover:bg-orange-600 active:translate-y-1",
                        status === 'wrong' && "bg-red-500"
                    )}
                >
                    {status === 'correct' ? 'Perfect!' : 'Check It'}
                    {status === 'idle' && <ArrowRight size={24} />}
                </button>
            </form>
        </div>
    );
};
