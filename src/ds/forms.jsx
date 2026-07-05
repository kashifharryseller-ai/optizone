import React, { useState, useId } from 'react'

/**
 * Button — OPTIZONE call-to-action. All-caps geometric label with wide tracking.
 * Primary = amber, Solid = pine, Outline, Ghost, Link.
 */
export function Button({ variant = 'primary', size = 'md', startIcon, endIcon, block = false, disabled = false, children, style, ...rest }) {
  const sizes = {
    sm: { padding: '0 16px', height: 38, fontSize: 12, gap: 8 },
    md: { padding: '0 24px', height: 46, fontSize: 13, gap: 10 },
    lg: { padding: '0 34px', height: 56, fontSize: 15, gap: 12 },
  }[size]
  const base = {
    display: block ? 'flex' : 'inline-flex', width: block ? '100%' : undefined,
    alignItems: 'center', justifyContent: 'center', gap: sizes.gap, height: sizes.height, padding: sizes.padding,
    fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: sizes.fontSize, letterSpacing: '0.16em',
    textTransform: 'uppercase', border: '1px solid transparent', borderRadius: 'var(--radius-sm)',
    cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1,
    transition: 'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)',
    whiteSpace: 'nowrap', userSelect: 'none',
  }
  const variants = {
    primary: { background: 'var(--amber-600)', color: 'var(--pine-950)', borderColor: 'var(--amber-600)' },
    solid: { background: 'var(--pine-700)', color: 'var(--cream-100)', borderColor: 'var(--pine-700)' },
    outline: { background: 'transparent', color: 'var(--pine-700)', borderColor: 'var(--pine-700)' },
    ghost: { background: 'transparent', color: 'var(--pine-700)', borderColor: 'transparent' },
    link: { background: 'transparent', color: 'var(--amber-700)', borderColor: 'transparent', height: 'auto', padding: 0, letterSpacing: '0.1em' },
  }[variant]
  const hover = {
    primary: { background: 'var(--amber-700)', borderColor: 'var(--amber-700)' },
    solid: { background: 'var(--pine-800)', borderColor: 'var(--pine-800)' },
    outline: { background: 'var(--pine-700)', color: 'var(--cream-100)' },
    ghost: { background: 'var(--pine-50)' },
    link: { color: 'var(--amber-800)' },
  }[variant]
  const [h, setH] = useState(false)
  const [p, setP] = useState(false)
  return (
    <button
      type="button"
      disabled={disabled}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => { setH(false); setP(false) }}
      onMouseDown={() => setP(true)}
      onMouseUp={() => setP(false)}
      style={{ ...base, ...variants, ...(h && !disabled ? hover : null), transform: p && !disabled ? 'translateY(1px)' : 'none', ...style }}
      {...rest}
    >
      {startIcon}
      {children}
      {endIcon}
    </button>
  )
}

/** Checkbox — square check with amber fill when selected. */
export function Checkbox({ checked, defaultChecked, onChange, label, disabled, id, style, ...rest }) {
  const isControlled = checked !== undefined
  const [internal, setInternal] = useState(!!defaultChecked)
  const on = isControlled ? checked : internal
  const reactId = useId()
  const cbId = id || reactId
  const toggle = () => {
    if (disabled) return
    if (!isControlled) setInternal(!on)
    onChange && onChange(!on)
  }
  return (
    <label htmlFor={cbId} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, ...style }}>
      <input id={cbId} type="checkbox" checked={on} onChange={toggle} disabled={disabled} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} {...rest} />
      <span style={{ width: 20, height: 20, borderRadius: 'var(--radius-xs)', border: `1.5px solid ${on ? 'var(--amber-600)' : 'var(--border-strong)'}`, background: on ? 'var(--amber-600)' : 'var(--white)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'all var(--dur-fast) var(--ease-out)', flex: '0 0 auto' }}>
        {on && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--pine-950)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        )}
      </span>
      {label && <span style={{ fontSize: 15, color: 'var(--text-body)' }}>{label}</span>}
    </label>
  )
}

/** IconButton — square/circular button for a single icon (cart, search, menu…). */
export function IconButton({ variant = 'ghost', size = 'md', round = false, disabled = false, children, style, ...rest }) {
  const dim = { sm: 34, md: 44, lg: 52 }[size]
  const variants = {
    ghost: { background: 'transparent', color: 'var(--pine-700)', border: '1px solid transparent' },
    outline: { background: 'transparent', color: 'var(--pine-700)', border: '1px solid var(--border-hair)' },
    solid: { background: 'var(--pine-700)', color: 'var(--cream-100)', border: '1px solid var(--pine-700)' },
    accent: { background: 'var(--amber-600)', color: 'var(--pine-950)', border: '1px solid var(--amber-600)' },
  }[variant]
  const hover = {
    ghost: { background: 'var(--pine-50)' },
    outline: { background: 'var(--pine-50)', borderColor: 'var(--pine-300)' },
    solid: { background: 'var(--pine-800)' },
    accent: { background: 'var(--amber-700)', borderColor: 'var(--amber-700)' },
  }[variant]
  const [h, setH] = useState(false)
  return (
    <button
      type="button"
      disabled={disabled}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: dim, height: dim, borderRadius: round ? '999px' : 'var(--radius-sm)', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, transition: 'background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)', ...variants, ...(h && !disabled ? hover : null), ...style }}
      {...rest}
    >
      {children}
    </button>
  )
}

/**
 * Input — text field with optional label, caps eyebrow style, helper/error text,
 * and leading/trailing adornments. RTL-aware.
 */
