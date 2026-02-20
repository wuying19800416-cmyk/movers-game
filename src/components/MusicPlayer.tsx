import React, { useEffect, useRef, useState } from 'react';
import { VolumeX, Music } from 'lucide-react';

interface MusicPlayerProps {
    src: string;
    initialVolume?: number;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ src, initialVolume = 0.3 }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.volume = initialVolume;
        audio.loop = true;

        const attemptPlay = () => {
            if (!isMuted && !isPlaying) {
                audio.play()
                    .then(() => {
                        setIsPlaying(true);
                        setHasInteracted(true);
                    })
                    .catch((e) => {
                        console.log("Autoplay prevented:", e.message);
                        // We will try again on next interaction
                    });
            }
        };

        // Try to play on mount (might be blocked)
        attemptPlay();

        const handleInteraction = () => {
            if (!hasInteracted) {
                attemptPlay();
            }
        };

        window.addEventListener('click', handleInteraction, { once: true });
        window.addEventListener('keydown', handleInteraction, { once: true });

        return () => {
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
        };
    }, [initialVolume, isMuted, isPlaying, hasInteracted]);

    const toggleMute = () => {
        setIsMuted(prev => !prev);
        const audio = audioRef.current;
        if (audio) {
            if (!isMuted) { // Muting
                audio.pause();
                setIsPlaying(false);
            } else { // Unmuting
                audio.play()
                    .then(() => setIsPlaying(true))
                    .catch(e => console.error("Play failed:", e));
            }
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 animate-fade-in">
            <audio ref={audioRef} src={src} preload="auto" />
            <button
                onClick={toggleMute}
                className={`p-3 rounded-full shadow-lg transition-all active:scale-95 border-4 border-white ${isMuted
                    ? 'bg-slate-200 text-slate-400 hover:bg-slate-300 transform grayscale'
                    : 'bg-gradient-to-tr from-pink-400 to-yellow-400 text-white hover:scale-110 animate-pulse-slow shadow-pink-200'
                    }`}
                title={isMuted ? "Play Music" : "Mute Music"}
                aria-label={isMuted ? "Play Music" : "Mute Music"}
            >
                {isMuted ? <VolumeX size={24} /> : <Music size={24} className="animate-bounce" />}
            </button>
        </div>
    );
};
