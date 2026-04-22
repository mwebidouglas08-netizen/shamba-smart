import { useState, useEffect } from 'react';
import { getMarket } from '../api.js';

export default function MarketPrices() {
  const [market,  setMarket]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort,    setSort]    = useState('change');

  useEffect(() => {
    getMarket().then(d=>{ setMarket(d); setLoading(false); }).catch(()=>setLoading(false));
  }, []);

  const sorted = [...market].sort((a,b) => {
    if (sort==='change') return (b.change_percent||0)-(a.change_percent||0);
    if (sort==='price')  return (b.price||0)-(a.price||0);
    return a.crop_name.localeCompare(b.crop_name);
  });

  const maxPrice = Math.max(...market.map(m=>m.price||0), 1);
  const rising   = market.filter(m=>m.change_percent>0).length;
  const falling  = market.filter(m=>m.change_percent<0).length;
  const highDmd  = market.filter(m=>m.demand==='High').length;

  if (loading) return <div style={{ textAlign:'center', padding:70, color:'var(--td)', fontSize:14 }}>Loading market prices...</div>;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18 }}>

      {/* Full-bleed hero */}
      <div style={{ position:'relative', margin:'0 -16px', height:168, overflow:'hidden' }}>
        <img
          src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1400&q=88&fit=crop&auto=format"
          alt="African fresh produce market"
          style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center 55%', animation:'heroKB 12s ease forwards' }}
          onError={e => { e.target.src='https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=1400&q=85&fit=crop'; }}
        />
        <div style={{
          position:'absolute', inset:0,
          background:'linear-gradient(100deg, rgba(120,60,5,0.92) 0%, rgba(120,60,5,0.40) 60%, transparent 100%)',
          display:'flex', alignItems:'center', padding:'0 24px',
        }}>
          <div>
            <div style={{ fontFamily:'var(--font-d)', fontWeight:800, color:'#fff', fontSize:24, marginBottom:5, textShadow:'0 2px 10px rgba(0,0,0,0.4)' }}>
              💹 Crop Market Prices
            </div>
            <div style={{ fontSize:13.5, color:'rgba(255,255,255,0.82)', marginBottom:8 }}>
              Kisii County & surrounding markets
            </div>
            <div style={{
              display:'inline-flex', alignItems:'center', gap:6,
              background:'rgba(255,255,255,0.16)', backdropFilter:'blur(8px)',
              border:'1px solid rgba(255,255,255,0.28)', borderRadius:999,
              padding:'4px 13px', fontSize:11.5, color:'#fff', fontWeight:600,
            }}>
              ⚠ Verify at Kisii Town, Suneka, or Ogembo markets
            </div>
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:11 }}>
        {[
          { v:rising,  l:'Rising',      i:'📈', c:'#5DC97E', bg:'rgba(93,201,126,0.18)', bc:'rgba(93,201,126,0.40)' },
          { v:falling, l:'Falling',     i:'📉', c:'#F87171', bg:'rgba(248,113,113,0.18)',bc:'rgba(248,113,113,0.40)' },
          { v:highDmd, l:'High Demand', i:'🔥', c:'#FCD34D', bg:'rgba(252,211,77,0.18)', bc:'rgba(252,211,77,0.40)' },
        ].map((s,i) => (
          <div key={i} className="glass" style={{ textAlign:'center', padding:'14px 10px', border:`1.5px solid ${s.bc}`, background:s.bg }}>
            <div style={{ fontSize:22 }}>{s.i}</div>
            <div style={{ fontFamily:'var(--font-m)', fontWeight:700, fontSize:24, color:s.c, marginTop:4 }}>{s.v}</div>
            <div style={{ fontSize:11.5, color:'var(--td)', marginTop:3, fontWeight:500 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Sort */}
      <div style={{ display:'flex', gap:8, alignItems:'center' }}>
        <span style={{ fontSize:12.5, color:'var(--td)', fontWeight:500 }}>Sort:</span>
        {[['change','% Change'],['price','Price'],['crop_name','A–Z']].map(([s,l]) => (
          <button key={s} onClick={() => setSort(s)} style={{
            background: sort===s ? 'rgba(45,138,78,0.55)' : 'rgba(255,255,255,0.10)',
            color:'#fff',
            border: `1.5px solid ${sort===s ? 'rgba(93,201,126,0.60)' : 'rgba(255,255,255,0.18)'}`,
            borderRadius:999, padding:'6px 15px', fontSize:12.5,
            cursor:'pointer', fontFamily:'var(--font-b)', fontWeight:sort===s?700:500,
            transition:'all 0.2s', backdropFilter:'blur(10px)',
            boxShadow: sort===s?'0 3px 10px rgba(45,138,78,0.35)':'none',
          }}>{l}</button>
        ))}
      </div>

      {/* Price rows */}
      <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
        {sorted.map((item,i) => (
          <div key={item.id} className="glass fade-up" style={{
            padding:'15px 18px', display:'flex', alignItems:'center', justifyContent:'space-between',
            borderLeft:`4px solid ${item.change_percent>0?'#5DC97E':item.change_percent<0?'#F87171':'rgba(255,255,255,0.18)'}`,
            animationDelay:`${i*0.04}s`, transition:'all 0.22s',
          }}
            onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.18)';e.currentTarget.style.transform='translateX(4px)';}}
            onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.11)';e.currentTarget.style.transform='none';}}>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:15.5, color:'#fff', marginBottom:2 }}>{item.crop_name}</div>
              <div style={{ fontSize:12, color:'var(--td)', marginBottom:8 }}>{item.unit}</div>
              {/* Price bar */}
              <div style={{ height:4, background:'rgba(255,255,255,0.12)', borderRadius:2, width:140, overflow:'hidden' }}>
                <div style={{
                  height:'100%', width:`${(item.price/maxPrice)*100}%`,
                  background:'linear-gradient(90deg,#2D8A4E,#FCD34D)',
                  borderRadius:2, transition:'width 1s ease',
                }} />
              </div>
            </div>
            <div style={{ textAlign:'right', flexShrink:0 }}>
              <div style={{ fontFamily:'var(--font-m)', fontWeight:700, fontSize:18, color:'#fff' }}>
                KES {item.price?.toLocaleString()}
              </div>
              <div style={{ fontSize:13.5, fontWeight:700, marginTop:3,
                color:item.change_percent>0?'#5DC97E':item.change_percent<0?'#F87171':'var(--tm)' }}>
                {item.change_percent>0?'▲ +':item.change_percent<0?'▼ ':'— '}{item.change_percent}%
              </div>
              <span style={{
                display:'inline-block', marginTop:5, padding:'3px 10px', borderRadius:999,
                fontSize:11.5, fontWeight:600,
                background: item.demand==='High'?'rgba(93,201,126,0.22)':item.demand==='Medium'?'rgba(252,211,77,0.22)':'rgba(255,255,255,0.08)',
                color: item.demand==='High'?'#A8F5C0':item.demand==='Medium'?'#FCD34D':'var(--td)',
                border: `1px solid ${item.demand==='High'?'rgba(93,201,126,0.40)':item.demand==='Medium'?'rgba(252,211,77,0.40)':'rgba(255,255,255,0.14)'}`,
              }}>
                {item.demand} Demand
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Selling tips */}
      <div className="glass fade-up" style={{ padding:20, borderLeft:'3px solid #FCD34D' }}>
        <div style={{ fontSize:15.5, fontWeight:700, color:'#fff', marginBottom:14 }}>💡 Smart Selling Tips</div>
        {[
          { i:'🏪', t:'Sell directly to Naivas or QuickMart — earn 20–40% more than the open market' },
          { i:'👥', t:'Form a farmer group to aggregate produce — better bargaining power and shared transport' },
          { i:'🥑', t:'Hass Avocado has very high export demand — consider planting for premium prices' },
          { i:'📱', t:'Use M-Kilimo and Tulaa apps to compare prices across Kisii, Nakuru, and Nairobi markets' },
          { i:'⏰', t:'Sell tomatoes early morning at Kisii Town market — prices drop significantly by midday' },
        ].map((tip,i) => (
          <div key={i} style={{
            display:'flex', gap:12, padding:'10px 0',
            borderBottom:i<4?'1px solid rgba(255,255,255,0.08)':'none',
          }}>
            <span style={{ fontSize:20,flexShrink:0,marginTop:1 }}>{tip.i}</span>
            <span style={{ fontSize:13.5,color:'var(--td)',lineHeight:1.6 }}>{tip.t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
