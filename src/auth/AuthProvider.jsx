import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { api, getUserToken, setUserToken } from '../api.js'

const AuthContext = createContext(null)

// Customer session state: profile, wishlist, login/register/logout.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [wishlist, setWishlist] = useState([])
  const [oauthError, setOauthError] = useState('')
  const [checking, setChecking] = useState(!!getUserToken())

  // On mount: pick up any "Continue with Google" result from the URL hash
  // (/#gtoken=<jwt> or /#gerror=<msg>), scrub it from the URL, then verify the
  // session. All side effects live in this effect (never in render), so React
  // StrictMode's double-invoke of the component body stays safe.
  useEffect(() => {
    let alive = true
    // Parse with URLSearchParams so malformed percent-encoding (e.g. "#gerror=%")
    // can't throw and abort initialization before the hash is scrubbed.
    const params = new URLSearchParams((window.location.hash || '').replace(/^#/, ''))
    const tok = params.get('gtoken')
    const err = params.get('gerror')
    if (tok) setUserToken(tok)
    if (err) setOauthError(err)
    if (tok || err) window.history.replaceState(null, '', window.location.pathname + window.location.search)

    if (!getUserToken()) { setChecking(false); return () => { alive = false } }
    setChecking(true)
    api.accountMe()
      .then(({ user: u }) => { if (alive) { setUser(u); setWishlist(u.wishlist || []) } })
      .catch(() => { if (alive) { setUserToken(null); setUser(null) } })
      .finally(() => { if (alive) setChecking(false) })
    return () => { alive = false }
  }, [])

  const applySession = useCallback(({ token, user: u }) => {
    setUserToken(token)
    setUser(u)
    setWishlist(u.wishlist || [])
  }, [])

  const login = useCallback(async (email, password) => applySession(await api.loginUser(email, password)), [applySession])
  const register = useCallback(async (data) => applySession(await api.register(data)), [applySession])
  // Sign in from a {token, user} response (used after a password reset).
  const resetSignIn = useCallback((sessionResponse) => applySession(sessionResponse), [applySession])
  const logout = useCallback(() => { setUserToken(null); setUser(null); setWishlist([]) }, [])

  const updateProfile = useCallback(async (patch) => {
    const { user: u } = await api.updateProfile(patch)
    setUser(u)
    return u
  }, [])

  const toggleWishlist = useCallback(async (productId) => {
    const { items } = await api.toggleWishlist(productId)
    setWishlist(items)
    return items
  }, [])

  const value = useMemo(() => ({
    user, checking, wishlist, oauthError,
    clearOauthError: () => setOauthError(''),
    login, register, resetSignIn, logout, updateProfile, toggleWishlist,
    inWishlist: (id) => wishlist.includes(id),
  }), [user, checking, wishlist, oauthError, login, register, resetSignIn, logout, updateProfile, toggleWishlist])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
