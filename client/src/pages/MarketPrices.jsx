import { useState, useEffect } from 'react';
import { getMarket } from '../api.jsx';

export default function MarketPrices() {
  const [market,  setMarket]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort,    setSort]    = useState('change');

  useEffect(() => {
    getMarket().then(d => { setMarket(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const sorted = [...market].sort((a, b) => {
    if (sort === 'change') return (b.change_percent || 0) - (a.change_percent || 0);
    if (sort === 'price')  return (b.price || 0) - (a.price || 0);
    return a.crop_name.localeCompare(b.crop_name);
  });

  const maxPrice = Math.max(...market.map(m => m.price || 0), 1);
  const rising   = market.filter(m => m.change_percent > 0).length;
  const falling  = market.filter(m => m.change_percent < 0).length;
  const highDmd  = market.filter(m => m.demand === 'High').length;

  if (loading) return (
    <div style={{ textAlign:'center', padding:70, color:'var(--muted)', fontSize:14 }}>Loading market prices...</div>
  );

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18 }}>

      {/* Full-bleed hero */}
      <div style={{ margin:'0 -16px', position:'relative', height:168, overflow:'hidden' }}>
        <img
          src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1400&q=90&fit=crop&auto=format"
          alt="Colourful African produce market with vegetables and fruits"
          style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center 55%', animation:'heroKB 12s ease forwards', display:'block' }}
          onError={e => { e.target.src='https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=1400&q=85&fit=crop'; }}
        />
        <div style={{
          position:'absolute', inset:0,
          background:'linear-gradient(100deg, rgba(10,31,61,0.92) 0%, rgba(20,71,160,0.55) 55%, transparent 100%)',
          display:'flex', alignItems:'center', padding:'0 26px',
        }}>
          <div>
            <div style={{ fontFamily:'var(--font-d)', fontWeight:700, color:'#fff', fontSize:24, marginBottom:5 }}>💹 Crop Market Prices</div>
            <div style={{ fontSize:13.5, color:'rgba(255,255,255,0.82)', marginBottom:8 }}>Kisii County & surrounding markets</div>
            <div style={{
              display:'inline-flex', alignItems:'center', gap:6,
              background:'rgba(255,255,255,0.16)', backdropFilter:'blur(8px)',
              border:'1px solid rgba(255,255,255,0.28)', borderRadius:999,
              padding:'4px 13px', fontSize:11.5, color:'#fff', fontWeight:600,
            }}>⚠ Verify at Kisii Town, Suneka, or Ogembo markets</div>
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:11 }}>
        {[
          { v:rising,  l:'Rising',      i:'📈', bg:'#f0fdf9', c:'var(--green)', bc:'#a7f3d0' },
          { v:falling, l:'Falling',     i:'📉', bg:'#fff5f5', c:'var(--red)',   bc:'#fecaca'  },
          { v:highDmd, l:'High Demand', i:'🔥', bg:'var(--blue-50)', c:'var(--blue-600)', bc:'var(--blue-200)' },
        ].map((s, i) => (
          <div key={i} className="card fade-up" style={{ textAlign:'center', padding:'14px 10px', background:s.bg, borderTop:`3px solid ${s.c}` }}>
            <div style={{ fontSize:22 }}>{s.i}</div>
            <div style={{ fontFamily:'var(--font-m)', fontWeight:700, fontSize:24, color:s.c, marginTop:4 }}>{s.v}</div>
            <div style={{ fontSize:11.5, color:'var(--muted)', marginTop:3, fontWeight:500 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Sort */}
      <div style={{ display:'flex', gap:8, alignItems:'center' }}>
        <span style={{ fontSize:12.5, color:'var(--muted)', fontWeight:500 }}>Sort by:</span>
        {[['change','% Change'],['price','Price'],['crop_name','A–Z']].map(([s, l]) => (
          <button key={s} onClick={() => setSort(s)} style={{
            background: sort===s ? 'var(--blue-600)' : 'var(--white)',
            color: sort===s ? '#fff' : 'var(--blue-600)',
            border:`1.5px solid ${sort===s ? 'var(--blue-600)' : 'var(--blue-200)'}`,
            borderRadius:999, padding:'6px 15px', fontSize:12.5, cursor:'pointer',
            fontFamily:'var(--font-b)', fontWeight:sort===s ? 700 : 500,
            transition:'all 0.2s',
            boxShadow:sort===s ? '0 3px 10px rgba(26,95,200,0.25)' : 'var(--shadow-sm)',
          }}>{l}</button>
        ))}
      </div>

      {/* Price list */}
      <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
        {sorted.map((item, i) => (
          <div key={item.id} className="card fade-up" style={{
            padding:'15px 18px',
            display:'flex', alignItems:'center', justifyContent:'space-between',
            borderLeft:`4px solid ${item.change_percent > 0 ? 'var(--green)' : item.change_percent < 0 ? 'var(--red)' : 'var(--blue-300)'}`,
            animationDelay:`${i * 0.04}s`, transition:'all 0.22s',
          }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow='var(--shadow)'; e.currentTarget.style.transform='translateX(3px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow='var(--shadow-sm)'; e.currentTarget.style.transform='none'; }}>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:15.5, color:'var(--text)', marginBottom:2 }}>{item.crop_name}</div>
              <div style={{ fontSize:12, color:'var(--muted)', marginBottom:8 }}>{item.unit}</div>
              <div style={{ height:5, background:'var(--gray-200)', borderRadius:3, width:140, overflow:'hidden' }}>
                <div style={{
                  height:'100%', width:`${(item.price/maxPrice)*100}%`,
                  background:'linear-gradient(90deg, var(--blue-500), var(--sky))',
                  borderRadius:3, transition:'width 1s ease',
                }} />
              </div>
            </div>
            <div style={{ textAlign:'right', flexShrink:0 }}>
              <div style={{ fontFamily:'var(--font-m)', fontWeight:700, fontSize:18, color:'var(--blue-800)' }}>
                KES {item.price?.toLocaleString()}
              </div>
              <div style={{ fontSize:13.5, fontWeight:700, marginTop:3,
                color:item.change_percent > 0 ? 'var(--green)' : item.change_percent < 0 ? 'var(--red)' : 'var(--muted)' }}>
                {item.change_percent > 0 ? '▲ +' : item.change_percent < 0 ? '▼ ' : '— '}{item.change_percent}%
              </div>
              <span style={{
                display:'inline-block', marginTop:5, padding:'3px 10px', borderRadius:999,
                fontSize:11.5, fontWeight:600,
                background: item.demand==='High' ? '#f0fdf9' : item.demand==='Medium' ? '#fffbeb' : 'var(--gray-100)',
                color: item.demand==='High' ? 'var(--green)' : item.demand==='Medium' ? 'var(--amber)' : 'var(--muted)',
                border:`1px solid ${item.demand==='High' ? '#a7f3d0' : item.demand==='Medium' ? '#fcd34d' : 'var(--border)'}`,
              }}>{item.demand} Demand</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tips card */}
      <div className="card fade-up" style={{ padding:20, borderTop:'3px solid var(--blue-400)' }}>
        <div style={{ fontSize:15.5, fontWeight:700, color:'var(--text)', marginBottom:14 }}>💡 Smart Selling Tips</div>
        {[
          { i:'🏪', t:'Sell directly to Naivas or QuickMart — earn 20–40% more than the open market' },
          { i:'👥', t:'Form a farmer group to aggregate produce — better bargaining power and shared transport' },
          { i:'🥑', t:'Hass Avocado has very high export demand — consider planting for premium prices' },
          { i:'📱', t:'Use M-Kilimo & Tulaa apps to compare prices across Kisii, Nakuru, and Nairobi markets' },
          { i:'⏰', t:'Sell tomatoes early morning at Kisii Town market — prices drop significantly by midday' },
        ].map((tip, i) => (
          <div key={i} style={{
            display:'flex', gap:12, padding:'10px 0',
            borderBottom:i < 4 ? '1px solid var(--border)' : 'none',
          }}>
            <span style={{ fontSize:20, flexShrink:0, marginTop:1 }}>{tip.i}</span>
            <span style={{ fontSize:13.5, color:'var(--text-2)', lineHeight:1.6 }}>{tip.t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
