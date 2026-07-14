import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Landing.module.css';
import {
  Music2, Play, Headphones, Zap, Radio,
  ChevronRight, Star, Users, Disc3, Mic2
} from 'lucide-react';

/* ─── static data ─────────────────────────────────────────────────── */
const STATS = [
  { icon: Music2, value: '80M+',  label: 'Songs' },
  { icon: Users,  value: '200M+', label: 'Listeners' },
  { icon: Disc3,  value: '10M+',  label: 'Albums' },
  { icon: Mic2,   value: '5M+',   label: 'Artists' },
];

const FEATURES = [
  { icon: Headphones, title: 'Lossless Audio',  desc: 'Hi-Fi 320kbps streaming with zero compression artefacts.', color: '#3b82f6' },
  { icon: Zap,        title: 'Instant Play',    desc: 'Zero-buffer adaptive streaming — music starts in milliseconds.', color: '#3b82f6' },
  { icon: Radio,      title: 'Smart Stations',  desc: 'AI-powered radio that learns what you love and evolves daily.', color: '#3b82f6' },
];

const TESTIMONIALS = [
  { name: 'Priya M.',   rating: 5, text: "The sound quality is unreal. Best music app I've ever used." },
  { name: 'Jake T.',    rating: 5, text: 'Smart Radio learned my taste within a week. Completely hooked.' },
  { name: 'Ananya K.',  rating: 5, text: 'Bollywood, K-Pop, indie — it has everything. Love the UI too.' },
];

// Fallback gradient tiles shown while images load
const FALLBACK_CARDS = [
  { title: 'Blinding Lights', artist: 'The Weeknd',    color: '#1a0533' },
  { title: 'Anti-Hero',       artist: 'Taylor Swift',  color: '#0d1a33' },
  { title: 'As It Was',       artist: 'Harry Styles',  color: '#1a1a0d' },
  { title: 'STAY',            artist: 'The Kid LAROI', color: '#1a0d1a' },
  { title: 'Bad Guy',         artist: 'Billie Eilish', color: '#0d1a0d' },
  { title: 'Dynamite',        artist: 'BTS',           color: '#1a1000' },
  { title: 'Levitating',      artist: 'Dua Lipa',      color: '#001a1a' },
  { title: 'Peaches',         artist: 'Justin Bieber', color: '#1a0a00' },
];

// Fetch artwork from iTunes via our Vite proxy (same origin — no CORS)
async function fetchArtwork(queries) {
  const results = await Promise.allSettled(
    queries.map(q =>
      fetch(`/api/itunes/search?term=${encodeURIComponent(q)}&entity=song&limit=1&media=music`)
        .then(r => r.json())
        .then(d => {
          const item = d.results?.[0];
          return item
            ? {
                title:  item.trackName,
                artist: item.artistName,
                // Replace 100x100 with 400x400 for better quality
                img:    (item.artworkUrl100 || '').replace('100x100bb', '400x400bb'),
              }
            : null;
        })
        .catch(() => null)
    )
  );
  return results.map((r, i) => r.status === 'fulfilled' && r.value
    ? r.value
    : { ...FALLBACK_CARDS[i], img: null }
  );
}

const QUERIES = [
  'Blinding Lights The Weeknd',
  'Anti-Hero Taylor Swift',
  'As It Was Harry Styles',
  'STAY Kid LAROI',
  'Bad Guy Billie Eilish',
  'Dynamite BTS',
  'Levitating Dua Lipa',
  'Peaches Justin Bieber',
];

