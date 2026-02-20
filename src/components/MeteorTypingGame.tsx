import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ALL_VOCAB } from '../data/words';
import { Keyboard, Heart, Trophy, RefreshCw, ChevronLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MeteorTypingGameProps {
    onBack: () => void;
    onScoreUpdate: (points: number) => void;
}

interface GameWord {
    q: string;
    a: string;
    emoji: string;
}

class Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    color: string;

    constructor(x: number, y: number, color: string) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.life = 1.0;
        this.color = color;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= 0.02;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class Star {
    x: number;
    y: number;
    size: number;
    speed: number;

    constructor(width: number, height: number) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2;
        this.speed = Math.random() * 0.5 + 0.1;
    }

    update(width: number, height: number) {
        this.y += this.speed;
        if (this.y > height) {
            this.y = -10;
            this.x = Math.random() * width;
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Meteor {
    x: number;
    y: number;
    text: string;
    answer: string;
    speed: number;
    id: number;
    width: number = 0;
    emoji: string;

    constructor(x: number, text: string, answer: string, emoji: string, speed: number, id: number) {
        this.x = x;
        this.y = -50;
        this.text = text;
        this.answer = answer.toLowerCase();
        this.emoji = emoji;
        this.speed = speed;
        this.id = id;
    }

    update() {
        this.y += this.speed;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();

        // Meteor Glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#f59e0b';

        // Meteor Body
        const gradient = ctx.createRadialGradient(this.x, this.y, 5, this.x, this.y, 20);
        gradient.addColorStop(0, '#fbbf24');
        gradient.addColorStop(1, '#ea580c');

        ctx.beginPath();
        ctx.arc(this.x, this.y, 18, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Emoji
        ctx.font = '20px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.emoji, this.x, this.y);

        // Text Label
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
        const textWidth = ctx.measureText(this.text).width;
        ctx.roundRect(this.x - textWidth / 2 - 8, this.y + 30, textWidth + 16, 24, 8);
        ctx.fill();

        ctx.fillStyle = 'white';
        ctx.font = 'bold 16px "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(this.text, this.x, this.y + 47);

        ctx.restore();
    }
}

export const MeteorTypingGame: React.FC<MeteorTypingGameProps> = ({ onBack, onScoreUpdate }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [inputValue, setInputValue] = useState('');
    const [hp, setHp] = useState(100);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(() => {
        const saved = localStorage.getItem('typing-highscore');
        return saved ? parseInt(saved) : 0;
    });
    const [level, setLevel] = useState(1);
    const [customWords, setCustomWords] = useState<GameWord[]>([]);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [importText, setImportText] = useState('');
    const [gameMode, setGameMode] = useState<'en' | 'cn'>('en');
    const [missedWords, setMissedWords] = useState<GameWord[]>([]);
    const [showReview, setShowReview] = useState(false);

    const meteorsRef = useRef<Meteor[]>([]);
    const particlesRef = useRef<Particle[]>([]);
    const starsRef = useRef<Star[]>([]);
    const nextMeteorIdRef = useRef(0);
    const lastSpawnTimeRef = useRef(0);
    const requestRef = useRef<number>(null);

    // Version control to force reset on HMR/updates
    const GAME_VERSION = '1.3-super-slow';
    const lastVersionRef = useRef(GAME_VERSION);

    const resetGame = () => {
        setHp(100);
        setScore(0);
        setGameOver(false);
        setLevel(1);
        meteorsRef.current = [];
        setInputValue('');
        setMissedWords([]);
        setShowReview(false);
    };

    useEffect(() => {
        if (lastVersionRef.current !== GAME_VERSION) {
            lastVersionRef.current = GAME_VERSION;
            resetGame();
        }
    }, [GAME_VERSION]);



    const getWordList = useCallback((): GameWord[] => {
        if (customWords.length > 0) return customWords;
        return ALL_VOCAB.map(v => ({ q: v.word, a: v.word, emoji: v.emoji }));
    }, [customWords]);

    const spawnMeteor = useCallback(() => {
        const words = getWordList();
        const wordItem = words[Math.floor(Math.random() * words.length)];
        const x = Math.max(50, Math.min((canvasRef.current?.width || 400) - 50, Math.random() * (canvasRef.current?.width || 400)));
        // Super slow speed for Grade 1 (10% of original)
        const speed = (0.5 + Math.random() * 0.5 + (level * 0.1)) * 0.1;

        const displayText = gameMode === 'en' ? wordItem.q : wordItem.a;

        const newMeteor = new Meteor(
            x,
            displayText,
            wordItem.a,
            wordItem.emoji,
            speed,
            nextMeteorIdRef.current++
        );
        meteorsRef.current.push(newMeteor);
    }, [level, gameMode, getWordList]);

    const update = (time: number) => {
        if (gameOver) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw background stars
        if (starsRef.current.length === 0) {
            for (let i = 0; i < 50; i++) starsRef.current.push(new Star(canvas.width, canvas.height));
        }
        starsRef.current.forEach(star => {
            star.update(canvas.width, canvas.height);
            star.draw(ctx);
        });

        // Spawn logic - 4s to 10s interval
        const spawnInterval = Math.max(4000, 10000 - level * 400);
        if (time - lastSpawnTimeRef.current > spawnInterval) {
            spawnMeteor();
            lastSpawnTimeRef.current = time;
        }

        // Update and draw particles
        const remainingParticles: Particle[] = [];
        particlesRef.current.forEach(p => {
            p.update();
            p.draw(ctx);
            if (p.life > 0) remainingParticles.push(p);
        });
        particlesRef.current = remainingParticles;

        // Update and draw meteors
        const remainingMeteors: Meteor[] = [];
        meteorsRef.current.forEach(meteor => {
            meteor.update();
            meteor.draw(ctx);

            if (meteor.y > canvas.height) {
                // Hits earth
                setMissedWords(prev => {
                    const exists = prev.some(w => w.a === meteor.answer);
                    if (exists) return prev;
                    return [...prev, { q: meteor.text, a: meteor.answer, emoji: meteor.emoji }];
                });
                setHp(prev => {
                    const next = prev - 10;
                    if (next <= 0) {
                        setGameOver(true);
                        // Game Over Speech
                        const utterance = new SpeechSynthesisUtterance("Game Over! Earth has been hit.");
                        utterance.rate = 0.9;
                        window.speechSynthesis.speak(utterance);
                        return 0;
                    }
                    return next;
                });
            } else {
                remainingMeteors.push(meteor);
            }
        });
        meteorsRef.current = remainingMeteors;

        requestRef.current = requestAnimationFrame(update);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(update);
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [gameOver, level]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInputValue(val);

        const targetMeteorIndex = meteorsRef.current.findIndex(m => m.answer === val.toLowerCase().trim());
        if (targetMeteorIndex !== -1) {
            // Hit!
            const meteor = meteorsRef.current[targetMeteorIndex];
            meteorsRef.current.splice(targetMeteorIndex, 1);
            setInputValue('');
            onScoreUpdate(10);

            // Update Score and High Score
            setScore(prev => {
                const newScore = prev + 10;
                if (newScore % 100 === 0) {
                    setLevel(l => l + 1);
                }

                setHighScore(prevHigh => {
                    if (newScore > prevHigh) {
                        localStorage.setItem('typing-highscore', newScore.toString());
                        return newScore;
                    }
                    return prevHigh;
                });

                return newScore;
            });

            // Create particles
            for (let i = 0; i < 20; i++) {
                particlesRef.current.push(new Particle(meteor.x, meteor.y, '#fbbf24'));
            }

            confetti({
                particleCount: 50,
                spread: 40,
                origin: { x: meteor.x / canvasRef.current!.width, y: meteor.y / canvasRef.current!.height }
            });
        }
    };



    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = canvas.parentElement?.clientWidth || 400;
            canvas.height = canvas.parentElement?.clientHeight || 600;
        }
    }, []);

    const handleImport = () => {
        try {
            const parsed = JSON.parse(importText);
            if (Array.isArray(parsed) && parsed.length > 0) {
                // Validate structure
                const isValid = parsed.every(item => item.q && item.a);
                if (isValid) {
                    setCustomWords(parsed.map(item => ({
                        q: item.q,
                        a: item.a,
                        emoji: item.emoji || '☄️'
                    })));
                    setIsImportModalOpen(false);
                    resetGame();
                    alert('Words imported successfully! 🚀');
                } else {
                    alert('Invalid format. Each item must have "q" and "a".');
                }
            }
        } catch {
            alert('JSON parse error. Please check your input.');
        }
    };

    return (
        <div className="flex-1 flex flex-col relative bg-slate-900 overflow-hidden">
            {/* HUD */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10 pointer-events-none">
                <div className="flex flex-col gap-2">
                    <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 flex items-center gap-3">
                        <Heart className={hp < 30 ? "text-red-500 animate-pulse" : "text-red-500"} fill="currentColor" />
                        <div className="w-32 h-3 bg-slate-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-red-500 to-pink-500 transition-all duration-300"
                                style={{ width: `${hp}%` }}
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 pointer-events-auto">
                        <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 inline-flex items-center gap-2">
                            <RefreshCw size={16} className="text-blue-400" />
                            <span className="font-bold text-white">LV. {level}</span>
                        </div>
                        <button
                            onClick={() => setGameMode(prev => prev === 'en' ? 'cn' : 'en')}
                            className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 inline-flex items-center gap-2 hover:bg-white/10 transition-colors"
                        >
                            <span className="text-xs uppercase font-bold text-slate-400">Mode:</span>
                            <span className="font-bold text-blue-400">{gameMode === 'en' ? 'Original' : 'Translation'}</span>
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-2 items-end">
                    <div className="flex flex-col items-end">
                        <div className="bg-black/50 backdrop-blur-md px-6 py-2 rounded-2xl border border-white/20 flex items-center gap-3">
                            <Trophy className="text-yellow-400" />
                            <span className="text-2xl font-black text-yellow-400">{score}</span>
                        </div>
                        <div className="text-xs font-bold text-slate-500 mt-1 mr-2">
                            BEST: <span className="text-slate-300">{highScore}</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsImportModalOpen(true)}
                        className="bg-black/50 backdrop-blur-md px-3 py-1 text-xs rounded-xl border border-white/10 text-slate-400 hover:text-white pointer-events-auto"
                    >
                        Import Words
                    </button>
                </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 relative">
                <canvas
                    ref={canvasRef}
                    className="w-full h-full block"
                />

                {/* Earth Line */}
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 shadow-[0_-4px_20px_rgba(239,68,68,0.5)]"></div>
            </div>

            {/* Input Area */}
            <div className="p-6 bg-slate-800/80 backdrop-blur-xl border-t border-white/10 flex items-center gap-4 z-20">
                <div className="relative flex-1">
                    <Keyboard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        autoFocus
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        disabled={gameOver}
                        placeholder="Type the falling words..."
                        // eslint-disable-next-line react-hooks/refs
                        className={`w-full bg-slate-950 border-2 rounded-2xl py-4 pl-12 pr-4 text-xl font-bold outline-none transition-all placeholder:text-slate-600 shadow-inner text-white ${meteorsRef.current.some(m => m.answer.startsWith(inputValue.toLowerCase().trim()))
                            ? 'border-slate-700 focus:border-blue-500'
                            : 'border-red-500 text-red-200'
                            }`}
                    />
                </div>
                <button
                    onClick={onBack}
                    className="p-4 bg-slate-700 hover:bg-slate-600 rounded-2xl transition-all active:scale-95"
                    title="Main Menu"
                >
                    <ChevronLeft size={24} />
                </button>
            </div>

            {/* Game Over Overlay */}
            {gameOver && (
                <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-8 animate-fade-in">
                    <div className="text-8xl mb-6">💥</div>
                    <h2 className="text-5xl font-black text-white mb-2">Game Over!</h2>
                    <p className="text-slate-400 text-xl mb-8">Earth has been hit too many times...</p>

                    <div className="bg-white/10 rounded-3xl p-8 w-full max-w-xs text-center border border-white/10 mb-8">
                        <div className="text-slate-400 font-bold uppercase tracking-wider text-sm mb-1">Final Score</div>
                        <div className="text-6xl font-black text-yellow-400">{score}</div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={onBack}
                            className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 px-8 rounded-2xl transition-all active:scale-95"
                        >
                            Main Menu
                        </button>
                        <button
                            onClick={resetGame}
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-2"
                        >
                            <RefreshCw size={20} />
                            Try Again
                        </button>
                        {missedWords.length > 0 && (
                            <button
                                onClick={() => setShowReview(true)}
                                className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 px-8 rounded-2xl transition-all active:scale-95 flex items-center gap-2"
                            >
                                Review Missed
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Review Modal */}
            {showReview && (
                <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl z-[100] flex flex-col p-8 animate-fade-in">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-4xl font-black text-white">Review Missed Words</h2>
                            <p className="text-slate-400">Study these words to save Earth next time!</p>
                        </div>
                        <button
                            onClick={() => setShowReview(false)}
                            className="bg-slate-800 p-4 rounded-2xl text-white hover:bg-slate-700"
                        >
                            Close
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4 pb-8">
                        {missedWords.map((word, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center gap-6 group hover:bg-white/10 transition-all">
                                <span className="text-4xl">{word.emoji}</span>
                                <div className="flex-1">
                                    <div className="text-2xl font-black text-white">{word.q}</div>
                                    <div className="text-slate-400 font-bold">{word.a}</div>
                                </div>
                                <button
                                    onClick={() => {
                                        const ut = new SpeechSynthesisUtterance(word.q);
                                        window.speechSynthesis.speak(ut);
                                    }}
                                    className="bg-blue-500/20 text-blue-400 p-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    🔊
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {/* Import Modal */}
            {isImportModalOpen && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-6">
                    <div className="bg-slate-900 border border-white/10 rounded-[32px] p-8 w-full max-w-lg shadow-2xl animate-scale-in">
                        <h3 className="text-2xl font-black mb-2">Import Custom Words</h3>
                        <p className="text-slate-400 text-sm mb-6">Paste your JSON word list below. Format: <br /> <code>[{"{\"q\": \"Apple\", \"a\": \"蘋果\", \"emoji\": \"🍎\"}"}, ...]</code></p>

                        <textarea
                            value={importText}
                            onChange={(e) => setImportText(e.target.value)}
                            placeholder='[{"q": "Hello", "a": "你好"}]'
                            className="w-full h-48 bg-slate-950 border-2 border-slate-800 rounded-2xl p-4 font-mono text-sm focus:border-blue-500 outline-none transition-all mb-6"
                        />

                        <div className="flex gap-4">
                            <button
                                onClick={() => setIsImportModalOpen(false)}
                                className="flex-1 bg-slate-800 hover:bg-slate-700 font-bold py-4 rounded-2xl"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleImport}
                                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/20"
                            >
                                Import
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
