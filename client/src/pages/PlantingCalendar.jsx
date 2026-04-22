import { useState, useEffect } from 'react';
import { getCrops } from '../api.js';

const MONTH_MAP = {
  'Maize':[2,3,4,9,10,11], 'Beans':[2,3,4,9,10], 'Tomatoes':[0,1,2,3,4,5,6,7,8,9,10,11],
  'Kale/Sukuma':[0,1,2,3,4,5,6,7,8,9,10,11], 'Potatoes':[2,3,4,8,9,10], 'Avocado':[1,2,3,4],
  'Sweet Potato':[0,1,2,3,4,5,6,7,8,9,10,11], 'Sorghum':[2,3,4], 'Cabbage':[2,3,4,5,8,9,10,11], 'Cassava':[2,3],
};
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const STEPS = [
  { e:'🌱', l:'Land Preparation',   d:'Clear weeds, plough 30cm deep. Apply compost or manure. Remove old crop residues.' },
  { e:'🧪', l:'Soil Testing',        d:'Test pH. Most crops need 6.0–7.0. Apply agricultural lime if soil is below 5.5.' },
  { e:'🌿', l:'Planting',            d:'Use certified quality seeds. Apply DAP basal fertilizer at planting. Follow correct spacing.' },
  { e:'💧', l:'Irrigation/Watering', d:'Water 2–3x per week for seedlings. Reduce as plants mature. Water at soil level only.' },
  { e:'🌾', l:'Top Dressing',        d:'Apply CAN or Urea at 4–6 weeks. Follow recommended rates to avoid leaf burn damage.' },
  { e:'🔍', l:'Pest Scouting',       d:'Inspect every 3–4 days. Look for Fall Armyworm, Aphids, and disease symptoms early.' },
  { e:'✂️', l:'Harvesting',          d:'Harvest at correct maturity. Avoid harvesting when wet. Handle produce gently to reduce damage.' },
];

