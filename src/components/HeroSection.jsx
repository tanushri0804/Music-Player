import React from 'react';
import { Play, Pause } from 'lucide-react';
import { usePlayer } from '../context/usePlayer';
import SafeImg from './SafeImg';
import styles from './HeroSection.module.css';

export default function HeroSection() {
  const { queue, playTrackAt, togglePlay, isPlaying, currentTrack } = usePlayer();
  const featured = queue[0];
  if (!featured) return null;

  const isActive = currentTrack?.id === featured.id;

  return (
    <section className={styles.hero}>
      {/* Blurred background from album art */}
      {featured.cover && (
        <div
          className={styles.bgBlur}
          style={{ backgroundImage: `url(${featured.cover})` }}
          aria-hidden
        />
      )}
      <div className={styles.overlay} aria-hidden />

      <div className={styles.content}>
        <span className={styles.tag}>Featured Now</span>
        <h1 className={styles.title}>{featured.title}</h1>
        <p className={styles.artist}>{featured.artist}</p>
        {featured.album && <p className={styles.album}>{featured.album}</p>}
        <button
          className={`${styles.playBtn} ${isActive && isPlaying ? styles.playing : ''}`}
          onClick={() => isActive ? togglePlay() : playTrackAt(0)}
        >
          {isActive && isPlaying
            ? <><Pause size={18} fill="currentColor" /> Now Playing</>
            : <><Play  size={18} fill="currentColor" /> Play Now</>
          }
        </button>
      </div>

      {/* Album art */}
      <div className={styles.imgWrap}>
        <SafeImg
          src={featured.cover}
          alt={featured.title}
          style={{ width: '100%', height: '100%', borderRadius: 0 }}
          iconSize={48}
        />
        <div className={styles.imgGlow} aria-hidden />
      </div>
    </section>
  );
}
