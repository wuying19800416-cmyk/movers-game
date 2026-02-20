import React, { useState } from 'react';
import { MANSION_SCRIPT, WILD_TRAIL_SCRIPT, PIRATE_SCRIPT } from '../data/storyData';
import type { AdventureScript } from '../data/storyData';
import { AdventureTextParser } from './AdventureTextParser';
import { Heart, Backpack, Book, ArrowLeft, X } from 'lucide-react';

interface AdventureGameProps {
    onBack: () => void;
}

export const AdventureGame: React.FC<AdventureGameProps> = ({ onBack }) => {
    const [activeScript, setActiveScript] = useState<AdventureScript | null>(null);
    const [currentNodeId, setCurrentNodeId] = useState<string>('start');
    const [hp, setHp] = useState(100);
    const [inventory, setInventory] = useState<string[]>([]);
    const [collectedWords, setCollectedWords] = useState<Set<string>>(new Set());
    const [showInventory, setShowInventory] = useState(false);
    const [showVocab, setShowVocab] = useState(false);

    // Initial Selection Screen
    if (!activeScript) {
        return (
            <div className="flex-1 flex flex-col bg-slate-900 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-12">
                    <button onClick={onBack} className="text-slate-400 hover:text-white flex items-center gap-2">
                        <ArrowLeft /> Back to Menu
                    </button>
                    <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                        Story Adventure
                    </h1>
                    <div className="w-24"></div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full">
                    <ScriptCard
                        title="The Mystery of the Mansion"
                        emoji="🏰"
                        desc="Explore a spooky building, find items, and solve the mystery!"
                        difficulty="Easy"
                        onClick={() => startScript(MANSION_SCRIPT)}
                    />
                    <ScriptCard
                        title="The Wild Trail"
                        emoji="🦁"
                        desc="Travel through nature, meet animals, and survive the wild."
                        difficulty="Medium"
                        onClick={() => startScript(WILD_TRAIL_SCRIPT)}
                    />
                    <ScriptCard
                        title="The Pirate's Prize"
                        emoji="🏴‍☠️"
                        desc="Cook for pirates, find treasure, and learn exciting words."
                        difficulty="Hard"
                        onClick={() => startScript(PIRATE_SCRIPT)}
                    />
                </div>
            </div>
        );
    }

    const currentNode = activeScript.nodes[currentNodeId];

    function startScript(script: AdventureScript) {
        setActiveScript(script);
        setCurrentNodeId('start');
        setHp(100);
        setInventory([]);
        // Keep collected words across sessions? For now, reset or keep global?
        // Let's keep collected words as they are learning progress
    }

    function handleChoice(nextNodeId: string) {
        // Simple logic for now. 
        // In a real state machine, we'd check conditions here.
        if (nextNodeId === 'menu') {
            onBack();
            return;
        }
        if (nextNodeId === 'start') {
            // Restart current script
            setHp(100);
            setInventory([]);
            setCurrentNodeId('start');
            return;
        }
        if (nextNodeId === 'next_chapter') {
            // Logic to move to next script
            if (activeScript?.id === 'mansion') startScript(WILD_TRAIL_SCRIPT);
            else if (activeScript?.id === 'wild_trail') startScript(PIRATE_SCRIPT);
            else onBack();
            return;
        }

        // Apply specific effects based on node ID (Hardcoded for demo logic derived from script nodes)
        // Ideally this would be in the data, but for this MVP we handle basic logic here or assume data is sufficient.
        // The current data structure has simple transitions.

        // Basic deduction for bad choices (hardcoded for flavor based on node names)
        if (nextNodeId.includes('game_over') || nextNodeId.includes('_pain') || nextNodeId.includes('burn')) {
            setHp(prev => Math.max(0, prev - 10));
        }

        // Add items logic (Mock)
        if (nextNodeId === 'find_ticket' && !inventory.includes('Ticket')) setInventory(prev => [...prev, 'Ticket']);
        if (nextNodeId === 'nurse_help' && !inventory.includes('Toothbrush')) setInventory(prev => [...prev, 'Toothbrush']);
        if (nextNodeId === 'find_ticket' && !inventory.includes('Blanket')) setInventory(prev => [...prev, 'Blanket']);

        setCurrentNodeId(nextNodeId);
    }

    function handleWordInteract(word: string) {
        if (!collectedWords.has(word)) {
            setCollectedWords(prev => new Set(prev).add(word));
        }
    }

    return (
        <div className="flex-1 flex flex-col bg-slate-950 relative overflow-hidden">
            {/* HUD */}
            <div className="bg-slate-900/80 backdrop-blur-md border-b border-white/10 p-4 flex justify-between items-center z-20">
                <button onClick={() => setActiveScript(null)} className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-bold">
                    <ArrowLeft size={16} /> Exit Story
                </button>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
                        <Heart className={`${hp < 30 ? 'text-red-500 animate-pulse' : 'text-red-500'}`} size={20} fill="currentColor" />
                        <span className="font-black text-white">{hp}%</span>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setShowVocab(true)}
                        className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-blue-400 transition-colors relative"
                        title="Vocabulary Book"
                    >
                        <Book size={20} />
                        <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                            {collectedWords.size}
                        </span>
                    </button>
                    <button
                        onClick={() => setShowInventory(true)}
                        className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-yellow-400 transition-colors relative"
                        title="Inventory"
                    >
                        <Backpack size={20} />
                        {inventory.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                                {inventory.length}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center max-w-4xl mx-auto w-full">

                {/* Scene Graphic */}
                <div className="w-full h-64 bg-slate-900 border-2 border-slate-800 rounded-3xl mb-8 flex items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/50"></div>
                    <span className="text-9xl transform group-hover:scale-110 transition-transform duration-700 select-none">
                        {currentNode.background || '📖'}
                    </span>
                </div>

                {/* Text Area */}
                <div className="bg-slate-800/50 border border-white/10 rounded-3xl p-8 w-full mb-8 shadow-2xl relative">
                    <AdventureTextParser
                        text={currentNode.text}
                        onWordInteract={handleWordInteract}
                    />
                </div>

                {/* Choices */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    {currentNode.choices.map((choice, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleChoice(choice.nextNodeId)}
                            className="bg-slate-800 hover:bg-blue-600 hover:scale-[1.02] border-2 border-slate-700 hover:border-blue-400 text-white text-lg font-bold py-6 px-8 rounded-2xl transition-all shadow-lg text-left flex items-center justify-between group"
                        >
                            {choice.text}
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity">➡️</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Vocab Modal */}
            {showVocab && (
                <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex flex-col p-8 animate-fade-in">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-black text-white flex items-center gap-3">
                            <Book className="text-blue-400" />
                            Vocabulary Book
                        </h2>
                        <button onClick={() => setShowVocab(false)} className="bg-slate-800 p-2 rounded-xl text-white hover:bg-slate-700">
                            <X />
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 overflow-y-auto pb-20">
                        {Array.from(collectedWords).map(word => (
                            <div key={word} className="bg-slate-900 border border-white/10 p-4 rounded-2xl flex flex-col items-center text-center">
                                <span className="text-xl font-bold text-yellow-400 mb-2">{word}</span>
                                <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">Collected</span>
                            </div>
                        ))}
                        {collectedWords.size === 0 && (
                            <div className="col-span-full text-center text-slate-500 py-10">
                                No words collected yet. Hover over highlighted words in the story!
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Inventory Modal */}
            {showInventory && (
                <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex flex-col p-8 animate-fade-in">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-black text-white flex items-center gap-3">
                            <Backpack className="text-yellow-400" />
                            Backpack
                        </h2>
                        <button onClick={() => setShowInventory(false)} className="bg-slate-800 p-2 rounded-xl text-white hover:bg-slate-700">
                            <X />
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {inventory.map((item, idx) => (
                            <div key={idx} className="bg-slate-900 border border-white/10 p-6 rounded-2xl flex flex-col items-center text-center">
                                <span className="text-4xl mb-4">📦</span>
                                <span className="text-xl font-bold text-white">{item}</span>
                            </div>
                        ))}
                        {inventory.length === 0 && (
                            <div className="col-span-full text-center text-slate-500 py-10">
                                Your backpack is empty.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

interface ScriptCardProps {
    title: string;
    emoji: string;
    desc: string;
    difficulty: string;
    onClick: () => void;
}

const ScriptCard: React.FC<ScriptCardProps> = ({ title, emoji, desc, difficulty, onClick }) => (
    <button
        onClick={onClick}
        className="bg-slate-800 hover:bg-slate-700 border border-white/10 p-8 rounded-[32px] text-left transition-all hover:-translate-y-2 group shadow-2xl relative overflow-hidden"
    >
        <div className="absolute top-0 right-0 p-32 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-white/10 transition-colors"></div>
        <div className="text-6xl mb-6">{emoji}</div>
        <h3 className="text-2xl font-black text-white mb-2">{title}</h3>
        <p className="text-slate-400 mb-6 font-medium leading-relaxed">{desc}</p>
        <div className="flex items-center justify-between">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                }`}>
                {difficulty}
            </span>
            <span className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                ➡️
            </span>
        </div>
    </button>
);
