import { useState, useEffect, useRef, useCallback } from 'react';
import { askAdvisor } from '../api.js';

const QUICK = [
  'How do I control Fall Armyworm organically?',
  'Best fertilizer for maize in Kisii?',
  'When should I plant tomatoes this season?',
  'How to improve soil quality cheaply?',
  'How to store beans to avoid weevils?',
  'What spacing for kale farming?',
];

function Bubble({ msg }) {
  const isUser = msg.role === 'user';
  const formatText = (t) => t.split('\n').map((line, i) => {
    if (line.startsWith('**') && line.endsWith('**'))
      return <div key={i} style={{ fontWeight:700, color:'var(--gold)', marginTop:6 }}>{line.slice(2,-2)}</div>;
    if (line.match(/^[-•]\s/))
      return <div key={i} style={{ paddingLeft:14, marginTop:3 }}>• {line.slice(2)}</div>;
    if (line.match(/^\d+\./))
      return <div key={i} style={{ paddingLeft:14, marginTop:4 }}>{line}</div>;
    return <div key={i} style={{ marginTop: line===''?6:1 }}>{line.replace(/\*\*(.*?)\*\*/g,'$1')}</div>;
  });

  return (
    <div style={{
      background: isUser ? 'linear-gradient(135deg,var(--amber),var(--gold))' : 'var(--surface)',
      color: isUser ? 'var(--soil)' : 'var(--text)',
      border: isUser ? 'none' : '1px solid var(--border)',
      borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
      padding:'12px 16px', maxWidth:'85%', fontSize:14, lineHeight:1.6,
      alignSelf: isUser ? 'flex-end' : 'flex-start'
    }}>
      {isUser ? msg.content : formatText(msg.content)}
    </div>
  );
}

export default function AIAdvisor() {
  const [messages, setMessages] = useState([{
    role:'assistant',
    content:'Habari! 👋 I\'m Shamba AI, your personal agricultural advisor.\n\nAsk me anything about crops, pests, soil health, markets, or farming techniques. I\'m here to help!'
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages]);

  const send = useCallback(async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');
    const newMessages = [...messages, { role:'user', content:msg }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const history = messages.map(m => ({ role: m.role==='assistant'?'assistant':'user', content: m.content }));
      const { reply } = await askAdvisor(msg, history);
      setMessages(prev => [...prev, { role:'assistant', content:reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role:'assistant', content:'Connection error. Please check internet and try again.' }]);
    }
    setLoading(false);
  }, [input, messages, loading]);

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'calc(100vh - 200px)', minHeight:500, gap:14 }}>
      {/* Header */}
      <div style={{ background:'linear-gradient(90deg,#3D1F00,#1A0D00)', border:'1px solid rgba(217,119,6,0.3)',
        borderRadius:16, padding:'14px 18px', display:'flex', alignItems:'center', gap:12 }}>
        <div className="float" style={{ width:42, height:42, borderRadius:12,
          background:'linear-gradient(135deg,var(--amber),var(--gold))',
          display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>🌾</div>
        <div>
          <div style={{ fontWeight:700, color:'var(--wheat)', fontSize:15 }}>Shamba AI Advisor</div>
          <div style={{ fontSize:11, color:'var(--lime)' }}>● Online · Expert in East African Agriculture</div>
        </div>
      </div>

      {/* Quick Questions */}
      <div style={{ display:'flex', gap:7, flexWrap:'wrap' }}>
        {QUICK.map((q,i) => (
          <button key={i} onClick={() => send(q)} style={{
            background:'rgba(217,119,6,0.1)', color:'var(--amber)', border:'1px solid var(--border)',
            borderRadius:999, padding:'6px 12px', fontSize:11.5, cursor:'pointer',
            fontFamily:'var(--font-b)', fontWeight:500, transition:'background 0.2s'
          }}>{q}</button>
        ))}
      </div>

      {/* Chat */}
      <div style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:10, padding:'2px' }}>
        {messages.map((m,i) => <Bubble key={i} msg={m} />)}
        {loading && (
          <div style={{ background:'var(--surface)', border:'1px solid var(--border)',
            borderRadius:'18px 18px 18px 4px', padding:'12px 16px', alignSelf:'flex-start',
            display:'flex', gap:6, alignItems:'center' }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ width:7, height:7, background:'var(--amber)', borderRadius:'50%',
                animation:`pulse 1.2s ease ${i*0.2}s infinite` }} />
            ))}
            <span style={{ fontSize:12, color:'var(--muted)', marginLeft:4 }}>Thinking...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ display:'flex', gap:8 }}>
        <input value={input} placeholder="Ask about crops, pests, weather, markets..."
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key==='Enter' && !e.shiftKey && send()}
          style={{ flex:1, background:'var(--surface)', border:'1px solid var(--border)', borderRadius:10,
            color:'var(--text)', fontFamily:'var(--font-b)', fontSize:14, padding:'12px 14px', outline:'none' }} />
        <button onClick={() => send()} disabled={loading || !input.trim()} style={{
          background:'linear-gradient(135deg,var(--amber),var(--gold))', color:'var(--soil)',
          border:'none', borderRadius:10, padding:'12px 20px', fontWeight:700,
          fontSize:14, cursor:'pointer', opacity: loading||!input.trim() ? 0.5 : 1 }}>
          {loading ? <span className="spin">⟳</span> : '↑'}
        </button>
      </div>
    </div>
  );
}
