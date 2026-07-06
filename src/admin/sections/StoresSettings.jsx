import React from 'react'
import { Panel, Row, Field, Text, Num, Bilingual, ListEditor, StringList } from '../ui.jsx'

export default function StoresSettings({ content, setContent }) {
  const set = (patch) => setContent({ ...content, ...patch })
  const settings = content.settings || {}
  const contact = settings.contact || {}
  const setSettings = (patch) => set({ settings: { ...settings, ...patch } })
  const setContact = (patch) => setSettings({ contact: { ...contact, ...patch } })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Panel title="Branches" desc="Stores shown on the store-locator and booking pages.">
        <ListEditor
          items={content.stores || []}
          onChange={(v) => set({ stores: v })}
          addLabel="Add branch"
          confirmRemove={(b) => `Remove the "${b.name || 'unnamed'}" branch? It disappears from the store locator and booking pages after you save.`}
          makeNew={() => ({ name: 'New Branch', he: '', addr: '', phone: '', hours: { en: '', he: '' }, services: [], x: 35, y: 45 })}
          render={(st, setItem) => (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Row cols="1fr 1fr 1fr">
                <Field label="Name (EN)"><Text value={st.name} onChange={(v) => setItem({ ...st, name: v })} /></Field>
                <Field label="Name (עברית)"><Text value={st.he} onChange={(v) => setItem({ ...st, he: v })} dir="rtl" /></Field>
                <Field label="Phone"><Text value={st.phone} onChange={(v) => setItem({ ...st, phone: v })} /></Field>
              </Row>
              <Field label="Address"><Text value={st.addr} onChange={(v) => setItem({ ...st, addr: v })} dir="rtl" /></Field>
              <Bilingual label="Opening hours" value={st.hours} onChange={(v) => setItem({ ...st, hours: v })} />
              <Field label="Service tags"><StringList items={st.services || []} onChange={(v) => setItem({ ...st, services: v })} placeholder="Eye Exams" /></Field>
              <Row cols="1fr 1fr">
                <Field label="Map X %" hint="0–100 horizontal position of the pin"><Num value={st.x} onChange={(v) => setItem({ ...st, x: v })} /></Field>
                <Field label="Map Y %" hint="0–100 vertical position of the pin"><Num value={st.y} onChange={(v) => setItem({ ...st, y: v })} /></Field>
              </Row>
            </div>
          )}
        />
      </Panel>

      <Panel title="Booking services" desc="Options in the appointment booking flow.">
        <ListEditor items={content.bookingServices || []} onChange={(v) => set({ bookingServices: v })} addLabel="Add service"
          makeNew={() => ({ en: '', he: '' })} render={(s, setItem) => <Bilingual value={s} onChange={setItem} />} />
        <div style={{ marginTop: 16, borderTop: '1px solid var(--border-hair)', paddingTop: 16 }}>
          <Field label="Calendly scheduling link" hint="Your Calendly URL — opens from the Booking page badge/button (leave blank to hide online booking).">
            <Text value={settings.calendlyUrl} onChange={(v) => setSettings({ calendlyUrl: v })} placeholder="https://calendly.com/optizone" />
          </Field>
        </div>
      </Panel>

      <Panel title="Popular searches" desc="Suggestions shown in the search overlay.">
        <ListEditor items={content.popularSearches || []} onChange={(v) => set({ popularSearches: v })} addLabel="Add search"
          makeNew={() => ({ en: '', he: '' })} render={(s, setItem) => <Bilingual value={s} onChange={setItem} />} />
      </Panel>

      <Panel title="Catalog filters" desc="Filter groups and their values on the catalog page.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {Object.entries(content.filters || {}).map(([group, vals]) => (
            <Field key={group} label={group}>
              <StringList items={vals} onChange={(v) => set({ filters: { ...content.filters, [group]: v } })} placeholder="Value" />
            </Field>
          ))}
        </div>
      </Panel>

      <Panel title="Store settings">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Row cols="1fr 1fr 1fr">
            <Field label="Free-shipping over ₪"><Num value={settings.shippingThreshold} onChange={(v) => setSettings({ shippingThreshold: v })} /></Field>
            <Field label="Shipping fee ₪"><Num value={settings.shippingFee} onChange={(v) => setSettings({ shippingFee: v })} /></Field>
            <Field label="Brand name"><Text value={settings.brandName} onChange={(v) => setSettings({ brandName: v })} /></Field>
          </Row>
          <Row cols="1fr 1fr">
            <Field label="Contact phone"><Text value={contact.phone} onChange={(v) => setContact({ phone: v })} /></Field>
            <Field label="Website"><Text value={contact.site} onChange={(v) => setContact({ site: v })} /></Field>
          </Row>
          <Row cols="1fr 1fr">
            <Field label="Contact email"><Text value={contact.email} onChange={(v) => setContact({ email: v })} /></Field>
            <div />
          </Row>
          <Row cols="1fr 1fr">
            <Field label="Address (EN)"><Text value={contact.addressEn} onChange={(v) => setContact({ addressEn: v })} /></Field>
            <Field label="Address (עברית)"><Text value={contact.addressHe} onChange={(v) => setContact({ addressHe: v })} dir="rtl" /></Field>
          </Row>
          <Bilingual label="Footer blurb" value={settings.footerBlurb} onChange={(v) => setSettings({ footerBlurb: v })} area />
        </div>
      </Panel>
    </div>
  )
}
