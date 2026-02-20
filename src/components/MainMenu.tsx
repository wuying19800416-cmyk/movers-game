
import React, { useState } from 'react';
import type { GameMode } from '../types';
import { Brain, Keyboard, Puzzle, Volume2, Tags } from 'lucide-react';

interface MainMenuProps {
    onSelectMode: (mode: GameMode) => void;
}

import { getGameStats, incrementGameStat } from '../utils/gameStats';
import type { GameStats, GameModeStats } from '../utils/gameStats';

export const MainMenu: React.FC<MainMenuProps> = ({ onSelectMode }) => {
    const [stats, setStats] = useState<GameStats>(getGameStats());



    const handleSelectMode = (mode: GameMode) => {
        incrementGameStat(mode);
        setStats(getGameStats());
        onSelectMode(mode);
    };
    return (
        <div className="h-full flex flex-col items-center justify-start p-2 sm:p-4 pt-6 sm:pt-8 text-center animate-fade-in relative overflow-y-auto">
            {/* 背景浮動裝飾 */}
            <div className="absolute top-10 left-10 text-6xl animate-bounce-slow opacity-30">🎮</div>
            <div className="absolute top-20 right-10 text-5xl animate-bounce-slow opacity-30" style={{ animationDelay: '1s' }}>🎨</div>
            <div className="absolute bottom-20 left-20 text-5xl animate-bounce-slow opacity-30" style={{ animationDelay: '0.5s' }}>✨</div>
            <div className="absolute bottom-10 right-20 text-6xl animate-bounce-slow opacity-30" style={{ animationDelay: '1.5s' }}>🌈</div>

            {/* Main Title */}
            <div className="mb-4 animate-tada">
                <div className="text-5xl sm:text-8xl mb-2 drop-shadow-2xl animate-wiggle">🎯</div>
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent mb-2 drop-shadow-lg animate-pulse">
                    Word Adventure
                </h1>
                <div className="inline-block bg-black/70 px-6 py-2 rounded-2xl backdrop-blur-sm">
                    <p className="text-base sm:text-xl md:text-2xl font-bold text-white drop-shadow-lg">
                        Choose Your Challenge! 🚀
                    </p>
                </div>
            </div>

            {/* Game Buttons */}
            <div className="grid grid-cols-1 gap-2 sm:gap-3 w-full max-w-md mb-2 sm:mb-4">
                <MenuButton
                    icon={<Brain size={40} />}
                    title="Memory Match"
                    emoji="🧠"
                    stats={stats.memory}
                    color="from-blue-400 to-cyan-400"
                    onClick={() => handleSelectMode('memory')}
                />
                <MenuButton
                    icon={<Keyboard size={40} />}
                    title="Spelling Bee"
                    emoji="✏️"
                    stats={stats.spelling}
                    color="from-emerald-400 to-teal-400"
                    onClick={() => handleSelectMode('spelling')}
                />
                <MenuButton
                    icon={<Puzzle size={40} />}
                    title="Word Fill"
                    emoji="🧩"
                    stats={stats.fillBlanks}
                    color="from-orange-400 to-amber-400"
                    onClick={() => handleSelectMode('fillBlanks')}
                />
                <MenuButton
                    icon={<Volume2 size={40} />}
                    title="Listening Challenge"
                    emoji="👂"
                    stats={stats.listening}
                    color="from-purple-400 to-violet-400"
                    onClick={() => handleSelectMode('listening')}
                />
                <MenuButton
                    icon={<Tags size={40} />}
                    title="Category Sort"
                    emoji="🏷️"
                    stats={stats.category}
                    color="from-pink-400 to-rose-400"
                    onClick={() => handleSelectMode('category')}
                />
                <MenuButton
                    icon={<Keyboard size={40} />}
                    title="Meteor Typing"
                    emoji="☄️"
                    stats={stats.typing}
                    color="from-slate-600 to-slate-800"
                    onClick={() => handleSelectMode('typing')}
                />
                <MenuButton
                    icon={<div className="text-4xl">🏰</div>}
                    title="Story Adventure"
                    emoji="🗺️"
                    stats={stats.adventure || { played: 0, completed: 0 }}
                    color="from-yellow-600 to-orange-700"
                    onClick={() => handleSelectMode('adventure')}
                />
            </div>

            <div className="bg-black/60 px-4 py-2 rounded-xl backdrop-blur-sm mt-2 mb-4">
                <div className="text-white text-sm font-semibold">
                    Click to start playing! 🎉
                </div>
            </div>
        </div>
    );
};

const MenuButton = ({
    icon,
    title,
    emoji,
    stats,
    color,
    onClick
}: {
    icon: React.ReactNode,
    title: string,
    emoji: string,
    stats: GameModeStats,
    color: string,
    onClick: () => void
}) => (
    <button
        onClick={onClick}
        className={`
            relative overflow-hidden
            bg-gradient-to-r ${color}
            text-white font-black text-2xl
            p-6 rounded-3xl
            shadow-[0_8px_0_rgba(0,0,0,0.2)]
            hover:shadow-[0_12px_0_rgba(0,0,0,0.2)]
            hover:translate-y-[-4px]
            active:translate-y-2
            active:shadow-[0_4px_0_rgba(0,0,0,0.2)]
            transition-all duration-200
            border-4 border-white/30
            group
            animate-rainbow-pulse
        `}
    >
        {/* 光澤效果 */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

        <div className="relative flex items-center gap-4">
            <div className="bg-white/30 p-3 rounded-2xl backdrop-blur-sm group-hover:scale-110 group-hover:rotate-12 transition-all">
                {icon}
            </div>
            <div className="flex-1 text-left">
                <span className="drop-shadow-lg block">{title}</span>
                <div className="text-xs opacity-90 font-normal space-y-0.5">
                    <div>Played: {stats.played}x</div>
                    <div className="text-green-200">✓ Completed: {stats.completed}x</div>
                </div>
            </div>
            <span className="text-5xl group-hover:scale-125 group-hover:animate-wiggle transition-transform">
                {emoji}
            </span>
        </div>
    </button>
);
