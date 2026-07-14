import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Music2, Home, Library, TrendingUp, Calendar, Heart, PlusCircle } from 'lucide-react';
import styles from './Sidebar.module.css';

const NAV = [
  { icon: Home,       label: 'Home',    to: '/home' },
  { icon: Library,    label: 'Library', to: '/home' },
  { icon: TrendingUp, label: 'Charts',  to: '/home' },
  { icon: Calendar,   label: 'Events',  to: '/home' },
];

const PLAYLISTS = ['K-Pop Hits', 'Workout Mix', 'Chill Vibes', 'Road Trip'];

export default function Sidebar() {
  const { pathname } = useLocation();
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <Music2 size={20} />
        <span>Harmony</span>
      </div>

      <nav className={styles.nav}>
        {NAV.map(({ icon: Icon, label, to }) => (
          <Link
            key={label}
            to={to}
            className={`${styles.navItem} ${pathname === to ? styles.active : ''}`}
          >
            <Icon size={18} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div className={styles.divider} />

      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          <span>Playlists</span>
          <button className={styles.addBtn} aria-label="Create playlist">
            <PlusCircle size={16} />
          </button>
        </div>
        {PLAYLISTS.map(name => (
          <button key={name} className={styles.playlistItem}>
            <span className={styles.playlistDot} />
            {name}
          </button>
        ))}
      </div>

      <div className={styles.divider} />

      <button className={styles.likedBtn}>
        <Heart size={16} />
        <span>Liked Songs</span>
      </button>
    </aside>
  );
}
