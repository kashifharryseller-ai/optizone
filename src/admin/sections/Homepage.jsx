import React from 'react'
import { Panel, Row, Field, Text, Toggle, Bilingual, ImageField, ListEditor, SelectField } from '../ui.jsx'

const ICONS = ['eye', 'glasses', 'circle-dot', 'target', 'layers', 'shield-check', 'camera', 'store', 'truck', 'heart']

export default function Homepage({ content, setContent }) {
  const set = (patch) => setContent({ ...content, ...patch })
  const hero = content.hero || {}
  const sec = content.sections || {}
  const media = content.media || {}
  const setHero = (k, v) => set({ hero: { ...hero, [k]: v } })
  const setSec = (group, k, v) => set({ sections: { ...sec, [group]: { ...(sec[group] || {}), [k]: v } } })
  const setMedia = (id, url) => set({ media: { ...media, [id]: url } })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Panel title="Announcement bar" desc="The thin strip at the very top of every page.">
        <div style={{ marginBottom: 12 }}><Toggle checked={content.announcement?.enabled !== false} onChange={(v) => set({ announcement: { ...content.announcement, enabled: v } })} label="Show announcement bar" /></div>
        <Bilingual value={content.announcement} onChange={(v) => set({ announcement: { ...content.announcement, ...v } })} />
      </Panel>

      <Panel title="Hero" desc="The main banner on the homepage.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Bilingual label="Eyebrow" value={hero.eyebrow} onChange={(v) => setHero('eyebrow', v)} />
          <Row cols="1fr 1fr 1fr">
            <Bilingual label="Title line 1" value={hero.titleA} onChange={(v) => setHero('titleA', v)} />
            <Bilingual label="Title line 2 (start)" value={hero.titleB} onChange={(v) => setHero('titleB', v)} />
            <Bilingual label="Title accent word" value={hero.titleC} onChange={(v) => setHero('titleC', v)} />
          </Row>
          <Bilingual label="Subtitle" value={hero.subtitle} onChange={(v) => setHero('subtitle', v)} area />
          <Row cols="1fr 1fr">
            <Bilingual label="Primary button" value={hero.ctaShop} onChange={(v) => setHero('ctaShop', v)} />
            <Bilingual label="Secondary button" value={hero.ctaBook} onChange={(v) => setHero('ctaBook', v)} />
          </Row>
          <Row cols="1fr 1fr">
            <Bilingual label="Trust line" value={hero.trusted} onChange={(v) => setHero('trusted', v)} />
            <Bilingual label="Photo badge" value={hero.tryReady} onChange={(v) => setHero('tryReady', v)} />
          </Row>
          <ImageField label="Hero photo" value={media['hero-photo']} onChange={(v) => setMedia('hero-photo', v)} />
        </div>
      </Panel>

      <Panel title="Section headings">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[['services', 'Services'], ['categories', 'Categories'], ['bestsellers', 'Bestsellers'], ['tryMirror', 'Try Mirror banner']].map(([key, name]) => (
            <div key={key} style={{ borderTop: '1px solid var(--border-hair)', paddingTop: 14 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-accent)', marginBottom: 10 }}>{name}</div>
              <Row cols="1fr 1fr">
                <Bilingual label="Eyebrow" value={sec[key]?.eyebrow} onChange={(v) => setSec(key, 'eyebrow', v)} />
                <Bilingual label="Title" value={sec[key]?.title} onChange={(v) => setSec(key, 'title', v)} />
              </Row>
              {key === 'bestsellers' && <div style={{ marginTop: 10 }}><Bilingual label="“View all” link" value={sec[key]?.viewall} onChange={(v) => setSec(key, 'viewall', v)} /></div>}
              {key === 'tryMirror' && (
                <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <Bilingual label="Subtitle" value={sec[key]?.subtitle} onChange={(v) => setSec(key, 'subtitle', v)} area />
                  <Bilingual label="Button" value={sec[key]?.cta} onChange={(v) => setSec(key, 'cta', v)} />
                </div>
              )}
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Services" desc="The six eye-care service tiles.">
        <ListEditor
          items={content.services || []}
          onChange={(v) => set({ services: v })}
          addLabel="Add service"
          makeNew={() => ({ icon: 'eye', title: { en: '', he: '' }, desc: { en: '', he: '' } })}
          render={(s, setItem) => (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Row cols="160px 1fr"><Field label="Icon"><SelectField value={s.icon} onChange={(v) => setItem({ ...s, icon: v })} options={ICONS} /></Field>
                <Bilingual label="Title" value={s.title} onChange={(v) => setItem({ ...s, title: v })} /></Row>
              <Bilingual label="Description" value={s.desc} onChange={(v) => setItem({ ...s, desc: v })} />
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
                  <Bilingual label="Page title" value={cp.title} onChange={(v) => setCp({ title: v })} />
                  <Bilingual label="Subtitle" value={cp.subtitle} onChange={(v) => setCp({ subtitle: v })} />
                </Row>
              </div>
            )
          })}
        </div>
      </Panel>

      <Panel title="Category tiles" desc="The three shop-by-category cards and their photos on the homepage.">
        <ListEditor
          items={content.categories || []}
          onChange={(v) => set({ categories: v })}
          addLabel="Add category"
          makeNew={() => ({ key: 'cat-' + Math.random().toString(36).slice(2, 7), label: { en: '', he: '' }, slot: { en: '', he: '' } })}
          render={(c, setItem) => (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Row cols="1fr 1fr">
                <Bilingual label="Label" value={c.label} onChange={(v) => setItem({ ...c, label: v })} />
                <Bilingual label="Empty-photo hint" value={c.slot} onChange={(v) => setItem({ ...c, slot: v })} />
              </Row>
              <ImageField label="Photo" value={media['cat-' + c.key]} onChange={(v) => setMedia('cat-' + c.key, v)} />
            </div>
          )}
        />
      </Panel>
    </div>
  )
}
