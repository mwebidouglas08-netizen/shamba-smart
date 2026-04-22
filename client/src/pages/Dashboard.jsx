import { useEffect, useState } from 'react';
import { getMarket } from '../api.jsx';

/* ── Reusable card ─────────────────────────────────── */
const Card = ({ children, style = {} }) => (
  <div className="fade-up" style={{
    background: 'var(--white)', border: '1px solid var(--border)',
    borderRadius: 18, padding: 22,
    boxShadow: 'var(--shadow-sm)', ...style,
  }}>
    {children}
  </div>
);

/* ── Season detector ───────────────────────────────── */
const getSeason = () => {
  const m = new Date().getMonth();
  if (m >= 2 && m <= 4) return {
    name: 'Long Rains (MAM)', emoji: '🌧️',
    crops: ['Maize', 'Beans', 'Tomatoes', 'Kale'],
    advice: 'Peak planting season. Prepare land now and apply basal fertilizer at planting.',
    color: '#1D4ED8', bg: '#DBEAFE',
  };
  if (m >= 9 && m <= 11) return {
    name: 'Short Rains (OND)', emoji: '🌦️',
    crops: ['Beans', 'Kale', 'Tomatoes', 'Cabbage'],
    advice: 'Good for short-season crops. Monitor drainage. Fall Armyworm alert is active.',
    color: '#0891B2', bg: '#CFFAFE',
  };
  if (m >= 5 && m <= 8) return {
    name: 'Dry Season', emoji: '☀️',
    crops: ['Sweet Potato', 'Cassava', 'Irrigated crops'],
    advice: 'Focus on irrigation. Harvest and store produce from long rains. Plan for OND.',
    color: '#D97706', bg: '#FEF3C7',
  };
  return {
    name: 'Festive Dry Season', emoji: '🌤️',
    crops: ['Kale', 'Cabbage'],
    advice: 'Prepare seedbeds. Source quality certified seed for the coming season.',
    color: '#7C3AED', bg: '#EDE9FE',
  };
};

/* ── Stats row ─────────────────────────────────────── */
const Stat = ({ icon, value, label, color }) => (
  <div className="fade-up" style={{
    background: 'var(--white)', border: '1px solid var(--border)',
    borderRadius: 16, padding: '18px 16px',
    boxShadow: 'var(--shadow-sm)',
    display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start',
    borderTop: `3px solid ${color}`,
  }}>
    <span style={{ fontSize: 28 }}>{icon}</span>
    <span style={{ fontFamily: 'var(--font-m)', fontWeight: 700, fontSize: 22, color }}>{value}</span>
    <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 500 }}>{label}</span>
  </div>
);

