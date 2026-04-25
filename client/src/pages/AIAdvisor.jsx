import { useState, useEffect, useRef, useCallback } from 'react';
import { askAdvisor } from '../api.jsx';

const QUICK = [
  'Control Fall Armyworm organically?',
  'Best fertilizer for maize in Kisii?',
  'When to plant tomatoes this season?',
  'How to improve soil cheaply?',
  'Store beans to avoid weevils?',
  'Correct spacing for kale?',
];

function FormatAI({ text }) {
  return (
    <>
      {text.split('\n').map((line, i) => {
        if (line.startsWith('**') && line.endsWith('**'))
          return <div key={i} style={{ fontWeight: 700, color: 'var(--blue-700)', marginTop: 8, fontSize: 14 }}>{line.slice(2, -2)}</div>;
        if (line.match(/^[-•]\s/))
          return <div key={i} style={{ paddingLeft: 14, marginTop: 4, color: 'var(--text-2)', fontSize: 13.5, lineHeight: 1.55 }}>• {line.slice(2)}</div>;
        if (line.match(/^\d+\./))
          return <div key={i} style={{ paddingLeft: 12, marginTop: 5, color: 'var(--text)', fontSize: 13.5, lineHeight: 1.55 }}>{line}</div>;
        return <div key={i} style={{ marginTop: line === '' ? 7 : 2, fontSize: 13.5, color: 'var(--text)', lineHeight: 1.6 }}>
          {line.replace(/\*\*(.*?)\*\*/g, '$1')}
        </div>;
      })}
    </>
  );
}

export default function AIAdvisor() {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: 'Habari! 👋 I\'m **Shamba AI**, your expert agricultural advisor.\n\nAsk me anything — crop management, pest control, soil health, market timing, or fertilizers. I know Kisii County farming deeply. How can I help you today?',
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = useCallback(async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setLoading(true);
    try {
      const history = messages.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content }));
      const { reply } = await askAdvisor(msg, history);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please check your internet and try again.' }]);
    }
    setLoading(false);
  }, [input, messages, loading]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 200px)', minHeight: 540, gap: 14 }}>

      {/* Header image — full bleed */}
      <div style={{ margin: '0 -16px', position: 'relative', height: 120, overflow: 'hidden', flexShrink: 0 }}>
        <img
          src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1400&q=88&fit=crop&auto=format"
          alt="Farmer in green field at golden hour"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 38%', display: 'block' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, rgba(10,31,61,0.90) 0%, rgba(20,71,160,0.55) 60%, rgba(10,31,61,0.20) 100%)',
          display: 'flex', alignItems: 'center', padding: '0 22px', gap: 16,
        }}>
          <div className="float" style={{
            width: 50, height: 50, borderRadius: 14,
            background: 'linear-gradient(135deg, var(--blue-500), var(--blue-700))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, flexShrink: 0,
            boxShadow: '0 6px 20px rgba(0,0,0,0.30)',
            border: '2px solid rgba(255,255,255,0.25)',
          }}>🌾</div>
          <div>
            <div style={{ fontFamily: 'var(--font-d)', fontWeight: 700, color: '#fff', fontSize: 20 }}>Shamba AI Advisor</div>
            <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.72)', marginTop: 3, display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', display: 'inline-block', animation: 'pdot 2s infinite' }} />
              Online · Expert in East African Agriculture
            </div>
          </div>
        </div>
      </div>

      {/* Quick chips */}
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', flexShrink: 0 }}>
        {QUICK.map((q, i) => (
          <button key={i} onClick={() => send(q)} style={{
            background: 'var(--white)', color: 'var(--blue-600)',
            border: '1.5px solid var(--blue-200)', borderRadius: 999,
            padding: '6px 13px', fontSize: 12, cursor: 'pointer',
            fontFamily: 'var(--font-b)', fontWeight: 500,
            boxShadow: 'var(--shadow-sm)', transition: 'all 0.18s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--blue-50)'; e.currentTarget.style.borderColor = 'var(--blue-400)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--white)'; e.currentTarget.style.borderColor = 'var(--blue-200)'; }}>
            {q}
          </button>
        ))}
      </div>

      {/* Chat messages */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 11 }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            background: m.role === 'user'
              ? 'linear-gradient(135deg, var(--blue-600), var(--blue-800))'
              : 'var(--white)',
            color: m.role === 'user' ? '#fff' : 'var(--text)',
            border: m.role === 'user' ? 'none' : '1.5px solid var(--border)',
            borderRadius: m.role === 'user' ? '18px 18px 5px 18px' : '18px 18px 18px 5px',
            padding: '13px 16px', maxWidth: '86%',
            alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
            boxShadow: m.role === 'user' ? '0 4px 16px rgba(26,95,200,0.30)' : 'var(--shadow-sm)',
          }}>
            {m.role === 'user'
              ? <div style={{ fontSize: 14, lineHeight: 1.5 }}>{m.content}</div>
              : <FormatAI text={m.content} />
            }
          </div>
        ))}

        {loading && (
          <div style={{
            background: 'var(--white)', border: '1.5px solid var(--border)',
            borderRadius: '18px 18px 18px 5px', padding: '14px 18px',
            alignSelf: 'flex-start', boxShadow: 'var(--shadow-sm)',
            display: 'flex', gap: 7, alignItems: 'center',
          }}>
            {[0, 1, 2].map(j => (
              <div key={j} style={{
                width: 8, height: 8, borderRadius: '50%', background: 'var(--blue-500)',
                animation: `pdot 1.2s ease ${j * 0.2}s infinite`,
              }} />
            ))}
            <span style={{ fontSize: 12.5, color: 'var(--muted)', marginLeft: 4 }}>Shamba AI is thinking...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
        <input
          value={input}
          placeholder="Ask about crops, pests, soil, markets..."
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          style={{
            flex: 1, background: 'var(--white)',
            border: '1.5px solid var(--border)',
            borderRadius: 12, color: 'var(--text)',
            fontFamily: 'var(--font-b)', fontSize: 14,
            padding: '13px 16px', outline: 'none',
            boxShadow: 'var(--shadow-sm)', transition: 'border-color 0.2s',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--blue-500)'}
          onBlur={e  => e.target.style.borderColor = 'var(--border)'}
        />
        <button onClick={() => send()} disabled={loading || !input.trim()} className="btn-primary"
          style={{ flexShrink: 0, padding: '13px 22px', fontSize: 16 }}>
          {loading ? <span className="spin">↻</span> : '↑'}
        </button>
      </div>
    </div>
  );
}
