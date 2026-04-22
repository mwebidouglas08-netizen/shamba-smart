import { useEffect, useState } from 'react';
import { getMarket } from '../api.js';

const Card = ({ children, style={} }) => (
  <div className="fade-up" style={{ background:'var(--card)', border:'1px solid var(--border)',
    borderRadius:16, padding:20, ...style }}>{children}</div>
);

const SEASON = () => {
  const m = new Date().getMonth();
  if (m>=2&&m<=4) return { name:'Long Rains (MAM)', emoji:'🌧️', crops:['Maize','Beans','Tomatoes','Kale'], advice:'Peak planting season. Prepare land, apply basal fertilizer at planting.' };
  if (m>=9&&m<=11) return { name:'Short Rains (OND)', emoji:'🌦️', crops:['Beans','Kale','Tomatoes','Cabbage'], advice:'Good for short-season crops. Monitor drainage. Fall Armyworm alert.' };
  if (m>=5&&m<=8) return  { name:'Dry Season', emoji:'☀️', crops:['Sweet Potato','Cassava','Irrigated crops'], advice:'Focus on irrigation. Harvest & store from long rains.' };
  return { name:'Festive Dry Season', emoji:'🌤️', crops:['Kale','Cabbage'], advice:'Prepare seedbeds. Source quality seed. Good time for soil testing.' };
};

export default function Dashboard({ onNav }) {
  const [market, setMarket] = useState([]);
  const season = SEASON();
  useEffect(() => { getMarket().then(setMarket).catch(()=>{}); }, []);

  const topCrops = [...market].sort((a,b)=>b.change_percent-a.change_percent).slice(0,3);

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      {/* Season Hero */}
      <Card style={{ background:'linear-gradient(135deg,#3D1F00,#1A0D00)', border:'1px solid rgba(217,119,6,0.3)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-20, right:-20, fontSize:120, opacity:0.07 }}>🌾</div>
        <div style={{ fontSize:11, color:'var(--muted)', letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>Current Season</div>
        <div style={{ fontSize:24, fontFamily:'var(--font-d)', fontWeight:900, color:'var(--wheat)' }}>{season.emoji} {season.name}</div>
        <p style={{ marginTop:10, fontSize:13.5, color:'var(--text)', lineHeight:1.6 }}>{season.advice}</p>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginTop:12 }}>
          {season.crops.map(c => (
            <span key={c} style={{ background:'rgba(217,119,6,0.2)', color:'var(--gold)', border:'1px solid rgba(217,119,6,0.3)',
              borderRadius:999, padding:'4px 12px', fontSize:12, fontWeight:600 }}>{c}</span>
          ))}
        </div>
      </Card>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:12 }}>
        {[
          { e:'🌱', v:'10+', l:'Crops in Guide' },
          { e:'🤖', v:'24/7', l:'AI Advisor' },
          { e:'🔬', v:'8',    l:'Diseases Covered' },
          { e:'💹', v:'Live', l:'Market Prices' },
        ].map((s,i) => (
          <Card key={i} style={{ textAlign:'center', animationDelay:`${i*0.1}s` }}>
            <div style={{ fontSize:32 }}>{s.e}</div>
            <div style={{ fontSize:22, fontFamily:'var(--font-m)', fontWeight:700, color:'var(--amber)', marginTop:4 }}>{s.v}</div>
            <div style={{ fontSize:12, color:'var(--muted)', marginTop:2 }}>{s.l}</div>
          </Card>
        ))}
      </div>

      {/* Top Market Movers */}
      {topCrops.length > 0 && (
        <Card>
          <div style={{ fontSize:13, fontWeight:700, color:'var(--gold)', marginBottom:12 }}>📈 Top Market Movers Today</div>
          {topCrops.map((c,i) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
              padding:'10px 0', borderBottom: i<topCrops.length-1 ? '1px solid var(--border)' : 'none' }}>
              <span style={{ fontSize:14, color:'var(--wheat)', fontWeight:600 }}>{c.crop_name}</span>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontFamily:'var(--font-m)', fontWeight:700, color:'var(--wheat)' }}>KES {c.price?.toLocaleString()}</div>
                <div style={{ fontSize:12, color: c.change_percent>0 ? 'var(--lime)' : '#F87171', fontWeight:600 }}>
                  {c.change_percent>0?'+':''}{c.change_percent}%
                </div>
              </div>
            </div>
          ))}
        </Card>
      )}

      {/* Quick Actions */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        {[
          { icon:'🤖', label:'Ask AI Advisor',  sub:'Expert farming advice',  tab:'advisor' },
          { icon:'🔬', label:'Diagnose Crop',    sub:'Identify disease/pest',  tab:'doctor'  },
          { icon:'📅', label:'Planting Guide',   sub:'What to grow now',       tab:'calendar'},
          { icon:'💹', label:'Market Prices',    sub:"Today's crop prices",    tab:'market'  },
        ].map((a,i) => (
          <button key={i} onClick={() => onNav(a.tab)} style={{
            background:'var(--card)', border:'1px solid var(--border)', borderRadius:14,
            padding:16, cursor:'pointer', textAlign:'left', transition:'all 0.2s'
          }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--amber)';e.currentTarget.style.transform='translateY(-2px)';}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.transform='none';}}>
            <div style={{ fontSize:28 }}>{a.icon}</div>
            <div style={{ fontSize:13.5, fontWeight:600, color:'var(--wheat)', marginTop:6 }}>{a.label}</div>
            <div style={{ fontSize:11.5, color:'var(--muted)', marginTop:2 }}>{a.sub}</div>
          </button>
        ))}
      </div>

      {/* Post Harvest Tips */}
      <Card style={{ borderColor:'rgba(74,222,128,0.2)' }}>
        <div style={{ fontSize:14, fontWeight:600, color:'var(--lime)', marginBottom:12 }}>📦 Post-Harvest Tips</div>
        {[
          'Dry grains to <13% moisture before storage to prevent aflatoxin',
          'Use hermetic PICS bags for grains — saves up to 30% losses',
          'Treat stored grains with Actellic Super to prevent weevils',
          'Harvest tomatoes at green-ripe stage for better shelf life',
          'Form a farmer group to sell in bulk — 20-40% better prices',
        ].map((t,i) => (
          <div key={i} style={{ display:'flex', gap:10, fontSize:13, color:'var(--muted)', marginTop:8, lineHeight:1.5 }}>
            <span style={{ color:'var(--lime)', flexShrink:0 }}>✓</span>{t}
          </div>
        ))}
      </Card>
    </div>
  );
}
