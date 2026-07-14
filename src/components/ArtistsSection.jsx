import React, { useMemo } from 'react';
import { Play } from 'lucide-react';
import { usePlayer } from '../context/usePlayer';
import SafeImg from './SafeImg';
import styles from './ArtistsSection.module.css';

export default function ArtistsSection() {
  const { queue, playTrackAt } = usePlayer();

  const artists = useMemo(() => {
    const seen = new Set();
    const list = [];
    for (const track of queue) {
      if (!seen.has(track.artist)) {
        seen.add(track.artist);
        list.push({ name: track.artist, img: track.cover, genre: track.genre });
      }
      if (list.length >= 8) break;
    }
    return list;
  }, [queue]);

  const playArtist = (name) => {
    const idx = queue.findIndex(t => t.artist === name);
    if (idx !== -1) playTrackAt(idx);
  };

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Popular Artists</h2>
        <p className={styles.sub}>Click to play their music</p>
      </div>
      <div className={styles.grid}>
        {artists.map(a => (
          <button key={a.name} className={styles.card} onClick={() => playArtist(a.name)} aria-label={`Play ${a.name}`}>
            <div className={styles.imgWrap}>
              <SafeImg
                src={a.img}
                alt={a.name}
                style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                iconSize={22}
              />
              <div className={styles.hover}><Play size={20} fill="white" /></div>
            </div>
            <h3>{a.name}</h3>
            <p>{a.genre}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
