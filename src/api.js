// OPTIZONE — API client for storefront + admin panel.
const TOKEN_KEY = 'oz_admin_token'

export const getToken = () => { try { return localStorage.getItem(TOKEN_KEY) } catch { return null } }
export const setToken = (t) => { try { t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY) } catch { /* ignore */ } }

async function req(path, { method = 'GET', body, auth = false, form = false } = {}) {
  const headers = {}
  if (!form) headers['Content-Type'] = 'application/json'
  if (auth) { const t = getToken(); if (t) headers.Authorization = 'Bearer ' + t }
  const res = await fetch('/api' + path, {
    method,
    headers,
    body: form ? body : body ? JSON.stringify(body) : undefined,
  })
  const ct = res.headers.get('content-type') || ''
  const data = ct.includes('application/json') ? await res.json() : await res.text()
  if (res.status === 401 && auth) setToken(null)
  if (!res.ok) throw new Error((data && data.error) || `Request failed (${res.status})`)
  return data
}

export const api = {
  // Public
  content: () => req('/content'),
  createOrder: (o) => req('/orders', { method: 'POST', body: o }),
  createBooking: (b) => req('/bookings', { method: 'POST', body: b }),

  // Admin
  login: (username, password) => req('/admin/login', { method: 'POST', body: { username, password } }),
  me: () => req('/admin/me', { auth: true }),
  stats: () => req('/admin/stats', { auth: true }),
  getContent: () => req('/admin/content', { auth: true }),
  saveContent: (c) => req('/admin/content', { method: 'PUT', auth: true, body: c }),
  orders: () => req('/admin/orders', { auth: true }),
  setOrderStatus: (id, status) => req(`/admin/orders/${id}`, { method: 'PATCH', auth: true, body: { status } }),
  deleteOrder: (id) => req(`/admin/orders/${id}`, { method: 'DELETE', auth: true }),
  bookings: () => req('/admin/bookings', { auth: true }),
  setBookingStatus: (id, status) => req(`/admin/bookings/${id}`, { method: 'PATCH', auth: true, body: { status } }),
  deleteBooking: (id) => req(`/admin/bookings/${id}`, { method: 'DELETE', auth: true }),
  upload: (file) => { const fd = new FormData(); fd.append('file', file); return req('/admin/upload', { method: 'POST', auth: true, form: true, body: fd }) },
}
