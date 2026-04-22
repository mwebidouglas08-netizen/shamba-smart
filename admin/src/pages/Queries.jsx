import { useEffect, useState } from 'react';
import { getQueries } from '../api.js';

export default function Queries() {
  const [queries, setQueries] = useState([]);
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => { getQueries().then(setQueries).catch(()=>{}); }, []);

  const filtered = filter==='all' ? queries : queries.filter(q=>q.query_type===filter);

  return (
    <div>
      <div style={{ marginBottom:20 }}>
        <h2 style={{ fontSize:20, fontWeight:700, color:'#1A2E22' }}>AI Query Log</h2>
        <p style={{ fontSize:13, color:'#6B7B70', marginTop:2 }}>{queries.length} total queries logged</p>
      </div>

      {/* Filter */}
      <div style={{ display:'flex', gap:8, marginBottom:20 }}>
        {[['all','All'],['advisor','Advisor'],['doctor','Disease Doctor']].map(([v,l]) => (
          <button key={v} onClick={() => setFilter(v)} style={{
            padding:'7px 16px', borderRadius:999, border:'1px solid #E8F0EB', cursor:'pointer',
            fontFamily:'DM Sans,sans-serif', fontSize:13, fontWeight: filter===v?700:400,
            background: filter===v?'#1A2E22':'#fff', color: filter===v?'#FDE68A':'#6B7B70'
          }}>{l} {v!=='all' && `(${queries.filter(q=>q.query_type===v).length})`}</button>
        ))}
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {filtered.length === 0 ? (
          <div style={{ background:'#fff', border:'1px solid #E8F0EB', borderRadius:12, padding:40, textAlign:'center', color:'#6B7B70', fontSize:14 }}>No queries yet.</div>
        ) : filtered.map((q,i) => (
          <div key={q.id||i} style={{ background:'#fff', border:'1px solid #E8F0EB', borderRadius:12, overflow:'hidden' }}>
            <div style={{ padding:'14px 18px', display:'flex', gap:14, alignItems:'flex-start', cursor:'pointer' }}
              onClick={() => setExpanded(expanded===i ? null : i)}>
              <span style={{ fontSize:22, flexShrink:0 }}>{q.query_type==='doctor'?'🔬':'🤖'}</span>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:4 }}>
                  <span style={{ padding:'3px 9px', borderRadius:999, fontSize:11, fontWeight:600,
                    background: q.query_type==='doctor'?'#FEE2E2':'#EDE9FE',
                    color: q.query_type==='doctor'?'#DC2626':'#7C3AED' }}>
                    {q.query_type==='doctor'?'Disease Doctor':'AI Advisor'}
                  </span>
                  <span style={{ fontSize:11, color:'#9CA3AF' }}>{new Date(q.created_at).toLocaleString()}</span>
                </div>
                <p style={{ fontSize:13.5, color:'#1A2E22', fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace: expanded===i?'normal':'nowrap' }}>
                  {q.user_query}
                </p>
              </div>
              <span style={{ fontSize:14, color:'#6B7B70', flexShrink:0 }}>{expanded===i?'▲':'▼'}</span>
            </div>
            {expanded===i && (
              <div style={{ padding:'0 18px 16px', borderTop:'1px solid #F0F4F2' }}>
                <div style={{ fontSize:12, fontWeight:700, color:'#6B7B70', textTransform:'uppercase', letterSpacing:1, marginBottom:8, marginTop:14 }}>AI Response</div>
                <div style={{ fontSize:13, color:'#3D5A47', lineHeight:1.7, background:'#F8FAF9', borderRadius:8, padding:'14px', whiteSpace:'pre-wrap' }}>
                  {q.ai_response}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
