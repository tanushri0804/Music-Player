import { useContext } from 'react';
import { PlayerContext } from './PlayerContext';

// Separated so Vite Fast Refresh is happy (hook + component in same file = warning)
export const usePlayer = () => useContext(PlayerContext);
