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
  return text.split('\n').map((line, i) => {
    if (line.startsWith('**') || line.startsWith('##'))
      return <div key={i} style={{ fontWeight:700, color:'#A8F5C0', fontSize:14.5, marginTop:12, marginBottom:4 }}>{line.replace(/\*\*|##\s?/g,'')}</div>;
    if (line.match(/^[-•]\s/))
      return <div key={i} style={{ paddingLeft:18, fontSize:13.5, color:'rgba(255,255,255,0.80)', marginTop:4, lineHeight:1.55 }}>• {line.slice(2)}</div>;
    if (line.match(/^\d+\./))
      return <div key={i} style={{ paddingLeft:14, fontSize:13.5, color:'rgba(255,255,255,0.88)', marginTop:6, lineHeight:1.55 }}>{line}</div>;
    return <div key={i} style={{ fontSize:13.5, color:'rgba(255,255,255,0.85)', marginTop:line===''?6:2, lineHeight:1.6 }}>{line.replace(/\*\*(.*?)\*\*/g,'$1')}</div>;
  });
}

const GCard = ({ children, style={} }) => (
  <div className="glass fade-up" style={{ padding:20, ...style }}>{children}</div>
);

export default function CropDoctor() {
  const [crop, setCrop] = useState('');
  const [symptoms, setSymptoms] = useState([]);
  const [description, setDescription] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggle = s => setSymptoms(p => p.includes(s) ? p.filter(x=>x!==s) : [...p,s]);

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
    <div style={{ display:'flex', flexDirection:'column', gap:18 }}>

      {/* Full-bleed hero */}
      <div style={{ position:'relative', margin:'0 -16px', height:160, overflow:'hidden' }}>
        <img
          src="https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1400&q=88&fit=crop&auto=format"
          alt="Plant disease inspection closeup"
          style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center 40%', animation:'heroKB 12s ease forwards' }}
          onError={e => { e.target.src='https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=85&fit=crop'; }}
        />
        <div style={{
          position:'absolute', inset:0,
          background:'linear-gradient(90deg, rgba(140,10,10,0.92) 0%, rgba(140,10,10,0.35) 65%, transparent 100%)',
          display:'flex', alignItems:'center', padding:'0 24px',
        }}>
          <div>
            <div style={{ fontFamily:'var(--font-d)', fontWeight:800, color:'#fff', fontSize:24, marginBottom:6, textShadow:'0 2px 10px rgba(0,0,0,0.4)' }}>
              🔬 AI Crop Disease Detector
            </div>
            <div style={{ fontSize:14, color:'rgba(255,255,255,0.82)' }}>
              Select symptoms → instant AI diagnosis + treatment plan
            </div>
          </div>
        </div>
      </div>

      {/* Step 1 — Crop */}
      <GCard>
        <div style={{ fontSize:13, fontWeight:700, color:'#A8F5C0', marginBottom:12 }}>Step 1 — Which crop is affected?</div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
          {CROPS.map(c => (
            <button key={c} onClick={() => setCrop(c)} style={{
              background: crop===c ? 'rgba(45,138,78,0.55)' : 'rgba(255,255,255,0.09)',
              color: '#fff',
              border: `1.5px solid ${crop===c ? 'rgba(93,201,126,0.70)' : 'rgba(255,255,255,0.18)'}`,
              borderRadius:10, padding:'8px 15px', cursor:'pointer',
              fontSize:13.5, fontWeight: crop===c ? 700 : 500,
              fontFamily:'var(--font-b)', transition:'all 0.18s',
              boxShadow: crop===c ? '0 3px 12px rgba(45,138,78,0.40)' : 'none',
            }}>{c}</button>
          ))}
        </div>
      </GCard>

      {/* Step 2 — Symptoms */}
      <GCard>
        <div style={{ fontSize:13, fontWeight:700, color:'#A8F5C0', marginBottom:12 }}>Step 2 — Select visible symptoms (all that apply)</div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
          {SYMPTOMS.map(s => (
            <span key={s} onClick={() => toggle(s)} style={{
              background: symptoms.includes(s) ? 'rgba(239,68,68,0.35)' : 'rgba(255,255,255,0.09)',
              border: `1.5px solid ${symptoms.includes(s) ? 'rgba(239,68,68,0.70)' : 'rgba(255,255,255,0.18)'}`,
              color: symptoms.includes(s) ? '#FFB3B3' : 'rgba(255,255,255,0.78)',
              borderRadius:999, padding:'6px 13px', fontSize:12.5, fontWeight:600,
              cursor:'pointer', transition:'all 0.18s',
            }}>{s}</span>
          ))}
        </div>
        {symptoms.length > 0 && (
          <div style={{ marginTop:10, fontSize:12.5, color:'#5DC97E', fontWeight:600 }}>
            ✓ {symptoms.length} symptom{symptoms.length>1?'s':''} selected
          </div>
        )}
      </GCard>

      {/* Step 3 — Description */}
      <GCard>
        <div style={{ fontSize:13, fontWeight:700, color:'#A8F5C0', marginBottom:10 }}>Step 3 — Additional details (optional)</div>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
          placeholder="When did symptoms start? How fast is it spreading? Recent weather? Chemicals used?"
          style={{
            width:'100%', background:'rgba(255,255,255,0.08)', backdropFilter:'blur(8px)',
            border:'1px solid rgba(255,255,255,0.20)', borderRadius:10,
            color:'#fff', fontFamily:'var(--font-b)', fontSize:13.5,
            padding:'12px 14px', outline:'none', resize:'vertical', lineHeight:1.5,
            transition:'border-color 0.2s',
          }}
          onFocus={e => e.target.style.borderColor='rgba(93,201,126,0.55)'}
          onBlur={e  => e.target.style.borderColor='rgba(255,255,255,0.20)'}
        />
      </GCard>

      {/* Diagnose button */}
      <button onClick={run} disabled={loading||(!crop&&!symptoms.length&&!description)} style={{
        background:'linear-gradient(135deg,rgba(185,28,28,0.85),rgba(239,68,68,0.75))',
        backdropFilter:'blur(10px)', color:'#fff',
        border:'1px solid rgba(239,68,68,0.45)', borderRadius:14,
        padding:'15px', fontSize:15.5, fontWeight:700, cursor:'pointer',
        display:'flex', alignItems:'center', justifyContent:'center', gap:9,
        boxShadow:'0 6px 24px rgba(185,28,28,0.40)',
        opacity: loading||(!crop&&!symptoms.length&&!description) ? 0.45 : 1,
        transition:'all 0.2s',
      }}>
        {loading ? <><span className="spin">↻</span> Analyzing symptoms...</> : '🔬 Diagnose My Crop'}
      </button>

      {/* Result */}
      {result && (
        <div className="glass fade-up" style={{ padding:22, border:'1.5px solid rgba(93,201,126,0.35)' }}>
          <div style={{ fontSize:15.5, fontWeight:700, color:'#A8F5C0', marginBottom:14 }}>📋 Diagnosis Report</div>
          <FormatResult text={result} />
          <button onClick={() => {setResult(null);setCrop('');setSymptoms([]);setDescription('');}} style={{
            marginTop:18, width:'100%', background:'rgba(255,255,255,0.10)', backdropFilter:'blur(8px)',
            color:'rgba(255,255,255,0.80)', border:'1px solid rgba(255,255,255,0.20)',
            borderRadius:10, padding:'11px', cursor:'pointer',
            fontFamily:'var(--font-b)', fontSize:14, fontWeight:600, transition:'background 0.2s',
          }}>🔄 Start New Diagnosis</button>
        </div>
      )}
    </div>
  );
}
