/**
 * iTunes Search API — proxied through:
 *   • Vite dev server in development  (/api/itunes → itunes.apple.com)
 *   • Netlify Function in production  (/api/itunes → /.netlify/functions/itunes)
 *
 * Returns 30-second AAC preview clips that play in <audio> without CORS issues.
 */

const BASE = '/api/itunes';

// ── Fallback tracks used if the API is unreachable ─────────────────────────
// Only Dynamite.mp3 is in /public/songs — the rest serve as placeholders.
const FALLBACK_TRACKS = [
  { id: 9001, title: 'Dynamite',           artist: 'BTS',            album: 'BE',           genre: 'K-Pop',        cover: '/images/Butter.jpg',          song: '/songs/Dynamite.mp3', duration: '3:19', year: 2020, plays: 12500000, liked: false, source: 'local' },
  { id: 9002, title: 'Anti-Hero',          artist: 'Taylor Swift',   album: 'Midnights',    genre: 'Pop',          cover: '/images/taylor.jpg_large',    song: '', duration: '3:20', year: 2022, plays: 9800000,  liked: false, source: 'local' },
  { id: 9003, title: 'Blinding Lights',    artist: 'The Weeknd',     album: 'After Hours',  genre: 'R&B',          cover: '/images/Weekend.jpeg',        song: '', duration: '3:20', year: 2019, plays: 15000000, liked: false, source: 'local' },
  { id: 9004, title: 'bad guy',            artist: 'Billie Eilish',  album: 'WWAFAWDWG',    genre: 'Alternative',  cover: '/images/Billie.jpg',          song: '', duration: '3:14', year: 2019, plays: 12000000, liked: false, source: 'local' },
  { id: 9005, title: 'Summertime Sadness', artist: 'Lana Del Rey',   album: 'Born to Die',  genre: 'Alternative',  cover: '/images/ldr.jpg',             song: '', duration: '4:24', year: 2012, plays: 8500000,  liked: false, source: 'local' },
  { id: 9006, title: 'drivers license',   artist: 'Olivia Rodrigo', album: 'SOUR',          genre: 'Pop',          cover: '/images/Olivia.jpeg',         song: '', duration: '4:02', year: 2021, plays: 9500000,  liked: false, source: 'local' },
  { id: 9007, title: 'Seven',             artist: 'JungKook',       album: 'Single',        genre: 'K-Pop',        cover: '/images/JK.jpg',              song: '', duration: '3:04', year: 2023, plays: 5000000,  liked: false, source: 'local' },
  { id: 9008, title: 'Chaleya',           artist: 'Darshan Raval',  album: 'Jawan',         genre: 'Bollywood',    cover: '/images/Darshan Raval.jpg',   song: '', duration: '3:20', year: 2023, plays: 3000000,  liked: false, source: 'local' },
];

// ── Helpers ────────────────────────────────────────────────────────────────

function mapTrack(item) {
  return {
    id:       item.trackId,
    title:    item.trackName        ?? 'Unknown',
    artist:   item.artistName       ?? 'Unknown',
    album:    item.collectionName   ?? '',
    genre:    item.primaryGenreName ?? '',
    // Bump artwork to 400×400 for sharper display
    cover:    (item.artworkUrl100 ?? '').replace('100x100bb', '400x400bb'),
    song:     item.previewUrl ?? '',   // 30-second AAC preview, direct CDN URL
    duration: item.trackTimeMillis ? formatMs(item.trackTimeMillis) : '0:30',
    year:     item.releaseDate ? new Date(item.releaseDate).getFullYear() : null,
    plays:    Math.floor(Math.random() * 15_000_000) + 1_000_000,
    liked:    false,
    source:   'itunes',
  };
}

function formatMs(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec < 10 ? '0' : ''}${sec}`;
}

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Search iTunes for tracks matching `query`.
 * Returns only tracks that have a previewUrl (playable).
 */
export async function searchTracks(query, limit = 20) {
  const url = `${BASE}/search?term=${encodeURIComponent(query)}&entity=song&limit=${limit}&media=music`;
  const res  = await fetch(url);
  if (!res.ok) throw new Error(`iTunes search failed: ${res.status}`);
  const data = await res.json();
  return (data.results ?? []).filter(r => r.previewUrl).map(mapTrack);
}

/**
 * Load the starter library on app boot.
 * Fires 8 parallel queries, deduplicates, returns up to ~40 tracks.
 * Falls back to local FALLBACK_TRACKS if the API is unreachable.
 */
export async function fetchStarterLibrary() {
  const QUERIES = [
    'BTS kpop',
    'Taylor Swift pop',
    'The Weeknd',
    'Billie Eilish',
    'Olivia Rodrigo',
    'Arijit Singh',
    'Ed Sheeran',
    'top hits 2024',
  ];

  try {
    const results = await Promise.allSettled(
      QUERIES.map(q => searchTracks(q, 5))
    );

    const seen   = new Set();
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

    // If every single query failed (no network, proxy down, etc.)
    // fall back to local tracks instead of showing an error screen
    if (tracks.length === 0) {
      console.warn('iTunes API returned 0 tracks — using local fallback library.');
      return FALLBACK_TRACKS;
    }

    return tracks;
  } catch (err) {
    console.warn('fetchStarterLibrary failed — using local fallback:', err.message);
    return FALLBACK_TRACKS;
  }
}
