import { useState, useEffect } from 'react';
import { getCrops } from '../api.js';

const MONTH_MAP = {
  'Maize':[2,3,4,9,10,11],'Beans':[2,3,4,9,10],'Tomatoes':[0,1,2,3,4,5,6,7,8,9,10,11],
  'Kale/Sukuma':[0,1,2,3,4,5,6,7,8,9,10,11],'Potatoes':[2,3,4,8,9,10],'Avocado':[1,2,3,4],
  'Sweet Potato':[0,1,2,3,4,5,6,7,8,9,10,11],'Sorghum':[2,3,4],'Cabbage':[2,3,4,5,8,9,10,11],'Cassava':[2,3],
};
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const STEPS = [
  { e:'🌱', l:'Land Preparation',    d:'Clear weeds, plough 30cm deep. Apply compost or manure. Remove old crop residues.' },
  { e:'🧪', l:'Soil Testing',         d:'Test pH. Most crops need 6.0–7.0. Apply lime if below 5.5. Buy kits at KARI centres.' },
  { e:'🌿', l:'Planting',             d:'Use certified quality seeds. Apply DAP basal fertilizer at planting. Follow correct spacing.' },
  { e:'💧', l:'Irrigation/Watering',  d:'Water 2–3x per week for seedlings. Reduce as plants mature. Water at soil level only.' },
  { e:'🌾', l:'Top Dressing',         d:'Apply CAN or Urea at 4–6 weeks. Follow recommended rates to avoid leaf burn.' },
  { e:'🔍', l:'Pest Scouting',        d:'Inspect every 3–4 days. Look for Fall Armyworm, Aphids, and disease symptoms.' },
  { e:'✂️', l:'Harvesting',           d:'Harvest at correct maturity. Avoid wet conditions. Handle produce gently.' },
];