export function Input({ label, helper, error, startAdornment, endAdornment, size = 'md', id, style, containerStyle, ...rest }) {
  const heights = { sm: 40, md: 48, lg: 56 }[size]
  const [focus, setFocus] = useState(false)
  const reactId = useId()
  const inputId = id || reactId
  const borderColor = error ? 'var(--danger)' : focus ? 'var(--amber-600)' : 'var(--border-hair)'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...containerStyle }}>
      {label && (
        <label htmlFor={inputId} style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 500 }}>{label}</label>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: heights, padding: '0 14px', background: 'var(--white)', border: `1px solid ${borderColor}`, borderRadius: 'var(--radius-sm)', boxShadow: focus ? '0 0 0 3px var(--amber-100)' : 'none', transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)' }}>
        {startAdornment && <span style={{ display: 'inline-flex', color: 'var(--text-faint)' }}>{startAdornment}</span>}
        <input id={inputId} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--text-strong)', ...style }} {...rest} />
        {endAdornment && <span style={{ display: 'inline-flex', color: 'var(--text-faint)' }}>{endAdornment}</span>}
      </div>
      {(helper || error) && <span style={{ fontSize: 12.5, color: error ? 'var(--danger)' : 'var(--text-muted)' }}>{error || helper}</span>}
    </div>
  )
}

/** QuantityStepper — −/+ control for cart quantities. */
export function QuantityStepper({ value, defaultValue = 1, min = 1, max = 99, onChange, size = 'md', style, ...rest }) {
  const isControlled = value !== undefined
  const [internal, setInternal] = useState(defaultValue)
  const v = isControlled ? value : internal
  const dim = { sm: 34, md: 42 }[size] || 42
  const set = (next) => {
    const clamped = Math.max(min, Math.min(max, next))
    if (!isControlled) setInternal(clamped)
    onChange && onChange(clamped)
  }
  const btn = (label, onClick, dis) => (
    <button type="button" onClick={onClick} disabled={dis} aria-label={label === '−' ? 'decrease' : 'increase'} style={{ width: dim, height: dim, border: 'none', background: 'transparent', fontFamily: 'var(--font-display)', fontSize: 20, lineHeight: 1, color: dis ? 'var(--text-faint)' : 'var(--pine-700)', cursor: dis ? 'not-allowed' : 'pointer' }}>{label}</button>
  )
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-sm)', background: 'var(--white)', ...style }} {...rest}>
      {btn('−', () => set(v - 1), v <= min)}
      <span style={{ minWidth: dim, textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600, color: 'var(--text-strong)', borderInline: '1px solid var(--border-hair)', lineHeight: `${dim}px` }}>{v}</span>
      {btn('+', () => set(v + 1), v >= max)}
    </div>
  )
}

/** Select — native <select> styled to match Input, with caps label and chevron. */
export function Select({ label, helper, error, options = [], placeholder, size = 'md', id, style, containerStyle, ...rest }) {
  const heights = { sm: 40, md: 48, lg: 56 }[size]
  const [focus, setFocus] = useState(false)
  const reactId = useId()
  const selId = id || reactId
  const borderColor = error ? 'var(--danger)' : focus ? 'var(--amber-600)' : 'var(--border-hair)'
  const norm = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o))
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...containerStyle }}>
      {label && (
        <label htmlFor={selId} style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 500 }}>{label}</label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <select
          id={selId}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{ appearance: 'none', WebkitAppearance: 'none', width: '100%', height: heights, padding: '0 40px 0 14px', background: 'var(--white)', border: `1px solid ${borderColor}`, borderRadius: 'var(--radius-sm)', boxShadow: focus ? '0 0 0 3px var(--amber-100)' : 'none', fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--text-strong)', cursor: 'pointer', outline: 'none', transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)', ...style }}
          {...rest}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {norm.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', insetInlineEnd: 14, pointerEvents: 'none' }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
      {(helper || error) && <span style={{ fontSize: 12.5, color: error ? 'var(--danger)' : 'var(--text-muted)' }}>{error || helper}</span>}
    </div>
  )
}

/** Switch — pill toggle, amber when on. */
export function Switch({ checked, defaultChecked, onChange, label, disabled, id, style, ...rest }) {
  const isControlled = checked !== undefined
  const [internal, setInternal] = useState(!!defaultChecked)
  const on = isControlled ? checked : internal
  const reactId = useId()
  const swId = id || reactId
  const toggle = () => {
    if (disabled) return
    if (!isControlled) setInternal(!on)
    onChange && onChange(!on)
  }
  return (
    <label htmlFor={swId} style={{ display: 'inline-flex', alignItems: 'center', gap: 12, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, ...style }}>
      <input id={swId} type="checkbox" checked={on} onChange={toggle} disabled={disabled} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} {...rest} />
      <span style={{ width: 46, height: 26, borderRadius: 999, padding: 3, background: on ? 'var(--amber-600)' : 'var(--ink-300)', display: 'inline-flex', alignItems: 'center', transition: 'background var(--dur-base) var(--ease-out)', flex: '0 0 auto' }}>
        <span style={{ width: 20, height: 20, borderRadius: 999, background: 'var(--white)', boxShadow: 'var(--shadow-sm)', transform: on ? 'translateX(20px)' : 'translateX(0)', transition: 'transform var(--dur-base) var(--ease-out)' }} />
      </span>
      {label && <span style={{ fontSize: 15, color: 'var(--text-body)' }}>{label}</span>}
    </label>
  )
}
