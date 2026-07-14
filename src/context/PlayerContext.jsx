import React, {
  createContext, useReducer,
  useRef, useEffect, useCallback, useState
} from 'react';
import { fetchStarterLibrary, searchTracks } from '../services/musicApi';

export const PlayerContext = createContext(null);

const initialState = {
  queue:        [],
  currentIndex: 0,
  isPlaying:    false,
  isShuffle:    false,
  isRepeat:     false,
  volume:       0.7,
  currentTime:  0,
  duration:     0,
  liked:        [],
  loading:      true,
  error:        null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_QUEUE':
      return {
        ...state,
        queue:   action.payload,
        liked:   action.payload.map(t => ({ id: t.id, liked: false })),
        loading: false,
      };
    case 'APPEND_QUEUE': {
      const existingIds = new Set(state.queue.map(t => t.id));
      const fresh       = action.payload.filter(t => !existingIds.has(t.id));
      return {
        ...state,
        queue: [...state.queue, ...fresh],
        liked: [...state.liked, ...fresh.map(t => ({ id: t.id, liked: false }))],
      };
    }
    case 'SET_PLAYING':  return { ...state, isPlaying:    action.payload };
    case 'SET_INDEX':    return { ...state, currentIndex: action.payload };
    case 'SET_SHUFFLE':  return { ...state, isShuffle:    action.payload };
    case 'SET_REPEAT':   return { ...state, isRepeat:     action.payload };
    case 'SET_VOLUME':   return { ...state, volume:       action.payload };
    case 'SET_TIME':     return { ...state, currentTime:  action.payload };
    case 'SET_DURATION': return { ...state, duration:     action.payload };
    case 'SET_ERROR':    return { ...state, error: action.payload, loading: false };
    case 'TOGGLE_LIKE':  return {
      ...state,
      liked: state.liked.map(l =>
        l.id === action.payload ? { ...l, liked: !l.liked } : l
      ),
    };
    default: return state;
  }
}

