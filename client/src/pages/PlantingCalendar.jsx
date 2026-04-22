import { useState, useEffect } from 'react';
import { getCrops } from '../api.js';

const MONTH_MAP = {
  'Maize':[2,3,4,9,10,11], 'Beans':[2,3,4,9,10], 'Tomatoes':[0,1,2,3,4,5,6,7,8,9,10,11],
  'Kale/Sukuma':[0,1,2,3,4,5,6,7,8,9,10,11], 'Potatoes':[2,3,4,8,9,10], 'Avocado':[1,2,3,4],
  'Sweet Potato':[0,1,2,3,4,5,6,7,8,9,10,11], 'Sorghum':[2,3,4], 'Cabbage':[2,3,4,5,8,9,10,11], 'Cassava':[2,3],
};
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const STEPS = [
  { e:'🌱', l:'Land Preparation',  d:'Clear weeds, plough 30cm deep. Apply compost/manure if available. Remove old crop residues.' },
  { e:'🧪', l:'Soil Testing',       d:'Test pH. Most crops need 6.0–7.0. Apply lime if below 5.5. Buy test kits at KARI centres.' },
  { e:'🌿', l:'Planting',           d:'Use certified seed. Apply DAP basal fertilizer at planting time. Follow recommended spacing.' },
  { e:'💧', l:'Irrigation/Watering',d:'Water 2–3x per week for seedlings. Reduce as plants mature. Water at soil level, not on leaves.' },
  { e:'🌾', l:'Top Dressing',       d:'Apply CAN or Urea fertilizer at 4–6 weeks. Follow recommended rates to avoid leaf burn.' },
  { e:'🔍', l:'Pest & Disease Scout',d:'Inspect every 3–4 days. Look for Fall Armyworm, Aphids, and early disease symptoms.' },
  { e:'✂️', l:'Harvesting',         d:'Harvest at right maturity stage. Avoid harvesting when wet. Handle produce carefully to reduce damage.' },
];

