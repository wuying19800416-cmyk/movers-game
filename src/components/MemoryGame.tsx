
import React, { useState, useEffect } from 'react';
import { ALL_VOCAB } from '../data/words';
import { Home, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import clsx from 'clsx';

interface Card {
    id: number;
    word: string; // The matching identifier
    content: string; // The display content (word or emoji)
    type: 'word' | 'emoji';
    key: string; // grammatical key for hint
}

interface MemoryGameProps {
    onBack: () => void;
    onSpeak: (text: string) => void;
    onScoreUpdate: (points: number) => void;
}

export const MemoryGame: React.FC<MemoryGameProps> = ({ onBack, onSpeak, onScoreUpdate }) => {
    const [cards, setCards] = useState<Card[]>([]);
    const [flipped, setFlipped] = useState<number[]>([]);
    const [matched, setMatched] = useState<number[]>([]);
    const [locked, setLocked] = useState(false);

    const initializeGame = () => {
        // Select 6 random distinct words
        const shuffledVocab = [...ALL_VOCAB].sort(() => 0.5 - Math.random());
        const selected = shuffledVocab.slice(0, 6);

        const cardPairs: Card[] = [];
        selected.forEach(item => {
            // Word Card
            cardPairs.push({
                id: Math.random(),
                word: item.word,
                content: item.word,
                type: 'word',
                key: item.key
            });
            // Emoji Card
            cardPairs.push({
                id: Math.random(),
                word: item.word,
                content: item.emoji,
                type: 'emoji',
                key: item.key
            });
        });

        // Shuffle cards
        setCards(cardPairs.sort(() => 0.5 - Math.random()));
        setFlipped([]);
        setMatched([]);
        setLocked(false);
    };

    useEffect(() => {
        initializeGame();
    }, []);

    const handleCardClick = (index: number) => {
        if (locked || flipped.includes(index) || matched.includes(index)) return;

        onSpeak(cards[index].type === 'word' ? cards[index].content : cards[index].word);

        const newFlipped = [...flipped, index];
        setFlipped(newFlipped);

        if (newFlipped.length === 2) {
            setLocked(true);
            checkForMatch(newFlipped);
        }
    };

    const checkForMatch = ([first, second]: number[]) => {
        const isMatch = cards[first].word === cards[second].word;

        if (isMatch) {
            onScoreUpdate(10);
            setMatched(prev => [...prev, first, second]);
            setFlipped([]);
            setLocked(false);

            // Check win
            if (matched.length + 2 === cards.length) {
                confetti({
                    particleCount: 150,
                    spread: 80,
                    origin: { y: 0.6 }
                });
                onScoreUpdate(50); // Bonus for clearing
            }
        } else {
            setTimeout(() => {
                setFlipped([]);
                setLocked(false);
            }, 1000);
        }
    };

    return (
        <div className="h-full flex flex-col items-center justify-center p-4 animate-fade-in relative">
            <button onClick={onBack} className="absolute top-4 left-4 p-2 bg-slate-100/50 rounded-full text-slate-400 hover:bg-slate-200 z-10">
                <Home size={20} />
            </button>

            <button onClick={initializeGame} className="absolute top-4 right-4 p-2 bg-indigo-100/50 rounded-full text-indigo-400 hover:bg-indigo-200 z-10 transition-colors">
                <RefreshCw size={20} />
            </button>

            <h2 className="text-2xl font-black text-slate-700 mb-6 tracking-tight">Memory Match</h2>

            <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
                {cards.map((card, index) => {
                    const isFlipped = flipped.includes(index) || matched.includes(index);
                    const isSolved = matched.includes(index);

                    return (
                        <div
                            key={card.id}
                            onClick={() => handleCardClick(index)}
                            className={clsx(
                                "aspect-square rounded-xl cursor-pointer transition-all duration-300 transform perspective-1000 relative shadow-sm",
                                isFlipped ? "rotate-y-0 bg-white" : "bg-sky-500 hover:bg-sky-400 active:scale-95",
                                isSolved && "opacity-50 ring-4 ring-emerald-200 bg-emerald-50",
                                !isFlipped && !isSolved && "shadow-[0_4px_0_var(--color-dark)]"
                            )}
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            {/* Front (Content) */}
                            <div className={clsx(
                                "absolute inset-0 flex flex-col items-center justify-center backface-hidden transition-opacity duration-300",
                                isFlipped ? "opacity-100" : "opacity-0"
                            )}>
                                {card.type === 'word' ? (
                                    <div className="flex flex-col items-center">
                                        <span className="text-sm font-bold text-sky-700 uppercase break-words px-1 text-center leading-tight">
                                            {card.content}
                                        </span>
                                        <span className="text-[10px] text-sky-400 mt-1">{card.key}</span>
                                    </div>
                                ) : (
                                    <span className="text-4xl">{card.content}</span>
                                )}
                            </div>

                            {/* Back (Pattern) */}
                            <div className={clsx(
                                "absolute inset-0 flex items-center justify-center backface-hidden",
                                isFlipped ? "opacity-0" : "opacity-100"
                            )}>
                                <span className="text-white/30 text-2xl font-black">?</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
