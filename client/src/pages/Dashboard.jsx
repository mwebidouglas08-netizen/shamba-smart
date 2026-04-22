import { useEffect, useState } from 'react';
import { getMarket } from '../api.js';

const getSeason = () => {
  const m = new Date().getMonth();
  if (m>=2&&m<=4)  return { name:'Long Rains (MAM)',   emoji:'🌧️', crops:['Maize','Beans','Tomatoes','Kale'],   advice:'Peak planting season. Prepare land and apply basal fertilizer at planting.', c:'#3B82F6', bg:'rgba(59,130,246,0.25)' };
  if (m>=9&&m<=11) return { name:'Short Rains (OND)',  emoji:'🌦️', crops:['Beans','Kale','Tomatoes','Cabbage'], advice:'Good for short-season crops. Monitor drainage. Fall Armyworm alert active.', c:'#06B6D4', bg:'rgba(6,182,212,0.25)' };
  if (m>=5&&m<=8)  return { name:'Dry Season',         emoji:'☀️', crops:['Sweet Potato','Cassava','Irrigated'],advice:'Focus on irrigation. Harvest and store long-rain produce now.', c:'#F59E0B', bg:'rgba(245,158,11,0.25)' };
  return { name:'Festive Dry Season', emoji:'🌤️', crops:['Kale','Cabbage'], advice:'Prepare seedbeds. Source certified seed for the coming season.', c:'#A78BFA', bg:'rgba(167,139,250,0.25)' };
};

/* Glass card wrapper */
const GCard = ({ children, style={}, className='' }) => (
  <div className={`glass fade-up ${className}`} style={{ padding:22, ...style }}>{children}</div>
);

