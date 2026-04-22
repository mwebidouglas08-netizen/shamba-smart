import { useState, useEffect, useRef } from 'react';
import Dashboard    from './pages/Dashboard.jsx';
import AIAdvisor    from './pages/AIAdvisor.jsx';
import CropDoctor   from './pages/CropDoctor.jsx';
import PlantingCal  from './pages/PlantingCalendar.jsx';
import MarketPrices from './pages/MarketPrices.jsx';

const TABS = [
  { id:'dashboard', icon:'🏡', label:'Home'     },
  { id:'advisor',   icon:'🤖', label:'AI Chat'  },
  { id:'doctor',    icon:'🔬', label:'Doctor'   },
  { id:'calendar',  icon:'📅', label:'Planting' },
  { id:'market',    icon:'💹', label:'Market'   },
];

/* Particle data — memoised */
const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  left:  `${Math.random() * 100}%`,
  size:  `${2 + Math.random() * 5}px`,
  dur:   `${10 + Math.random() * 18}s`,
  delay: `${Math.random() * 14}s`,
}));

/* Video sources — multiple free farming/nature clips, first that loads plays */
const VIDEO_SOURCES = [
  'https://assets.mixkit.co/videos/preview/mixkit-farm-landscape-during-a-warm-afternoon-43310-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-countryside-meadow-4075-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-green-field-with-trees-in-the-background-4080-large.mp4',
];

export default function App() {
  const [tab, setTab]       = useState('dashboard');
  const [vidOk, setVidOk]   = useState(false);
  const videoRef            = useRef(null);

  /* Try to play the video; if it errors, remove it so CSS scene shows cleanly */
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.play().then(() => setVidOk(true)).catch(() => setVidOk(false));
  }, []);

  return (
    <>
      {/* ══ CINEMATIC FULL-PAGE BACKGROUND ══════════════════ */}
      <div id="cinematic-bg">
        {/* CSS animated scene — always present as base layer */}
        <div className="scene" />
        <div className="sun" />
        <div className="rays" />
        <div className="hills" />
        <div className="field-rows" />

        {/* Real video — plays on top of CSS scene if it loads */}
        <video
          ref={videoRef}
          autoPlay muted loop playsInline
          style={{ opacity: vidOk ? 1 : 0, transition: 'opacity 1.8s ease' }}
        >
          {VIDEO_SOURCES.map((s, i) => <source key={i} src={s} type="video/mp4" />)}
        </video>

        {/* Floating pollen particles */}
        <div className="particles">
          {PARTICLES.map(p => (
            <div key={p.id} className="p" style={{
              left: p.left, bottom: '-10px',
              width: p.size, height: p.size,
              animationDuration: p.dur,
              animationDelay: p.delay,
            }} />
          ))}
        </div>

        {/* Film grain + vignette */}
        <div className="grain" />
        <div className="vignette" />
      </div>

      {/* ══ APP SHELL — sits above background ════════════════ */}
      <div style={{ position: 'relative', zIndex: 10, minHeight: '100vh', paddingBottom: 80 }}>

        {/* ── Header ──────────────────────────────────────── */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 100,
          background: 'rgba(5,18,8,0.72)',
          backdropFilter: 'blur(22px)',
          WebkitBackdropFilter: 'blur(22px)',
          borderBottom: '1px solid rgba(255,255,255,0.14)',
          boxShadow: '0 2px 24px rgba(0,0,0,0.30)',
          padding: '0 20px',
          height: 68,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div className="float" style={{
              width: 44, height: 44, borderRadius: 14,
              background: 'linear-gradient(135deg, #2D8A4E, #1A5C30)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22,
              boxShadow: '0 4px 16px rgba(45,138,78,0.45), inset 0 1px 0 rgba(255,255,255,0.2)',
            }}>🌾</div>
            <div>
              <div style={{
                fontFamily: 'var(--font-d)', fontWeight: 800,
                fontSize: 20, color: '#fff', lineHeight: 1.1,
                textShadow: '0 2px 8px rgba(0,0,0,0.4)',
                letterSpacing: 0.3,
              }}>Shamba Smart</div>
              <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.5)', letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600 }}>
                Agriculture & Food Security
              </div>
            </div>
          </div>

          {/* Status badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 7,
            background: 'rgba(45,138,78,0.25)',
            border: '1px solid rgba(93,201,126,0.35)',
            borderRadius: 999, padding: '6px 14px',
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%', background: '#5DC97E',
              display: 'inline-block', animation: 'pdot 2s ease infinite',
            }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#A8F5C0' }}>Kisii, Kenya</span>
          </div>
        </header>

        {/* ── Tab Navigation ──────────────────────────────── */}
        <nav style={{
          position: 'sticky', top: 68, zIndex: 90,
          background: 'rgba(5,18,8,0.65)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          borderBottom: '1px solid rgba(255,255,255,0.10)',
          padding: '8px 16px',
          display: 'flex', gap: 5, overflowX: 'auto',
        }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              background: tab === t.id
                ? 'linear-gradient(135deg, rgba(45,138,78,0.80), rgba(26,92,48,0.90))'
                : 'rgba(255,255,255,0.07)',
              color: tab === t.id ? '#fff' : 'rgba(255,255,255,0.60)',
              border: tab === t.id
                ? '1px solid rgba(93,201,126,0.50)'
                : '1px solid rgba(255,255,255,0.10)',
              borderRadius: 11, padding: '9px 18px',
              fontFamily: 'var(--font-b)',
              fontWeight: tab === t.id ? 700 : 500,
              fontSize: 13.5, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 7,
              whiteSpace: 'nowrap', transition: 'all 0.22s ease',
              boxShadow: tab === t.id ? '0 4px 14px rgba(45,138,78,0.35)' : 'none',
            }}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </nav>

        {/* ── Page Content ────────────────────────────────── */}
        <main style={{ maxWidth: 740, margin: '0 auto', padding: '22px 16px' }}>
          {tab === 'dashboard' && <Dashboard onNav={setTab} />}
          {tab === 'advisor'   && <AIAdvisor />}
          {tab === 'doctor'    && <CropDoctor />}
          {tab === 'calendar'  && <PlantingCal />}
          {tab === 'market'    && <MarketPrices />}
        </main>
      </div>
    </>
  );
}
