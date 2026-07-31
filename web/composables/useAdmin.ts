// Admin session + API — a shared singleton. JWT in localStorage ('oz_admin_token'),
// the editable content object (source of truth for products/homepage/stores/
// discounts), dirty tracking, and every /api/admin/* call. Mirrors the React
// admin's api.js + AdminApp state.
import { ref, computed } from 'vue'

const KEY = 'oz_admin_token'
const token = ref<string | null>(null)
const owner = ref('')
const content = ref<any>(null)
const original = ref<any>(null)
let hydrated = false

function headers(): Record<string, string> {
  return token.value ? { Authorization: `Bearer ${token.value}` } : {}
}

export function useAdmin() {
  if (import.meta.client && !hydrated) { hydrated = true; token.value = localStorage.getItem(KEY) }

  function setToken(t: string | null) {
    token.value = t
    if (typeof localStorage === 'undefined') return
    if (t) localStorage.setItem(KEY, t); else localStorage.removeItem(KEY)
  }

  // auth
  async function login(email: string, password: string) {
    const r: any = await $fetch('/api/admin/login', { method: 'POST', body: { email, password } })
    if (r.otp) return r // { otp:true, challenge, email, sent }
    setToken(r.token); owner.value = r.user?.username || ''
    return r
  }
  async function otp(challenge: string, code: string) {
    const r: any = await $fetch('/api/admin/otp', { method: 'POST', body: { challenge, code } })
    setToken(r.token); owner.value = r.user?.username || ''
    return r
  }
  async function me() {
    if (!token.value) return null
    try { const r: any = await $fetch('/api/admin/me', { headers: headers() }); owner.value = r.user?.username || ''; return r.user }
    catch { setToken(null); return null }
  }
  function logout() { setToken(null); content.value = null; original.value = null }

  // content
  async function loadContent() {
    const c: any = await $fetch('/api/admin/content', { headers: headers() })
    content.value = c; original.value = JSON.parse(JSON.stringify(c))
    return c
  }
  async function saveContent() {
    const saved: any = await $fetch('/api/admin/content', { method: 'PUT', headers: headers(), body: content.value })
    content.value = saved; original.value = JSON.parse(JSON.stringify(saved))
    return saved
  }
  const dirty = computed(() => content.value && original.value && JSON.stringify(content.value) !== JSON.stringify(original.value))

  // data endpoints
  const stats = () => $fetch('/api/admin/stats', { headers: headers() })
  const orders = () => $fetch<any[]>('/api/admin/orders', { headers: headers() })
  const setOrderStatus = (id: string, status: string) => $fetch(`/api/admin/orders/${id}`, { method: 'PATCH', headers: headers(), body: { status } })
  const deleteOrder = (id: string) => $fetch(`/api/admin/orders/${id}`, { method: 'DELETE', headers: headers() })
  const bookings = () => $fetch<any[]>('/api/admin/bookings', { headers: headers() })
  const setBookingStatus = (id: string, status: string) => $fetch(`/api/admin/bookings/${id}`, { method: 'PATCH', headers: headers(), body: { status } })
  const deleteBooking = (id: string) => $fetch(`/api/admin/bookings/${id}`, { method: 'DELETE', headers: headers() })
  const users = () => $fetch<any[]>('/api/admin/users', { headers: headers() })
  const deleteUser = (id: string) => $fetch(`/api/admin/users/${id}`, { method: 'DELETE', headers: headers() })
  const account = () => $fetch('/api/admin/account', { headers: headers() })
  const updateAccount = (body: any) => $fetch('/api/admin/account', { method: 'PUT', headers: headers(), body })
  const audit = () => $fetch<any[]>('/api/admin/audit', { headers: headers() })
  async function upload(file: File) {
    const fd = new FormData(); fd.append('file', file)
    return $fetch<any>('/api/admin/upload', { method: 'POST', headers: headers(), body: fd })
  }

  const isAuthed = computed(() => !!token.value)
  return {
    token, owner, content, original, dirty, isAuthed,
    login, otp, me, logout, loadContent, saveContent,
    stats, orders, setOrderStatus, deleteOrder, bookings, setBookingStatus, deleteBooking,
    users, deleteUser, account, updateAccount, audit, upload,
  }
}
