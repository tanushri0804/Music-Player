import React, { useState } from 'react';
import { genres } from '../data/library';
import { usePlayer } from '../context/usePlayer';
import styles from './GenresSection.module.css';

export default function GenresSection() {
  const { searchAndAdd, playById } = usePlayer();
  const [loading, setLoading] = useState(null);

  const handleGenreClick = async (g) => {
    if (loading) return;
    setLoading(g.name);
    try {
      const tracks = await searchAndAdd(g.query);
      // searchAndAdd appends to queue and returns the fetched tracks.
      // By this point the dispatch has fired; playById reads the latest
      // stateRef so it sees the updated queue.
      if (tracks.length > 0) {
        playById(tracks[0].id);
      }
    } finally {
      setLoading(null);
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Browse Genres</h2>
        <p className={styles.sub}>Tap to load and play</p>
      </div>
      <div className={styles.grid}>
        {genres.map(g => (
          <button
            key={g.name}
            className={`${styles.card} ${loading === g.name ? styles.loading : ''}`}
            style={{ background: g.gradient }}
            onClick={() => handleGenreClick(g)}
            aria-label={`Browse ${g.name}`}
            disabled={!!loading}
          >
            {loading === g.name
              ? <div className={styles.spinner} aria-hidden />
              : <h3>{g.name}</h3>
            }
          </button>
        ))}
      </div>
    </section>
  );
}
