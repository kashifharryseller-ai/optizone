import React, { useEffect, useRef, useState } from 'react'
import { Panel, Row, Field, Toggle, Bilingual, ListEditor, SelectField, UploadField, Btn } from '../ui.jsx'
import { Icon } from '../../ds/index.js'

const ICONS = ['eye', 'glasses', 'circle-dot', 'target', 'layers', 'shield-check', 'camera', 'store', 'truck', 'heart']

// Character limits per field type — enforced with live counters. Chosen from
// what each storefront slot can display without wrapping/overflow.
const MAX = { eyebrow: 40, titleLine: 24, accent: 20, button: 26, announcement: 120, subtitle: 240, sectionTitle: 60, short: 60, svcTitle: 40, svcDesc: 160, tileLabel: 30 }

/**
 * Live storefront preview — a real storefront iframe fed the CURRENT unsaved
 * content over postMessage (same-origin), with EN/HE and desktop/mobile
 * switches. Nothing is persisted until Save.
 */
function PreviewDrawer({ content, onClose }) {
  const frameRef = useRef(null)
  const [lang, setLang] = useState('en')
  const [device, setDevice] = useState('mobile') // mobile fits the drawer 1:1
  const post = (msg) => { try { frameRef.current?.contentWindow?.postMessage(msg, window.location.origin) } catch { /* frame not ready */ } }

  // Push content on every edit (debounced) and once when the frame loads.
  useEffect(() => {
    const t = setTimeout(() => post({ type: 'oz-preview', content }), 250)
    return () => clearTimeout(t)
  }, [content]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { post({ type: 'oz-preview-lang', lang }) }, [lang]) // eslint-disable-line react-hooks/exhaustive-deps
  // Handshake: the iframe announces when its React app has mounted — resend
  // the current state then (covers posts that raced the iframe boot).
  const latest = useRef(null)
  latest.current = { content, lang }
  useEffect(() => {
    const onMsg = (e) => {
      if (e.origin !== window.location.origin || e.data?.type !== 'oz-preview-ready') return
      post({ type: 'oz-preview', content: latest.current.content })
      post({ type: 'oz-preview-lang', lang: latest.current.lang })
    }
    window.addEventListener('message', onMsg)
    return () => window.removeEventListener('message', onMsg)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const drawerW = 430
  const deviceW = device === 'mobile' ? 390 : 1280
  const scale = Math.min(1, (drawerW - 24) / deviceW)

  const seg = (active) => ({
    padding: '5px 12px', borderRadius: 999, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-display)',
    fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase',
    background: active ? 'var(--amber-600)' : 'transparent', color: active ? 'var(--pine-950)' : 'var(--pine-200)',
  })

  return (
    <aside aria-label="Live storefront preview" style={{ position: 'fixed', top: 0, insetInlineEnd: 0, bottom: 0, width: drawerW, zIndex: 80, background: 'var(--pine-800)', borderInlineStart: '1px solid var(--border-on-dark)', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-lg)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', color: 'var(--cream-100)' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--amber-500)' }}>Live preview</span>
        <span style={{ display: 'flex', gap: 2, background: 'var(--pine-900)', borderRadius: 999, padding: 3, marginInlineStart: 'auto' }}>
          <button type="button" style={seg(lang === 'en')} onClick={() => setLang('en')}>EN</button>
          <button type="button" style={seg(lang === 'he')} onClick={() => setLang('he')}>עברית</button>
        </span>
        <span style={{ display: 'flex', gap: 2, background: 'var(--pine-900)', borderRadius: 999, padding: 3 }}>
          <button type="button" style={seg(device === 'mobile')} onClick={() => setDevice('mobile')} aria-label="Mobile preview">📱</button>
          <button type="button" style={seg(device === 'desktop')} onClick={() => setDevice('desktop')} aria-label="Desktop preview">🖥</button>
        </span>
        <button type="button" onClick={onClose} aria-label="Close preview" style={{ border: 'none', background: 'transparent', color: 'var(--cream-100)', cursor: 'pointer', fontSize: 18, padding: 2 }}>×</button>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '0 12px 12px' }}>
        <div style={{ width: deviceW * scale, height: `calc(100% - 2px)`, margin: '0 auto', overflow: 'hidden', borderRadius: 10, border: '1px solid var(--border-on-dark)', background: '#fff' }}>
          <iframe
            ref={frameRef}
            title="Storefront preview"
            src="/?ozPreview=1"
            onLoad={() => { post({ type: 'oz-preview', content }); post({ type: 'oz-preview-lang', lang }) }}
            style={{ width: deviceW, height: `${100 / scale}%`, border: 'none', transform: `scale(${scale})`, transformOrigin: 'top left', display: 'block' }}
          />
        </div>
      </div>
    </aside>
  )
}

