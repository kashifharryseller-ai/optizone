// Customer auth — JWT in localStorage ('oz_token'), user in a shared singleton.
// Mirrors the React AuthProvider: register/login/logout, profile + password,
// wishlist toggle, and lazy /account/me hydration. All calls hit the existing
// Express API; the token rides as a Bearer header.
import { ref, computed } from 'vue'

export interface AuthUser {
  id: string; name: string; email: string; phone?: string
  createdAt?: string; active?: boolean; wishlist?: number[]
}

const KEY = 'oz_token'
const token = ref<string | null>(null)
const user = ref<AuthUser | null>(null)
let hydrated = false

function authHeaders(): Record<string, string> {
  return token.value ? { Authorization: `Bearer ${token.value}` } : {}
}

export function useAuth() {
  if (import.meta.client && !hydrated) {
    hydrated = true
    token.value = localStorage.getItem(KEY)
    if (token.value) { void me() }
  }

  function persist(tk: string | null) {
    token.value = tk
    if (typeof localStorage === 'undefined') return
    if (tk) localStorage.setItem(KEY, tk); else localStorage.removeItem(KEY)
  }

  async function register(body: { name: string; email: string; phone?: string; password: string }) {
    const r: any = await $fetch('/api/auth/register', { method: 'POST', body })
    persist(r.token); user.value = r.user
    return r.user
  }
  async function login(body: { email: string; password: string }) {
    const r: any = await $fetch('/api/auth/login', { method: 'POST', body })
    persist(r.token); user.value = r.user
    return r.user
  }
  async function me() {
    if (!token.value) return null
    try {
      const r: any = await $fetch('/api/account/me', { headers: authHeaders() })
      user.value = r.user
      return r.user
    } catch { persist(null); user.value = null; return null }
  }
  function logout() { persist(null); user.value = null }

  async function updateProfile(patch: { name?: string; phone?: string }) {
    const r: any = await $fetch('/api/account/profile', { method: 'PUT', headers: authHeaders(), body: patch })
    user.value = r.user
    return r.user
  }
  async function changePassword(current: string, nextPw: string) {
    return $fetch('/api/account/password', { method: 'PUT', headers: authHeaders(), body: { current, next: nextPw } })
  }
  async function orders() { return $fetch<any[]>('/api/account/orders', { headers: authHeaders() }) }
  async function bookings() { return $fetch<any[]>('/api/account/bookings', { headers: authHeaders() }) }

  const inWishlist = (id: number | string) => !!user.value?.wishlist?.includes(Number(id))
  async function toggleWishlist(productId: number | string) {
    const r: any = await $fetch('/api/account/wishlist/toggle', { method: 'POST', headers: authHeaders(), body: { productId: Number(productId) } })
    if (user.value) user.value.wishlist = r.items
    return r.items
  }

  const isAuthed = computed(() => !!user.value)
  return { token, user, isAuthed, register, login, me, logout, updateProfile, changePassword, orders, bookings, inWishlist, toggleWishlist, authHeaders }
}
