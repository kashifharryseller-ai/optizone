import React, { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../api.js'
import { SEED_CONTENT, NAV } from '../data/seed.js'

const ContentContext = createContext(null)

// Provides the live site content (fetched from /api/content). Falls back to the
// bundled seed so the storefront always renders, even if the API is unreachable.
export function ContentProvider({ children }) {
  const [content, setContent] = useState(SEED_CONTENT)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    api.content()
      .then((c) => { if (alive && c && typeof c === 'object') setContent(c) })
      .catch(() => { /* keep seed */ })
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [])

  return <ContentContext.Provider value={{ content, loading, nav: NAV }}>{children}</ContentContext.Provider>
}

export function useContent() {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContent must be used within a ContentProvider')
  return ctx
}
