
import React, { useState, useEffect } from 'react';
import type { WordItem } from '../types';
import { Volume2, ArrowRight, Home } from 'lucide-react';
import clsx from 'clsx';
import { recordCompletion } from './MainMenu';

interface SpellingGameProps {
    currentWord: WordItem;
    onCheck: (answer: string) => boolean;
    onSpeak: (text: string) => void;
    onBack: () => void;
}

export const SpellingGame: React.FC<SpellingGameProps> = ({ currentWord, onCheck, onSpeak, onBack }) => {
    const [input, setInput] = useState('');
    const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

    useEffect(() => {
        setInput('');
        setStatus('idle');
    }, [currentWord]);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim()) return;

        const isCorrect = onCheck(input);
        setStatus(isCorrect ? 'correct' : 'wrong');

        if (isCorrect) {
            recordCompletion('spelling');
        }

        if (!isCorrect) {
            setTimeout(() => setStatus('idle'), 1500);
        }
    };

    return (
        <div className="h-full flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            {/* Back Button */}
            <button onClick={onBack} className="absolute top-4 left-4 p-2 bg-slate-100/50 rounded-full text-slate-400 hover:bg-slate-200">
                <Home size={20} />
            </button>

            {/* Hint Badge */}
            <div className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-600 rounded-full text-sm font-bold uppercase tracking-wider mb-8">
                {currentWord.key}
            </div>

            {/* Emoji Display */}
            <div className="text-[120px] mb-8 leading-none drop-shadow-sm filter hover:brightness-110 active:scale-95 transition-transform cursor-pointer"
                onClick={() => onSpeak(currentWord.word)}>
                {currentWord.emoji}
            </div>

            {/* Input Area */}
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
                        placeholder="Type the word..."
                        className={clsx(
                            "w-full text-center text-3xl font-bold py-5 pl-12 pr-4 rounded-3xl outline-none border-4 transition-all shadow-sm",
                            status === 'idle' && "border-slate-100 focus:border-indigo-300 focus:shadow-md",
                            status === 'correct' && "border-emerald-400 bg-emerald-50 text-emerald-700",
                            status === 'wrong' && "border-red-400 bg-red-50 text-red-700 animate-shake"
                        )}
                    />
                </div>

                <button
                    type="submit"
                    className={clsx(
                        "w-full py-4 text-xl font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2",
                        status === 'correct' ? "bg-emerald-500 text-white" : "bg-indigo-600 text-white hover:bg-indigo-700 active:translate-y-1",
                        status === 'wrong' && "bg-red-500"
                    )}
                >
                    {status === 'correct' ? 'Great Job!' : 'Check Answer'}
                    {status === 'idle' && <ArrowRight size={24} />}
                </button>
            </form>
        </div>
    );
};
