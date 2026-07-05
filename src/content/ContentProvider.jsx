import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { api } from '../api.js'
import { SEED_CONTENT, NAV } from '../data/seed.js'

const ContentContext = createContext(null)
const POLL_MS = 8000

// Provides the live site content (fetched from /api/content) and keeps it
// fresh: a lightweight version stamp is polled every few seconds and the page
// refetches whenever the admin saves changes — plus an immediate check when
// the tab regains focus. Falls back to the bundled seed if the API is down.
export function ContentProvider({ children }) {
  const [content, setContent] = useState(SEED_CONTENT)
  const [loading, setLoading] = useState(true)
  const verRef = useRef(null)

  useEffect(() => {
    let alive = true

    const load = () =>
      api.content()
        .then((c) => {
          if (alive && c && typeof c === 'object') {
            verRef.current = c.updatedAt || null
            setContent(c)
          }
        })
        .catch(() => { /* keep last good content */ })

    const checkVersion = async () => {
      try {
        const { v } = await api.contentVersion()
        if (alive && v && v !== verRef.current) await load()
      } catch { /* offline — try again next tick */ }
    }

    load().finally(() => { if (alive) setLoading(false) })

    const timer = setInterval(checkVersion, POLL_MS)
    const onFocus = () => checkVersion()
    const onVisible = () => { if (document.visibilityState === 'visible') checkVersion() }
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      alive = false
      clearInterval(timer)
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  return <ContentContext.Provider value={{ content, loading, nav: NAV }}>{children}</ContentContext.Provider>
}

export function useContent() {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContent must be used within a ContentProvider')
  return ctx
}
