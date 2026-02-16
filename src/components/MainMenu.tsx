
import React from 'react';
import type { GameMode } from '../types';
import { Brain, Keyboard, Puzzle, Gamepad2 } from 'lucide-react';

interface MainMenuProps {
    onSelectMode: (mode: GameMode) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onSelectMode }) => {
    return (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-fade-in">
            <div className="mb-8 p-6 bg-indigo-50 rounded-full animate-bounce-slow">
                <Gamepad2 size={64} className="text-indigo-600" />
            </div>

            <h2 className="text-4xl font-black text-slate-800 mb-2 tracking-tight">
                Ready to Play?
            </h2>
            <p className="text-slate-500 mb-10 font-medium text-lg">
                Choose your challenge mode!
            </p>

            <div className="grid gap-4 w-full max-w-sm">
                <MenuButton
                    icon={<Brain size={32} />}
                    title="Memory Match"
                    color="bg-sky-500"
                    onClick={() => onSelectMode('memory')}
                />
                <MenuButton
                    icon={<Keyboard size={32} />}
                    title="Spelling Bee"
                    color="bg-emerald-500"
                    onClick={() => onSelectMode('spelling')}
                />
                <MenuButton
                    icon={<Puzzle size={32} />}
                    title="Word Fill"
                    color="bg-orange-500"
                    onClick={() => onSelectMode('fillBlanks')}
                />
            </div>
        </div>
    );
};

const MenuButton = ({ icon, title, color, onClick }: { icon: React.ReactNode, title: string, color: string, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`${color} text-white font-bold p-6 rounded-3xl shadow-lg active:scale-95 transition-all text-left flex items-center gap-6 hover:brightness-110 group border-b-4 border-black/10`}
    >
        <div className="bg-white/20 p-3 rounded-2xl group-hover:rotate-12 transition-transform">
            {icon}
        </div>
        <span className="text-2xl flex-1">{title}</span>
    </button>
);
