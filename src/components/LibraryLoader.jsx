import React from 'react';
import { Music2 } from 'lucide-react';
import styles from './LibraryLoader.module.css';

export default function LibraryLoader() {
  return (
    <div className={styles.root}>
      <div className={styles.icon}>
        <Music2 size={32} />
      </div>
      <div className={styles.bars}>
        {[0,1,2,3,4].map(i => (
          <div key={i} className={styles.bar} style={{ animationDelay: `${i * 0.12}s` }} />
        ))}
      </div>
      <p className={styles.label}>Loading your music…</p>
      <p className={styles.sub}>Fetching songs from iTunes</p>
    </div>
  );
}
