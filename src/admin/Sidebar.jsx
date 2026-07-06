import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Icon, GlassesMark } from '../ds/index.js'

/**
 * Sidebar — reusable, responsive admin navigation for OPTIZONE.
 *
 * Features: fixed full-height rail; collapse to a 64px icon rail (state owned by
 * the parent so it can persist); expandable sub-menu groups with animation;
 * amber active indicator (left border + tint); hover + focus-visible states;
 * tooltips when collapsed; order-count badge; footer profile chip with a
 * Profile/Logout dropdown and a language/RTL toggle; off-canvas drawer with a
 * dimmed overlay on mobile; full keyboard navigation (Tab + Arrow keys, Enter/
 * Space, Escape) and logical-property styling so it mirrors correctly in RTL.
 *
 * Props:
 *   menu          [{ id, label, icon, section?, query?, badgeKey?, children? }]
 *   activeSection current section key (drives the active highlight)
 *   badges        { [badgeKey]: number }
 *   collapsed, onToggleCollapse
 *   mobile, mobileOpen, onCloseMobile
 *   owner, role, onProfile, onLogout, onOpenStorefront
 *   dir ('ltr'|'rtl'), onToggleDir
 *   onNavigate(item)  called with the leaf item chosen
 */
export function Sidebar({
  menu = [], activeSection, activeId, badges = {},
  collapsed = false, onToggleCollapse,
  mobile = false, mobileOpen = false, onCloseMobile,
  owner = 'admin', role = 'Store owner', onProfile, onLogout, onOpenStorefront,
  dir = 'ltr', onToggleDir,
  onNavigate,
}) {
  const isCollapsed = collapsed && !mobile
  const railW = isCollapsed ? 68 : 244

  // The group that owns the currently-active leaf (by id), for auto-expand.
  const parentOfActive = useMemo(() => {
    for (const it of menu) if ((it.children || []).some((c) => c.id === activeId)) return it.id
    return null
  }, [menu, activeId])

  // Accordion: at most one group open at a time (keeps the rail compact).
  const [openGroups, setOpenGroups] = useState(() => new Set(parentOfActive ? [parentOfActive] : []))
  const [profileOpen, setProfileOpen] = useState(false)
  const [hovered, setHovered] = useState(null) // id for the collapsed-mode tooltip
  const navRef = useRef(null)
  const profileRef = useRef(null)

  // Keep the active item's group expanded.
  useEffect(() => {
    if (parentOfActive) setOpenGroups((s) => (s.has(parentOfActive) ? s : new Set([parentOfActive])))
  }, [parentOfActive])

  // Close the profile dropdown on outside click / Escape.
  useEffect(() => {
    if (!profileOpen) return
    const onDoc = (e) => { if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false) }
    const onKey = (e) => { if (e.key === 'Escape') setProfileOpen(false) }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey) }
  }, [profileOpen])

  const toggleGroup = (id) => setOpenGroups((s) => (s.has(id) ? new Set() : new Set([id])))

  const navigate = (item) => {
    onNavigate && onNavigate(item)
    if (mobile) onCloseMobile && onCloseMobile()
  }

  // Roving focus: Arrow keys move between the nav's focusable controls.
  const onNavKeyDown = (e) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    const items = Array.from(navRef.current.querySelectorAll('[data-navitem]'))
    const i = items.indexOf(document.activeElement)
    if (i === -1) return
    e.preventDefault()
    const next = e.key === 'ArrowDown' ? items[i + 1] : items[i - 1]
    if (next) next.focus()
  }

  const activeStyle = (on) => ({
    // amber left border + tinted background for the selected item
    boxShadow: on ? 'inset 3px 0 0 0 var(--amber-500)' : 'none',
    background: on ? 'rgba(224,138,42,0.14)' : 'transparent',
    color: on ? 'var(--cream-100)' : 'var(--pine-200)',
  })

  const rowBase = {
    display: 'flex', alignItems: 'center', gap: 12, width: '100%',
    padding: isCollapsed ? '12px 0' : '11px 14px', justifyContent: isCollapsed ? 'center' : 'flex-start',
    borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer', textAlign: 'start',
    fontFamily: 'var(--font-body)', fontSize: 14, position: 'relative',
    transition: 'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)',
  }

  const Badge = ({ n }) => (n > 0
    ? <span aria-label={`${n} new`} style={{ minWidth: 18, height: 18, padding: '0 5px', borderRadius: 999, background: 'var(--amber-600)', color: 'var(--pine-950)', fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{n > 99 ? '99+' : n}</span>
    : null)

  const Tooltip = ({ id, label }) => (isCollapsed && hovered === id
    ? <span role="tooltip" style={{ position: 'absolute', insetInlineStart: 'calc(100% + 10px)', top: '50%', transform: 'translateY(-50%)', whiteSpace: 'nowrap', background: 'var(--pine-950)', color: 'var(--cream-100)', fontSize: 12.5, padding: '6px 10px', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-md)', zIndex: 5, pointerEvents: 'none' }}>{label}</span>
    : null)

  // ── one top-level item (leaf or group) ──────────────────────────────────────
  const renderItem = (item) => {
    const hasKids = !!(item.children && item.children.length)
    const isOpen = openGroups.has(item.id)
    // active when this leaf is selected, or (for a group) one of its children is
    const activeHere = hasKids ? item.children.some((c) => c.id === activeId) : (item.id === activeId || item.section === activeSection)
    const badge = item.badgeKey ? badges[item.badgeKey] : 0

    const onClick = () => {
      if (hasKids && !isCollapsed) { toggleGroup(item.id); return }
      // leaf, or collapsed group → navigate to the item / its first child
      navigate(hasKids ? { ...item.children[0], parent: item.id } : item)
      if (hasKids) toggleGroup(item.id)
    }

    return (
      <li key={item.id} style={{ listStyle: 'none' }}>
        <button
          type="button"
          data-navitem
          onClick={onClick}
          onMouseEnter={() => setHovered(item.id)}
          onMouseLeave={() => setHovered((h) => (h === item.id ? null : h))}
          onFocus={() => setHovered(item.id)}
          onBlur={() => setHovered((h) => (h === item.id ? null : h))}
          aria-current={activeHere && !hasKids ? 'page' : undefined}
          aria-expanded={hasKids && !isCollapsed ? isOpen : undefined}
          title={isCollapsed ? item.label : undefined}
          style={{ ...rowBase, ...activeStyle(activeHere) }}
        >
          <span style={{ width: 20, display: 'inline-flex', justifyContent: 'center', flex: '0 0 auto' }}>
            <Icon name={item.icon} size={18} color={activeHere ? 'var(--amber-500)' : 'currentColor'} />
          </span>
          {!isCollapsed && <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>}
          {!isCollapsed && badge > 0 && <Badge n={badge} />}
          {!isCollapsed && hasKids && <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} size={15} color="currentColor" />}
          {/* collapsed: a dot marks a badge, tooltip shows the label */}
          {isCollapsed && badge > 0 && <span aria-hidden="true" style={{ position: 'absolute', top: 8, insetInlineEnd: 12, width: 8, height: 8, borderRadius: 999, background: 'var(--amber-600)' }} />}
          <Tooltip id={item.id} label={item.label} />
        </button>

        {/* animated sub-menu (expanded sidebar only) */}
        {hasKids && !isCollapsed && (
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', overflow: 'hidden', maxHeight: isOpen ? item.children.length * 42 + 6 : 0, transition: 'max-height var(--dur-base) var(--ease-out)' }}>
            {item.children.map((c) => {
              const on = c.id === activeId
              return (
                <li key={c.id} style={{ listStyle: 'none' }}>
                  <button
                    type="button"
                    data-navitem
                    onClick={() => navigate({ ...c, parent: item.id })}
                    aria-current={on ? 'page' : undefined}
                    style={{ ...rowBase, padding: '9px 14px 9px 46px', fontSize: 13.5, ...activeStyle(on) }}
                  >
                    <span style={{ width: 5, height: 5, borderRadius: 999, background: on ? 'var(--amber-500)' : 'var(--pine-400)', flex: '0 0 auto' }} />
                    <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </li>
    )
  }

  // ── the aside itself ────────────────────────────────────────────────────────
  const asideStyle = {
    width: railW, flex: '0 0 auto', background: 'var(--pine-800)', color: 'var(--cream-100)',
    display: 'flex', flexDirection: 'column', height: '100vh',
    transition: 'width var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out)',
    ...(mobile
      ? { position: 'fixed', top: 0, insetInlineStart: 0, zIndex: 70, width: 260, transform: mobileOpen ? 'none' : (dir === 'rtl' ? 'translateX(100%)' : 'translateX(-100%)'), boxShadow: mobileOpen ? 'var(--shadow-lg)' : 'none' }
      : { position: 'sticky', top: 0 }),
  }

  return (
    <>
      {/* dimmed overlay behind the mobile drawer */}
      {mobile && mobileOpen && (
        <div onClick={onCloseMobile} aria-hidden="true" style={{ position: 'fixed', inset: 0, background: 'rgba(15,34,26,0.55)', zIndex: 65 }} />
      )}

      <aside aria-label="Admin navigation" style={asideStyle}>
        {/* brand + collapse toggle */}
        <div style={{ padding: isCollapsed ? '20px 0 16px' : '20px 18px 16px', borderBottom: '1px solid var(--border-on-dark)', display: 'flex', alignItems: 'center', gap: 10, justifyContent: isCollapsed ? 'center' : 'space-between' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <GlassesMark size={22} color="var(--amber-500)" />
            {!isCollapsed && <span style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.18em', fontSize: 15 }}><span>OPTI</span><span style={{ color: 'var(--amber-500)' }}>ZONE</span></span>}
          </span>
          {!mobile && (
            <button type="button" onClick={onToggleCollapse} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} aria-pressed={collapsed}
              style={{ position: isCollapsed ? 'absolute' : 'static', insetInlineEnd: isCollapsed ? 8 : undefined, top: isCollapsed ? 22 : undefined, border: 'none', background: 'transparent', color: 'var(--pine-200)', cursor: 'pointer', padding: 4, display: 'inline-flex' }}>
              <Icon name={collapsed ? 'chevron-right' : 'chevron-left'} size={18} color="currentColor" />
            </button>
          )}
          {mobile && (
            <button type="button" onClick={onCloseMobile} aria-label="Close menu" style={{ border: 'none', background: 'transparent', color: 'var(--cream-100)', cursor: 'pointer', padding: 4, marginInlineStart: 'auto', display: 'inline-flex' }}>
              <Icon name="x" size={18} color="currentColor" />
            </button>
          )}
        </div>

        {/* nav */}
        <nav aria-label="Sections" ref={navRef} onKeyDown={onNavKeyDown} style={{ flex: 1, overflowY: 'auto', overflowX: 'visible', padding: isCollapsed ? '10px 8px' : '12px 12px' }}>
          <ul style={{ margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {menu.map(renderItem)}
          </ul>
        </nav>

        {/* footer: language/RTL toggle + profile chip */}
        <div style={{ borderTop: '1px solid var(--border-on-dark)', padding: isCollapsed ? '10px 8px' : '12px' }}>
          <button type="button" data-navitem onClick={onToggleDir} title={isCollapsed ? 'Language / RTL' : undefined}
            aria-label={`Switch layout direction (currently ${dir === 'rtl' ? 'right-to-left' : 'left-to-right'})`}
            onMouseEnter={() => setHovered('dir')} onMouseLeave={() => setHovered((h) => (h === 'dir' ? null : h))}
            style={{ ...rowBase, marginBottom: 6, color: 'var(--pine-200)' }}>
            <span style={{ width: 20, display: 'inline-flex', justifyContent: 'center', flex: '0 0 auto', fontFamily: 'var(--font-display)', fontSize: 12 }}>{dir === 'rtl' ? 'ע' : 'A'}</span>
            {!isCollapsed && <span style={{ flex: 1 }}>{dir === 'rtl' ? 'עברית · RTL' : 'English · LTR'}</span>}
            <Tooltip id="dir" label="Language / RTL" />
          </button>

          <div ref={profileRef} style={{ position: 'relative' }}>
            <button type="button" data-navitem onClick={() => setProfileOpen((o) => !o)} aria-haspopup="menu" aria-expanded={profileOpen}
              title={isCollapsed ? owner : undefined}
              onMouseEnter={() => setHovered('profile')} onMouseLeave={() => setHovered((h) => (h === 'profile' ? null : h))}
              style={{ ...rowBase, background: 'var(--pine-900)', color: 'var(--cream-100)' }}>
              <span aria-hidden="true" style={{ width: 30, height: 30, flex: '0 0 auto', borderRadius: 999, background: 'var(--amber-600)', color: 'var(--pine-950)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 14 }}>{(owner || 'A').trim()[0].toUpperCase()}</span>
              {!isCollapsed && (
                <span style={{ flex: 1, minWidth: 0, textAlign: 'start' }}>
                  <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--cream-100)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{owner}</span>
                  <span style={{ display: 'block', fontSize: 11, color: 'var(--pine-200)' }}>{role}</span>
                </span>
              )}
              {!isCollapsed && <Icon name={profileOpen ? 'chevron-up' : 'chevron-down'} size={14} color="var(--pine-200)" />}
              <Tooltip id="profile" label={owner} />
            </button>

            {profileOpen && (
              <div role="menu" style={{ position: 'absolute', bottom: 'calc(100% + 8px)', insetInlineStart: 0, minWidth: isCollapsed ? 200 : '100%', background: 'var(--surface-card)', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', overflow: 'hidden', zIndex: 6 }}>
                <button type="button" role="menuitem" onClick={() => { setProfileOpen(false); onProfile && onProfile() }} style={menuItemStyle}>
                  <Icon name="user" size={15} color="var(--pine-700)" /> Profile
                </button>
                <button type="button" role="menuitem" onClick={() => { setProfileOpen(false); onOpenStorefront && onOpenStorefront() }} style={menuItemStyle}>
                  <Icon name="store" size={15} color="var(--pine-700)" /> View storefront
                </button>
                <button type="button" role="menuitem" onClick={() => { setProfileOpen(false); onLogout && onLogout() }} style={{ ...menuItemStyle, color: 'var(--danger)', borderTop: '1px solid var(--border-hair)' }}>
                  <Icon name="log-out" size={15} color="var(--danger)" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}

const menuItemStyle = { display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '11px 16px', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'start', fontFamily: 'var(--font-body)', fontSize: 13.5, color: 'var(--text-body)' }
