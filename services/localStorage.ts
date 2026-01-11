import { ContentItem } from '../types';

const KEYS = {
    FAVORITES: 'omnistream_favorites',
    HISTORY: 'omnistream_history'
};

export const getFavorites = (): ContentItem[] => {
    try {
        const data = localStorage.getItem(KEYS.FAVORITES);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
};

export const isFavorite = (id: string): boolean => {
    const favs = getFavorites();
    return favs.some(item => item.id === id);
};

export const toggleFavorite = (item: ContentItem): boolean => {
    const favs = getFavorites();
    const index = favs.findIndex(f => f.id === item.id);
    let newFavs;
    let isAdded = false;

    if (index > -1) {
        newFavs = favs.filter(f => f.id !== item.id);
    } else {
        const minimalItem: ContentItem = {
            id: item.id,
            title: item.title,
            type: item.type,
            coverImage: item.coverImage,
            backdropImage: item.backdropImage,
            description: item.description, 
            rating: item.rating,
            year: item.year,
            tags: item.tags
        };
        newFavs = [minimalItem, ...favs];
        isAdded = true;
    }

    localStorage.setItem(KEYS.FAVORITES, JSON.stringify(newFavs));
    return isAdded;
};

export interface HistoryItem extends ContentItem {
    lastViewedAt: number;
    lastChapterName?: string; 
    lastChapterId?: string;   
    lastEpisodeName?: string; 
    lastEpisodeNumber?: number; 
}

export const getHistory = (): HistoryItem[] => {
    try {
        const data = localStorage.getItem(KEYS.HISTORY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
};

export const addToHistory = (item: ContentItem, meta?: { chapterName?: string, chapterId?: string, episodeName?: string, episodeNumber?: number }) => {
    const history = getHistory();
    const filtered = history.filter(h => h.id !== item.id);
    
    const newItem: HistoryItem = {
        id: item.id,
        title: item.title,
        type: item.type,
        coverImage: item.coverImage,
        backdropImage: item.backdropImage,
        description: item.description,
        rating: item.rating,
        year: item.year,
        tags: item.tags,
        lastViewedAt: Date.now(),
        lastChapterName: meta?.chapterName,
        lastChapterId: meta?.chapterId,
        lastEpisodeName: meta?.episodeName,
        lastEpisodeNumber: meta?.episodeNumber
    };

    const newHistory = [newItem, ...filtered].slice(0, 20); 
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(newHistory));
};

export const clearHistory = () => {
    localStorage.removeItem(KEYS.HISTORY);
};