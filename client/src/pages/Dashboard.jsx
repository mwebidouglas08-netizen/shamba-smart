import { useEffect, useState } from 'react';
import { getMarket } from '../api.jsx';

const getSeason = () => {
  const m = new Date().getMonth();
  if (m >= 2 && m <= 4)  return { name: 'Long Rains (MAM)',   emoji: '🌧️', crops: ['Maize', 'Beans', 'Tomatoes', 'Kale'],    advice: 'Peak planting season. Prepare your land now and apply basal fertilizer at planting.', c: '#1a5fc8', bg: 'rgba(26,95,200,0.15)' };
  if (m >= 9 && m <= 11) return { name: 'Short Rains (OND)',  emoji: '🌦️', crops: ['Beans', 'Kale', 'Tomatoes', 'Cabbage'],  advice: 'Good for short-season crops. Monitor drainage. Fall Armyworm alert is active.', c: '#0ea5e9', bg: 'rgba(14,165,233,0.15)' };
  if (m >= 5 && m <= 8)  return { name: 'Dry Season',         emoji: '☀️', crops: ['Sweet Potato', 'Cassava', 'Irrigated'], advice: 'Focus on irrigation. Harvest and store produce from long rains. Plan for OND.', c: '#f59e0b', bg: 'rgba(245,158,11,0.15)' };
  return { name: 'Festive Dry Season', emoji: '🌤️', crops: ['Kale', 'Cabbage'], advice: 'Prepare seedbeds. Source certified seed for the coming season.', c: '#8b5cf6', bg: 'rgba(139,92,246,0.15)' };
};

const Card = ({ children, style = {}, delay = 0 }) => (
  <div className="card fade-up" style={{ padding: 22, animationDelay: `${delay}s`, ...style }}>
    {children}
  </div>
);

