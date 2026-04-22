import { useEffect, useState } from 'react';
import { getStats, getMessages, updateMessage } from '../api.js';

const StatCard = ({ icon, value, label, color }) => (
  <div style={{ background:'#fff', border:'1px solid #E8F0EB', borderRadius:14, padding:22,
    borderLeft:`4px solid ${color}`, display:'flex', alignItems:'center', gap:16 }}>
    <span style={{ fontSize:36 }}>{icon}</span>
    <div>
      <div style={{ fontSize:28, fontWeight:700, color:'#1A2E22', fontFamily:'DM Mono,monospace' }}>{value}</div>
      <div style={{ fontSize:13, color:'#6B7B70', marginTop:2 }}>{label}</div>
    </div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    getStats().then(setStats).catch(()=>{});
    getMessages().then(m=>setMessages(m.slice(0,10))).catch(()=>{});
  }, []);

  const markRead = async (id) => {
    await updateMessage(id, 'read').catch(()=>{});
    setMessages(prev => prev.map(m => m.id===id ? {...m,status:'read'} : m));
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:14 }}>
        <StatCard icon="🌱" value={stats?.crops ?? '—'} label="Crops in Database" color="#16A34A" />
        <StatCard icon="💹" value={stats?.market ?? '—'} label="Market Price Entries" color="#D97706" />
        <StatCard icon="🤖" value={stats?.queries ?? '—'} label="AI Queries Logged" color="#7C3AED" />
        <StatCard icon="📬" value={stats?.unread ?? '—'} label="Unread Messages" color="#DC2626" />
      </div>

      {/* Recent Messages */}
      <div style={{ background:'#fff', border:'1px solid #E8F0EB', borderRadius:16, padding:24 }}>
        <h3 style={{ fontSize:16, fontWeight:700, color:'#1A2E22', marginBottom:16 }}>📬 Recent Farmer Messages</h3>
        {messages.length === 0 ? (
          <p style={{ color:'#6B7B70', fontSize:14 }}>No messages yet.</p>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {messages.map(m => (
              <div key={m.id} style={{ display:'flex', gap:14, padding:'14px', background: m.status==='unread'?'#FFFBEB':'#F8FAF9',
                borderRadius:10, border:`1px solid ${m.status==='unread'?'#FDE68A':'#E8F0EB'}`, alignItems:'flex-start' }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:4 }}>
                    <span style={{ fontWeight:600, fontSize:14, color:'#1A2E22' }}>{m.name || 'Anonymous'}</span>
                    {m.phone && <span style={{ fontSize:12, color:'#6B7B70' }}>{m.phone}</span>}
                    {m.status==='unread' && (
                      <span style={{ fontSize:11, background:'#FEF3C7', color:'#92400E', borderRadius:999, padding:'2px 8px', fontWeight:600 }}>NEW</span>
                    )}
                  </div>
                  <p style={{ fontSize:13, color:'#3D5A47', lineHeight:1.5 }}>{m.message}</p>
                  <p style={{ fontSize:11, color:'#9CA3AF', marginTop:4 }}>{new Date(m.created_at).toLocaleString()}</p>
                </div>
                {m.status==='unread' && (
                  <button onClick={() => markRead(m.id)} style={{ flexShrink:0, background:'#F0FDF4', color:'#16A34A',
                    border:'1px solid #BBF7D0', borderRadius:8, padding:'6px 12px', cursor:'pointer', fontSize:12, fontWeight:600 }}>
                    Mark Read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
