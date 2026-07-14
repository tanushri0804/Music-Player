import React, { useRef } from 'react';
import {
  Play, Pause, SkipBack, SkipForward,
  Shuffle, Repeat, Volume2, VolumeX,
  Heart, List
} from 'lucide-react';
import { usePlayer } from '../context/usePlayer';
import SafeImg from './SafeImg';
import styles from './Player.module.css';

function fmt(s) {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec < 10 ? '0' : ''}${sec}`;
}

export default function Player({ onQueueClick }) {
  const {
    currentTrack, isPlaying, isShuffle, isRepeat,
    volume, currentTime, duration, isLiked,
    togglePlay, next, prev, toggleShuffle, toggleRepeat,
    seek, setVolume, toggleLike,
  } = usePlayer();

  const barRef = useRef(null);
  const progress = duration ? (currentTime / duration) * 100 : 0;

  const handleBarClick = (e) => {
    const rect = barRef.current.getBoundingClientRect();
    seek(((e.clientX - rect.left) / rect.width) * duration);
  };

  return (
    <div className={styles.player}>
      {/* Left */}
      <div className={styles.left}>
        {currentTrack && (
          <>
            <SafeImg
              src={currentTrack.cover}
              alt={currentTrack.title}
              className={`${styles.coverWrap} ${isPlaying ? styles.spin : ''}`}
              iconSize={16}
            />
            <div className={styles.trackInfo}>
              <p className={styles.trackTitle}>{currentTrack.title}</p>
              <p className={styles.trackArtist}>{currentTrack.artist}</p>
            </div>
            <button
              className={`${styles.iconBtn} ${isLiked ? styles.liked : ''}`}
              onClick={() => toggleLike()}
              aria-label={isLiked ? 'Unlike' : 'Like'}
            >
              <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
            </button>
          </>
        )}
      </div>

      {/* Center */}
      <div className={styles.center}>
        <div className={styles.controls}>
          <button className={`${styles.iconBtn} ${isShuffle ? styles.active : ''}`} onClick={toggleShuffle} aria-label="Shuffle"><Shuffle size={16} /></button>
          <button className={styles.iconBtn} onClick={prev} aria-label="Previous"><SkipBack size={20} /></button>
          <button className={styles.playBtn} onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
          </button>
          <button className={styles.iconBtn} onClick={next} aria-label="Next"><SkipForward size={20} /></button>
          <button className={`${styles.iconBtn} ${isRepeat ? styles.active : ''}`} onClick={toggleRepeat} aria-label="Repeat"><Repeat size={16} /></button>
        </div>
        <div className={styles.progressRow}>
          <span className={styles.time}>{fmt(currentTime)}</span>
          <div
            className={styles.bar}
            ref={barRef}
            onClick={handleBarClick}
            role="slider"
            aria-valuemin={0}
            aria-valuemax={duration || 0}
            aria-valuenow={currentTime}
            aria-label="Seek"
            tabIndex={0}
          >
            <div className={styles.fill} style={{ width: `${progress}%` }}>
              <div className={styles.thumb} aria-hidden />
            </div>
          </div>
          <span className={styles.time}>{fmt(duration)}</span>
        </div>
      </div>

      {/* Right */}
      <div className={styles.right}>
        <button className={styles.queueBtn} onClick={onQueueClick} aria-label="Queue">
          <List size={16} />Queue
        </button>
        <button className={styles.iconBtn} onClick={() => setVolume(volume > 0 ? 0 : 0.7)} aria-label={volume === 0 ? 'Unmute' : 'Mute'}>
          {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <input
          className={styles.volSlider}
          type="range" min={0} max={1} step={0.01}
          value={volume}
          onChange={e => setVolume(Number(e.target.value))}
          aria-label="Volume"
          style={{ '--vol': `${volume * 100}%` }}
        />
      </div>
    </div>
  );
}