export default function Dashboard({ onNav }) {
  const [market, setMarket] = useState([]);
  const season = getSeason();
  useEffect(() => { getMarket().then(setMarket).catch(() => {}); }, []);
  const top = [...market].sort((a, b) => b.change_percent - a.change_percent).slice(0, 3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

      {/* ══ MAIN HERO — full-bleed, tall, HD ══════════════ */}
      <div style={{
        margin: '0 -16px',
        position: 'relative',
        height: 440,
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)',
      }}>
        <img
          src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1600&q=95&fit=crop&auto=format"
          alt="Kenyan farmer in lush green maize field"
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center 35%',
            animation: 'heroKB 10s ease forwards',
            display: 'block',
          }}
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1600&q=90&fit=crop'; }}
        />

        {/* Blue gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            linear-gradient(to top,
              rgba(10,31,61,0.95) 0%,
              rgba(10,31,61,0.55) 45%,
              rgba(10,31,61,0.12) 100%
            )
          `,
        }} />

        {/* Blue tint bar at very top */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 4,
          background: 'linear-gradient(90deg, #1447a0, #2272e8, #0ea5e9)',
        }} />

        {/* Hero content */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 28px 34px' }}>

          {/* Season chip */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: 'rgba(255,255,255,0.18)',
            backdropFilter: 'blur(10px)',
            border: '1.5px solid rgba(255,255,255,0.35)',
            borderRadius: 999, padding: '5px 15px',
            fontSize: 12.5, fontWeight: 700, color: '#fff',
            marginBottom: 14,
          }}>
            {season.emoji} {season.name}
          </div>

          <h1 style={{
            fontFamily: 'var(--font-d)', fontWeight: 700,
            fontSize: 'clamp(28px, 6vw, 44px)',
            color: '#ffffff', lineHeight: 1.18, marginBottom: 12,
            textShadow: '0 3px 20px rgba(0,0,0,0.45)',
          }}>
            Smart Farming,<br />Stronger Harvests 🌾
          </h1>

          <p style={{
            fontSize: 15, color: 'rgba(255,255,255,0.85)',
            lineHeight: 1.65, maxWidth: 460, marginBottom: 20,
          }}>
            {season.advice}
          </p>

          {/* Crops */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
            {season.crops.map(c => (
              <span key={c} style={{
                background: 'rgba(255,255,255,0.18)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.32)',
                color: '#fff', borderRadius: 999,
                padding: '5px 14px', fontSize: 12.5, fontWeight: 600,
              }}>{c}</span>
            ))}
          </div>

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button onClick={() => onNav('advisor')} className="btn-primary">
              🤖 Ask AI Advisor
            </button>
            <button onClick={() => onNav('market')} className="btn-outline"
              style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', borderColor: 'rgba(255,255,255,0.35)' }}>
              💹 Market Prices
            </button>
          </div>
        </div>

        {/* Live AI badge top-right */}
        <div style={{
          position: 'absolute', top: 20, right: 18,
          background: 'rgba(255,255,255,0.18)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.30)',
          borderRadius: 999, padding: '6px 14px',
          display: 'flex', alignItems: 'center', gap: 7,
        }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', display: 'inline-block', animation: 'pdot 2s infinite' }} />
          <span style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>AI Live</span>
        </div>
      </div>

      {/* ══ STATS ══════════════════════════════════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 13 }}>
        {[
          { e: '🌱', v: '10+',  l: 'Crops in Guide',   c: 'var(--blue-600)',  bg: 'var(--blue-50)'  },
          { e: '🤖', v: '24/7', l: 'AI Advisor',        c: 'var(--sky)',       bg: '#f0fbff'          },
          { e: '🔬', v: '8',    l: 'Diseases Covered',  c: 'var(--red)',       bg: '#fff5f5'          },
          { e: '💹', v: 'Live', l: 'Market Prices',     c: 'var(--green)',     bg: '#f0fdf9'          },
        ].map((s, i) => (
          <div key={i} className="card fade-up" style={{
            padding: '18px 16px', animationDelay: `${i * 0.09}s`,
            borderTop: `3px solid ${s.c}`,
            background: s.bg,
          }}>
            <span style={{ fontSize: 30 }}>{s.e}</span>
            <div style={{ fontFamily: 'var(--font-m)', fontWeight: 700, fontSize: 24, color: s.c, marginTop: 8 }}>{s.v}</div>
            <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 3, fontWeight: 500 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* ══ MARKET IMAGE STRIP — full bleed ═══════════════ */}
      <div style={{ margin: '0 -16px', position: 'relative', height: 210, overflow: 'hidden' }}>
        <img
          src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1600&q=90&fit=crop&auto=format"
          alt="Vibrant African produce market with fresh vegetables"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 55%', animation: 'heroKB 12s ease forwards', display: 'block' }}
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=1600&q=85&fit=crop'; }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(100deg, rgba(10,31,61,0.92) 0%, rgba(20,71,160,0.55) 50%, rgba(10,31,61,0.20) 100%)',
          display: 'flex', alignItems: 'center', padding: '0 30px',
        }}>
          <div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.68)', marginBottom: 7, fontWeight: 500 }}>Fresh from the field</div>
            <div style={{ fontFamily: 'var(--font-d)', fontSize: 26, color: '#fff', fontWeight: 700, lineHeight: 1.25, marginBottom: 14 }}>
              Get the Best Price<br />for Your Harvest
            </div>
            <button onClick={() => onNav('market')} style={{
              background: 'var(--amber)', color: '#0a1f3d',
              border: 'none', borderRadius: 10, padding: '10px 20px',
              fontSize: 14, fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(245,158,11,0.45)',
            }}>Check Prices →</button>
          </div>
        </div>
      </div>

      {/* ══ TOP MARKET MOVERS ══════════════════════════════ */}
      {top.length > 0 && (
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text)' }}>📈 Top Market Movers</div>
            <button onClick={() => onNav('market')} style={{
              background: 'var(--blue-50)', color: 'var(--blue-600)',
              border: '1px solid var(--blue-200)', borderRadius: 8,
              padding: '5px 13px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
            }}>View all →</button>
          </div>
          {top.map((c, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 0', borderBottom: i < top.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14.5, color: 'var(--text)' }}>{c.crop_name}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{c.unit}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-m)', fontWeight: 700, fontSize: 16, color: 'var(--blue-800)' }}>
                  KES {c.price?.toLocaleString()}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, marginTop: 2, color: c.change_percent > 0 ? 'var(--green)' : 'var(--red)' }}>
                  {c.change_percent > 0 ? '▲ +' : '▼ '}{c.change_percent}%
                </div>
              </div>
            </div>
          ))}
        </Card>
      )}

      {/* ══ QUICK ACTIONS ══════════════════════════════════ */}
      <div>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 13 }}>
          ⚡ Quick Actions
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { icon: '🤖', label: 'Ask AI Advisor',  sub: 'Expert farming advice',  tab: 'advisor',  c: 'var(--blue-600)', bg: 'var(--blue-50)'  },
            { icon: '🔬', label: 'Diagnose Crop',   sub: 'Identify disease/pest',  tab: 'doctor',   c: 'var(--red)',      bg: '#fff5f5'          },
            { icon: '📅', label: 'Planting Guide',  sub: 'What to grow now',       tab: 'calendar', c: 'var(--sky)',      bg: '#f0fbff'          },
            { icon: '💹', label: 'Market Prices',   sub: "Today's crop prices",    tab: 'market',   c: 'var(--green)',    bg: '#f0fdf9'          },
          ].map((a, i) => (
            <button key={i} onClick={() => onNav(a.tab)} style={{
              background: a.bg, border: `1.5px solid ${a.c}28`,
              borderRadius: 16, padding: '18px 16px',
              cursor: 'pointer', textAlign: 'left',
              transition: 'all 0.22s ease',
              boxShadow: 'var(--shadow-sm)',
              borderLeft: `4px solid ${a.c}`,
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}>
              <div style={{ fontSize: 30, marginBottom: 10 }}>{a.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 3 }}>{a.label}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{a.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* ══ DISEASE BANNER — full bleed ════════════════════ */}
      <div style={{ margin: '0 -16px', position: 'relative', height: 190, overflow: 'hidden' }}>
        <img
          src="https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1600&q=90&fit=crop&auto=format"
          alt="Scientist examining crop leaves for disease"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%', animation: 'heroKB 14s ease forwards', display: 'block' }}
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=85&fit=crop'; }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(105deg, rgba(10,31,61,0.91) 0%, rgba(14,49,104,0.60) 55%, transparent 100%)',
          display: 'flex', alignItems: 'center', padding: '0 30px',
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-d)', fontSize: 22, color: '#fff', fontWeight: 700, marginBottom: 7 }}>
              Spot Disease Early 🔬
            </div>
            <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.82)', marginBottom: 14 }}>
              AI diagnosis in seconds — before it spreads to your whole field
            </div>
            <button onClick={() => onNav('doctor')} style={{
              background: '#fff', color: 'var(--blue-800)',
              border: 'none', borderRadius: 9, padding: '9px 18px',
              fontSize: 13.5, fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(0,0,0,0.22)',
            }}>Diagnose Now →</button>
          </div>
        </div>
      </div>

      {/* ══ POST-HARVEST TIPS ══════════════════════════════ */}
      <Card style={{ borderLeft: '4px solid var(--blue-500)' }}>
        <div style={{ fontSize: 15.5, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>
          📦 Post-Harvest Loss Reduction
        </div>
        {[
          { i: '💧', t: 'Dry grains to below 13% moisture before storage to prevent dangerous aflatoxin' },
          { i: '🛍️', t: 'Use hermetic PICS bags for grain storage — reduces losses by up to 30%' },
          { i: '🐛', t: 'Treat stored grains with Actellic Super to eliminate weevil damage' },
          { i: '🍅', t: 'Harvest tomatoes at green-ripe stage for better shelf life during transport' },
          { i: '👥', t: 'Sell in bulk via farmer groups — earn 20–40% above open market rates' },
        ].map((tip, i) => (
          <div key={i} style={{
            display: 'flex', gap: 12, padding: '10px 0',
            borderBottom: i < 4 ? '1px solid var(--border)' : 'none', alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{tip.i}</span>
            <span style={{ fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.6 }}>{tip.t}</span>
          </div>
        ))}
      </Card>

      {/* ══ FOOTER ══════════════════════════════════════════ */}
      <div style={{ textAlign: 'center', padding: '8px 0 4px', fontSize: 12, color: 'var(--muted-l)' }}>
        🌾 Shamba Smart · AI-Powered Farming · Kisii County, Kenya
      </div>
    </div>
  );
}
