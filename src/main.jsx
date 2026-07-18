import React from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'motion/react'

// Jost — geometric display face (wordmark, headings, all-caps UI labels).
import '@fontsource/jost/300.css'
import '@fontsource/jost/400.css'
import '@fontsource/jost/500.css'
import '@fontsource/jost/600.css'
import '@fontsource/jost/700.css'
// Assistant — bilingual body/UI workhorse. Latin + Hebrew subsets (RTL).
import '@fontsource/assistant/300.css'
import '@fontsource/assistant/400.css'
import '@fontsource/assistant/500.css'
import '@fontsource/assistant/600.css'
import '@fontsource/assistant/700.css'
import '@fontsource/assistant/hebrew-300.css'
import '@fontsource/assistant/hebrew-400.css'
import '@fontsource/assistant/hebrew-500.css'
import '@fontsource/assistant/hebrew-600.css'
import '@fontsource/assistant/hebrew-700.css'
// Cairo — Arabic (+ Latin) face for the Arabic locale (RTL). Vendored, no CDN.
import '@fontsource/cairo/arabic-400.css'
import '@fontsource/cairo/arabic-600.css'
import '@fontsource/cairo/arabic-700.css'

import './styles/index.css'
import App from './App.jsx'
import { LangProvider } from './i18n/index.jsx'
import { ContentProvider } from './content/ContentProvider.jsx'
import { AuthProvider } from './auth/AuthProvider.jsx'
import AdminApp from './admin/AdminApp.jsx'

const isAdmin = window.location.pathname.replace(/\/+$/, '').startsWith('/admin')

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user">
      {isAdmin ? (
        <AdminApp />
      ) : (
        <LangProvider defaultLang="en">
          <ContentProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </ContentProvider>
        </LangProvider>
      )}
    </MotionConfig>
  </React.StrictMode>,
)
