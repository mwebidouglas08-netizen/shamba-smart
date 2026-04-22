import { useState, useEffect, useRef, useCallback } from 'react';
import { askAdvisor } from '../api.jsx';

const QUICK = [
  'Control Fall Armyworm organically?',
  'Best fertilizer for maize in Kisii?',
  'When to plant tomatoes this season?',
  'How to improve soil quality cheaply?',
  'How to store beans to avoid weevils?',
  'Correct spacing for kale farming?',
];

function formatAI(text) {
  return text.split('\n').map((line, i) => {
    if (line.startsWith('**') && line.endsWith('**'))
      return <div key={i} style={{ fontWeight: 700, color: 'var(--green-d)', marginTop: 8, fontSize: 14 }}>{line.slice(2, -2)}</div>;
    if (line.match(/^[-•]\s/))
      return <div key={i} style={{ paddingLeft: 16, marginTop: 4, color: 'var(--text-2)', fontSize: 13.5, lineHeight: 1.55 }}>• {line.slice(2)}</div>;
    if (line.match(/^\d+\./))
      return <div key={i} style={{ paddingLeft: 14, marginTop: 5, color: 'var(--text)', fontSize: 13.5, lineHeight: 1.55 }}>{line}</div>;
    return <div key={i} style={{ marginTop: line === '' ? 7 : 2, fontSize: 13.5, color: 'var(--text)', lineHeight: 1.6 }}>
      {line.replace(/\*\*(.*?)\*\*/g, '$1')}
    </div>;
  });
}

export default function AIAdvisor() {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: 'Habari! 👋 I\'m **Shamba AI**, your personal agricultural advisor.\n\nAsk me anything about crops, pests, soil health, market timing, or farming techniques. I\'m here to help you grow more, earn more, and waste less!',
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

      {/* Header card with image */}
      <div className="fade-up" style={{
        borderRadius: 18, overflow: 'hidden', position: 'relative', height: 110,
        boxShadow: 'var(--shadow)',
      }}>
        <img
          src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=900&q=80&fit=crop"
          alt="Farmer in field"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, rgba(27,77,46,0.92) 0%, rgba(27,77,46,0.50) 100%)',
          display: 'flex', alignItems: 'center', padding: '0 22px', gap: 14,
        }}>
          <div className="float" style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'linear-gradient(135deg, var(--amber-l), var(--amber))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
          }}>🌾</div>
          <div>
            <div style={{ fontFamily: 'var(--font-d)', fontWeight: 900, color: '#fff', fontSize: 17 }}>Shamba AI Advisor</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ADE80', display: 'inline-block', animation: 'pulse-dot 2s infinite' }} />
              Online · Expert in East African Agriculture
            </div>
          </div>
        </div>
      </div>

      {/* Quick questions */}
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
        {QUICK.map((q, i) => (
          <button key={i} onClick={() => send(q)} style={{
            background: 'var(--white)', color: 'var(--green)',
            border: '1px solid var(--border)', borderRadius: 999,
            padding: '6px 13px', fontSize: 12, cursor: 'pointer',
            fontFamily: 'var(--font-b)', fontWeight: 500,
            transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--green-xl)'; e.currentTarget.style.borderColor = 'var(--green-l)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--white)'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
            {q}
          </button>
        ))}
      </div>

      {/* Chat messages */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, padding: '2px' }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            background: m.role === 'user'
              ? 'linear-gradient(135deg, var(--green), var(--green-m))'
              : 'var(--white)',
            color: m.role === 'user' ? '#fff' : 'var(--text)',
            border: m.role === 'user' ? 'none' : '1px solid var(--border)',
            borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
            padding: '12px 16px', maxWidth: '85%',
            alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
            boxShadow: 'var(--shadow-sm)',
          }}>
            {m.role === 'user'
              ? <div style={{ fontSize: 14, lineHeight: 1.5 }}>{m.content}</div>
              : <div style={{ fontSize: 14, lineHeight: 1.6 }}>{formatAI(m.content)}</div>
            }
          </div>
        ))}
        {loading && (
          <div style={{
            background: 'var(--white)', border: '1px solid var(--border)',
            borderRadius: '18px 18px 18px 4px', padding: '14px 18px',
            alignSelf: 'flex-start', boxShadow: 'var(--shadow-sm)',
            display: 'flex', gap: 7, alignItems: 'center',
          }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 8, height: 8, borderRadius: '50%', background: 'var(--green-m)',
                animation: `pulse-dot 1.2s ease ${i * 0.2}s infinite`,
              }} />
            ))}
            <span style={{ fontSize: 12.5, color: 'var(--muted)', marginLeft: 4 }}>Shamba AI is thinking...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div style={{ display: 'flex', gap: 10 }}>
        <input
          value={input}
          placeholder="Ask about crops, pests, soil, markets..."
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          style={{
            flex: 1, background: 'var(--white)', border: '1.5px solid var(--border)',
            borderRadius: 12, color: 'var(--text)', fontFamily: 'var(--font-b)',
            fontSize: 14, padding: '13px 16px', outline: 'none',
            boxShadow: 'var(--shadow-sm)', transition: 'border-color 0.2s',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--green-m)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
        <button onClick={() => send()} disabled={loading || !input.trim()} style={{
          background: 'linear-gradient(135deg, var(--green), var(--green-m))',
          color: '#fff', border: 'none', borderRadius: 12,
          padding: '13px 22px', fontWeight: 700, fontSize: 15,
          cursor: 'pointer', flexShrink: 0,
          opacity: loading || !input.trim() ? 0.5 : 1,
          boxShadow: '0 4px 12px rgba(27,77,46,0.3)',
          transition: 'all 0.2s',
        }}>
          {loading ? <span className="spin">↻</span> : '↑'}
        </button>
      </div>
    </div>
  );
}
