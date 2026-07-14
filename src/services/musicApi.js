/**
 * iTunes Search API — proxied through Vite dev server to bypass CORS.
 * Returns 30-second preview clips (previewUrl) which are plain CDN mp3s
 * that play fine in <audio> without CORS issues.
 */

const BASE = '/api/itunes';

/**
 * Map an iTunes track result to our internal track shape.
 */
function mapTrack(item, idx) {
  return {
    id:       item.trackId ?? idx,
    title:    item.trackName   ?? 'Unknown',
    artist:   item.artistName  ?? 'Unknown',
    album:    item.collectionName ?? '',
    genre:    item.primaryGenreName ?? '',
    cover:    (item.artworkUrl100 ?? '').replace('100x100', '300x300'),
    song:     item.previewUrl ?? '',        // 30-second AAC preview
    duration: item.trackTimeMillis
      ? formatMs(item.trackTimeMillis)
      : '0:30',
    year:     item.releaseDate
      ? new Date(item.releaseDate).getFullYear()
      : null,
    plays:    Math.floor(Math.random() * 15_000_000) + 1_000_000,
    liked:    false,
    source:   'itunes',
  };
}

function formatMs(ms) {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

/**
 * Search tracks. Returns up to `limit` results.
 */
export async function searchTracks(query, limit = 20) {
  const url = `${BASE}/search?term=${encodeURIComponent(query)}&entity=song&limit=${limit}&media=music`;
  const res  = await fetch(url);
  if (!res.ok) throw new Error(`iTunes search failed: ${res.status}`);
  const data = await res.json();
  return (data.results ?? [])
    .filter(r => r.previewUrl)          // only keep tracks that have a playable preview
    .map(mapTrack);
}

/**
 * Fetch a chart/genre feed — iTunes "top songs" for a genre term.
 */
export async function fetchGenreChart(term, limit = 15) {
  return searchTracks(term, limit);
}

/**
 * Fetch multiple popular searches and combine them into a starter library.
 * Called once on app load.
 */
export async function fetchStarterLibrary() {
  const QUERIES = [
    'BTS kpop',
    'Taylor Swift pop',
    'The Weeknd rnb',
    'Billie Eilish',
    'Olivia Rodrigo',
    'trending 2024',
    'Arijit Singh bollywood',
    'Ed Sheeran',
  ];

  const results = await Promise.allSettled(
    QUERIES.map(q => searchTracks(q, 5))
  );

  const seen = new Set();
  const tracks = [];

  for (const r of results) {
    if (r.status !== 'fulfilled') continue;
    for (const t of r.value) {
      if (!seen.has(t.id)) {
        seen.add(t.id);
        tracks.push(t);
      }
    }
  }

  return tracks;
}
