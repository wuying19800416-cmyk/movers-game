
import React from 'react';
import { Home, Star, Trophy } from 'lucide-react';
import clsx from 'clsx';
import '../styles/index.css';

interface GameLayoutProps {
    score: number;
    highScore: number;
    onHome: () => void;
    children: React.ReactNode;
    className?: string; // Allow passing extra styles to the container
}

export const GameLayout: React.FC<GameLayoutProps> = ({ score, highScore, onHome, children, className }) => {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
            {/* Header Bar */}
            <div className="w-full max-w-2xl bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-4 mb-6 flex justify-between items-center border-b-4 border-indigo-100 z-10 transition-all hover:scale-[1.01]">
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
                    <div className="p-2 bg-indigo-100 rounded-full">
                        <Trophy size={24} className="text-yellow-500 fill-yellow-500" />
                    </div>
                    <span className="text-2xl">{score}</span>
                </div>

                <h1 className="text-2xl font-black text-indigo-800 tracking-tight hidden sm:block">
                    Movers Word Master
                </h1>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-slate-500 font-bold">
                        <Star size={20} className="text-orange-400 fill-orange-400" />
                        <span>{highScore}</span>
                    </div>
                    <button
                        onClick={onHome}
                        className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl transition-colors active:scale-90"
                        aria-label="Home"
                    >
                        <Home size={24} />
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className={clsx(
                "w-full max-w-2xl bg-white/95 backdrop-blur-md rounded-[40px] shadow-2xl overflow-hidden relative border-b-8 border-indigo-200 min-h-[600px] flex flex-col",
                className
            )}>
                {children}
            </div>
        </div>
    );
};
