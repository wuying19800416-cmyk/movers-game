
import React from 'react';
import { Home, Star, Trophy } from 'lucide-react';
import clsx from 'clsx';
import '../styles/index.css';

interface GameLayoutProps {
    score: number;
    highScore: number;
    onHome: () => void;
    children: React.ReactNode;
    className?: string;
}

export const GameLayout: React.FC<GameLayoutProps> = ({ score, highScore, onHome, children, className }) => {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative">
            {/* 背景浮動裝飾 */}
            <div className="absolute top-5 left-5 text-4xl animate-bounce-slow opacity-20">🎈</div>
            <div className="absolute top-1/4 right-10 text-5xl animate-bounce-slow opacity-20" style={{ animationDelay: '0.5s' }}>⚡</div>
            <div className="absolute bottom-1/4 left-10 text-4xl animate-bounce-slow opacity-20" style={{ animationDelay: '1s' }}>💫</div>

            {/* 頂部分數欄 */}
            <div className="w-full max-w-2xl bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 rounded-3xl shadow-[0_8px_0_rgba(0,0,0,0.15)] p-1 mb-6 z-10 animate-pulse">
                <div className="bg-white rounded-[20px] p-4 flex justify-between items-center">
                    {/* 當前分數 */}
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl animate-wiggle shadow-lg">
                            <Trophy size={28} className="text-white" />
                        </div>
                        <div>
                            <div className="text-xs text-slate-500 font-bold">Current Score</div>
                            <div className="text-3xl font-black text-transparent bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text animate-tada">
                                {score}
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-black text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text hidden sm:block animate-bounce-slow">
                        Word World 🌟
                    </h1>

                    {/* High Score + Home */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-gradient-to-br from-purple-100 to-pink-100 px-4 py-2 rounded-2xl">
                            <Star size={20} className="text-yellow-500 fill-yellow-500 animate-pulse" />
                            <div>
                                <div className="text-xs text-slate-500 font-bold">High Score</div>
                                <div className="text-xl font-black text-purple-600">{highScore}</div>
                            </div>
                        </div>
                        <button
                            onClick={onHome}
                            className="p-3 bg-gradient-to-br from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white rounded-2xl transition-all active:scale-90 shadow-lg hover:shadow-xl animate-wiggle"
                            aria-label="Back to Home"
                        >
                            <Home size={24} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Game Content */}
            <div className={clsx(
                "w-full max-w-2xl bg-white/95 backdrop-blur-md rounded-[40px] shadow-[0_16px_0_rgba(0,0,0,0.1)] overflow-hidden relative border-8 border-white/50 min-h-[600px] flex flex-col",
                className
            )}>
                {/* Decorative Shine */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/40 to-transparent pointer-events-none"></div>
                {children}
            </div>

            {/* Footer */}
            <div className="mt-4 text-white/60 text-sm animate-bounce-slow">
                Have fun! 🎮
            </div>
        </div>
    );
};