/* ─── component ───────────────────────────────────────────────────── */
export default function Landing() {
  const ticker1Ref = useRef(null);
  const ticker2Ref = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [cards, setCards]       = useState(FALLBACK_CARDS);

  // Fetch real artwork on mount
  useEffect(() => {
    fetchArtwork(QUERIES).then(setCards);
  }, []);

  // Parallax orbs on mouse move
  useEffect(() => {
    const onMove = e => setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // Infinite tickers
  useEffect(() => {
    const refs = [ticker1Ref, ticker2Ref];
    const cancels = refs.map((ref, i) => {
      let pos = 0;
      const speed = i === 0 ? 0.5 : -0.4;
      let id;
      const tick = () => {
        if (!ref.current) return;
        const halfW = ref.current.scrollWidth / 2;
        pos += speed;
        if (pos >= halfW)  pos = 0;
        if (pos <= -halfW) pos = 0;
        ref.current.style.transform = `translateX(${-pos}px)`;
        id = requestAnimationFrame(tick);
      };
      id = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(id);
    });
    return () => cancels.forEach(c => c());
  }, []);

  const orbX = `${(mousePos.x - 0.5) * 40}px`;
  const orbY = `${(mousePos.y - 0.5) * 40}px`;
  const orbXN = `${-(mousePos.x - 0.5) * 40}px`;

  return (
    <div className={styles.root}>
      {/* ── Background ── */}
      <div className={styles.bg}>
        <div className={styles.grid} aria-hidden />
        <div className={styles.orb1} style={{ transform: `translate(calc(-50% + ${orbX}), calc(-50% + ${orbY}))` }} aria-hidden />
        <div className={styles.orb2} style={{ transform: `translate(calc(-50% + ${orbXN}), calc(-50% + ${orbY}))` }} aria-hidden />
        <div className={styles.orb3} aria-hidden />
      </div>

      {/* ── Nav ── */}
      <header className={styles.nav}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}><Music2 size={18} /></div>
          <span>Harmony</span>
        </div>
        <nav className={styles.navCenter}>
          <a href="#features" className={styles.navA}>Features</a>
          <a href="#explore"  className={styles.navA}>Explore</a>
          <a href="#reviews"  className={styles.navA}>Reviews</a>
        </nav>
        <div className={styles.navRight}>
          <Link to="/signin" className={styles.navLink}>Sign in</Link>
          <Link to="/signup" className={styles.navPrimary}>Get started <ChevronRight size={14} /></Link>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroBadge}>
          <span className={styles.pulse} aria-hidden />
          Live · 80M tracks available now
        </div>
        <h1 className={styles.heroTitle}>
          Feel every beat.<br />
          <span className={styles.heroGradient}>Live the music.</span>
        </h1>
        <p className={styles.heroSub}>
          Stream millions of songs in stunning quality. Discover new artists,
          build playlists, and let AI find your next obsession.
        </p>
        <div className={styles.heroCta}>
          <Link to="/signup" className={styles.btnPrimary}>
            <Play size={16} fill="currentColor" />Start listening free
          </Link>
          <Link to="/signin" className={styles.btnGhost}>I have an account</Link>
        </div>

        {/* Floating album cards */}
        <div className={styles.floatCards} aria-hidden>
          {cards.slice(0, 4).map((c, i) => (
            <div key={i} className={`${styles.floatCard} ${styles[`fc${i}`]}`}>
              <CardImg src={c.img} alt={c.title} color={c.color} size={44} radius={8} />
              <div className={styles.fcInfo}>
                <span className={styles.fcTitle}>{c.title}</span>
                <span className={styles.fcArtist}>{c.artist}</span>
              </div>
              <div className={styles.fcPlay}><Play size={12} fill="white" /></div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats ── */}
      <section className={styles.stats}>
        {STATS.map(({ icon: Icon, value, label }) => (
          <div key={label} className={styles.statItem}>
            <div className={styles.statIcon}><Icon size={20} /></div>
            <div>
              <p className={styles.statValue}>{value}</p>
              <p className={styles.statLabel}>{label}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ── Ticker 1 ── */}
      <TickerRow cards={cards} tickerRef={ticker1Ref} />

      {/* ── Features ── */}
      <section className={styles.features} id="features">
        <div className={styles.sectionTag}>BUILT DIFFERENT</div>
        <h2 className={styles.sectionTitle}>
          Everything you need to<br />
          <span className={styles.heroGradient}>fall in love with music again.</span>
        </h2>
        <div className={styles.featGrid}>
          {FEATURES.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className={styles.featCard}>
              <div className={styles.featIconWrap} style={{ background: `${color}1a`, color }}>
                <Icon size={24} />
              </div>
              <h3 className={styles.featTitle}>{title}</h3>
              <p className={styles.featDesc}>{desc}</p>
              <div className={styles.featLine} style={{ background: color }} />
            </div>
          ))}
        </div>
      </section>

      {/* ── Album wall ── */}
      <section className={styles.explore} id="explore">
        <div className={styles.sectionTag}>EXPLORE</div>
        <h2 className={styles.sectionTitle}>Trending right now</h2>
        <div className={styles.albumWall}>
          {cards.map((c, i) => (
            <div key={i} className={styles.albumTile}>
              <CardImg src={c.img} alt={c.title} color={c.color} size="100%" radius={14} cover />
              <div className={styles.albumOverlay}>
                <p>{c.title}</p>
                <span>{c.artist}</span>
              </div>
            </div>
          ))}
        </div>
        <Link to="/signup" className={styles.btnPrimary} style={{ alignSelf: 'center', marginTop: 32 }}>
          Explore all music
        </Link>
      </section>

      {/* ── Ticker 2 (reverse) ── */}
      <TickerRow cards={[...cards].reverse()} tickerRef={ticker2Ref} />

      {/* ── Reviews ── */}
      <section className={styles.reviews} id="reviews">
        <div className={styles.sectionTag}>LOVED BY MILLIONS</div>
        <h2 className={styles.sectionTitle}>What people are saying</h2>
        <div className={styles.reviewGrid}>
          {TESTIMONIALS.map(t => (
            <div key={t.name} className={styles.reviewCard}>
              <div className={styles.stars}>
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <p className={styles.reviewText}>"{t.text}"</p>
              <p className={styles.reviewName}>— {t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className={styles.finalCta}>
        <div className={styles.finalGlow} aria-hidden />
        <div className={styles.finalInner}>
          <h2 className={styles.finalTitle}>
            Your soundtrack is<br />
            <span className={styles.heroGradient}>waiting for you.</span>
          </h2>
          <p className={styles.finalSub}>Free to start. No credit card. Cancel anytime.</p>
          <Link to="/signup" className={styles.btnPrimary}>
            <Play size={16} fill="currentColor" />Get started — it's free
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}><Music2 size={16} /></div>
          <span>Harmony</span>
        </div>
        <p className={styles.footerText}>© 2026 Harmony. All rights reserved.</p>
        <div className={styles.footerLinks}>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
        </div>
      </footer>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────────── */

/** Smart image with gradient fallback while loading / if broken */
function CardImg({ src, alt, color, size, radius, cover }) {
  const [loaded, setLoaded] = useState(false);
  const [error,  setError]  = useState(false);

  const showImg = src && !error;

  const wrapStyle = {
    width:        typeof size === 'number' ? size : size,
    height:       typeof size === 'number' ? size : '100%',
    borderRadius: radius,
    overflow:     'hidden',
    flexShrink:   0,
    position:     'relative',
    background:   color || '#1a1a2e',
  };

  return (
    <div style={wrapStyle}>
      {/* Gradient placeholder — always rendered, fades out when img loads */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(135deg, ${color || '#1a1a2e'}, #0a0a14)`,
        opacity: loaded ? 0 : 1,
        transition: 'opacity 0.4s',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Music2 size={typeof size === 'number' ? size * 0.4 : 20} color="rgba(255,255,255,0.15)" />
      </div>

      {showImg && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          style={{
            position:   'absolute',
            inset:      0,
            width:      '100%',
            height:     '100%',
            objectFit:  cover ? 'cover' : 'cover',
            opacity:    loaded ? 1 : 0,
            transition: 'opacity 0.4s',
          }}
        />
      )}
    </div>
  );
}

function TickerRow({ cards, tickerRef }) {
  const triple = [...cards, ...cards, ...cards];
  return (
    <div className={styles.tickerWrap}>
      <div className={styles.tickerFade} aria-hidden />
      <div className={styles.tickerTrack} ref={tickerRef}>
        {triple.map((c, i) => (
          <div key={i} className={styles.tickerCard}>
            <CardImg src={c.img} alt={c.title} color={c.color} size={38} radius={7} />
            <div>
              <p className={styles.tcTitle}>{c.title}</p>
              <p className={styles.tcArtist}>{c.artist}</p>
            </div>
          </div>
        ))}
      </div>
      <div className={`${styles.tickerFade} ${styles.tickerFadeR}`} aria-hidden />
    </div>
  );
}