export default function Dashboard({ onNav }) {
  const [market, setMarket] = useState([]);
  const season = getSeason();

  useEffect(() => { getMarket().then(setMarket).catch(() => {}); }, []);

  const topMovers = [...market]
    .sort((a, b) => b.change_percent - a.change_percent)
    .slice(0, 3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

      {/* ══ HERO IMAGE BANNER ══════════════════════════════════ */}
      <div className="fade-up" style={{
        borderRadius: 22, overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative', height: 340,
        border: '1px solid var(--border)',
      }}>
        {/* HD Farming Image */}
        <img
          src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1400&q=90&fit=crop"
          alt="African smallholder farmer working in lush green fields"
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            objectPosition: 'center 40%',
            animation: 'heroZoom 8s ease forwards',
          }}
          onError={e => {
            e.target.src = 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1400&q=90&fit=crop';
          }}
        />

        {/* Gradient overlay — bottom-heavy for text legibility */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(10,30,15,0.88) 0%, rgba(10,30,15,0.35) 55%, rgba(10,30,15,0.10) 100%)',
        }} />

        {/* Hero text */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '28px 26px',
        }}>
          {/* Season badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: season.bg, color: season.color,
            borderRadius: 999, padding: '5px 13px', fontSize: 12, fontWeight: 700,
            marginBottom: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}>
            {season.emoji} {season.name}
          </div>

          <h1 style={{
            fontFamily: 'var(--font-d)', fontWeight: 900,
            fontSize: 'clamp(22px, 5vw, 30px)',
            color: '#FFFFFF', lineHeight: 1.25, marginBottom: 8,
            textShadow: '0 2px 12px rgba(0,0,0,0.4)',
          }}>
            Smart Farming,<br />Stronger Harvests 🌾
          </h1>

          <p style={{
            fontSize: 13.5, color: 'rgba(255,255,255,0.85)',
            lineHeight: 1.6, maxWidth: 440, marginBottom: 16,
          }}>
            {season.advice}
          </p>

          {/* Recommended crops */}
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
            {season.crops.map(c => (
              <span key={c} style={{
                background: 'rgba(255,255,255,0.18)',
                backdropFilter: 'blur(8px)',
                color: '#fff', border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: 999, padding: '5px 13px', fontSize: 12, fontWeight: 600,
              }}>{c}</span>
            ))}
          </div>
        </div>

        {/* Top-right live tag */}
        <div style={{
          position: 'absolute', top: 18, right: 18,
          background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.3)', borderRadius: 999,
          padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ADE80',
            display: 'inline-block', animation: 'pulse-dot 2s infinite' }} />
          <span style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>AI Live</span>
        </div>
      </div>

      {/* ══ STATS ═══════════════════════════════════════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
        <Stat icon="🌱" value="10+"  label="Crops in Guide"     color="var(--green)"   />
        <Stat icon="🤖" value="24/7" label="AI Advisor Online"  color="var(--amber)"   />
        <Stat icon="🔬" value="8"    label="Diseases Covered"   color="#DC2626"         />
        <Stat icon="💹" value="Live" label="Market Prices"      color="var(--blue)"    />
      </div>

      {/* ══ TOP MARKET MOVERS ═══════════════════════════════════ */}
      {topMovers.length > 0 && (
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--green-d)' }}>📈 Top Market Movers</div>
            <button onClick={() => onNav('market')} style={{
              background: 'var(--green-xl)', color: 'var(--green)', border: 'none',
              borderRadius: 8, padding: '5px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}>View all →</button>
          </div>
          {topMovers.map((c, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '11px 0',
              borderBottom: i < topMovers.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>{c.crop_name}</div>
                <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 1 }}>{c.unit}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-m)', fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>
                  KES {c.price?.toLocaleString()}
                </div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: c.change_percent > 0 ? 'var(--green)' : 'var(--red)' }}>
                  {c.change_percent > 0 ? '▲ +' : '▼ '}{c.change_percent}%
                </div>
              </div>
            </div>
          ))}
        </Card>
      )}

      {/* ══ FEATURE IMAGE STRIP ════════════════════════════════ */}
      <div style={{
        borderRadius: 18, overflow: 'hidden', height: 180, position: 'relative',
        boxShadow: 'var(--shadow)',
      }}>
        <img
          src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=1200&q=85&fit=crop"
          alt="Kenyan market with fresh vegetables and produce"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 60%' }}
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200&q=85&fit=crop'; }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, rgba(27,77,46,0.85) 0%, rgba(27,77,46,0.20) 100%)',
          display: 'flex', alignItems: 'center', padding: '0 28px',
        }}>
          <div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 6, fontWeight: 500 }}>Fresh from the field</div>
            <div style={{ fontFamily: 'var(--font-d)', fontSize: 20, color: '#fff', fontWeight: 900, lineHeight: 1.3 }}>
              Get the Best Price<br />for Your Harvest
            </div>
            <button onClick={() => onNav('market')} style={{
              marginTop: 12, background: 'var(--amber-l)', color: 'var(--text)', border: 'none',
              borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            }}>Check Prices →</button>
          </div>
        </div>
      </div>

      {/* ══ QUICK ACTIONS ════════════════════════════════════════ */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase',
          letterSpacing: 1.5, marginBottom: 12 }}>⚡ Quick Actions</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { icon: '🤖', label: 'Ask AI Advisor',  sub: 'Expert farming advice',  tab: 'advisor',  color: 'var(--green)'  },
            { icon: '🔬', label: 'Diagnose Crop',   sub: 'Identify disease/pest',  tab: 'doctor',   color: '#DC2626'       },
            { icon: '📅', label: 'Planting Guide',  sub: 'What to grow now',       tab: 'calendar', color: 'var(--blue)'  },
            { icon: '💹', label: 'Market Prices',   sub: "Today's crop prices",    tab: 'market',   color: 'var(--amber)'  },
          ].map((a, i) => (
            <button key={i} onClick={() => onNav(a.tab)} style={{
              background: 'var(--white)', border: '1px solid var(--border)',
              borderRadius: 16, padding: '18px 16px',
              cursor: 'pointer', textAlign: 'left',
              transition: 'all 0.22s ease',
              boxShadow: 'var(--shadow-sm)',
              borderLeft: `4px solid ${a.color}`,
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}>
              <div style={{ fontSize: 30, marginBottom: 8 }}>{a.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 3 }}>{a.label}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{a.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* ══ SECOND HERO IMAGE — Crop health ════════════════════ */}
      <div style={{
        borderRadius: 18, overflow: 'hidden', height: 160, position: 'relative',
        boxShadow: 'var(--shadow)',
      }}>
        <img
          src="https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1200&q=85&fit=crop"
          alt="Healthy maize crop growing in Kenya"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 50%' }}
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=1200&q=85&fit=crop'; }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(220,38,38,0.82) 0%, rgba(220,38,38,0.10) 100%)',
          display: 'flex', alignItems: 'center', padding: '0 28px',
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-d)', fontSize: 18, color: '#fff', fontWeight: 900, marginBottom: 6 }}>
              Spot Disease Early 🔬
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginBottom: 10 }}>AI diagnosis in seconds — before it spreads</div>
            <button onClick={() => onNav('doctor')} style={{
              background: '#fff', color: '#DC2626', border: 'none',
              borderRadius: 8, padding: '7px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            }}>Diagnose Now →</button>
          </div>
        </div>
      </div>

      {/* ══ POST-HARVEST TIPS ════════════════════════════════════ */}
      <Card style={{ borderLeft: '4px solid var(--green-m)' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--green-d)', marginBottom: 14 }}>
          📦 Post-Harvest Loss Reduction
        </div>
        {[
          { icon: '💧', tip: 'Dry grains to <13% moisture before storage to prevent aflatoxin' },
          { icon: '🛍️', tip: 'Use hermetic PICS bags for grains — saves up to 30% losses' },
          { icon: '🐛', tip: 'Treat stored grains with Actellic Super to prevent weevil damage' },
          { icon: '🍅', tip: 'Harvest tomatoes at green-ripe stage for better shelf life during transport' },
          { icon: '👥', tip: 'Form a farmer group to sell in bulk — 20-40% better prices guaranteed' },
        ].map((t, i) => (
          <div key={i} style={{
            display: 'flex', gap: 12, padding: '9px 0',
            borderBottom: i < 4 ? '1px solid var(--border)' : 'none',
            alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{t.icon}</span>
            <span style={{ fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.55 }}>{t.tip}</span>
          </div>
        ))}
      </Card>

      {/* ══ FOOTER NOTE ════════════════════════════════════════ */}
      <div style={{ textAlign: 'center', padding: '12px 0 4px', fontSize: 12, color: 'var(--muted-l)' }}>
        🌾 Shamba Smart · Empowering Kisii County Farmers · AI-Powered Agriculture
      </div>
    </div>
  );
}
