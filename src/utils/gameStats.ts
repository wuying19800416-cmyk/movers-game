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
                // Merge with default stats to ensure all keys exist (e.g. if new game modes are added)
                const defaults = defaultStats();
                const merged: GameStats = { ...defaults };

                // Deep merge known keys
                (Object.keys(defaults) as (keyof GameStats)[]).forEach(key => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    if ((parsed as any)[key]) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        merged[key] = (parsed as any)[key];
                    }
                });

                return merged;
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
