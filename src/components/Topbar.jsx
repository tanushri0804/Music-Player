import React from 'react';
import { Search, Bell, X, Loader2 } from 'lucide-react';
import styles from './Topbar.module.css';

export default function Topbar({ searchQuery, setSearchQuery, searchLoading }) {
  return (
    <header className={styles.bar}>
      <div className={styles.searchWrap}>
        {searchLoading
          ? <Loader2 size={15} className={`${styles.searchIcon} ${styles.spin}`} />
          : <Search size={15} className={styles.searchIcon} />
        }
        <input
          className={styles.input}
          type="text"
          placeholder="Search songs, artists, albums…"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          aria-label="Search"
        />
        {searchQuery && !searchLoading && (
          <button
            className={styles.clear}
            onClick={() => setSearchQuery('')}
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className={styles.right}>
        <button className={styles.bell} aria-label="Notifications">
          <Bell size={18} />
          <span className={styles.dot} aria-hidden />
        </button>
        <button className={styles.avatar} aria-label="Profile">
          <span>U</span>
        </button>
      </div>
    </header>
  );
}
