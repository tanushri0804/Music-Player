import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import HeroSection from '../components/HeroSection';
import FeaturedSection from '../components/FeaturedSection';
import ArtistsSection from '../components/ArtistsSection';
import TrackList from '../components/TrackList';
import GenresSection from '../components/GenresSection';
import Player from '../components/Player';
import QueueModal from '../components/QueueModal';
import LibraryLoader from '../components/LibraryLoader';
import styles from './Home.module.css';
import { usePlayer } from '../context/usePlayer';

export default function Home() {
  const { queue, loading, error, searchAndAdd, searchLoading } = usePlayer();
  const [queueOpen, setQueueOpen]     = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searched, setSearched]       = useState(false);

  // Run search when query changes (debounced)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      setSearched(false);
      return;
    }
    const t = setTimeout(async () => {
      const results = await searchAndAdd(searchQuery.trim());
      setSearchResults(results);
      setSearched(true);
    }, 500);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  if (loading) return <LibraryLoader />;

  if (error) return (
    <div className={styles.errorScreen}>
      <p>⚠️ Could not load music library.</p>
      <small>{error}</small>
      <button onClick={() => window.location.reload()}>Retry</button>
    </div>
  );

  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.main}>
        <Topbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchLoading={searchLoading}
        />
        <div className={styles.content}>
          {searchQuery.trim() ? (
            <section style={{ padding: '32px 32px 140px' }}>
              <h2 className={styles.searchHeading}>
                {searchLoading ? 'Searching…' : `Results for "${searchQuery}"`}
              </h2>
              {!searchLoading && searched && searchResults?.length === 0 && (
                <p className={styles.noResults}>No tracks found. Try a different search.</p>
              )}
              {searchResults && searchResults.length > 0 && (
                <TrackList tracks={searchResults} />
              )}
            </section>
          ) : (
            <>
              <HeroSection />
              <FeaturedSection />
              <ArtistsSection />
              <section className={styles.allTracks}>
                <div className={styles.sectionHeader}>
                  <div>
                    <h2>All Tracks</h2>
                    <p>{queue.length} songs loaded</p>
                  </div>
                </div>
                <TrackList tracks={queue} />
              </section>
              <GenresSection />
              <div style={{ height: 120 }} />
            </>
          )}
        </div>
      </div>

      <Player onQueueClick={() => setQueueOpen(true)} />
      {queueOpen && <QueueModal onClose={() => setQueueOpen(false)} />}
    </div>
  );
}
