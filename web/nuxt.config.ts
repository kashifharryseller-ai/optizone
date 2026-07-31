// OPTIZONE storefront — Nuxt 3 (SPA), served in production by the existing
// Express app; in dev, /api is proxied to Express. Palette + fonts come from the
// ported design tokens (assets/css). Lenis provides global smooth scroll.
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2025-01-01',
  devtools: { enabled: false },

  modules: ['@nuxtjs/tailwindcss', 'lenis/nuxt'],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'OPTIZONE — Vision & Style',
      htmlAttrs: { lang: 'en', dir: 'ltr' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
  },

  // Dev: proxy the API to the running Express server (set OZ_API to match).
  nitro: {
    devProxy: {
      '/api': { target: (process.env.OZ_API || 'http://127.0.0.1:5090') + '/api', changeOrigin: true },
      '/products': { target: process.env.OZ_API || 'http://127.0.0.1:5090', changeOrigin: true },
      '/site': { target: process.env.OZ_API || 'http://127.0.0.1:5090', changeOrigin: true },
      '/uploads': { target: process.env.OZ_API || 'http://127.0.0.1:5090', changeOrigin: true },
    },
  },

  tailwindcss: { cssPath: false, configPath: '~/tailwind.config.ts' },
})
