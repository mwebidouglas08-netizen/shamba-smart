import { useNavigate } from 'react-router-dom';

const s = {
  wrap:    { display:'flex', minHeight:'100vh', background:'#F8FAF9' },
  sidebar: { width:220, background:'#1A2E22', display:'flex', flexDirection:'column', flexShrink:0, position:'sticky', top:0, height:'100vh' },
  logo:    { padding:'24px 20px 20px', borderBottom:'1px solid rgba(255,255,255,0.08)' },
  logoT:   { fontSize:18, fontWeight:700, color:'#FDE68A', fontFamily:'DM Sans,sans-serif' },
  logoS:   { fontSize:10, color:'rgba(255,255,255,0.4)', letterSpacing:1.5, marginTop:2 },
  nav:     { flex:1, padding:'16px 12px', display:'flex', flexDirection:'column', gap:4 },
  main:    { flex:1, display:'flex', flexDirection:'column', overflow:'auto' },
  topbar:  { background:'#fff', borderBottom:'1px solid #E8F0EB', padding:'16px 28px', display:'flex', alignItems:'center', justifyContent:'space-between' },
  content: { flex:1, padding:'28px', maxWidth:1100 },
};

const LINKS = [
  { path:'/dashboard', icon:'📊', label:'Dashboard' },
  { path:'/prices',    icon:'💹', label:'Market Prices' },
  { path:'/crops',     icon:'🌱', label:'Crops' },
  { path:'/queries',   icon:'🤖', label:'AI Queries' },
];

export default function Layout({ children, page }) {
  const nav = useNavigate();
  const logout = () => { localStorage.removeItem('shamba_admin_token'); nav('/'); };

  const NavBtn = ({ path, icon, label, id }) => {
    const active = page === id || (id==='dashboard' && page==='dashboard');
    const pid = path.slice(1) || 'dashboard';
    return (
      <button onClick={() => nav(path)} style={{
        display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderRadius:10, width:'100%',
        background: page===pid ? 'rgba(217,119,6,0.25)' : 'transparent',
        color: page===pid ? '#F59E0B' : 'rgba(255,255,255,0.6)',
        border:'none', cursor:'pointer', fontFamily:'DM Sans,sans-serif', fontSize:14,
        fontWeight: page===pid ? 600 : 400, textAlign:'left', transition:'all 0.2s'
      }}
        onMouseEnter={e=>{ if(page!==pid) e.currentTarget.style.background='rgba(255,255,255,0.07)'; }}
        onMouseLeave={e=>{ if(page!==pid) e.currentTarget.style.background='transparent'; }}>
        {icon} {label}
      </button>
    );
  };

  return (
    <div style={s.wrap}>
      <aside style={s.sidebar}>
        <div style={s.logo}>
          <div style={s.logoT}>🌾 Shamba Smart</div>
          <div style={s.logoS}>ADMIN DASHBOARD</div>
        </div>
        <nav style={s.nav}>
          {LINKS.map(l => <NavBtn key={l.path} path={l.path} icon={l.icon} label={l.label} id={l.path.slice(1)} />)}
        </nav>
        <div style={{ padding:'16px 12px', borderTop:'1px solid rgba(255,255,255,0.08)' }}>
          <button onClick={logout} style={{ width:'100%', padding:'10px 14px', borderRadius:10,
            background:'rgba(220,38,38,0.15)', color:'#FCA5A5', border:'1px solid rgba(220,38,38,0.2)',
            cursor:'pointer', fontFamily:'DM Sans,sans-serif', fontSize:13, fontWeight:500 }}>
            🚪 Logout
          </button>
        </div>
      </aside>
      <div style={s.main}>
        <div style={s.topbar}>
          <span style={{ fontWeight:600, fontSize:16, color:'#1A2E22' }}>
            {LINKS.find(l=>l.path.slice(1)===page)?.icon} {LINKS.find(l=>l.path.slice(1)===page)?.label || 'Dashboard'}
          </span>
          <span style={{ fontSize:12, color:'#6B7B70' }}>Shamba Smart Admin · {new Date().toLocaleDateString()}</span>
        </div>
        <div style={s.content}>{children}</div>
      </div>
    </div>
  );
}
