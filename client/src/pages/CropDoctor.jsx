import { useState } from 'react';
import { diagnose } from '../api.jsx';

const CROPS = ['Maize','Beans','Tomatoes','Kale/Sukuma','Potatoes','Avocado','Sweet Potato','Sorghum','Cabbage','Cassava','Banana'];
const SYMPTOMS = [
  'yellowing leaves','stunted growth','holes in leaves','brown spots','wilting',
  'white powder','orange pustules','rotting stem base','water-soaked spots','leaf curl',
  'dead heart','sawdust frass','bacterial ooze','root rot','black spots',
  'mosaic pattern','distorted leaves','premature fruit drop',
];

function formatResult(text) {
  return text.split('\n').map((line, i) => {
    if (line.startsWith('**') || line.startsWith('##'))
      return <div key={i} style={{ fontWeight: 700, color: 'var(--green-d)', fontSize: 14.5, marginTop: 12, marginBottom: 4 }}>
        {line.replace(/\*\*|##\s?/g, '')}
      </div>;
    if (line.match(/^[-•]\s/))
      return <div key={i} style={{ paddingLeft: 18, fontSize: 13.5, color: 'var(--text-2)', marginTop: 4, lineHeight: 1.55 }}>• {line.slice(2)}</div>;
    if (line.match(/^\d+\./))
      return <div key={i} style={{ paddingLeft: 14, fontSize: 13.5, color: 'var(--text)', marginTop: 6, lineHeight: 1.55 }}>{line}</div>;
    return <div key={i} style={{ fontSize: 13.5, color: 'var(--text)', marginTop: line === '' ? 6 : 2, lineHeight: 1.6 }}>
      {line.replace(/\*\*(.*?)\*\*/g, '$1')}
    </div>;
  });
}

export default function CropDoctor() {
  const [crop, setCrop] = useState('');
  const [symptoms, setSymptoms] = useState([]);
  const [description, setDescription] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggle = s => setSymptoms(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

  const run = async () => {
    if (!crop && !symptoms.length && !description) return;
    setLoading(true); setResult(null);
    try {
      const { reply } = await diagnose(crop, symptoms, description);
      setResult(reply);
    } catch { setResult('Connection error. Please check internet and try again.'); }
    setLoading(false);
  };

  const card = { background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 18, padding: 20, boxShadow: 'var(--shadow-sm)' };
  const sectionLabel = { fontSize: 13, fontWeight: 700, color: 'var(--green-d)', marginBottom: 12 };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

      {/* Hero banner */}
      <div className="fade-up" style={{ borderRadius: 18, overflow: 'hidden', height: 130, position: 'relative', boxShadow: 'var(--shadow)' }}>
        <img
          src="https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=900&q=80&fit=crop"
          alt="Scientist examining crop leaves"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 35%' }}
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&q=80&fit=crop'; }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, rgba(185,28,28,0.88) 0%, rgba(185,28,28,0.30) 100%)',
          display: 'flex', alignItems: 'center', padding: '0 24px',
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-d)', fontWeight: 900, color: '#fff', fontSize: 20, marginBottom: 5 }}>🔬 AI Crop Disease Detector</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>Describe symptoms → get instant diagnosis + treatment plan</div>
          </div>
        </div>
      </div>

      {/* Step 1 — Crop */}
      <div className="fade-up" style={card}>
        <div style={sectionLabel}>Step 1 — Which crop is affected?</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {CROPS.map(c => (
            <button key={c} onClick={() => setCrop(c)} style={{
              background: crop === c ? 'var(--green)' : 'var(--surface)',
              color: crop === c ? '#fff' : 'var(--text-2)',
              border: `1.5px solid ${crop === c ? 'var(--green)' : 'var(--border)'}`,
              borderRadius: 10, padding: '8px 15px', cursor: 'pointer',
              fontSize: 13.5, fontWeight: crop === c ? 700 : 500,
              fontFamily: 'var(--font-b)', transition: 'all 0.18s',
              boxShadow: crop === c ? '0 3px 10px rgba(27,77,46,0.22)' : 'none',
            }}>{c}</button>
          ))}
        </div>
      </div>

      {/* Step 2 — Symptoms */}
      <div className="fade-up" style={card}>
        <div style={sectionLabel}>Step 2 — Select visible symptoms (pick all that apply)</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {SYMPTOMS.map(s => (
            <span key={s} onClick={() => toggle(s)} style={{
              background: symptoms.includes(s) ? 'var(--red-l)' : 'var(--surface)',
              border: `1.5px solid ${symptoms.includes(s) ? 'var(--red)' : 'var(--border)'}`,
              color: symptoms.includes(s) ? 'var(--red)' : 'var(--text-2)',
              borderRadius: 999, padding: '6px 13px', fontSize: 12.5, fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.18s',
            }}>{s}</span>
          ))}
        </div>
        {symptoms.length > 0 && (
          <div style={{ marginTop: 10, fontSize: 12, color: 'var(--green)', fontWeight: 600 }}>
            ✓ {symptoms.length} symptom{symptoms.length > 1 ? 's' : ''} selected
          </div>
        )}
      </div>

      {/* Step 3 — Extra description */}
      <div className="fade-up" style={card}>
        <div style={sectionLabel}>Step 3 — Additional details (optional)</div>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
          placeholder="When did symptoms start? How fast spreading? Recent weather? Chemicals used recently?"
          style={{
            width: '100%', background: 'var(--surface)', border: '1.5px solid var(--border)',
            borderRadius: 10, color: 'var(--text)', fontFamily: 'var(--font-b)',
            fontSize: 13.5, padding: '12px 14px', outline: 'none', resize: 'vertical',
            lineHeight: 1.5, transition: 'border-color 0.2s',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--green-m)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
      </div>

      {/* Diagnose button */}
      <button onClick={run} disabled={loading || (!crop && !symptoms.length && !description)} style={{
        background: 'linear-gradient(135deg, #DC2626, #EF4444)',
        color: '#fff', border: 'none', borderRadius: 14,
        padding: '15px', fontSize: 15.5, fontWeight: 700, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        boxShadow: '0 4px 16px rgba(220,38,38,0.30)',
        opacity: loading || (!crop && !symptoms.length && !description) ? 0.5 : 1,
        transition: 'all 0.2s',
      }}>
        {loading ? <><span className="spin">↻</span> Analyzing symptoms...</> : '🔬 Diagnose My Crop'}
      </button>

      {/* Result */}
      {result && (
        <div className="fade-up" style={{
          background: 'var(--white)', border: '1.5px solid var(--green-l)',
          borderRadius: 18, padding: 22, boxShadow: 'var(--shadow)',
          borderLeft: '4px solid var(--green)',
        }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--green-d)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            📋 Diagnosis Report
          </div>
          <div style={{ lineHeight: 1.7 }}>{formatResult(result)}</div>
          <button onClick={() => { setResult(null); setCrop(''); setSymptoms([]); setDescription(''); }} style={{
            marginTop: 18, width: '100%', background: 'var(--surface)',
            color: 'var(--text-2)', border: '1px solid var(--border)',
            borderRadius: 10, padding: '11px', cursor: 'pointer',
            fontFamily: 'var(--font-b)', fontSize: 13.5, fontWeight: 600,
            transition: 'background 0.2s',
          }}>🔄 Start New Diagnosis</button>
        </div>
      )}
    </div>
  );
}
