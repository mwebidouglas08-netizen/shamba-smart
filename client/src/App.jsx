import { useState } from 'react';
import Dashboard      from './pages/Dashboard.jsx';
import AIAdvisor      from './pages/AIAdvisor.jsx';
import CropDoctor     from './pages/CropDoctor.jsx';
import PlantingCal    from './pages/PlantingCalendar.jsx';
import MarketPrices   from './pages/MarketPrices.jsx';

const TABS = [
  { id:'dashboard', icon:'🏡', label:'Home'    },
  { id:'advisor',   icon:'🤖', label:'AI Chat' },
  { id:'doctor',    icon:'🔬', label:'Doctor'  },
  { id:'calendar',  icon:'📅', label:'Planting'},
  { id:'market',    icon:'💹', label:'Market'  },
];

export default function App() {
  const [tab, setTab] = useState('dashboard');
  return (
    <div style={{ minHeight:'100vh', background:'var(--soil)', paddingBottom:80 }}>
      {/* Header */}
      <header style={{
        position:'sticky', top:0, zIndex:50,
        background:'rgba(26,13,0,0.95)', backdropFilter:'blur(12px)',
        borderBottom:'1px solid var(--border)', padding:'12px 20px',
        display:'flex', alignItems:'center', justifyContent:'space-between'
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,var(--amber),var(--gold))',
            display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>🌾</div>
          <div>
            <div style={{ fontFamily:'var(--font-d)', fontWeight:900, fontSize:17, color:'var(--wheat)', lineHeight:1 }}>Shamba Smart</div>
            <div style={{ fontSize:10, color:'var(--muted)', letterSpacing:1 }}>AGRICULTURE & FOOD SECURITY</div>
          </div>
        </div>
        <span style={{ fontSize:11, background:'rgba(74,222,128,0.15)', color:'var(--lime)',
          border:'1px solid rgba(74,222,128,0.3)', borderRadius:999, padding:'4px 10px', fontWeight:600 }}>
          ● Kisii, Kenya
        </span>
      </header>

      {/* Tabs */}
      <nav style={{
        position:'sticky', top:61, zIndex:40,
        background:'rgba(26,13,0,0.9)', backdropFilter:'blur(10px)',
        borderBottom:'1px solid var(--border)', padding:'6px 16px',
        display:'flex', gap:4, overflowX:'auto'
      }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: tab===t.id ? 'var(--amber)' : 'transparent',
            color: tab===t.id ? 'var(--soil)' : 'var(--muted)',
            border:'none', borderRadius:10, padding:'9px 16px',
            fontFamily:'var(--font-b)', fontWeight: tab===t.id ? 700 : 500,
            fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', gap:6,
            whiteSpace:'nowrap', transition:'all 0.2s'
          }}>
            {t.icon} {t.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main style={{ maxWidth:680, margin:'0 auto', padding:'20px 16px' }}>
        {tab==='dashboard' && <Dashboard onNav={setTab} />}
        {tab==='advisor'   && <AIAdvisor />}
        {tab==='doctor'    && <CropDoctor />}
        {tab==='calendar'  && <PlantingCal />}
        {tab==='market'    && <MarketPrices />}
      </main>
    </div>
  );
}
