import { useState, useEffect, useRef, useCallback } from 'react';
import { askAdvisor } from '../api.js';

const QUICK = [
  'Control Fall Armyworm organically?',
  'Best fertilizer for maize in Kisii?',
  'When to plant tomatoes this season?',
  'How to improve soil cheaply?',
  'Store beans to avoid weevils?',
  'Correct kale spacing?',
];

function FormatAI({ text }) {
  return text.split('\n').map((line, i) => {
    if (line.startsWith('**') && line.endsWith('**'))
      return <div key={i} style={{ fontWeight:700, color:'#A8F5C0', marginTop:8, fontSize:14 }}>{line.slice(2,-2)}</div>;
    if (line.match(/^[-•]\s/))
      return <div key={i} style={{ paddingLeft:14, marginTop:4, color:'rgba(255,255,255,0.85)', fontSize:13.5, lineHeight:1.55 }}>• {line.slice(2)}</div>;
    if (line.match(/^\d+\./))
      return <div key={i} style={{ paddingLeft:12, marginTop:5, color:'rgba(255,255,255,0.90)', fontSize:13.5, lineHeight:1.55 }}>{line}</div>;
    return <div key={i} style={{ marginTop:line===''?7:2, fontSize:13.5, color:'rgba(255,255,255,0.88)', lineHeight:1.6 }}>
      {line.replace(/\*\*(.*?)\*\*/g,'$1')}
    </div>;
  });
}

