import { useState, useEffect } from 'react';
import { is$Mode } from '../services/api.ob';

export const use$Mode = (): boolean => {
    const [mode, setMode] = useState(is$Mode);
    useEffect(() => {
        const handler = () => setMode(is$Mode());
        window.addEventListener('$modechange', handler);
        window.addEventListener('storage', handler);
        return () => {
            window.removeEventListener('$modechange', handler);
            window.removeEventListener('storage', handler);
        };
    }, []);
    return mode;
};