export default function PlantingCalendar() {
  const [crops, setCrops] = useState([]);
  const [selected, setSelected] = useState(null);
  const nowMonth = new Date().getMonth();

  useEffect(() => {
    getCrops().then(data => { setCrops(data); if (data.length) setSelected(data[0]); }).catch(() => {});
  }, []);

  if (!selected) return (
    <div style={{ textAlign: 'center', padding: 60, color: 'var(--muted)' }}>Loading crops...</div>
  );

  const goodMonths = MONTH_MAP[selected.name] || [];
  const plantNow = goodMonths.includes(nowMonth);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Hero */}
      <div className="fade-up" style={{ borderRadius: 18, overflow: 'hidden', height: 130, position: 'relative', boxShadow: 'var(--shadow)' }}>
        <img
          src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=900&q=80&fit=crop"
          alt="Calendar and farming tools"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 50%' }}
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=900&q=80&fit=crop'; }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, rgba(27,77,46,0.90) 0%, rgba(27,77,46,0.35) 100%)',
          display: 'flex', alignItems: 'center', padding: '0 24px',
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-d)', fontWeight: 900, color: '#fff', fontSize: 20, marginBottom: 4 }}>📅 Smart Planting Calendar</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>Optimised for Kisii highlands · 1500–2000m altitude</div>
          </div>
        </div>
      </div>

      {/* Crop selector */}
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
        {crops.map(c => (
          <button key={c.id} onClick={() => setSelected(c)} style={{
            background: selected?.id === c.id ? 'var(--green)' : 'var(--white)',
            color: selected?.id === c.id ? '#fff' : 'var(--text-2)',
            border: `1.5px solid ${selected?.id === c.id ? 'var(--green)' : 'var(--border)'}`,
            borderRadius: 999, padding: '7px 15px', fontSize: 13, cursor: 'pointer',
            fontFamily: 'var(--font-b)', fontWeight: selected?.id === c.id ? 700 : 500,
            transition: 'all 0.2s', boxShadow: selected?.id === c.id ? '0 3px 10px rgba(27,77,46,0.22)' : 'var(--shadow-sm)',
          }}>
            {c.emoji || '🌿'} {c.name}
          </button>
        ))}
      </div>

      {/* Selected crop card */}
      <div className="fade-up" style={{
        background: 'var(--white)', border: '1.5px solid var(--green-l)',
        borderRadius: 18, padding: 22, boxShadow: 'var(--shadow)',
        borderTop: '4px solid var(--green)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <span className="float" style={{ fontSize: 52 }}>{selected.emoji || '🌿'}</span>
          <div>
            <div style={{ fontFamily: 'var(--font-d)', fontWeight: 900, fontSize: 22, color: 'var(--green-d)' }}>{selected.name}</div>
            <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 3 }}>📍 Kisii County, Kenya Highlands</div>
            <div style={{ marginTop: 6 }}>
              <span style={{
                fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 999,
                background: plantNow ? 'var(--green-xl)' : 'var(--amber-xl)',
                color: plantNow ? 'var(--green)' : 'var(--amber)',
                border: `1px solid ${plantNow ? 'var(--green-l)' : '#FCD34D'}`,
              }}>
                {plantNow ? '✅ Good to plant this month!' : '⏳ Wait for planting season'}
              </span>
            </div>
          </div>
        </div>

        {/* Crop details grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
          {[
            { l: 'Planting Season', v: selected.season,          i: '📅', c: 'var(--green-xl)',  t: 'var(--green)'  },
            { l: 'Soil pH Range',   v: selected.ph_range,        i: '🧪', c: '#FEF3C7',          t: 'var(--amber)'  },
            { l: 'Water Needs',     v: selected.water_needs,     i: '💧', c: '#DBEAFE',          t: 'var(--blue)'   },
            { l: 'Days to Harvest', v: selected.days_to_harvest, i: '⏱️', c: 'var(--surface)',   t: 'var(--muted)'  },
          ].filter(x => x.v).map((item, i) => (
            <div key={i} style={{ background: item.c, borderRadius: 12, padding: '12px 14px' }}>
              <div style={{ fontSize: 20, marginBottom: 5 }}>{item.i}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 3, fontWeight: 500 }}>{item.l}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: item.t, fontFamily: 'var(--font-m)' }}>{item.v}</div>
            </div>
          ))}
        </div>

        {selected.description && (
          <p style={{ marginTop: 14, fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.65,
            background: 'var(--surface)', borderRadius: 10, padding: '12px 14px' }}>
            {selected.description}
          </p>
        )}
      </div>

      {/* Calendar grid */}
      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 18, padding: 20, boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--green-d)', marginBottom: 14 }}>🗓 Best Planting Months</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 7 }}>
          {MONTHS.map((m, i) => {
            const good = goodMonths.includes(i);
            const now = i === nowMonth;
            return (
              <div key={i} style={{
                borderRadius: 10, padding: '10px 4px', textAlign: 'center',
                fontSize: 12, fontWeight: 700,
                background: now ? 'var(--green)' : good ? 'var(--green-xl)' : 'var(--surface)',
                color: now ? '#fff' : good ? 'var(--green)' : 'var(--muted)',
                border: `${now ? 2 : 1}px solid ${now ? 'var(--green)' : good ? 'var(--green-l)' : 'var(--border)'}`,
                transition: 'all 0.2s',
              }}>
                {m}
                {now && <div style={{ fontSize: 8, marginTop: 2, fontWeight: 700 }}>NOW</div>}
                {good && !now && <div style={{ fontSize: 13, marginTop: 1 }}>✓</div>}
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 18, marginTop: 12, fontSize: 11.5, color: 'var(--muted)', fontWeight: 500 }}>
          <span>🟩 Plant this month</span>
          <span>🟧 Current month</span>
          <span style={{ color: 'var(--border2)' }}>⬜ Off season</span>
        </div>
      </div>

      {/* Step-by-step guide */}
      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 18, padding: 20, boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--green-d)', marginBottom: 16 }}>📋 Step-by-Step Growing Guide</div>
        {STEPS.map((s, i) => (
          <div key={i} style={{ display: 'flex', gap: 14, padding: '12px 0', borderBottom: i < STEPS.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 11, background: 'var(--green-xl)',
                border: '1.5px solid var(--green-l)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19,
              }}>{s.e}</div>
              {i < STEPS.length - 1 && <div style={{ width: 2, flex: 1, background: 'var(--border)', marginTop: 4 }} />}
            </div>
            <div style={{ paddingTop: 6 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{i + 1}. {s.l}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>{s.d}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