export default function AIAdvisor() {
  const [messages, setMessages] = useState([{
    role:'assistant',
    content:'Habari! 👋 I\'m **Shamba AI**, your expert agricultural advisor.\n\nAsk me anything — crop management, pest control, soil health, market timing, fertilizers. I know Kisii County and East Africa farming deeply. How can I help you today?',
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages]);

  const send = useCallback(async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role:'user', content:msg }]);
    setLoading(true);
    try {
      const history = messages.map(m => ({ role: m.role==='assistant'?'assistant':'user', content:m.content }));
      const { reply } = await askAdvisor(msg, history);
      setMessages(prev => [...prev, { role:'assistant', content:reply }]);
    } catch {
      setMessages(prev => [...prev, { role:'assistant', content:'Connection error. Please check your internet and try again.' }]);
    }
    setLoading(false);
  }, [input, messages, loading]);

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'calc(100vh - 200px)', minHeight:540, gap:14 }}>

      {/* Full-bleed header image */}
      <div style={{ position:'relative', margin:'0 -16px', height:120, overflow:'hidden', flexShrink:0 }}>
        <img
          src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200&q=85&fit=crop&auto=format"
          alt="Farmer in green field"
          style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center 35%' }}
        />
        <div style={{
          position:'absolute', inset:0,
          background:'linear-gradient(90deg, rgba(5,18,8,0.92) 0%, rgba(5,18,8,0.50) 100%)',
          display:'flex', alignItems:'center', padding:'0 22px', gap:16,
        }}>
          <div className="float" style={{
            width:50, height:50, borderRadius:14,
            background:'linear-gradient(135deg,#F59E0B,#D97706)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:26, flexShrink:0, boxShadow:'0 6px 18px rgba(0,0,0,0.35)',
          }}>🌾</div>
          <div>
            <div style={{ fontFamily:'var(--font-d)', fontWeight:800, color:'#fff', fontSize:20 }}>Shamba AI Advisor</div>
            <div style={{ fontSize:12.5, color:'rgba(255,255,255,0.72)', marginTop:3, display:'flex', alignItems:'center', gap:7 }}>
              <span style={{ width:7,height:7,borderRadius:'50%',background:'#5DC97E',display:'inline-block',animation:'pdot 2s infinite' }} />
              Online · Expert in East African Agriculture
            </div>
          </div>
        </div>
      </div>

      {/* Quick chips */}
      <div style={{ display:'flex', gap:7, flexWrap:'wrap', flexShrink:0 }}>
        {QUICK.map((q,i) => (
          <button key={i} onClick={() => send(q)} style={{
            background:'rgba(255,255,255,0.10)', color:'rgba(255,255,255,0.88)',
            border:'1px solid rgba(255,255,255,0.20)', borderRadius:999,
            padding:'6px 13px', fontSize:12, cursor:'pointer',
            fontFamily:'var(--font-b)', fontWeight:500, transition:'all 0.2s',
          }}
            onMouseEnter={e=>{e.currentTarget.style.background='rgba(45,138,78,0.35)';e.currentTarget.style.borderColor='rgba(93,201,126,0.45)';}}
            onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.10)';e.currentTarget.style.borderColor='rgba(255,255,255,0.20)';}}>
            {q}
          </button>
        ))}
      </div>

      {/* Chat */}
      <div style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:11, padding:'2px 0' }}>
        {messages.map((m,i) => (
          <div key={i} style={{
            background: m.role==='user'
              ? 'linear-gradient(135deg, rgba(45,138,78,0.80), rgba(26,92,48,0.90))'
              : 'rgba(255,255,255,0.10)',
            backdropFilter:'blur(14px)',
            WebkitBackdropFilter:'blur(14px)',
            border: m.role==='user'
              ? '1px solid rgba(93,201,126,0.40)'
              : '1px solid rgba(255,255,255,0.18)',
            borderRadius: m.role==='user' ? '18px 18px 5px 18px' : '18px 18px 18px 5px',
            padding:'13px 16px', maxWidth:'86%',
            alignSelf: m.role==='user' ? 'flex-end' : 'flex-start',
            boxShadow:'0 4px 16px rgba(0,0,0,0.20)',
          }}>
            {m.role==='user'
              ? <div style={{ fontSize:14, lineHeight:1.5, color:'#fff' }}>{m.content}</div>
              : <div style={{ fontSize:14, lineHeight:1.6 }}><FormatAI text={m.content} /></div>
            }
          </div>
        ))}
        {loading && (
          <div style={{
            background:'rgba(255,255,255,0.10)', backdropFilter:'blur(14px)',
            border:'1px solid rgba(255,255,255,0.18)', borderRadius:'18px 18px 18px 5px',
            padding:'14px 18px', alignSelf:'flex-start',
            display:'flex', gap:7, alignItems:'center',
          }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ width:8,height:8,borderRadius:'50%',background:'#5DC97E',
                animation:`pdot 1.2s ease ${i*0.2}s infinite` }} />
            ))}
            <span style={{ fontSize:12.5, color:'var(--td)', marginLeft:4 }}>Shamba AI is thinking...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ display:'flex', gap:10, flexShrink:0 }}>
        <input
          value={input}
          placeholder="Ask about crops, pests, soil, markets..."
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key==='Enter' && !e.shiftKey && send()}
          style={{
            flex:1, background:'rgba(255,255,255,0.12)', backdropFilter:'blur(14px)',
            WebkitBackdropFilter:'blur(14px)',
            border:'1px solid rgba(255,255,255,0.24)', borderRadius:13,
            color:'#fff', fontFamily:'var(--font-b)', fontSize:14,
            padding:'13px 16px', outline:'none', transition:'border-color 0.2s',
          }}
          onFocus={e => e.target.style.borderColor='rgba(93,201,126,0.60)'}
          onBlur={e  => e.target.style.borderColor='rgba(255,255,255,0.24)'}
        />
        <button onClick={() => send()} disabled={loading || !input.trim()} style={{
          background:'linear-gradient(135deg,#2D8A4E,#1A5C30)', color:'#fff',
          border:'none', borderRadius:13, padding:'13px 22px',
          fontWeight:700, fontSize:16, cursor:'pointer', flexShrink:0,
          opacity: loading||!input.trim() ? 0.45 : 1,
          boxShadow:'0 4px 16px rgba(45,138,78,0.45)', transition:'all 0.2s',
        }}>
          {loading ? <span className="spin">↻</span> : '↑'}
        </button>
      </div>
    </div>
  );
}