export default function PlantingCalendar() {
  const [crops, setCrops]       = useState([]);
  const [selected, setSelected] = useState(null);
  const nowMonth = new Date().getMonth();

  useEffect(() => {
    getCrops().then(d => { setCrops(d); if (d.length) setSelected(d[0]); }).catch(() => {});
  }, []);

  if (!selected) return <div style={{ textAlign:'center', padding:60, color:'var(--muted)' }}>Loading crops...</div>;

  const goodMonths = MONTH_MAP[selected.name] || [];
  const plantNow   = goodMonths.includes(nowMonth);

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18 }}>

      {/* Full-bleed hero */}
      <div style={{ margin:'0 -16px', position:'relative', height:155, overflow:'hidden' }}>
        <img
          src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1400&q=90&fit=crop&auto=format"
          alt="Seeds in hand — planting season on a farm"
          style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center 50%', animation:'heroKB 12s ease forwards', display:'block' }}
          onError={e => { e.target.src='https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1400&q=85&fit=crop'; }}
        />
        <div style={{
          position:'absolute', inset:0,
          background:'linear-gradient(90deg, rgba(10,31,61,0.92) 0%, rgba(20,71,160,0.50) 60%, transparent 100%)',
          display:'flex', alignItems:'center', padding:'0 26px',
        }}>
          <div>
            <div style={{ fontFamily:'var(--font-d)', fontWeight:700, color:'#fff', fontSize:23, marginBottom:5 }}>📅 Smart Planting Calendar</div>
            <div style={{ fontSize:13.5, color:'rgba(255,255,255,0.82)' }}>Optimised for Kisii highlands · 1500–2000m altitude</div>
          </div>
        </div>
      </div>

      {/* Crop picker */}
      <div style={{ display:'flex', gap:7, flexWrap:'wrap' }}>
        {crops.map(c => (
          <button key={c.id} onClick={() => setSelected(c)} style={{
            background: selected?.id===c.id ? 'var(--blue-600)' : 'var(--white)',
            color: selected?.id===c.id ? '#fff' : 'var(--blue-600)',
            border:`1.5px solid ${selected?.id===c.id ? 'var(--blue-600)' : 'var(--blue-200)'}`,
            borderRadius:999, padding:'7px 15px', fontSize:13, cursor:'pointer',
            fontFamily:'var(--font-b)', fontWeight:selected?.id===c.id ? 700 : 500,
            transition:'all 0.2s',
            boxShadow: selected?.id===c.id ? '0 3px 12px rgba(26,95,200,0.28)' : 'var(--shadow-sm)',
          }}>
            {c.emoji||'🌿'} {c.name}
          </button>
        ))}
      </div>

      {/* Crop detail card */}
      <div className="card fade-up" style={{ padding:22, borderTop:'4px solid var(--blue-500)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:16 }}>
          <span className="float" style={{ fontSize:54 }}>{selected.emoji||'🌿'}</span>
          <div>
            <div style={{ fontFamily:'var(--font-d)', fontWeight:700, fontSize:24, color:'var(--text)' }}>{selected.name}</div>
            <div style={{ fontSize:12.5, color:'var(--muted)', marginTop:3 }}>📍 Kisii County, Kenya Highlands</div>
            <div style={{ marginTop:8 }}>
              <span style={{
                fontSize:12.5, fontWeight:700, padding:'5px 13px', borderRadius:999,
                background: plantNow ? '#f0fdf9' : 'var(--blue-50)',
                color: plantNow ? 'var(--green)' : 'var(--blue-600)',
                border:`1.5px solid ${plantNow ? 'var(--green)' : 'var(--blue-300)'}`,
              }}>
                {plantNow ? '✅ Good to plant this month!' : '⏳ Wait for planting season'}
              </span>
            </div>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(128px,1fr))', gap:10 }}>
          {[
            { l:'Planting Season', v:selected.season,          i:'📅', bg:'var(--blue-50)',  c:'var(--blue-700)' },
            { l:'Soil pH Range',   v:selected.ph_range,        i:'🧪', bg:'#fffbeb',         c:'var(--amber)'   },
            { l:'Water Needs',     v:selected.water_needs,     i:'💧', bg:'#f0fbff',          c:'var(--sky)'     },
            { l:'Days to Harvest', v:selected.days_to_harvest, i:'⏱️', bg:'var(--gray-100)', c:'var(--muted)'   },
          ].filter(x => x.v).map((item, i) => (
            <div key={i} style={{ background:item.bg, border:'1px solid var(--border)', borderRadius:12, padding:'12px 13px' }}>
              <div style={{ fontSize:20, marginBottom:5 }}>{item.i}</div>
              <div style={{ fontSize:11, color:'var(--muted)', marginBottom:3, fontWeight:500 }}>{item.l}</div>
              <div style={{ fontSize:13, fontWeight:700, color:item.c, fontFamily:'var(--font-m)' }}>{item.v}</div>
            </div>
          ))}
        </div>

        {selected.description && (
          <p style={{ marginTop:14, fontSize:13.5, color:'var(--text-2)', lineHeight:1.65,
            background:'var(--gray-50)', borderRadius:10, padding:'12px 14px' }}>
            {selected.description}
          </p>
        )}
      </div>

      {/* Calendar grid */}
      <div className="card fade-up" style={{ padding:20 }}>
        <div style={{ fontSize:14, fontWeight:700, color:'var(--text)', marginBottom:14 }}>🗓 Best Planting Months</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:7 }}>
          {MONTHS.map((m, i) => {
            const good = goodMonths.includes(i);
            const now  = i === nowMonth;
            return (
              <div key={i} style={{
                borderRadius:10, padding:'10px 4px', textAlign:'center',
                fontSize:12, fontWeight:700,
                background: now ? 'var(--blue-600)' : good ? 'var(--blue-50)' : 'var(--gray-100)',
                color: now ? '#fff' : good ? 'var(--blue-700)' : 'var(--muted)',
                border:`${now?2:1}px solid ${now?'var(--blue-600)':good?'var(--blue-300)':'var(--border)'}`,
                transition:'all 0.2s',
              }}>
                {m}
                {now  && <div style={{ fontSize:8, marginTop:2, fontWeight:700 }}>NOW</div>}
                {good && !now && <div style={{ fontSize:13, marginTop:1 }}>✓</div>}
              </div>
            );
          })}
        </div>
        <div style={{ display:'flex', gap:18, marginTop:12, fontSize:12, color:'var(--muted)', fontWeight:500 }}>
          <span style={{ display:'flex', alignItems:'center', gap:5 }}>
            <span style={{ width:12,height:12,borderRadius:3,background:'var(--blue-50)',border:'1px solid var(--blue-300)',display:'inline-block' }} />
            Plant this month
          </span>
          <span style={{ display:'flex', alignItems:'center', gap:5 }}>
            <span style={{ width:12,height:12,borderRadius:3,background:'var(--blue-600)',display:'inline-block' }} />
            Current month
          </span>
        </div>
      </div>

      {/* Step-by-step guide */}
      <div className="card fade-up" style={{ padding:20 }}>
        <div style={{ fontSize:14, fontWeight:700, color:'var(--text)', marginBottom:16 }}>📋 Step-by-Step Growing Guide</div>
        {STEPS.map((s, i) => (
          <div key={i} style={{ display:'flex', gap:14, padding:'12px 0', borderBottom:i<STEPS.length-1?'1px solid var(--border)':'none' }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
              <div style={{ width:38,height:38,borderRadius:11,background:'var(--blue-50)',
                border:'1.5px solid var(--blue-200)',
                display:'flex',alignItems:'center',justifyContent:'center',fontSize:19 }}>{s.e}</div>
              {i < STEPS.length-1 && <div style={{ width:2,flex:1,background:'var(--border)',marginTop:4 }} />}
            </div>
            <div style={{ paddingTop:6 }}>
              <div style={{ fontSize:13.5,fontWeight:700,color:'var(--text)',marginBottom:4 }}>{i+1}. {s.l}</div>
              <div style={{ fontSize:13,color:'var(--muted)',lineHeight:1.6 }}>{s.d}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
