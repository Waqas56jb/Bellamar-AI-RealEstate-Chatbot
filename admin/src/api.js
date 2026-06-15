// Thin API client for the admin panel -> backend (server/).
// Defaults to the deployed backend; override with VITE_API_URL for local dev.
const BASE = (import.meta.env.VITE_API_URL || 'https://bellamar-ai-real-estate-chatbot-bac.vercel.app').replace(/\/$/, '')
const TOKEN_KEY = 'bellamar_admin_token'

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY) || '',
  set: (t) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth) headers.Authorization = `Bearer ${tokenStore.get()}`

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`)
    err.status = res.status
    throw err
  }
  return data
}

export const api = {
  // auth
  login: (password) => request('/api/admin/login', { method: 'POST', body: { password }, auth: false }),
  verify: () => request('/api/admin/verify'),

  // dashboard
  stats: () => request('/api/admin/stats'),

  // leads
  leads: (status) => request(`/api/admin/leads${status ? `?status=${status}` : ''}`),
  updateLead: (id, status) => request(`/api/admin/leads/${id}`, { method: 'PATCH', body: { status } }),
  deleteLead: (id) => request(`/api/admin/leads/${id}`, { method: 'DELETE' }),

  // training
  training: () => request('/api/admin/training'),
  createTraining: (doc) => request('/api/admin/training', { method: 'POST', body: doc }),
  updateTraining: (id, patch) => request(`/api/admin/training/${id}`, { method: 'PATCH', body: patch }),
  deleteTraining: (id) => request(`/api/admin/training/${id}`, { method: 'DELETE' }),

  // settings
  settings: () => request('/api/admin/settings'),
  updateSettings: (patch) => request('/api/admin/settings', { method: 'PATCH', body: patch }),
}
