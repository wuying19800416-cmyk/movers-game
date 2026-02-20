import React, { useState } from 'react';
import { ALL_VOCAB } from '../data/words';
import { Volume2 } from 'lucide-react';

interface InteractiveWordProps {
    word: string;
    emoji: string;
    type: string;
    onInteract?: (word: string) => void;
}

const InteractiveWord: React.FC<InteractiveWordProps> = ({ word, emoji, type, onInteract }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    const handleMouseEnter = () => {
        setShowTooltip(true);
        if (onInteract) onInteract(word);
    };

    const playSound = (e: React.MouseEvent) => {
        e.stopPropagation();
        const utter = new SpeechSynthesisUtterance(word);
        window.speechSynthesis.speak(utter);
    };

    return (
        <span
            className="relative inline-block mx-1 cursor-pointer group"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <span className="text-yellow-400 font-bold border-b-2 border-yellow-400/30 group-hover:border-yellow-400 transition-all">
                {word}
            </span>

            {/* Tooltip */}
            <span className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max bg-slate-900 border border-yellow-400/30 rounded-xl p-3 shadow-xl z-50 transition-all duration-200 ${showTooltip ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
                <span className="flex items-center gap-3">
                    <span className="text-3xl">{emoji}</span>
                    <span className="flex flex-col text-left">
                        <span className="font-bold text-white capitalize flex items-center gap-2">
                            {word}
                            <button onClick={playSound} className="p-1 hover:bg-white/10 rounded-full">
                                <Volume2 size={14} className="text-blue-400" />
                            </button>
                        </span>
                        <span className="text-xs text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded w-fit">{type}</span>
                    </span>
                </span>
                {/* Arrow */}
                <span className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900"></span>
            </span>
        </span>
    );
};

interface AdventureTextParserProps {
    text: string;
    onWordInteract?: (word: string) => void;
}

export const AdventureTextParser: React.FC<AdventureTextParserProps> = ({ text, onWordInteract }) => {
    // Split by {word} pattern
    const parts = text.split(/\{([^}]+)\}/g);

    return (
        <div className="text-xl leading-relaxed text-slate-200">
            {parts.map((part, index) => {
                // Every odd index is a word inside {}
                if (index % 2 === 1) {
                    const wordKey = part.toLowerCase();
                    const wordData = ALL_VOCAB.find(w => w.word.toLowerCase() === wordKey);

                    if (wordData) {
                        return (
                            <InteractiveWord
                                key={index}
                                word={wordData.word}
                                emoji={wordData.emoji}
                                type={wordData.key}
                                onInteract={onWordInteract}
                            />
                        );
                    } else {
                        // Fallback if word not found in DB
                        return <span key={index} className="text-yellow-400 font-bold">{part}</span>;
                    }
                }
                // Regular text
                return <span key={index}>{part}</span>;
            })}
        </div>
    );
};
