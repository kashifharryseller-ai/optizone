// OPTIZONE — API client for storefront, customer accounts, and admin panel.
const ADMIN_KEY = 'oz_admin_token'
const USER_KEY = 'oz_user_token'

export const getToken = () => { try { return localStorage.getItem(ADMIN_KEY) } catch { return null } }
export const setToken = (t) => { try { t ? localStorage.setItem(ADMIN_KEY, t) : localStorage.removeItem(ADMIN_KEY) } catch { /* ignore */ } }
export const getUserToken = () => { try { return localStorage.getItem(USER_KEY) } catch { return null } }
export const setUserToken = (t) => { try { t ? localStorage.setItem(USER_KEY, t) : localStorage.removeItem(USER_KEY) } catch { /* ignore */ } }

// auth: false | 'admin' | 'user' | 'user-optional'
async function req(path, { method = 'GET', body, auth = false, form = false } = {}) {
  const headers = {}
  if (!form) headers['Content-Type'] = 'application/json'
  if (auth === 'admin') { const t = getToken(); if (t) headers.Authorization = 'Bearer ' + t }
  if (auth === 'user' || auth === 'user-optional') { const t = getUserToken(); if (t) headers.Authorization = 'Bearer ' + t }
  const res = await fetch('/api' + path, {
    method,
    headers,
    body: form ? body : body ? JSON.stringify(body) : undefined,
  })
  const ct = res.headers.get('content-type') || ''
  const data = ct.includes('application/json') ? await res.json() : await res.text()
  if (res.status === 401) {
    if (auth === 'admin') setToken(null)
    if (auth === 'user') setUserToken(null)
  }
  if (!res.ok) throw new Error((data && data.error) || `Request failed (${res.status})`)
  return data
}

export const api = {
  // Public
  content: () => req('/content'),
  createOrder: (o) => req('/orders', { method: 'POST', body: o, auth: 'user-optional' }),
  createBooking: (b) => req('/bookings', { method: 'POST', body: b, auth: 'user-optional' }),

  // Customer auth + account
  register: (data) => req('/auth/register', { method: 'POST', body: data }),
  loginUser: (email, password) => req('/auth/login', { method: 'POST', body: { email, password } }),
  accountMe: () => req('/account/me', { auth: 'user' }),
  updateProfile: (patch) => req('/account/profile', { method: 'PUT', auth: 'user', body: patch }),
  changePassword: (current, next) => req('/account/password', { method: 'PUT', auth: 'user', body: { current, next } }),
  myOrders: () => req('/account/orders', { auth: 'user' }),
  myBookings: () => req('/account/bookings', { auth: 'user' }),
  myWishlist: () => req('/account/wishlist', { auth: 'user' }),
  toggleWishlist: (productId) => req('/account/wishlist/toggle', { method: 'POST', auth: 'user', body: { productId } }),

  // Admin — auth (email + password, then emailed OTP when enabled)
  login: (email, password) => req('/admin/login', { method: 'POST', body: { email, password } }),
  adminOtp: (challenge, code) => req('/admin/otp', { method: 'POST', body: { challenge, code } }),
  adminForgot: (email) => req('/admin/forgot', { method: 'POST', body: { email } }),
  adminReset: (challenge, code, password) => req('/admin/reset', { method: 'POST', body: { challenge, code, password } }),
  adminAccount: () => req('/admin/account', { auth: 'admin' }),
  adminAccountUpdate: (payload) => req('/admin/account', { method: 'PUT', auth: 'admin', body: payload }),
  contentVersion: () => req('/content/version'),
  me: () => req('/admin/me', { auth: 'admin' }),
  stats: () => req('/admin/stats', { auth: 'admin' }),
  getContent: () => req('/admin/content', { auth: 'admin' }),
  saveContent: (c) => req('/admin/content', { method: 'PUT', auth: 'admin', body: c }),
  orders: () => req('/admin/orders', { auth: 'admin' }),
  setOrderStatus: (id, status) => req(`/admin/orders/${id}`, { method: 'PATCH', auth: 'admin', body: { status } }),
  deleteOrder: (id) => req(`/admin/orders/${id}`, { method: 'DELETE', auth: 'admin' }),
  bookings: () => req('/admin/bookings', { auth: 'admin' }),
  setBookingStatus: (id, status) => req(`/admin/bookings/${id}`, { method: 'PATCH', auth: 'admin', body: { status } }),
  deleteBooking: (id) => req(`/admin/bookings/${id}`, { method: 'DELETE', auth: 'admin' }),
  adminUsers: () => req('/admin/users', { auth: 'admin' }),
  setUserActive: (id, active) => req(`/admin/users/${id}`, { method: 'PATCH', auth: 'admin', body: { active } }),
  deleteUser: (id) => req(`/admin/users/${id}`, { method: 'DELETE', auth: 'admin' }),
  upload: (file) => { const fd = new FormData(); fd.append('file', file); return req('/admin/upload', { method: 'POST', auth: 'admin', form: true, body: fd }) },
}
