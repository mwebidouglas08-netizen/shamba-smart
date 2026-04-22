import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api.js';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { token } = await login(username, password);
      localStorage.setItem('shamba_admin_token', token);
      nav('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    }
    setLoading(false);
  };

  const inp = { width:'100%', padding:'12px 14px', border:'1.5px solid #E8F0EB', borderRadius:10,
    fontFamily:'DM Sans,sans-serif', fontSize:14, color:'#1A2E22', outline:'none',
    background:'#F8FAF9', transition:'border-color 0.2s' };

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#1A2E22,#0D1A14)',
      display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ background:'#fff', borderRadius:20, padding:40, width:'100%', maxWidth:420,
        boxShadow:'0 24px 64px rgba(0,0,0,0.15)' }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ fontSize:48, marginBottom:12 }}>🌾</div>
          <h1 style={{ fontSize:24, fontWeight:700, color:'#1A2E22' }}>Shamba Smart</h1>
          <p style={{ color:'#6B7B70', fontSize:14, marginTop:4 }}>Admin Dashboard Login</p>
        </div>

        <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div>
            <label style={{ fontSize:13, fontWeight:600, color:'#3D5A47', display:'block', marginBottom:6 }}>Username</label>
            <input style={inp} type="text" value={username} onChange={e=>setUsername(e.target.value)}
              placeholder="admin" required autoFocus
              onFocus={e=>e.target.style.borderColor='#D97706'}
              onBlur={e=>e.target.style.borderColor='#E8F0EB'} />
          </div>
          <div>
            <label style={{ fontSize:13, fontWeight:600, color:'#3D5A47', display:'block', marginBottom:6 }}>Password</label>
            <input style={inp} type="password" value={password} onChange={e=>setPassword(e.target.value)}
              placeholder="••••••••" required
              onFocus={e=>e.target.style.borderColor='#D97706'}
              onBlur={e=>e.target.style.borderColor='#E8F0EB'} />
          </div>
          {error && (
            <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:8,
              padding:'10px 14px', fontSize:13, color:'#DC2626' }}>⚠ {error}</div>
          )}
          <button type="submit" disabled={loading} style={{
            background:'linear-gradient(135deg,#D97706,#F59E0B)', color:'#fff', border:'none',
            borderRadius:10, padding:'13px', fontSize:15, fontWeight:700, cursor:'pointer',
            marginTop:4, opacity: loading ? 0.7 : 1, transition:'all 0.2s'
          }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop:20, padding:'14px', background:'#F0FDF4', borderRadius:10, fontSize:12.5, color:'#166534' }}>
          <strong>Default credentials:</strong><br/>Username: <code>admin</code> · Password: <code>shamba2024</code>
        </div>
      </div>
    </div>
  );
}
