import { useState } from 'react';
import Dashboard   from './pages/Dashboard.jsx';
import AIAdvisor   from './pages/AIAdvisor.jsx';
import CropDoctor  from './pages/CropDoctor.jsx';
import PlantingCal from './pages/PlantingCalendar.jsx';
import MarketPrices from './pages/MarketPrices.jsx';

const TABS = [
  { id: 'dashboard', icon: '🏡', label: 'Home'     },
  { id: 'advisor',   icon: '🤖', label: 'AI Chat'  },
  { id: 'doctor',    icon: '🔬', label: 'Doctor'   },
  { id: 'calendar',  icon: '📅', label: 'Planting' },
  { id: 'market',    icon: '💹', label: 'Market'   },
];

export default function App() {
  const [tab, setTab] = useState('dashboard');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: 80 }}>

      {/* ── Top Header ─────────────────────────────────────── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.96)',
        backdropFilter: 'blur(14px)',
        borderBottom: '1px solid var(--border)',
        boxShadow: '0 1px 12px rgba(27,77,46,0.07)',
        padding: '0 20px',
        height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'linear-gradient(135deg, var(--green), var(--green-m))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, boxShadow: '0 3px 10px rgba(27,77,46,0.25)',
          }}>🌾</div>
          <div>
            <div style={{
              fontFamily: 'var(--font-d)', fontWeight: 900, fontSize: 18,
              color: 'var(--green-d)', lineHeight: 1.1,
            }}>Shamba Smart</div>
            <div style={{ fontSize: 9.5, color: 'var(--muted)', letterSpacing: 1.6, textTransform: 'uppercase', fontWeight: 600 }}>
              Agriculture & Food Security
            </div>
          </div>
        </div>

        {/* Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontSize: 11.5, fontWeight: 600, color: 'var(--green)',
            background: 'var(--green-xl)', border: '1px solid var(--green-l)',
            borderRadius: 999, padding: '5px 12px',
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%', background: 'var(--green-m)',
              display: 'inline-block', animation: 'pulse-dot 2s ease infinite',
            }} />
            Kisii, Kenya
          </span>
        </div>
      </header>

      {/* ── Tab Navigation ──────────────────────────────────── */}
      <nav style={{
        position: 'sticky', top: 64, zIndex: 90,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--border)',
        padding: '8px 16px',
        display: 'flex', gap: 4, overflowX: 'auto',
      }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: tab === t.id
              ? 'linear-gradient(135deg, var(--green), var(--green-m))'
              : 'transparent',
            color: tab === t.id ? '#fff' : 'var(--muted)',
            border: 'none', borderRadius: 10,
            padding: '9px 18px',
            fontFamily: 'var(--font-b)',
            fontWeight: tab === t.id ? 700 : 500,
            fontSize: 13.5, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
            whiteSpace: 'nowrap', transition: 'all 0.22s ease',
            boxShadow: tab === t.id ? '0 3px 10px rgba(27,77,46,0.22)' : 'none',
          }}>
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </nav>

      {/* ── Page Content ─────────────────────────────────────── */}
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px' }}>
        {tab === 'dashboard' && <Dashboard onNav={setTab} />}
        {tab === 'advisor'   && <AIAdvisor />}
        {tab === 'doctor'    && <CropDoctor />}
        {tab === 'calendar'  && <PlantingCal />}
        {tab === 'market'    && <MarketPrices />}
      </main>
    </div>
  );
}