export default function Homepage({ content, setContent }) {
  const set = (patch) => setContent({ ...content, ...patch })
  const hero = content.hero || {}
  const sec = content.sections || {}
  const media = content.media || {}
  const mediaAlt = content.mediaAlt || {}
  const setHero = (k, v) => set({ hero: { ...hero, [k]: v } })
  const setSec = (group, k, v) => set({ sections: { ...sec, [group]: { ...(sec[group] || {}), [k]: v } } })
  const setMedia = (id, url) => set({ media: { ...media, [id]: url } })
  const setAlt = (id, v) => set({ mediaAlt: { ...mediaAlt, [id]: v } })
  const [preview, setPreview] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingInlineEnd: preview ? 430 : 0, transition: 'padding var(--dur-base) var(--ease-out)' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Btn variant={preview ? 'primary' : 'outline'} size="sm" onClick={() => setPreview((p) => !p)} aria-pressed={preview}>
          <Icon name="eye" size={14} color="currentColor" /> {preview ? 'Close live preview' : 'Live preview'}
        </Btn>
      </div>

      <Panel title="Announcement bar" desc="The thin strip at the very top of every page.">
        <div style={{ marginBottom: 12 }}><Toggle checked={content.announcement?.enabled !== false} onChange={(v) => set({ announcement: { ...content.announcement, enabled: v } })} label="Show announcement bar" /></div>
        <Bilingual label="Announcement" value={content.announcement} onChange={(v) => set({ announcement: { ...content.announcement, ...v } })} max={MAX.announcement} />
      </Panel>

      <Panel title="Hero" desc="The main banner on the homepage.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Bilingual label="Eyebrow" value={hero.eyebrow} onChange={(v) => setHero('eyebrow', v)} max={MAX.eyebrow} />
          <Row cols="1fr 1fr 1fr">
            <Bilingual label="Title line 1" value={hero.titleA} onChange={(v) => setHero('titleA', v)} max={MAX.titleLine} />
            <Bilingual label="Title line 2 (start)" value={hero.titleB} onChange={(v) => setHero('titleB', v)} max={MAX.titleLine} />
            <Bilingual label="Title accent word" value={hero.titleC} onChange={(v) => setHero('titleC', v)} max={MAX.accent} />
          </Row>
          <Bilingual label="Subtitle" value={hero.subtitle} onChange={(v) => setHero('subtitle', v)} area max={MAX.subtitle} />
          <Row cols="1fr 1fr">
            <Bilingual label="Primary button" value={hero.ctaShop} onChange={(v) => setHero('ctaShop', v)} max={MAX.button} />
            <Bilingual label="Secondary button" value={hero.ctaBook} onChange={(v) => setHero('ctaBook', v)} max={MAX.button} />
          </Row>
          <Row cols="1fr 1fr">
            <Bilingual label="Trust line" value={hero.trusted} onChange={(v) => setHero('trusted', v)} max={MAX.short} />
            <Bilingual label="Photo badge" value={hero.tryReady} onChange={(v) => setHero('tryReady', v)} max={MAX.short} />
          </Row>
          <UploadField
            label="Hero photo"
            value={media['hero-photo']}
            onChange={(v) => setMedia('hero-photo', v)}
            aspect={4 / 3} recommend="1200 × 900 px" targetW={1200}
            alt={mediaAlt['hero-photo']} onAlt={(v) => setAlt('hero-photo', v)}
          />
        </div>
      </Panel>

      <Panel title="Section headings">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[['services', 'Services'], ['categories', 'Categories'], ['bestsellers', 'Bestsellers'], ['tryMirror', 'Try Mirror banner']].map(([key, name]) => (
            <div key={key} style={{ borderTop: '1px solid var(--border-hair)', paddingTop: 14 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-accent)', marginBottom: 10 }}>{name}</div>
              <Row cols="1fr 1fr">
                <Bilingual label="Eyebrow" value={sec[key]?.eyebrow} onChange={(v) => setSec(key, 'eyebrow', v)} max={MAX.eyebrow} />
                <Bilingual label="Title" value={sec[key]?.title} onChange={(v) => setSec(key, 'title', v)} max={MAX.sectionTitle} />
              </Row>
              {key === 'bestsellers' && <div style={{ marginTop: 10 }}><Bilingual label="“View all” link" value={sec[key]?.viewall} onChange={(v) => setSec(key, 'viewall', v)} max={MAX.button} /></div>}
              {key === 'tryMirror' && (
                <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <Bilingual label="Subtitle" value={sec[key]?.subtitle} onChange={(v) => setSec(key, 'subtitle', v)} area max={MAX.subtitle} />
                  <Bilingual label="Button" value={sec[key]?.cta} onChange={(v) => setSec(key, 'cta', v)} max={MAX.button} />
                </div>
              )}
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Services" desc="The six eye-care service tiles. Drag the ⋮⋮ handle (or focus it and press ↑/↓) to reorder.">
        <ListEditor
          items={content.services || []}
          onChange={(v) => set({ services: v })}
          addLabel="Add service"
          dragReorder
          confirmRemove={(s) => `Remove the "${s.title?.en || 'untitled'}" service tile? It disappears from the homepage after you save.`}
          makeNew={() => ({ icon: 'eye', title: { en: '', he: '' }, desc: { en: '', he: '' } })}
          render={(s, setItem) => (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Row cols="160px 1fr"><Field label="Icon"><SelectField value={s.icon} onChange={(v) => setItem({ ...s, icon: v })} options={ICONS} /></Field>
                <Bilingual label="Title" value={s.title} onChange={(v) => setItem({ ...s, title: v })} max={MAX.svcTitle} /></Row>
              <Bilingual label="Description" value={s.desc} onChange={(v) => setItem({ ...s, desc: v })} area max={MAX.svcDesc} />
            </div>
          )}
        />
      </Panel>

      <Panel title="Category pages" desc="The header (title + subtitle) shown at the top of each navbar page — Eyeglasses, Sunglasses, Contact Lenses.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[['eyeglasses', 'Eyeglasses page'], ['sunglasses', 'Sunglasses page'], ['contacts', 'Contact Lenses page']].map(([key, name]) => {
            const cp = (content.categoryPages || {})[key] || {}
            const setCp = (patch) => set({ categoryPages: { ...(content.categoryPages || {}), [key]: { ...cp, ...patch } } })
            return (
              <div key={key} style={{ borderTop: '1px solid var(--border-hair)', paddingTop: 14 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-accent)', marginBottom: 10 }}>{name}</div>
                <Row cols="1fr 1fr">
                  <Bilingual label="Page title" value={cp.title} onChange={(v) => setCp({ title: v })} max={MAX.sectionTitle} />
                  <Bilingual label="Subtitle" value={cp.subtitle} onChange={(v) => setCp({ subtitle: v })} area max={MAX.subtitle} />
                </Row>
              </div>
            )
          })}
        </div>
      </Panel>

      <Panel title="Category tiles" desc="The three shop-by-category cards and their photos on the homepage. Drag the ⋮⋮ handle to reorder.">
        <ListEditor
          items={content.categories || []}
          onChange={(v) => set({ categories: v })}
          addLabel="Add category"
          dragReorder
          confirmRemove={(c) => `Remove the "${c.label?.en || 'untitled'}" category tile? Its photo assignment is kept in Media if you re-add it later.`}
          makeNew={() => ({ key: 'cat-' + Math.random().toString(36).slice(2, 7), label: { en: '', he: '' }, slot: { en: '', he: '' } })}
          render={(c, setItem) => (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Row cols="1fr 1fr">
                <Bilingual label="Label" value={c.label} onChange={(v) => setItem({ ...c, label: v })} max={MAX.tileLabel} />
                <Bilingual label="Empty-photo hint" value={c.slot} onChange={(v) => setItem({ ...c, slot: v })} max={MAX.short} />
              </Row>
              <UploadField
                label="Photo"
                value={media['cat-' + c.key]}
                onChange={(v) => setMedia('cat-' + c.key, v)}
                aspect={3 / 2} recommend="900 × 600 px" targetW={900}
                alt={mediaAlt['cat-' + c.key]} onAlt={(v) => setAlt('cat-' + c.key, v)}
              />
            </div>
          )}
        />
      </Panel>

      {preview && <PreviewDrawer content={content} onClose={() => setPreview(false)} />}
    </div>
  )
}
