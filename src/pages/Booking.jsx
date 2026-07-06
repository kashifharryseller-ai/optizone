import React from 'react'
import { Button, Icon } from '../ds/index.js'
import { useLang } from '../i18n/index.jsx'
import { useContent } from '../content/ContentProvider.jsx'
import { CalendlyBadge, openCalendlyPopup } from '../components/Calendly.jsx'

// Calendly badge widget. Clicking the floating badge — or the in-page button —
// opens the Calendly popup with live slots + booking details. The URL is
// editable from Admin → Stores & Settings; these are the requested defaults.
const CALENDLY_URL = 'https://calendly.com/optizone'
const BADGE = { color: '#0069ff', textColor: '#ffffff', branding: true }

export function Booking() {
  const { t: root } = useLang()
  const { content } = useContent()
  const t = root.booking
  const settings = content.settings || {}
  const phone = (settings.contact || {}).phone || '058-644-2303'
  // Admin value when the field exists (blank = online booking hidden),
  // otherwise the requested default.
  const calendlyUrl = 'calendlyUrl' in settings ? settings.calendlyUrl : CALENDLY_URL

  return (
    <div>
      {/* page header */}
      <div style={{ background: 'var(--pine-700)', color: 'var(--cream-100)' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '46px 28px' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--amber-500)' }}>{t.eyebrow}</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 40, color: 'var(--cream-100)', margin: '10px 0 0' }}>{t.h1}</h1>
          <p style={{ margin: '12px 0 0', fontSize: 15, color: 'var(--pine-100)', maxWidth: 540, lineHeight: 1.6 }}>{t.calendlySub}</p>
        </div>
      </div>

      {/* Calendly — in-page CTA opens the popup; a floating badge stays available */}
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '60px 28px 96px', textAlign: 'center' }}>
        {calendlyUrl ? (
          <>
            <span style={{ width: 72, height: 72, borderRadius: 999, background: 'var(--pine-50)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
              <Icon name="calendar" size={34} color="var(--pine-700)" />
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 30, color: 'var(--text-strong)', margin: '20px 0 8px' }}>{t.calendlyH}</h2>
            <p style={{ fontSize: 15.5, color: 'var(--text-body)', lineHeight: 1.6, maxWidth: 460, margin: '0 auto 26px' }}>{t.calendlySub}</p>
            <Button variant="primary" size="lg" onClick={() => openCalendlyPopup(calendlyUrl)} startIcon={<Icon name="calendar" size={18} color="currentColor" />}>
              {t.calendlyCta}
            </Button>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 16 }}>{t.calendlyBadgeHint}</p>
            {/* floating "Schedule time with me" badge — text follows the language */}
            <CalendlyBadge url={calendlyUrl} text={t.calendlyCta} {...BADGE} />
          </>
        ) : (
          <p style={{ color: 'var(--text-muted)', padding: '20px 0', fontSize: 15 }}>
            {t.calendlyOff} <a href={`tel:${phone}`} style={{ color: 'var(--amber-700)', fontWeight: 600 }}>{phone}</a>
          </p>
        )}
      </div>
    </div>
  )
}