export default function Dashboard({ onNav }) {
  const [market, setMarket] = useState([]);
  const season = getSeason();

  useEffect(() => { getMarket().then(setMarket).catch(()=>{}); }, []);

  const topMovers = [...market].sort((a,b) => b.change_percent - a.change_percent).slice(0,3);

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

      {/* ══ HERO — Full-bleed cinematic image ══════════════ */}
      <div className="fade-up" style={{
        position: 'relative',
        /* Negative margin breaks out of the container to go full width */
        margin: '0 -16px',
        height: 420,
        overflow: 'hidden',
      }}>
        <img
          src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1600&q=92&fit=crop&auto=format"
          alt="Kenyan smallholder farmer in lush green maize field"
          style={{
            width:'100%', height:'100%', objectFit:'cover',
            objectPosition:'center 38%',
            animation: 'heroKB 10s ease forwards',
          }}
          onError={e => { e.target.src='https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1600&q=85&fit=crop'; }}
        />

        {/* Cinematic gradient overlay */}
        <div style={{
          position:'absolute', inset:0,
          background:'linear-gradient(to top, rgba(5,18,8,0.92) 0%, rgba(5,18,8,0.40) 50%, rgba(5,18,8,0.12) 100%)',
        }} />

        {/* Widescreen letterbox top bar */}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:28,
          background:'rgba(0,0,0,0.70)' }} />

        {/* Content on hero */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'0 24px 30px' }}>
          {/* Season badge */}
          <div style={{
            display:'inline-flex', alignItems:'center', gap:7,
            background: season.bg,
            border: `1px solid ${season.c}55`,
            borderRadius:999, padding:'5px 14px', fontSize:12, fontWeight:700,
            color:'#fff', marginBottom:12,
            backdropFilter:'blur(8px)',
          }}>
            {season.emoji} {season.name}
          </div>

          <h1 style={{
            fontFamily:'var(--font-d)', fontWeight:800,
            fontSize:'clamp(28px,6vw,42px)', color:'#fff',
            lineHeight:1.18, marginBottom:10,
            textShadow:'0 3px 16px rgba(0,0,0,0.50)',
            letterSpacing:0.5,
          }}>
            Smart Farming,<br/>Stronger Harvests 🌾
          </h1>

          <p style={{ fontSize:14.5, color:'rgba(255,255,255,0.82)', lineHeight:1.65, maxWidth:460, marginBottom:18 }}>
            {season.advice}
          </p>

          {/* Crops row */}
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:18 }}>
            {season.crops.map(c => (
              <span key={c} style={{
                background:'rgba(255,255,255,0.16)', backdropFilter:'blur(8px)',
                border:'1px solid rgba(255,255,255,0.30)',
                color:'#fff', borderRadius:999, padding:'5px 14px', fontSize:12.5, fontWeight:600,
              }}>{c}</span>
            ))}
          </div>

          {/* CTA buttons */}
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            <button onClick={() => onNav('advisor')} style={{
              background:'linear-gradient(135deg,#2D8A4E,#1A5C30)', color:'#fff',
              border:'none', borderRadius:12, padding:'12px 22px',
              fontSize:14, fontWeight:700, cursor:'pointer',
              boxShadow:'0 6px 20px rgba(45,138,78,0.45)',
            }}>🤖 Ask AI Advisor</button>
            <button onClick={() => onNav('market')} style={{
              background:'rgba(255,255,255,0.18)', backdropFilter:'blur(10px)',
              color:'#fff', border:'1px solid rgba(255,255,255,0.35)',
              borderRadius:12, padding:'12px 22px', fontSize:14, fontWeight:600, cursor:'pointer',
            }}>💹 Market Prices</button>
          </div>
        </div>

        {/* Top-right live badge */}
        <div style={{
          position:'absolute', top:38, right:18,
          background:'rgba(0,0,0,0.40)', backdropFilter:'blur(12px)',
          border:'1px solid rgba(255,255,255,0.22)', borderRadius:999,
          padding:'6px 14px', display:'flex', alignItems:'center', gap:7,
        }}>
          <span style={{ width:7,height:7,borderRadius:'50%',background:'#5DC97E', display:'inline-block',animation:'pdot 2s infinite' }} />
          <span style={{ color:'#fff', fontSize:12, fontWeight:600 }}>AI Live</span>
        </div>
      </div>

      {/* ══ STATS ══════════════════════════════════════════ */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:12 }}>
        {[
          { e:'🌱', v:'10+',  l:'Crops in Guide',    c:'#5DC97E' },
          { e:'🤖', v:'24/7', l:'AI Advisor Online', c:'#FCD34D' },
          { e:'🔬', v:'8',    l:'Diseases Covered',  c:'#F87171' },
          { e:'💹', v:'Live', l:'Market Prices',     c:'#60A5FA' },
        ].map((s,i) => (
          <div key={i} className="glass fade-up" style={{ padding:'18px 16px', animationDelay:`${i*0.1}s`,
            borderTop:`3px solid ${s.c}` }}>
            <span style={{ fontSize:30 }}>{s.e}</span>
            <div style={{ fontFamily:'var(--font-m)', fontWeight:700, fontSize:24, color:s.c, marginTop:8 }}>{s.v}</div>
            <div style={{ fontSize:12.5, color:'var(--td)', marginTop:3, fontWeight:500 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* ══ MARKET IMAGE STRIP — full bleed ════════════════ */}
      <div style={{ position:'relative', margin:'0 -16px', height:200, overflow:'hidden' }}>
        <img
          src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=1400&q=88&fit=crop&auto=format"
          alt="Fresh vegetables at Kisii Town market"
          style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center 55%', animation:'heroKB 12s ease forwards' }}
          onError={e => { e.target.src='https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1400&q=85&fit=crop'; }}
        />
        <div style={{
          position:'absolute', inset:0,
          background:'linear-gradient(100deg, rgba(5,18,8,0.90) 0%, rgba(5,18,8,0.30) 55%, transparent 100%)',
          display:'flex', alignItems:'center', padding:'0 28px',
        }}>
          <div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.65)', marginBottom:6, fontWeight:500 }}>Fresh from the field</div>
            <div style={{ fontFamily:'var(--font-d)', fontSize:24, color:'#fff', fontWeight:800, lineHeight:1.28 }}>
              Get the Best Price<br/>for Your Harvest
            </div>
            <button onClick={() => onNav('market')} style={{
              marginTop:14, background:'var(--amber)', color:'#0F2E18',
              border:'none', borderRadius:9, padding:'9px 18px',
              fontSize:13.5, fontWeight:700, cursor:'pointer',
              boxShadow:'0 4px 14px rgba(245,158,11,0.45)',
            }}>Check Prices →</button>
          </div>
        </div>
      </div>

      {/* ══ TOP MARKET MOVERS ══════════════════════════════ */}
      {topMovers.length > 0 && (
        <GCard>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
            <div style={{ fontWeight:700, fontSize:15.5, color:'#fff' }}>📈 Top Market Movers</div>
            <button onClick={() => onNav('market')} style={{
              background:'rgba(93,201,126,0.20)', color:'#A8F5C0',
              border:'1px solid rgba(93,201,126,0.30)', borderRadius:8,
              padding:'5px 12px', fontSize:12.5, fontWeight:600, cursor:'pointer',
            }}>View all →</button>
          </div>
          {topMovers.map((c,i) => (
            <div key={i} style={{
              display:'flex', justifyContent:'space-between', alignItems:'center',
              padding:'12px 0', borderBottom: i<topMovers.length-1?'1px solid rgba(255,255,255,0.10)':'none',
            }}>
              <div>
                <div style={{ fontWeight:700, fontSize:14.5, color:'#fff' }}>{c.crop_name}</div>
                <div style={{ fontSize:11.5, color:'var(--td)', marginTop:1 }}>{c.unit}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontFamily:'var(--font-m)', fontWeight:700, fontSize:16, color:'#fff' }}>
                  KES {c.price?.toLocaleString()}
                </div>
                <div style={{ fontSize:13, fontWeight:700, marginTop:2,
                  color: c.change_percent>0 ? '#5DC97E' : '#F87171' }}>
                  {c.change_percent>0?'▲ +':'▼ '}{c.change_percent}%
                </div>
              </div>
            </div>
          ))}
        </GCard>
      )}

      {/* ══ QUICK ACTIONS ══════════════════════════════════ */}
      <div>
        <div style={{ fontSize:11.5, fontWeight:700, color:'var(--tm)', textTransform:'uppercase', letterSpacing:2, marginBottom:12 }}>⚡ Quick Actions</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          {[
            { icon:'🤖', label:'Ask AI Advisor',  sub:'Expert farming advice',  tab:'advisor',  ac:'#5DC97E' },
            { icon:'🔬', label:'Diagnose Crop',   sub:'Identify disease/pest',  tab:'doctor',   ac:'#F87171' },
            { icon:'📅', label:'Planting Guide',  sub:'What to grow now',       tab:'calendar', ac:'#60A5FA' },
            { icon:'💹', label:'Market Prices',   sub:"Today's crop prices",    tab:'market',   ac:'#FCD34D' },
          ].map((a,i) => (
            <button key={i} onClick={() => onNav(a.tab)} className="glass" style={{
              padding:'18px 16px', cursor:'pointer', textAlign:'left',
              transition:'all 0.22s ease', border:`1px solid ${a.ac}28`,
              background:`rgba(255,255,255,0.08)`,
            }}
              onMouseEnter={e=>{e.currentTarget.style.background=`rgba(255,255,255,0.17)`;e.currentTarget.style.transform='translateY(-3px)';}}
              onMouseLeave={e=>{e.currentTarget.style.background=`rgba(255,255,255,0.08)`;e.currentTarget.style.transform='none';}}>
              <div style={{ fontSize:30, marginBottom:10 }}>{a.icon}</div>
              <div style={{ fontSize:14, fontWeight:700, color:'#fff', marginBottom:3 }}>{a.label}</div>
              <div style={{ fontSize:12, color:'var(--td)' }}>{a.sub}</div>
              <div style={{ width:28, height:2, background:a.ac, borderRadius:2, marginTop:10 }} />
            </button>
          ))}
        </div>
      </div>

      {/* ══ CROP HEALTH IMAGE — full bleed ═════════════════ */}
      <div style={{ position:'relative', margin:'0 -16px', height:190, overflow:'hidden' }}>
        <img
          src="https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1400&q=88&fit=crop&auto=format"
          alt="Healthy maize crop field in Kenya"
          style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center 45%', animation:'heroKB 14s ease forwards' }}
          onError={e => { e.target.src='https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=1400&q=85&fit=crop'; }}
        />
        <div style={{
          position:'absolute', inset:0,
          background:'linear-gradient(135deg, rgba(180,20,20,0.88) 0%, rgba(180,20,20,0.18) 100%)',
          display:'flex', alignItems:'center', padding:'0 28px',
        }}>
          <div>
            <div style={{ fontFamily:'var(--font-d)', fontSize:22, color:'#fff', fontWeight:800, marginBottom:6 }}>
              Spot Disease Early 🔬
            </div>
            <div style={{ fontSize:13.5, color:'rgba(255,255,255,0.82)', marginBottom:14 }}>
              AI diagnosis in seconds — before it spreads to your whole field
            </div>
            <button onClick={() => onNav('doctor')} style={{
              background:'#fff', color:'#DC2626', border:'none',
              borderRadius:9, padding:'9px 18px', fontSize:13.5, fontWeight:700, cursor:'pointer',
              boxShadow:'0 4px 16px rgba(0,0,0,0.25)',
            }}>Diagnose Now →</button>
          </div>
        </div>
      </div>

      {/* ══ POST-HARVEST TIPS ══════════════════════════════ */}
      <GCard style={{ borderLeft:'3px solid #5DC97E' }}>
        <div style={{ fontSize:15.5, fontWeight:700, color:'#fff', marginBottom:14 }}>
          📦 Post-Harvest Loss Reduction
        </div>
        {[
          { i:'💧', t:'Dry grains to <13% moisture before storage to prevent aflatoxin contamination' },
          { i:'🛍️', t:'Use hermetic PICS bags for grain storage — reduces losses by up to 30%' },
          { i:'🐛', t:'Treat stored grains with Actellic Super to eliminate weevils' },
          { i:'🍅', t:'Harvest tomatoes at green-ripe stage for better shelf life during transport' },
          { i:'👥', t:'Aggregate with farmer groups and sell bulk — earn 20–40% above open market rates' },
        ].map((tip,i) => (
          <div key={i} style={{
            display:'flex', gap:12, padding:'10px 0',
            borderBottom: i<4?'1px solid rgba(255,255,255,0.08)':'none',
          }}>
            <span style={{ fontSize:20, flexShrink:0, marginTop:1 }}>{tip.i}</span>
            <span style={{ fontSize:13.5, color:'var(--td)', lineHeight:1.6 }}>{tip.t}</span>
          </div>
        ))}
      </GCard>

      {/* ══ FOOTER ═════════════════════════════════════════ */}
      <div style={{ textAlign:'center', padding:'10px 0 4px', fontSize:12, color:'var(--tm)' }}>
        🌾 Shamba Smart · AI-Powered Farming · Kisii County, Kenya
      </div>
    </div>
  );
}