export default function PlantingCalendar() {
  const [crops, setCrops]   = useState([]);
  const [selected, setSelected] = useState(null);
  const nowMonth = new Date().getMonth();

  useEffect(() => {
    getCrops().then(d => { setCrops(d); if(d.length) setSelected(d[0]); }).catch(()=>{});
  }, []);

  if (!selected) return <div style={{ textAlign:'center', padding:60, color:'var(--td)' }}>Loading crops...</div>;

  const goodMonths = MONTH_MAP[selected.name] || [];
  const plantNow   = goodMonths.includes(nowMonth);

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18 }}>

      {/* Full-bleed hero */}
      <div style={{ position:'relative', margin:'0 -16px', height:155, overflow:'hidden' }}>
        <img
          src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1400&q=88&fit=crop&auto=format"
          alt="Seeds in hand with planting calendar"
          style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center 50%', animation:'heroKB 12s ease forwards' }}
          onError={e => { e.target.src='https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1400&q=85&fit=crop'; }}
        />
        <div style={{
          position:'absolute', inset:0,
          background:'linear-gradient(90deg, rgba(5,18,8,0.92) 0%, rgba(5,18,8,0.45) 65%, transparent 100%)',
          display:'flex', alignItems:'center', padding:'0 24px',
        }}>
          <div>
            <div style={{ fontFamily:'var(--font-d)', fontWeight:800, color:'#fff', fontSize:23, marginBottom:5 }}>📅 Smart Planting Calendar</div>
            <div style={{ fontSize:13.5, color:'rgba(255,255,255,0.80)' }}>Optimised for Kisii highlands · 1500–2000m altitude</div>
          </div>
        </div>
      </div>

      {/* Crop selector chips */}
      <div style={{ display:'flex', gap:7, flexWrap:'wrap' }}>
        {crops.map(c => (
          <button key={c.id} onClick={() => setSelected(c)} style={{
            background: selected?.id===c.id ? 'rgba(45,138,78,0.55)' : 'rgba(255,255,255,0.10)',
            color:'#fff',
            border:`1.5px solid ${selected?.id===c.id ? 'rgba(93,201,126,0.65)' : 'rgba(255,255,255,0.18)'}`,
            borderRadius:999, padding:'7px 15px', fontSize:13, cursor:'pointer',
            fontFamily:'var(--font-b)', fontWeight: selected?.id===c.id ? 700 : 500,
            transition:'all 0.2s', backdropFilter:'blur(10px)',
            boxShadow: selected?.id===c.id ? '0 3px 12px rgba(45,138,78,0.40)' : 'none',
          }}>
            {c.emoji||'🌿'} {c.name}
          </button>
        ))}
      </div>

      {/* Crop detail glass card */}
      <div className="glass fade-up" style={{ padding:22, border:'1.5px solid rgba(93,201,126,0.28)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:16 }}>
          <span className="float" style={{ fontSize:54 }}>{selected.emoji||'🌿'}</span>
          <div>
            <div style={{ fontFamily:'var(--font-d)', fontWeight:800, fontSize:24, color:'#fff' }}>{selected.name}</div>
            <div style={{ fontSize:12.5, color:'var(--td)', marginTop:3 }}>📍 Kisii County, Kenya Highlands</div>
            <div style={{ marginTop:7 }}>
              <span style={{
                fontSize:12.5, fontWeight:700, padding:'5px 13px', borderRadius:999,
                background: plantNow ? 'rgba(93,201,126,0.25)' : 'rgba(245,158,11,0.25)',
                color: plantNow ? '#A8F5C0' : '#FCD34D',
                border: `1px solid ${plantNow ? 'rgba(93,201,126,0.45)' : 'rgba(245,158,11,0.45)'}`,
              }}>
                {plantNow ? '✅ Good to plant this month!' : '⏳ Wait for planting season'}
              </span>
            </div>
          </div>
        </div>

        {/* Attributes grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(125px,1fr))', gap:10 }}>
          {[
            { l:'Planting Season', v:selected.season,          i:'📅', c:'rgba(93,201,126,0.25)'  },
            { l:'Soil pH Range',   v:selected.ph_range,        i:'🧪', c:'rgba(245,158,11,0.25)'  },
            { l:'Water Needs',     v:selected.water_needs,     i:'💧', c:'rgba(96,165,250,0.25)'  },
            { l:'Days to Harvest', v:selected.days_to_harvest, i:'⏱️', c:'rgba(255,255,255,0.10)' },
          ].filter(x=>x.v).map((item,i) => (
            <div key={i} style={{ background:item.c, border:'1px solid rgba(255,255,255,0.14)', borderRadius:12, padding:'12px 13px' }}>
              <div style={{ fontSize:20, marginBottom:5 }}>{item.i}</div>
              <div style={{ fontSize:11, color:'var(--td)', marginBottom:3, fontWeight:500 }}>{item.l}</div>
              <div style={{ fontSize:13, fontWeight:700, color:'#fff', fontFamily:'var(--font-m)' }}>{item.v}</div>
            </div>
          ))}
        </div>

        {selected.description && (
          <p style={{ marginTop:14, fontSize:13.5, color:'var(--td)', lineHeight:1.65,
            background:'rgba(255,255,255,0.07)', borderRadius:10, padding:'12px 14px' }}>
            {selected.description}
          </p>
        )}
      </div>

      {/* Calendar grid */}
      <div className="glass fade-up" style={{ padding:20 }}>
        <div style={{ fontSize:13.5, fontWeight:700, color:'#fff', marginBottom:14 }}>🗓 Best Planting Months</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:7 }}>
          {MONTHS.map((m,i) => {
            const good = goodMonths.includes(i);
            const now  = i===nowMonth;
            return (
              <div key={i} style={{
                borderRadius:10, padding:'10px 4px', textAlign:'center',
                fontSize:12, fontWeight:700,
                background: now ? 'rgba(45,138,78,0.60)' : good ? 'rgba(93,201,126,0.18)' : 'rgba(255,255,255,0.06)',
                color: now ? '#fff' : good ? '#A8F5C0' : 'var(--tm)',
                border: `${now?2:1}px solid ${now?'rgba(93,201,126,0.70)':good?'rgba(93,201,126,0.35)':'rgba(255,255,255,0.12)'}`,
                transition:'all 0.2s',
              }}>
                {m}
                {now  && <div style={{ fontSize:8,marginTop:2,fontWeight:700 }}>NOW</div>}
                {good && !now && <div style={{ fontSize:13,marginTop:1 }}>✓</div>}
              </div>
            );
          })}
        </div>
        <div style={{ display:'flex', gap:18, marginTop:12, fontSize:11.5, color:'var(--td)', fontWeight:500 }}>
          <span>🟩 Plant this month</span>
          <span>🟧 Current month</span>
        </div>
      </div>

      {/* Step guide */}
      <div className="glass fade-up" style={{ padding:20 }}>
        <div style={{ fontSize:13.5, fontWeight:700, color:'#fff', marginBottom:16 }}>📋 Step-by-Step Growing Guide</div>
        {STEPS.map((s,i) => (
          <div key={i} style={{ display:'flex', gap:14, padding:'12px 0', borderBottom: i<STEPS.length-1?'1px solid rgba(255,255,255,0.08)':'none' }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
              <div style={{ width:38,height:38,borderRadius:11,
                background:'rgba(45,138,78,0.30)', border:'1px solid rgba(93,201,126,0.35)',
                display:'flex',alignItems:'center',justifyContent:'center',fontSize:19 }}>{s.e}</div>
              {i<STEPS.length-1 && <div style={{ width:2,flex:1,background:'rgba(255,255,255,0.08)',marginTop:4 }} />}
            </div>
            <div style={{ paddingTop:6 }}>
              <div style={{ fontSize:13.5,fontWeight:700,color:'#fff',marginBottom:4 }}>{i+1}. {s.l}</div>
              <div style={{ fontSize:13,color:'var(--td)',lineHeight:1.6 }}>{s.d}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
