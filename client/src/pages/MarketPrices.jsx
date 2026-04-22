import { useState, useEffect } from 'react';
import { getMarket } from '../api.js';

export default function MarketPrices() {
  const [market, setMarket] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('change');

  useEffect(() => {
    getMarket().then(d=>{ setMarket(d); setLoading(false); }).catch(()=>setLoading(false));
  }, []);

  const sorted = [...market].sort((a,b) => {
    if (sort==='change') return (b.change_percent||0)-(a.change_percent||0);
    if (sort==='price')  return (b.price||0)-(a.price||0);
    return a.crop_name.localeCompare(b.crop_name);
  });

  const maxPrice = Math.max(...market.map(m=>m.price||0), 1);

  if (loading) return <div style={{ textAlign:'center', padding:60, color:'var(--muted)', fontSize:14 }}>Loading market prices...</div>;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
      <div className="fade-up" style={{ background:'linear-gradient(135deg,#1A1505,#1A0D00)', border:'1px solid rgba(245,158,11,0.2)', borderRadius:16, padding:20 }}>
        <div style={{ fontSize:15, fontWeight:700, color:'var(--gold)' }}>💹 Crop Market Prices</div>
        <div style={{ fontSize:12.5, color:'var(--muted)', marginTop:4 }}>
          Indicative prices for Kisii County & surrounding markets<br/>
          <span style={{ color:'#F87171', fontSize:11 }}>⚠ Always verify at your local market (Kisii Town, Suneka, Ogembo)</span>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
        {[
          { v: market.filter(m=>m.change_percent>0).length, l:'📈 Rising',    c:'var(--lime)' },
          { v: market.filter(m=>m.change_percent<0).length, l:'📉 Falling',   c:'#F87171' },
          { v: market.filter(m=>m.demand==='High').length,   l:'🔥 High Demand',c:'var(--gold)' },
        ].map((s,i) => (
          <div key={i} style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:12, padding:'14px', textAlign:'center' }}>
            <div style={{ fontSize:22, fontFamily:'var(--font-m)', fontWeight:700, color:s.c }}>{s.v}</div>
            <div style={{ fontSize:11, color:'var(--muted)', marginTop:4 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Sort */}
      <div style={{ display:'flex', gap:7, alignItems:'center' }}>
        <span style={{ fontSize:12, color:'var(--muted)' }}>Sort:</span>
        {[['change','% Change'],['price','Price'],['crop_name','A–Z']].map(([s,l]) => (
          <button key={s} onClick={()=>setSort(s)} style={{
            background: sort===s ? 'var(--amber)' : 'rgba(217,119,6,0.1)',
            color: sort===s ? 'var(--soil)' : 'var(--amber)',
            border:'1px solid var(--border)', borderRadius:999, padding:'6px 14px',
            fontSize:12, cursor:'pointer', fontFamily:'var(--font-b)', fontWeight: sort===s ? 700 : 500
          }}>{l}</button>
        ))}
      </div>

      {/* Price list */}
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {sorted.map((item,i) => (
          <div key={item.id} className="fade-up" style={{
            display:'flex', alignItems:'center', justifyContent:'space-between',
            padding:'14px 16px', background:'var(--surface)', borderRadius:12,
            border:'1px solid var(--border)', transition:'all 0.2s', animationDelay:`${i*0.04}s`
          }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--amber)';e.currentTarget.style.transform='translateX(2px)';}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.transform='none';}}>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:14, color:'var(--wheat)' }}>{item.crop_name}</div>
              <div style={{ fontSize:11, color:'var(--muted)', marginTop:1 }}>{item.unit}</div>
              <div style={{ marginTop:7, width:120, height:5, background:'rgba(255,255,255,0.08)', borderRadius:3, overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${(item.price/maxPrice)*100}%`,
                  background:'linear-gradient(90deg,var(--amber),var(--gold))', borderRadius:3, transition:'width 1s' }} />
              </div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontFamily:'var(--font-m)', fontWeight:700, fontSize:16, color:'var(--wheat)' }}>
                KES {item.price?.toLocaleString()}
              </div>
              <div style={{ fontSize:12, fontWeight:600, marginTop:2, color: item.change_percent>0?'var(--lime)':'#F87171' }}>
                {item.change_percent>0?'↑ +':'↓ '}{item.change_percent}%
              </div>
              <span style={{ display:'inline-block', marginTop:4, padding:'3px 9px', borderRadius:999, fontSize:11, fontWeight:600,
                background: item.demand==='High'?'rgba(74,222,128,0.15)':'rgba(255,255,255,0.06)',
                color: item.demand==='High'?'var(--lime)':'var(--muted)',
                border: `1px solid ${item.demand==='High'?'rgba(74,222,128,0.3)':'var(--border)'}` }}>
                {item.demand} Demand
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Selling tips */}
      <div style={{ background:'var(--card)', border:'1px solid rgba(217,119,6,0.2)', borderRadius:16, padding:18 }}>
        <div style={{ fontSize:13, fontWeight:700, color:'var(--gold)', marginBottom:12 }}>💡 Smart Selling Tips</div>
        {[
          { i:'🏪', t:'Sell directly to supermarkets (Naivas, QuickMart) — 20-40% better price' },
          { i:'👥', t:'Form a farmer group to aggregate produce for better bargaining power' },
          { i:'🥑', t:'Avocado demand is very high — Hass variety fetches export prices' },
          { i:'📱', t:'Use M-Kilimo & Tulaa apps to compare prices across different markets' },
          { i:'⏰', t:'Sell tomatoes early morning at Kisii Town market for best prices' },
        ].map((item,i) => (
          <div key={i} style={{ display:'flex', gap:10, fontSize:13, color:'var(--muted)', marginTop:9, lineHeight:1.5 }}>
            <span style={{ fontSize:16, flexShrink:0 }}>{item.i}</span>{item.t}
          </div>
        ))}
      </div>
    </div>
  );
}
