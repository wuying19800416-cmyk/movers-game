import type { GameMode } from '../types';

// localStorage key for game stats
export const STATS_KEY = 'movers-game-stats';

export interface GameModeStats {
    played: number;
    completed: number;
}

export interface GameStats {
    memory: GameModeStats;
    spelling: GameModeStats;
    fillBlanks: GameModeStats;
    listening: GameModeStats;
    category: GameModeStats;
    typing: GameModeStats;
    adventure: GameModeStats;
}

export const defaultStats = (): GameStats => ({
    memory: { played: 0, completed: 0 },
    spelling: { played: 0, completed: 0 },
    fillBlanks: { played: 0, completed: 0 },
    listening: { played: 0, completed: 0 },
    category: { played: 0, completed: 0 },
    typing: { played: 0, completed: 0 },
    adventure: { played: 0, completed: 0 }
});

export const getGameStats = (): GameStats => {
    try {
        const stored = localStorage.getItem(STATS_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                // Migrate old format if needed
                if (typeof parsed.memory === 'number') {
                    const migrated: GameStats = {
                        memory: { played: parsed.memory || 0, completed: 0 },
                        spelling: { played: parsed.spelling || 0, completed: 0 },
                        fillBlanks: { played: parsed.fillBlanks || 0, completed: 0 },
                        listening: { played: parsed.listening || 0, completed: 0 },
                        category: { played: parsed.category || 0, completed: 0 },
                        typing: { played: 0, completed: 0 },
                        adventure: { played: 0, completed: 0 }
                    };
                    localStorage.setItem(STATS_KEY, JSON.stringify(migrated));
                    return migrated;
                }
                return parsed;
            } catch {
                return defaultStats();
            }
        }
    } catch (e) {
        console.warn('Failed to access localStorage:', e);
    }
    return defaultStats();
};

export const incrementGameStat = (mode: GameMode) => {
    try {
        const stats = getGameStats();
        if (mode !== 'menu') {
            stats[mode].played++;
            localStorage.setItem(STATS_KEY, JSON.stringify(stats));
        }
    } catch (e) {
        console.warn('Failed to write stats:', e);
    }
};

// Export this function for game components to call
export const recordCompletion = (mode: GameMode) => {
    try {
        const stats = getGameStats();
        if (mode !== 'menu') {
            stats[mode].completed++;
            localStorage.setItem(STATS_KEY, JSON.stringify(stats));
        }
    } catch (e) {
        console.warn('Failed to write stats completion:', e);
    }
};
