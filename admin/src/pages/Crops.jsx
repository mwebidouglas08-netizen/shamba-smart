import { useEffect, useState } from 'react';
import { getCrops, createCrop, updateCrop, deleteCrop } from '../api.js';
import Modal from '../components/Modal.jsx';

const EMPTY = { name:'', emoji:'🌿', season:'', ph_range:'', water_needs:'', days_to_harvest:'', description:'' };

export default function Crops() {
  const [crops, setCrops] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => getCrops().then(setCrops).catch(()=>{});
  useEffect(() => { load(); }, []);

  const openAdd  = () => { setForm(EMPTY); setError(''); setModal('add'); };
  const openEdit = (c) => { setForm(c); setError(''); setModal(c); };
  const close = () => setModal(null);

  const save = async () => {
    if (!form.name) { setError('Crop name is required'); return; }
    setSaving(true); setError('');
    try {
      if (modal === 'add') { await createCrop(form); }
      else { await updateCrop(modal.id, form); }
      await load(); close();
    } catch (e) { setError(e.message); }
    setSaving(false);
  };

  const del = async (id) => {
    if (!confirm('Delete this crop?')) return;
    await deleteCrop(id).catch(()=>{});
    setCrops(prev => prev.filter(c => c.id !== id));
  };

  const inp = { width:'100%', padding:'10px 12px', border:'1.5px solid #E8F0EB', borderRadius:8,
    fontFamily:'DM Sans,sans-serif', fontSize:14, color:'#1A2E22', outline:'none',
    background:'#F8FAF9', marginBottom:14 };
  const label = (t) => <label style={{ fontSize:13, fontWeight:600, color:'#3D5A47', display:'block', marginBottom:6 }}>{t}</label>;

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <div>
          <h2 style={{ fontSize:20, fontWeight:700, color:'#1A2E22' }}>Crops Management</h2>
          <p style={{ fontSize:13, color:'#6B7B70', marginTop:2 }}>{crops.length} crops in database</p>
        </div>
        <button onClick={openAdd} style={{ background:'#16A34A', color:'#fff', border:'none', borderRadius:10, padding:'10px 20px', cursor:'pointer', fontWeight:600, fontSize:14 }}>+ Add Crop</button>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:14 }}>
        {crops.map(c => (
          <div key={c.id} style={{ background:'#fff', border:'1px solid #E8F0EB', borderRadius:14, padding:20 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontSize:32 }}>{c.emoji}</span>
                <div>
                  <div style={{ fontWeight:700, fontSize:16, color:'#1A2E22' }}>{c.name}</div>
                  <div style={{ fontSize:11, color:'#6B7B70', marginTop:1 }}>{c.days_to_harvest} days to harvest</div>
                </div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                <button onClick={() => openEdit(c)} style={{ padding:'5px 10px', border:'1px solid #D97706', color:'#D97706', background:'#FFFBEB', borderRadius:7, cursor:'pointer', fontSize:12, fontWeight:600 }}>Edit</button>
                <button onClick={() => del(c.id)} style={{ padding:'5px 10px', border:'1px solid #FCA5A5', color:'#DC2626', background:'#FEF2F2', borderRadius:7, cursor:'pointer', fontSize:12, fontWeight:600 }}>Del</button>
              </div>
            </div>
            {c.description && <p style={{ fontSize:13, color:'#6B7B70', lineHeight:1.5, marginBottom:10 }}>{c.description}</p>}
            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
              {c.season && <span style={{ fontSize:11, background:'#F0FDF4', color:'#166534', borderRadius:6, padding:'3px 8px', fontWeight:500 }}>📅 {c.season}</span>}
              {c.ph_range && <span style={{ fontSize:11, background:'#FFFBEB', color:'#92400E', borderRadius:6, padding:'3px 8px', fontWeight:500 }}>pH {c.ph_range}</span>}
              {c.water_needs && <span style={{ fontSize:11, background:'#EFF6FF', color:'#1D4ED8', borderRadius:6, padding:'3px 8px', fontWeight:500 }}>💧 {c.water_needs}</span>}
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal title={modal==='add' ? 'Add New Crop' : `Edit: ${modal.name}`} onClose={close}>
          {error && <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:8, padding:'10px 14px', fontSize:13, color:'#DC2626', marginBottom:14 }}>{error}</div>}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            <div>
              {label('Crop Name *')}
              <input style={inp} value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="e.g. Maize" />
            </div>
            <div>
              {label('Emoji')}
              <input style={inp} value={form.emoji} onChange={e=>setForm(p=>({...p,emoji:e.target.value}))} placeholder="🌽" maxLength={2} />
            </div>
          </div>
          {label('Season')}
          <input style={inp} value={form.season} onChange={e=>setForm(p=>({...p,season:e.target.value}))} placeholder="e.g. Mar–Jun, Oct–Dec" />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14 }}>
            <div>{label('Soil pH')}
              <input style={inp} value={form.ph_range} onChange={e=>setForm(p=>({...p,ph_range:e.target.value}))} placeholder="e.g. 5.5–7.0" /></div>
            <div>{label('Water Needs')}
              <input style={inp} value={form.water_needs} onChange={e=>setForm(p=>({...p,water_needs:e.target.value}))} placeholder="e.g. 500–800mm" /></div>
            <div>{label('Days to Harvest')}
              <input style={inp} value={form.days_to_harvest} onChange={e=>setForm(p=>({...p,days_to_harvest:e.target.value}))} placeholder="e.g. 90–120" /></div>
          </div>
          {label('Description')}
          <textarea style={{...inp, resize:'vertical'}} rows={3} value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} placeholder="Brief description of this crop..." />
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={close} style={{ flex:1, padding:'11px', border:'1px solid #E8F0EB', borderRadius:10, cursor:'pointer', fontSize:14, background:'#F8FAF9', color:'#6B7B70', fontFamily:'DM Sans,sans-serif' }}>Cancel</button>
            <button onClick={save} disabled={saving} style={{ flex:2, padding:'11px', background:'#16A34A', color:'#fff', border:'none', borderRadius:10, cursor:'pointer', fontSize:14, fontWeight:700, opacity:saving?0.7:1, fontFamily:'DM Sans,sans-serif' }}>
              {saving ? 'Saving...' : 'Save Crop'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
