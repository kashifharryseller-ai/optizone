import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { api, getUserToken, setUserToken } from '../api.js'

const AuthContext = createContext(null)

// Customer session state: profile, wishlist, login/register/logout.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [wishlist, setWishlist] = useState([])
  const [checking, setChecking] = useState(!!getUserToken())

  useEffect(() => {
    if (!getUserToken()) return
    let alive = true
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
    user, checking, wishlist,
    login, register, logout, updateProfile, toggleWishlist,
    inWishlist: (id) => wishlist.includes(id),
  }), [user, checking, wishlist, login, register, logout, updateProfile, toggleWishlist])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
