const BASE = '/api';

const getToken = () => localStorage.getItem('shamba_admin_token');
const authHeaders = () => ({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` });

async function req(url, options = {}) {
  const r = await fetch(BASE + url, {
    headers: options.auth !== false ? authHeaders() : { 'Content-Type': 'application/json' },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await r.json();
  if (r.status === 401) { localStorage.removeItem('shamba_admin_token'); window.location.href = '/admin/'; }
  if (!r.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const login = (username, password) => req('/admin/login', { method:'POST', body:{username,password}, auth:false });
export const getStats   = () => req('/admin/stats');
export const getQueries = () => req('/admin/queries');
export const getMessages = () => req('/admin/messages');
export const updateMessage = (id, status) => req(`/admin/messages/${id}`, { method:'PUT', body:{status} });

export const getCrops   = () => req('/crops');
export const createCrop = (data) => req('/crops', { method:'POST', body:data });
export const updateCrop = (id, data) => req(`/crops/${id}`, { method:'PUT', body:data });
export const deleteCrop = (id) => req(`/crops/${id}`, { method:'DELETE' });

export const getMarket    = () => req('/market');
export const createMarket = (data) => req('/market', { method:'POST', body:data });
export const updateMarket = (id, data) => req(`/market/${id}`, { method:'PUT', body:data });
export const deleteMarket = (id) => req(`/market/${id}`, { method:'DELETE' });
