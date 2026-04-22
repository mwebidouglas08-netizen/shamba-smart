import { useEffect, useState } from 'react';
import { getMarket, createMarket, updateMarket, deleteMarket } from '../api.js';
import Modal from '../components/Modal.jsx';

const EMPTY = { crop_name:'', unit:'', price:'', change_percent:'0', demand:'Medium' };

export default function Prices() {
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState(null); // null | 'add' | {id, ...}
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => getMarket().then(setItems).catch(()=>{});
  useEffect(() => { load(); }, []);

  const openAdd  = () => { setForm(EMPTY); setError(''); setModal('add'); };
  const openEdit = (item) => { setForm({ ...item, price: String(item.price), change_percent: String(item.change_percent||0) }); setError(''); setModal(item); };
  const close    = () => setModal(null);

  const save = async () => {
    if (!form.crop_name || !form.price) { setError('Crop name and price are required'); return; }
    setSaving(true); setError('');
    try {
      if (modal === 'add') {
        await createMarket(form); 
      } else {
        await updateMarket(modal.id, form);
      }
      await load(); close();
    } catch (e) { setError(e.message); }
    setSaving(false);
  };

  const del = async (id) => {
    if (!confirm('Delete this price entry?')) return;
    await deleteMarket(id).catch(()=>{});
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const inp = { width:'100%', padding:'10px 12px', border:'1.5px solid #E8F0EB', borderRadius:8,
    fontFamily:'DM Sans,sans-serif', fontSize:14, color:'#1A2E22', outline:'none',
    background:'#F8FAF9', marginBottom:14 };

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <div>
          <h2 style={{ fontSize:20, fontWeight:700, color:'#1A2E22' }}>Market Prices</h2>
          <p style={{ fontSize:13, color:'#6B7B70', marginTop:2 }}>{items.length} price entries</p>
        </div>
        <button onClick={openAdd} style={{ background:'#D97706', color:'#fff', border:'none', borderRadius:10,
          padding:'10px 20px', cursor:'pointer', fontWeight:600, fontSize:14 }}>+ Add Price</button>
      </div>

      <div style={{ background:'#fff', border:'1px solid #E8F0EB', borderRadius:16, overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'#F8FAF9', borderBottom:'1px solid #E8F0EB' }}>
              {['Crop','Unit','Price (KES)','Change %','Demand','Actions'].map(h => (
                <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:12, fontWeight:700, color:'#6B7B70', textTransform:'uppercase', letterSpacing:0.5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={item.id} style={{ borderBottom: i<items.length-1?'1px solid #F0F4F2':'none' }}>
                <td style={{ padding:'14px 16px', fontWeight:600, color:'#1A2E22', fontSize:14 }}>{item.crop_name}</td>
                <td style={{ padding:'14px 16px', color:'#6B7B70', fontSize:13 }}>{item.unit}</td>
                <td style={{ padding:'14px 16px', fontFamily:'DM Mono,monospace', fontWeight:700, color:'#1A2E22' }}>{item.price?.toLocaleString()}</td>
                <td style={{ padding:'14px 16px', fontWeight:600, color: item.change_percent>0?'#16A34A':'#DC2626', fontFamily:'DM Mono,monospace' }}>
                  {item.change_percent>0?'+':''}{item.change_percent}%
                </td>
                <td style={{ padding:'14px 16px' }}>
                  <span style={{ padding:'4px 10px', borderRadius:999, fontSize:12, fontWeight:600,
                    background: item.demand==='High'?'#DCFCE7':item.demand==='Medium'?'#FEF3C7':'#FEE2E2',
                    color: item.demand==='High'?'#166534':item.demand==='Medium'?'#92400E':'#991B1B' }}>
                    {item.demand}
                  </span>
                </td>
                <td style={{ padding:'14px 16px' }}>
                  <div style={{ display:'flex', gap:8 }}>
                    <button onClick={() => openEdit(item)} style={{ padding:'6px 12px', borderRadius:7, border:'1px solid #D97706',
                      color:'#D97706', background:'#FFFBEB', cursor:'pointer', fontSize:12, fontWeight:600 }}>Edit</button>
                    <button onClick={() => del(item.id)} style={{ padding:'6px 12px', borderRadius:7, border:'1px solid #FCA5A5',
                      color:'#DC2626', background:'#FEF2F2', cursor:'pointer', fontSize:12, fontWeight:600 }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal==='add' ? 'Add Market Price' : `Edit: ${modal.crop_name}`} onClose={close}>
          {error && <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:8, padding:'10px 14px', fontSize:13, color:'#DC2626', marginBottom:14 }}>{error}</div>}
          <label style={{ fontSize:13, fontWeight:600, color:'#3D5A47', display:'block', marginBottom:6 }}>Crop Name *</label>
          <input style={inp} value={form.crop_name} onChange={e=>setForm(p=>({...p,crop_name:e.target.value}))} placeholder="e.g. Maize" />
          <label style={{ fontSize:13, fontWeight:600, color:'#3D5A47', display:'block', marginBottom:6 }}>Unit</label>
          <input style={inp} value={form.unit} onChange={e=>setForm(p=>({...p,unit:e.target.value}))} placeholder="e.g. per 90kg bag" />
          <label style={{ fontSize:13, fontWeight:600, color:'#3D5A47', display:'block', marginBottom:6 }}>Price (KES) *</label>
          <input style={inp} type="number" value={form.price} onChange={e=>setForm(p=>({...p,price:e.target.value}))} placeholder="e.g. 4500" />
          <label style={{ fontSize:13, fontWeight:600, color:'#3D5A47', display:'block', marginBottom:6 }}>Change % (positive = up)</label>
          <input style={inp} type="number" step="0.1" value={form.change_percent} onChange={e=>setForm(p=>({...p,change_percent:e.target.value}))} placeholder="e.g. 5.2" />
          <label style={{ fontSize:13, fontWeight:600, color:'#3D5A47', display:'block', marginBottom:6 }}>Demand</label>
          <select style={{...inp, appearance:'none'}} value={form.demand} onChange={e=>setForm(p=>({...p,demand:e.target.value}))}>
            {['High','Medium','Low'].map(d=><option key={d}>{d}</option>)}
          </select>
          <div style={{ display:'flex', gap:10, marginTop:4 }}>
            <button onClick={close} style={{ flex:1, padding:'11px', border:'1px solid #E8F0EB', borderRadius:10, cursor:'pointer', fontSize:14, background:'#F8FAF9', color:'#6B7B70', fontFamily:'DM Sans,sans-serif' }}>Cancel</button>
            <button onClick={save} disabled={saving} style={{ flex:2, padding:'11px', background:'#D97706', color:'#fff', border:'none', borderRadius:10, cursor:'pointer', fontSize:14, fontWeight:700, opacity:saving?0.7:1, fontFamily:'DM Sans,sans-serif' }}>
              {saving ? 'Saving...' : 'Save Price'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
