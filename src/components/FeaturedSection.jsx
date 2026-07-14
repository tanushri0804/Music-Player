import React from 'react';
import { Play, Pause } from 'lucide-react';
import { usePlayer } from '../context/usePlayer';
import SafeImg from './SafeImg';
import styles from './FeaturedSection.module.css';

const BADGES = ['New Release', 'Trending', 'Popular', "Editor's Pick", 'Hot', 'Fresh'];

export default function FeaturedSection() {
  const { queue, playTrackAt, togglePlay, currentTrack, isPlaying } = usePlayer();
  const featured = queue.slice(0, 4);

  const handlePlay = (index) => {
    if (currentTrack?.id === queue[index]?.id) togglePlay();
    else playTrackAt(index);
  };

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Featured This Week</h2>
          <p className={styles.sub}>New releases and trending music</p>
        </div>
      </div>
      <div className={styles.grid}>
        {featured.map((track, i) => {
          const active  = currentTrack?.id === track.id;
          const playing = active && isPlaying;
          return (
            <div
              key={track.id}
              className={`${styles.card} ${active ? styles.cardActive : ''}`}
              onClick={() => handlePlay(i)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && handlePlay(i)}
              aria-label={`${playing ? 'Pause' : 'Play'} ${track.title}`}
            >
              <div className={styles.imgWrap}>
                <SafeImg
                  src={track.cover}
                  alt={track.title}
                  style={{ width: '100%', height: '100%', borderRadius: 0 }}
                  iconSize={28}
                />
                <div className={styles.badge}>{BADGES[i % BADGES.length]}</div>
                <div className={styles.playOverlay}>
                  <button className={styles.playBtn} aria-hidden tabIndex={-1}>
                    {playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                  </button>
                </div>
              </div>
              <div className={styles.info}>
                <h3>{track.title}</h3>
                <p>{track.artist}</p>
              </div>
              {active && <div className={styles.activeLine} aria-hidden />}
            </div>
          );
        })}
      </div>
    </section>
  );
}
