import React from 'react';
import { X } from 'lucide-react';
import { usePlayer } from '../context/usePlayer';
import SafeImg from './SafeImg';
import styles from './QueueModal.module.css';

export default function QueueModal({ onClose }) {
  const { queue, currentIndex, playTrackAt } = usePlayer();

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal aria-label="Queue">
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>Queue <span className={styles.count}>{queue.length} tracks</span></h3>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>
        <div className={styles.list}>
          {queue.map((track, i) => {
            const active = i === currentIndex;
            return (
              <button
                key={`${track.id}-${i}`}
                className={`${styles.item} ${active ? styles.active : ''}`}
                onClick={() => playTrackAt(i)}
                aria-label={`Play ${track.title}`}
              >
                <SafeImg
                  src={track.cover}
                  alt={track.title}
                  style={{ width: 38, height: 38, borderRadius: 6, flexShrink: 0 }}
                  iconSize={12}
                />
                <div className={styles.info}>
                  <p className={styles.title}>{track.title}</p>
                  <p className={styles.artist}>{track.artist}</p>
                </div>
                <span className={styles.dur}>{track.duration}</span>
                {active && <span className={styles.nowBadge}>NOW</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
