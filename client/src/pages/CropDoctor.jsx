import { useState } from 'react';
import { diagnose } from '../api.js';

const CROPS = ['Maize','Beans','Tomatoes','Kale/Sukuma','Potatoes','Avocado','Sweet Potato','Sorghum','Cabbage','Cassava','Banana'];
const SYMPTOMS = [
  'yellowing leaves','stunted growth','holes in leaves','brown spots','wilting',
  'white powder','orange pustules','rotting stem base','water-soaked spots','leaf curl',
  'dead heart','sawdust frass','bacterial ooze','root rot','black spots',
  'mosaic pattern','distorted leaves','premature fruit drop',
];

function FormatResult({ text }) {
  return (
    <>
      {text.split('\n').map((line, i) => {
        if (line.startsWith('**') || line.startsWith('##'))
          return <div key={i} style={{ fontWeight: 700, color: 'var(--blue-700)', fontSize: 14.5, marginTop: 12, marginBottom: 4 }}>{line.replace(/\*\*|##\s?/g, '')}</div>;
        if (line.match(/^[-•]\s/))
          return <div key={i} style={{ paddingLeft: 18, fontSize: 13.5, color: 'var(--text-2)', marginTop: 4, lineHeight: 1.55 }}>• {line.slice(2)}</div>;
        if (line.match(/^\d+\./))
          return <div key={i} style={{ paddingLeft: 14, fontSize: 13.5, color: 'var(--text)', marginTop: 6, lineHeight: 1.55 }}>{line}</div>;
        return <div key={i} style={{ fontSize: 13.5, color: 'var(--text)', marginTop: line === '' ? 6 : 2, lineHeight: 1.6 }}>{line.replace(/\*\*(.*?)\*\*/g, '$1')}</div>;
      })}
    </>
  );
}

export default function CropDoctor() {
  const [crop, setCrop]       = useState('');
  const [symptoms, setSymptoms] = useState([]);
  const [description, setDescription] = useState('');
  const [result, setResult]   = useState(null);
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

      {/* Full-bleed hero */}
      <div style={{ margin: '0 -16px', position: 'relative', height: 160, overflow: 'hidden' }}>
        <img
          src="https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1400&q=90&fit=crop&auto=format"
          alt="Scientist examining plant disease on crop leaves"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 38%', animation: 'heroKB 12s ease forwards', display: 'block' }}
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400&q=85&fit=crop'; }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, rgba(10,31,61,0.93) 0%, rgba(14,49,104,0.58) 60%, transparent 100%)',
          display: 'flex', alignItems: 'center', padding: '0 26px',
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-d)', fontWeight: 700, color: '#fff', fontSize: 24, marginBottom: 6 }}>🔬 AI Crop Disease Detector</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.82)' }}>Select symptoms → instant AI diagnosis + treatment plan</div>
          </div>
        </div>
      </div>

      {/* Step 1 */}
      <div className="card fade-up" style={{ padding: 20 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--blue-700)', marginBottom: 13 }}>Step 1 — Which crop is affected?</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {CROPS.map(c => (
            <button key={c} onClick={() => setCrop(c)} style={{
              background: crop === c ? 'var(--blue-600)' : 'var(--blue-50)',
              color: crop === c ? '#fff' : 'var(--blue-700)',
              border: `1.5px solid ${crop === c ? 'var(--blue-600)' : 'var(--blue-200)'}`,
              borderRadius: 10, padding: '8px 15px', cursor: 'pointer',
              fontSize: 13.5, fontWeight: crop === c ? 700 : 500,
              fontFamily: 'var(--font-b)', transition: 'all 0.18s',
              boxShadow: crop === c ? '0 3px 12px rgba(26,95,200,0.28)' : 'none',
            }}>{c}</button>
          ))}
        </div>
      </div>

      {/* Step 2 */}
      <div className="card fade-up" style={{ padding: 20 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--blue-700)', marginBottom: 13 }}>Step 2 — Select visible symptoms</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {SYMPTOMS.map(s => (
            <span key={s} onClick={() => toggle(s)} style={{
              background: symptoms.includes(s) ? '#fef2f2' : 'var(--gray-100)',
              border: `1.5px solid ${symptoms.includes(s) ? 'var(--red)' : 'var(--border)'}`,
              color: symptoms.includes(s) ? 'var(--red)' : 'var(--text-2)',
              borderRadius: 999, padding: '6px 13px', fontSize: 12.5, fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.18s',
            }}>{s}</span>
          ))}
        </div>
        {symptoms.length > 0 && (
          <div style={{ marginTop: 10, fontSize: 12.5, color: 'var(--blue-600)', fontWeight: 600 }}>
            ✓ {symptoms.length} symptom{symptoms.length > 1 ? 's' : ''} selected
          </div>
        )}
      </div>

      {/* Step 3 */}
      <div className="card fade-up" style={{ padding: 20 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--blue-700)', marginBottom: 11 }}>Step 3 — Additional details (optional)</div>
        <textarea
          value={description} onChange={e => setDescription(e.target.value)} rows={3}
          placeholder="When did symptoms start? How fast spreading? Recent weather? Chemicals used?"
          style={{
            width: '100%', background: 'var(--gray-50)',
            border: '1.5px solid var(--border)', borderRadius: 10,
            color: 'var(--text)', fontFamily: 'var(--font-b)', fontSize: 13.5,
            padding: '12px 14px', outline: 'none', resize: 'vertical', lineHeight: 1.5,
            transition: 'border-color 0.2s',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--blue-500)'}
          onBlur={e  => e.target.style.borderColor = 'var(--border)'}
        />
      </div>

      <button onClick={run} disabled={loading || (!crop && !symptoms.length && !description)} style={{
        background: 'linear-gradient(135deg, #dc2626, #ef4444)',
        color: '#fff', border: 'none', borderRadius: 14,
        padding: '14px', fontSize: 15.5, fontWeight: 700, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
        boxShadow: '0 6px 20px rgba(220,38,38,0.30)',
        opacity: loading || (!crop && !symptoms.length && !description) ? 0.45 : 1,
        transition: 'all 0.2s',
      }}>
        {loading ? <><span className="spin">↻</span> Analyzing...</> : '🔬 Diagnose My Crop'}
      </button>

      {result && (
        <div className="card fade-up" style={{ padding: 22, borderLeft: '4px solid var(--blue-500)', borderTop: '2px solid var(--blue-200)' }}>
          <div style={{ fontSize: 15.5, fontWeight: 700, color: 'var(--blue-800)', marginBottom: 14 }}>📋 Diagnosis Report</div>
          <FormatResult text={result} />
          <button onClick={() => { setResult(null); setCrop(''); setSymptoms([]); setDescription(''); }} style={{
            marginTop: 18, width: '100%', background: 'var(--gray-100)',
            color: 'var(--text-2)', border: '1px solid var(--border)',
            borderRadius: 10, padding: '11px', cursor: 'pointer',
            fontFamily: 'var(--font-b)', fontSize: 13.5, fontWeight: 600,
          }}>🔄 Start New Diagnosis</button>
        </div>
      )}
    </div>
  );
}
