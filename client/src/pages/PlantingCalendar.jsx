import { useState, useEffect } from 'react';
import { getCrops } from '../api.js';

const MONTH_MAP = {
  'Maize':[2,3,4,9,10,11], 'Beans':[2,3,4,9,10], 'Tomatoes':[0,1,2,3,4,5,6,7,8,9,10,11],
  'Kale/Sukuma':[0,1,2,3,4,5,6,7,8,9,10,11], 'Potatoes':[2,3,4,8,9,10], 'Avocado':[1,2,3,4],
  'Sweet Potato':[0,1,2,3,4,5,6,7,8,9,10,11], 'Sorghum':[2,3,4], 'Cabbage':[2,3,4,5,8,9,10,11], 'Cassava':[2,3]
};
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function PlantingCalendar() {
  const [crops, setCrops] = useState([]);
  const [selected, setSelected] = useState(null);
  const nowMonth = new Date().getMonth();

  useEffect(() => {
    getCrops().then(data => { setCrops(data); if(data.length) setSelected(data[0]); }).catch(()=>{});
  }, []);

  if (!selected) return <div style={{ textAlign:'center', padding:40, color:'var(--muted)' }}>Loading crops...</div>;

  const goodMonths = MONTH_MAP[selected.name] || [];

  const STEPS = [
    { e:'🌱', l:'Land Preparation', d:'Clear weeds, plough 30cm deep. Apply compost or manure if available.' },
    { e:'🧪', l:'Soil Testing',     d:'Test soil pH. Most crops need pH 6.0–7.0. Apply lime if below 5.5.' },
    { e:'🌿', l:'Planting',         d:`Use certified quality seeds. Apply DAP basal fertilizer at planting. ${selected.ph_range ? 'Target pH: '+selected.ph_range : ''}` },
    { e:'💧', l:'Watering',         d:`Water 2–3x/week for seedlings. Reduce as plants mature. Water needs: ${selected.water_needs||'varies'}.` },
    { e:'🌾', l:'Top Dressing',     d:'Apply CAN or Urea at 4–6 weeks after planting. Follow recommended rates.' },
    { e:'🔍', l:'Pest Scouting',    d:'Inspect crops every 3–4 days. Look for Fall Armyworm, Aphids, and disease symptoms.' },
    { e:'✂️', l:'Harvesting',       d:`Ready in ${selected.days_to_harvest||'varies'} days. Harvest at right maturity for best price and storage.` },
  ];

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
      <div className="fade-up" style={{ background:'linear-gradient(135deg,#0D1F14,#1A0D00)', border:'1px solid rgba(74,222,128,0.2)', borderRadius:16, padding:20 }}>
        <div style={{ fontSize:15, fontWeight:700, color:'var(--lime)' }}>📅 Smart Planting Calendar</div>
        <div style={{ fontSize:12.5, color:'var(--muted)', marginTop:4 }}>Optimized for Kisii highlands (1500–2000m) · Kisii County, Kenya</div>
      </div>

      {/* Crop picker */}
      <div style={{ display:'flex', gap:7, flexWrap:'wrap' }}>
        {crops.map(c => (
          <button key={c.id} onClick={() => setSelected(c)} style={{
            background: selected?.id===c.id ? 'var(--amber)' : 'rgba(217,119,6,0.1)',
            color: selected?.id===c.id ? 'var(--soil)' : 'var(--amber)',
            border: '1px solid var(--border)', borderRadius:999, padding:'7px 14px',
            fontSize:12.5, cursor:'pointer', fontFamily:'var(--font-b)', fontWeight: selected?.id===c.id ? 700 : 500,
            transition:'all 0.2s'
          }}>{selected?.id===c.id ? selected.emoji : (c.emoji||'🌿')} {c.name}</button>
        ))}
      </div>

      {/* Crop card */}
      <div className="fade-up" style={{ background:'var(--card)', border:'1px solid rgba(74,222,128,0.2)', borderRadius:16, padding:20 }}>
        <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:16 }}>
          <span className="float" style={{ fontSize:52 }}>{selected.emoji||'🌿'}</span>
          <div>
            <div style={{ fontSize:22, fontFamily:'var(--font-d)', fontWeight:900, color:'var(--wheat)' }}>{selected.name}</div>
            <div style={{ fontSize:12, color:'var(--muted)', marginTop:3 }}>🗺️ Kisii County, Kenya Highlands</div>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))', gap:10 }}>
          {[
            { l:'Planting Season', v:selected.season, i:'📅' },
            { l:'Soil pH',         v:selected.ph_range, i:'🧪' },
            { l:'Water Needs',     v:selected.water_needs, i:'💧' },
            { l:'Days to Harvest', v:selected.days_to_harvest, i:'⏱️' },
          ].filter(x=>x.v).map((item,i) => (
            <div key={i} style={{ background:'var(--surface)', borderRadius:10, padding:12, border:'1px solid var(--border)' }}>
              <div style={{ fontSize:18, marginBottom:4 }}>{item.i}</div>
              <div style={{ fontSize:11, color:'var(--muted)', marginBottom:3 }}>{item.l}</div>
              <div style={{ fontSize:13, fontWeight:600, color:'var(--wheat)', fontFamily:'var(--font-m)' }}>{item.v}</div>
            </div>
          ))}
        </div>
        {selected.description && (
          <p style={{ marginTop:12, fontSize:13, color:'var(--muted)', lineHeight:1.6 }}>{selected.description}</p>
        )}
      </div>

      {/* Calendar grid */}
      <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:16, padding:18 }}>
        <div style={{ fontSize:13, fontWeight:600, color:'var(--amber)', marginBottom:12 }}>Planting Calendar — Best Months</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:6 }}>
          {MONTHS.map((m,i) => {
            const good = goodMonths.includes(i);
            const now  = i===nowMonth;
            return (
              <div key={i} style={{
                borderRadius:8, padding:'9px 4px', textAlign:'center', fontSize:11, fontWeight:600,
                background: now ? 'var(--amber)' : good ? 'rgba(74,222,128,0.15)' : 'var(--surface)',
                color: now ? 'var(--soil)' : good ? 'var(--lime)' : 'var(--muted)',
                border: `${now?2:1}px solid ${now?'var(--amber)':good?'rgba(74,222,128,0.3)':'var(--border)'}`
              }}>
                {m}
                {now && <div style={{ fontSize:8, marginTop:2 }}>NOW</div>}
                {good && !now && <div style={{ fontSize:13 }}>✓</div>}
              </div>
            );
          })}
        </div>
        <div style={{ display:'flex', gap:16, marginTop:10, fontSize:11, color:'var(--muted)' }}>
          <span>🟩 Planting season</span><span>🟧 This month</span>
        </div>
      </div>

      {/* Growing steps */}
      <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:16, padding:18 }}>
        <div style={{ fontSize:13, fontWeight:600, color:'var(--amber)', marginBottom:14 }}>📋 Step-by-Step Growing Guide</div>
        {STEPS.map((s,i) => (
          <div key={i} style={{ display:'flex', gap:12, padding:'12px 0', borderBottom: i<STEPS.length-1?'1px solid var(--border)':'none' }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:'rgba(217,119,6,0.15)', border:'1px solid var(--border)',
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>{s.e}</div>
              {i<STEPS.length-1 && <div style={{ width:1, flex:1, background:'var(--border)', marginTop:4 }} />}
            </div>
            <div style={{ paddingTop:6 }}>
              <div style={{ fontSize:13, fontWeight:700, color:'var(--wheat)', marginBottom:4 }}>{i+1}. {s.l}</div>
              <div style={{ fontSize:12.5, color:'var(--muted)', lineHeight:1.6 }}>{s.d}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
