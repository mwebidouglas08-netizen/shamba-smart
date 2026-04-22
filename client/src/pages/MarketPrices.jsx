import { useState, useEffect } from 'react';
import { getMarket } from '../api.js';

export default function MarketPrices() {
  const [market, setMarket] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('change');

  useEffect(() => {
    getMarket().then(d => { setMarket(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const sorted = [...market].sort((a, b) => {
    if (sort === 'change') return (b.change_percent || 0) - (a.change_percent || 0);
    if (sort === 'price')  return (b.price || 0) - (a.price || 0);
    return a.crop_name.localeCompare(b.crop_name);
  });

  const maxPrice = Math.max(...market.map(m => m.price || 0), 1);
  const rising  = market.filter(m => m.change_percent > 0).length;
  const falling = market.filter(m => m.change_percent < 0).length;
  const highDmd = market.filter(m => m.demand === 'High').length;

  if (loading) return (
    <div style={{ textAlign: 'center', padding: 70, color: 'var(--muted)', fontSize: 14 }}>Loading market prices...</div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Hero */}
      <div className="fade-up" style={{ borderRadius: 18, overflow: 'hidden', height: 140, position: 'relative', boxShadow: 'var(--shadow)' }}>
        <img
          src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=900&q=80&fit=crop"
          alt="African market with fresh produce"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 60%' }}
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=900&q=80&fit=crop'; }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, rgba(180,83,9,0.92) 0%, rgba(180,83,9,0.35) 100%)',
          display: 'flex', alignItems: 'center', padding: '0 24px',
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-d)', fontWeight: 900, color: '#fff', fontSize: 21, marginBottom: 5 }}>💹 Crop Market Prices</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginBottom: 8 }}>Kisii County & surrounding markets</div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.3)', borderRadius: 999, padding: '4px 12px',
              fontSize: 11.5, color: '#fff', fontWeight: 600,
            }}>
              ⚠ Verify prices at Kisii Town, Suneka, or Ogembo markets
            </div>
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {[
          { v: rising,  label: 'Rising',      icon: '📈', bg: '#DCFCE7', c: 'var(--green)', border: '#BBF7D0' },
          { v: falling, label: 'Falling',     icon: '📉', bg: 'var(--red-l)', c: 'var(--red)', border: '#FECACA' },
          { v: highDmd, label: 'High Demand', icon: '🔥', bg: 'var(--amber-xl)', c: 'var(--amber)', border: '#FCD34D' },
        ].map((s, i) => (
          <div key={i} style={{
            background: s.bg, border: `1.5px solid ${s.border}`,
            borderRadius: 14, padding: '14px 12px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 22 }}>{s.icon}</div>
            <div style={{ fontFamily: 'var(--font-m)', fontWeight: 700, fontSize: 24, color: s.c, marginTop: 4 }}>{s.v}</div>
            <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 3, fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Sort buttons */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ fontSize: 12.5, color: 'var(--muted)', fontWeight: 500 }}>Sort by:</span>
        {[['change', '% Change'], ['price', 'Price'], ['crop_name', 'A–Z']].map(([s, l]) => (
          <button key={s} onClick={() => setSort(s)} style={{
            background: sort === s ? 'var(--green)' : 'var(--white)',
            color: sort === s ? '#fff' : 'var(--text-2)',
            border: `1.5px solid ${sort === s ? 'var(--green)' : 'var(--border)'}`,
            borderRadius: 999, padding: '6px 15px', fontSize: 12.5, cursor: 'pointer',
            fontFamily: 'var(--font-b)', fontWeight: sort === s ? 700 : 500,
            transition: 'all 0.2s', boxShadow: sort === s ? '0 3px 8px rgba(27,77,46,0.2)' : 'var(--shadow-sm)',
          }}>{l}</button>
        ))}
      </div>

      {/* Price list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {sorted.map((item, i) => (
          <div key={item.id} className="fade-up" style={{
            background: 'var(--white)', border: '1px solid var(--border)',
            borderRadius: 14, padding: '14px 18px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            boxShadow: 'var(--shadow-sm)', transition: 'all 0.2s',
            animationDelay: `${i * 0.04}s`,
            borderLeft: `4px solid ${item.change_percent > 0 ? 'var(--green)' : item.change_percent < 0 ? 'var(--red)' : 'var(--border2)'}`,
          }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow)'; e.currentTarget.style.transform = 'translateX(3px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'none'; }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', marginBottom: 2 }}>{item.crop_name}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>{item.unit}</div>
              {/* Price bar */}
              <div style={{ height: 5, background: 'var(--surface)', borderRadius: 3, width: 140, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${(item.price / maxPrice) * 100}%`,
                  background: 'linear-gradient(90deg, var(--green), var(--amber-l))',
                  borderRadius: 3, transition: 'width 1s ease',
                }} />
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontFamily: 'var(--font-m)', fontWeight: 700, fontSize: 17, color: 'var(--text)' }}>
                KES {item.price?.toLocaleString()}
              </div>
              <div style={{
                fontSize: 13, fontWeight: 700, marginTop: 3,
                color: item.change_percent > 0 ? 'var(--green)' : item.change_percent < 0 ? 'var(--red)' : 'var(--muted)',
              }}>
                {item.change_percent > 0 ? '▲ +' : item.change_percent < 0 ? '▼ ' : '— '}{item.change_percent}%
              </div>
              <span style={{
                display: 'inline-block', marginTop: 5, padding: '3px 10px', borderRadius: 999,
                fontSize: 11.5, fontWeight: 600,
                background: item.demand === 'High' ? '#DCFCE7' : item.demand === 'Medium' ? '#FEF3C7' : 'var(--surface)',
                color: item.demand === 'High' ? 'var(--green)' : item.demand === 'Medium' ? 'var(--amber)' : 'var(--muted)',
                border: `1px solid ${item.demand === 'High' ? '#BBF7D0' : item.demand === 'Medium' ? '#FCD34D' : 'var(--border)'}`,
              }}>
                {item.demand} Demand
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Selling tips */}
      <div style={{
        background: 'var(--white)', border: '1.5px solid var(--green-l)',
        borderRadius: 18, padding: 20, boxShadow: 'var(--shadow-sm)',
        borderTop: '4px solid var(--amber-l)',
      }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--green-d)', marginBottom: 14 }}>💡 Smart Selling Tips</div>
        {[
          { i: '🏪', t: 'Sell directly to Naivas or QuickMart supermarkets — earn 20-40% more than open market' },
          { i: '👥', t: 'Join a farmer group to aggregate produce — better bargaining power & shared transport costs' },
          { i: '🥑', t: 'Avocado (Hass variety) has very high export demand — consider planting for premium prices' },
          { i: '📱', t: 'Use M-Kilimo & Tulaa apps to compare prices across Kisii, Nakuru, and Nairobi markets' },
          { i: '⏰', t: 'Sell tomatoes early morning at Kisii Town market — prices drop significantly by midday' },
        ].map((item, i) => (
          <div key={i} style={{
            display: 'flex', gap: 12, padding: '10px 0',
            borderBottom: i < 4 ? '1px solid var(--border)' : 'none',
            alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{item.i}</span>
            <span style={{ fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.55 }}>{item.t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