export function PlayerProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [searchLoading, setSearchLoading] = useState(false);

  // Always-current snapshot of state for use inside stable callbacks
  const stateRef     = useRef(state);
  const audioRef     = useRef(new Audio());
  const skipGuardRef = useRef(false);
  const skipCountRef = useRef(0);

  useEffect(() => { stateRef.current = state; }, [state]);

  // ── Fetch starter library ──────────────────────────────────────────
  useEffect(() => {
    fetchStarterLibrary()
      .then(tracks => {
        if (!tracks.length) throw new Error('No tracks returned from API');
        dispatch({ type: 'SET_QUEUE', payload: tracks });
      })
      .catch(err => {
        console.error('Library load failed:', err);
        dispatch({ type: 'SET_ERROR', payload: err.message });
      });
  }, []);

  // ── Track change: load audio, auto-play if needed ──────────────────
  useEffect(() => {
    const { queue, currentIndex, isPlaying, volume } = stateRef.current;
    const track = queue[currentIndex];
    if (!track) return;

    const audio  = audioRef.current;
    audio.src    = track.song;
    audio.volume = volume;
    audio.load();
    dispatch({ type: 'SET_TIME',     payload: 0 });
    dispatch({ type: 'SET_DURATION', payload: 0 });

    if (isPlaying) {
      audio.play()
        .then(() => {
          skipGuardRef.current = false;
          skipCountRef.current = 0;
        })
        .catch(() => {
          dispatch({ type: 'SET_PLAYING', payload: false });
          // Auto-skip broken tracks but stop after full loop
          if (!skipGuardRef.current) {
            skipGuardRef.current = true;
            skipCountRef.current++;
            if (skipCountRef.current < stateRef.current.queue.length) {
              goNext();
            }
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentIndex, state.queue]);

  // ── Volume sync ────────────────────────────────────────────────────
  useEffect(() => {
    audioRef.current.volume = state.volume;
  }, [state.volume]);

  // ── Audio events — set up once, read state via ref ─────────────────
  useEffect(() => {
    const audio = audioRef.current;

    const onTime  = () => dispatch({ type: 'SET_TIME',     payload: audio.currentTime });
    const onMeta  = () => dispatch({ type: 'SET_DURATION', payload: audio.duration   });
    const onPlay  = () => dispatch({ type: 'SET_PLAYING',  payload: true  });
    const onPause = () => dispatch({ type: 'SET_PLAYING',  payload: false });
    const onEnded = () => {
      if (stateRef.current.isRepeat) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        goNext();
      }
    };

    audio.addEventListener('timeupdate',     onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('play',           onPlay);
    audio.addEventListener('pause',          onPause);
    audio.addEventListener('ended',          onEnded);
    return () => {
      audio.removeEventListener('timeupdate',     onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('play',           onPlay);
      audio.removeEventListener('pause',          onPause);
      audio.removeEventListener('ended',          onEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Actions ────────────────────────────────────────────────────────

  const togglePlay = useCallback(() => {
    stateRef.current.isPlaying
      ? audioRef.current.pause()
      : audioRef.current.play().catch(() => {});
  }, []);

  const goNext = useCallback(() => {
    const { queue, currentIndex, isShuffle } = stateRef.current;
    if (!queue.length) return;
    const next = isShuffle
      ? Math.floor(Math.random() * queue.length)
      : (currentIndex + 1) % queue.length;
    skipGuardRef.current = false;
    dispatch({ type: 'SET_INDEX', payload: next });
  }, []);

  const goPrev = useCallback(() => {
    if (audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }
    const { queue, currentIndex } = stateRef.current;
    if (!queue.length) return;
    const prev = (currentIndex - 1 + queue.length) % queue.length;
    dispatch({ type: 'SET_INDEX', payload: prev });
  }, []);

  const playTrackAt = useCallback((index) => {
    skipGuardRef.current = false;
    skipCountRef.current = 0;
    dispatch({ type: 'SET_INDEX',   payload: index });
    dispatch({ type: 'SET_PLAYING', payload: true  });
  }, []);

  // Play by track id. Works even right after APPEND_QUEUE because we
  // search stateRef which is updated synchronously in the same tick
  // via the useEffect above. If not found yet we retry once on next frame.
  const playById = useCallback((id) => {
    const tryPlay = (retries = 0) => {
      const idx = stateRef.current.queue.findIndex(t => t.id === id);
      if (idx !== -1) {
        skipGuardRef.current = false;
        skipCountRef.current = 0;
        dispatch({ type: 'SET_INDEX',   payload: idx  });
        dispatch({ type: 'SET_PLAYING', payload: true });
      } else if (retries < 5) {
        // Queue hasn't re-rendered into stateRef yet — retry next frame
        requestAnimationFrame(() => tryPlay(retries + 1));
      }
    };
    tryPlay();
  }, []);

  const seek = useCallback((time) => {
    audioRef.current.currentTime = time;
    dispatch({ type: 'SET_TIME', payload: time });
  }, []);

  const toggleLike = useCallback((trackId) => {
    const id = trackId ?? stateRef.current.queue[stateRef.current.currentIndex]?.id;
    if (id != null) dispatch({ type: 'TOGGLE_LIKE', payload: id });
  }, []);

  const toggleShuffle = useCallback(() => {
    dispatch({ type: 'SET_SHUFFLE', payload: !stateRef.current.isShuffle });
  }, []);

  const toggleRepeat = useCallback(() => {
    dispatch({ type: 'SET_REPEAT', payload: !stateRef.current.isRepeat });
  }, []);

  const setVolume = useCallback((v) => {
    dispatch({ type: 'SET_VOLUME', payload: v });
  }, []);

  const searchAndAdd = useCallback(async (query) => {
    setSearchLoading(true);
    try {
      const tracks = await searchTracks(query, 20);
      if (tracks.length > 0) {
        dispatch({ type: 'APPEND_QUEUE', payload: tracks });
      }
      return tracks;
    } finally {
      setSearchLoading(false);
    }
  }, []);

  // ── Derived values ─────────────────────────────────────────────────
  const currentTrack = state.queue[state.currentIndex] ?? null;
  const isLiked      = currentTrack
    ? (state.liked.find(l => l.id === currentTrack.id)?.liked ?? false)
    : false;

  return (
    <PlayerContext.Provider value={{
      ...state,
      currentTrack,
      isLiked,
      searchLoading,
      audioRef,
      togglePlay,
      next:          goNext,
      prev:          goPrev,
      playTrackAt,
      playById,
      seek,
      toggleLike,
      toggleShuffle,
      toggleRepeat,
      setVolume,
      searchAndAdd,
    }}>
      {children}
    </PlayerContext.Provider>
  );
}
