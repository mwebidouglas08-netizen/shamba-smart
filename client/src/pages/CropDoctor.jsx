import { useState } from 'react';
import { diagnose } from '../api.js';

const CROPS_LIST = ['Maize','Beans','Tomatoes','Kale/Sukuma','Potatoes','Avocado','Sweet Potato','Sorghum','Cabbage','Cassava','Banana'];
const ALL_SYMPTOMS = [
  'yellowing leaves','stunted growth','holes in leaves','brown spots','wilting',
  'white powder','orange pustules','rotting stem base','water-soaked spots',
  'leaf curl','dead heart','sawdust frass','bacterial ooze','root rot',
  'black spots','mosaic pattern','distorted leaves','premature drop'
];

export default function CropDoctor() {
  const [crop, setCrop] = useState('');
  const [symptoms, setSymptoms] = useState([]);
  const [description, setDescription] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggle = (s) => setSymptoms(p => p.includes(s) ? p.filter(x=>x!==s) : [...p,s]);

  const run = async () => {
    if (!crop && !symptoms.length && !description) return;
    setLoading(true); setResult(null);
    try {
      const { reply } = await diagnose(crop, symptoms, description);
      setResult(reply);
    } catch { setResult('Connection error. Please check internet and try again.'); }
    setLoading(false);
  };

  const formatResult = (text) => text.split('\n').map((line, i) => {
    const isBold = line.startsWith('**') || line.startsWith('##');
    if (isBold) return <div key={i} style={{ fontWeight:700, color:'var(--gold)', fontSize:14, marginTop:10, marginBottom:4 }}>{line.replace(/\*\*|##/g,'')}</div>;
    if (line.match(/^[-•]\s/)) return <div key={i} style={{ paddingLeft:16, fontSize:13, color:'var(--muted)', marginTop:3, lineHeight:1.5 }}>• {line.slice(2)}</div>;
    if (line.match(/^\d+\./)) return <div key={i} style={{ paddingLeft:12, fontSize:13, color:'var(--text)', marginTop:5, lineHeight:1.5 }}>{line}</div>;
    return <div key={i} style={{ fontSize:13, color:'var(--text)', marginTop: line===''?6:2, lineHeight:1.5 }}>{line.replace(/\*\*(.*?)\*\*/g,'$1')}</div>;
  });

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
      <div className="fade-up" style={{ background:'linear-gradient(135deg,#2A0A0A,#1A0D00)', border:'1px solid rgba(220,38,38,0.2)', borderRadius:16, padding:20 }}>
        <div style={{ fontSize:16, fontWeight:700, color:'#FCA5A5' }}>🔬 AI Crop Disease Detector</div>
        <div style={{ fontSize:13, color:'var(--muted)', marginTop:4 }}>Select symptoms → get instant AI diagnosis with treatment plan</div>
      </div>

      {/* Crop selector */}
      <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:16, padding:18 }}>
        <div style={{ fontSize:13, fontWeight:600, color:'var(--amber)', marginBottom:12 }}>Step 1 — Which crop is affected?</div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
          {CROPS_LIST.map(c => (
            <button key={c} onClick={() => setCrop(c)} style={{
              background: crop===c ? 'rgba(217,119,6,0.25)' : 'var(--surface)',
              border: `1px solid ${crop===c ? 'var(--amber)' : 'var(--border)'}`,
              borderRadius:10, padding:'8px 14px', cursor:'pointer', fontSize:13,
              color: crop===c ? 'var(--wheat)' : 'var(--muted)', transition:'all 0.2s', fontFamily:'var(--font-b)'
            }}>{c}</button>
          ))}
        </div>
      </div>

      {/* Symptoms */}
      <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:16, padding:18 }}>
        <div style={{ fontSize:13, fontWeight:600, color:'var(--amber)', marginBottom:12 }}>Step 2 — Select visible symptoms</div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
          {ALL_SYMPTOMS.map(s => (
            <span key={s} onClick={() => toggle(s)} style={{
              background: symptoms.includes(s) ? 'rgba(220,38,38,0.3)' : 'rgba(220,38,38,0.1)',
              border: `1px solid ${symptoms.includes(s) ? '#DC2626' : 'rgba(220,38,38,0.25)'}`,
              color: symptoms.includes(s) ? '#fff' : '#FCA5A5',
              borderRadius:999, padding:'5px 12px', fontSize:12, fontWeight:500,
              cursor:'pointer', transition:'all 0.2s'
            }}>{s}</span>
          ))}
        </div>
      </div>

      {/* Extra description */}
      <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:16, padding:18 }}>
        <div style={{ fontSize:13, fontWeight:600, color:'var(--amber)', marginBottom:10 }}>Step 3 — Additional details (optional)</div>
        <textarea value={description} onChange={e=>setDescription(e.target.value)} rows={3}
          placeholder="When did symptoms start? How fast is it spreading? Recent weather? Chemicals used?"
          style={{ width:'100%', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:10,
            color:'var(--text)', fontFamily:'var(--font-b)', fontSize:13, padding:'12px',
            outline:'none', resize:'vertical' }} />
      </div>

      <button onClick={run} disabled={loading || (!crop && !symptoms.length && !description)} style={{
        background:'linear-gradient(135deg,var(--amber),var(--gold))', color:'var(--soil)',
        border:'none', borderRadius:12, padding:'14px', fontSize:15, fontWeight:700,
        cursor:'pointer', opacity: loading||(!crop&&!symptoms.length&&!description) ? 0.5 : 1,
        display:'flex', alignItems:'center', justifyContent:'center', gap:8
      }}>
        {loading ? <><span className="spin">⟳</span> Analyzing...</> : '🔬 Diagnose My Crop'}
      </button>

      {result && (
        <div className="fade-up" style={{ background:'var(--card)', border:'1px solid rgba(74,222,128,0.25)', borderRadius:16, padding:20 }}>
          <div style={{ fontSize:14, fontWeight:700, color:'var(--lime)', marginBottom:14 }}>📋 Diagnosis Report</div>
          {formatResult(result)}
          <button onClick={()=>{setResult(null);setCrop('');setSymptoms([]);setDescription('');}} style={{
            marginTop:16, width:'100%', background:'rgba(217,119,6,0.1)', color:'var(--amber)',
            border:'1px solid var(--border)', borderRadius:10, padding:'10px', cursor:'pointer',
            fontFamily:'var(--font-b)', fontSize:13, fontWeight:500
          }}>🔄 Start New Diagnosis</button>
        </div>
      )}
    </div>
  );
}
