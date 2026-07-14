import React from 'react';
import { Heart } from 'lucide-react';
import { usePlayer } from '../context/usePlayer';
import SafeImg from './SafeImg';
import styles from './TrackList.module.css';

function formatPlays(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`;
  return n;
}

export default function TrackList({ tracks }) {
  const { playTrackAt, currentTrack, isPlaying, queue, liked, toggleLike } = usePlayer();

  const handlePlay = (trackId) => {
    const idx = queue.findIndex(t => t.id === trackId);
    if (idx !== -1) playTrackAt(idx);
  };

  return (
    <div className={styles.list}>
      {tracks.map((track, i) => {
        const active  = currentTrack?.id === track.id;
        const playing = active && isPlaying;
        const isLiked = liked.find(l => l.id === track.id)?.liked ?? false;

        return (
          <div
            key={track.id}
            className={`${styles.row} ${active ? styles.active : ''}`}
            onClick={() => handlePlay(track.id)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && handlePlay(track.id)}
            aria-label={`Play ${track.title}`}
          >
            <span className={styles.num}>
              {playing
                ? <span className={styles.bars} aria-hidden><span /><span /><span /></span>
                : <span className={styles.idxNum}>{i + 1}</span>
              }
            </span>

            <SafeImg
              src={track.cover}
              alt={track.title}
              className={styles.cover}
              iconSize={14}
            />

            <div className={styles.info}>
              <p className={styles.trackTitle}>{track.title}</p>
              <p className={styles.artist}>{track.artist}</p>
            </div>

            <p className={styles.album}>{track.album}</p>
            <p className={styles.plays}>{formatPlays(track.plays)}</p>

            <button
              className={`${styles.likeBtn} ${isLiked ? styles.liked : ''}`}
              onClick={e => { e.stopPropagation(); toggleLike(track.id); }}
              aria-label={isLiked ? 'Unlike' : 'Like'}
            >
              <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
            </button>

            <span className={styles.dur}>{track.duration}</span>
          </div>
        );
      })}
    </div>
  );
}
