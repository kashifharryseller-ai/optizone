import React, { useState } from 'react'

/** Tabs — underlined tab bar with amber active indicator. */
export function Tabs({ tabs = [], value, defaultValue, onChange, style, ...rest }) {
  const isControlled = value !== undefined
  const norm = tabs.map((t) => (typeof t === 'string' ? { value: t, label: t } : t))
  const [internal, setInternal] = useState(defaultValue ?? norm[0]?.value)
  const active = isControlled ? value : internal
  const select = (v) => {
    if (!isControlled) setInternal(v)
    onChange && onChange(v)
  }
  return (
    <div role="tablist" style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--border-hair)', flexWrap: 'wrap', ...style }} {...rest}>
      {norm.map((t) => {
        const on = t.value === active
        return (
          <button
            key={t.value}
            role="tab"
            aria-selected={on}
            onClick={() => select(t.value)}
            style={{ position: 'relative', border: 'none', background: 'transparent', cursor: 'pointer', padding: '12px 18px', marginBottom: -1, fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500, color: on ? 'var(--pine-800)' : 'var(--text-muted)', borderBottom: `2px solid ${on ? 'var(--amber-600)' : 'transparent'}`, transition: 'color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)' }}
          >
            {t.label}
          </button>
        )
      })}
    </div>
  )
}
