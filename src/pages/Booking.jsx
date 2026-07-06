import React from 'react'
import { useLang } from '../i18n/index.jsx'
import { useContent } from '../content/ContentProvider.jsx'
import { CalendlyInline } from '../components/CalendlyInline.jsx'

// Calendly scheduling embed. The URL (with the pine-brand colours baked in) is
// editable from Admin → Stores & Settings; this is the default. The booking
// page is now the Calendly scheduler — pick a live slot with instant
// confirmation; the old manual date/time form has been removed.
const CALENDLY_URL = 'https://calendly.com/optizone-info?background_color=072b08&text_color=f9f1f1'

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

      {/* Calendly scheduler — the live slots + booking details render here */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '36px 28px 80px' }}>
        {calendlyUrl ? (
          <CalendlyInline url={calendlyUrl} height={760} loadingLabel={t.calendlyLoading} />
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '60px 0', fontSize: 15 }}>
            {t.calendlyOff} <a href={`tel:${phone}`} style={{ color: 'var(--amber-700)', fontWeight: 600 }}>{phone}</a>
          </p>
        )}
      </div>
    </div>
  )
}
