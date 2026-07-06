import React from 'react'
import { Panel, Row, Field, Text, Num, Toggle, ListEditor } from '../ui.jsx'

// Discounts & promotions — free-shipping threshold, shipping fee, and a list of
// promo codes. All saved with the global "Save changes" (content settings).
export default function Discounts({ content, setContent }) {
  const settings = content.settings || {}
  const setSettings = (patch) => setContent({ ...content, settings: { ...settings, ...patch } })
  const promos = settings.promos || []
  const setPromos = (v) => setSettings({ promos: v })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Panel title="Shipping & free-shipping" desc="Controls the cart threshold and the flat delivery fee shown at checkout.">
        <Row cols="1fr 1fr">
          <Field label="Free shipping over ₪"><Num value={settings.shippingThreshold} onChange={(v) => setSettings({ shippingThreshold: v })} /></Field>
          <Field label="Flat shipping fee ₪"><Num value={settings.shippingFee} onChange={(v) => setSettings({ shippingFee: v })} /></Field>
        </Row>
      </Panel>

      <Panel title="Promo codes" desc="Percentage-off codes customers can enter in the cart. Toggle a code off to pause it without deleting it.">
        <ListEditor
          items={promos}
          onChange={setPromos}
          addLabel="Add promo code"
          confirmRemove={(p) => `Remove the promo code "${p.code || 'untitled'}"? This can’t be undone after saving.`}
          makeNew={() => ({ code: '', percent: 10, active: true })}
          summary={(p) => (
            <>
              <span style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.08em', color: 'var(--text-strong)', fontSize: 14 }}>{p.code || 'NEW-CODE'}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 12.5 }}>{'  ·  '}{p.percent || 0}% off</span>
              {p.active === false && <span style={{ marginInlineStart: 8, fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', background: 'var(--ink-200)', color: 'var(--text-muted)', borderRadius: 999, padding: '3px 8px' }}>Paused</span>}
            </>
          )}
          render={(p, set) => (
            <Row cols="1fr 140px 120px">
              <Field label="Code"><Text value={p.code} onChange={(v) => set({ ...p, code: v.toUpperCase().replace(/\s+/g, '') })} /></Field>
              <Field label="Percent off"><Num value={p.percent} onChange={(v) => set({ ...p, percent: Math.min(100, Math.max(0, v)) })} /></Field>
              <Field label="Active"><Toggle checked={p.active !== false} onChange={(v) => set({ ...p, active: v })} label={p.active !== false ? 'On' : 'Paused'} /></Field>
            </Row>
          )}
        />
      </Panel>
    </div>
  )
}
