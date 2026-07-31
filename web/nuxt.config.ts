// OPTIZONE storefront — Nuxt 3 (SPA), served in production by the existing
// Express app; in dev, /api is proxied to Express. Palette + fonts come from the
// ported design tokens (assets/css). Lenis provides global smooth scroll.
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2025-01-01',
  devtools: { enabled: false },

  modules: ['@nuxtjs/tailwindcss', 'lenis/nuxt'],

  // Resolve components/ui/* by filename (no "Ui" prefix) — shadcn-vue / Inspira
  // convention, so <AuroraBackground>, <Marquee>, <Button> work directly.
  components: [{ path: '~/components', pathPrefix: false }],

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

  // Dev: proxy the API + static asset dirs to the running Express server (set
  // OZ_API to match). Nitro's devProxy strips the matched prefix before hitting
  // the target, so each target must re-include its own prefix (as /api does) or
  // the path segment is dropped and the request falls through to the SPA shell.
  //
  // NOTE: /brands is deliberately NOT proxied — it's also a page route, and the
  // proxy would swallow it. Brand images are served from web/public/brands
  // instead (real files win over the page route, and they ship with the build).
  nitro: {
    // SPA (ssr:false): emit only the app shell (index.html / 200.html). Express
    // serves every route via its SPA fallback, so we don't want per-route
    // directories (they'd 301 on the trailing slash).
    prerender: { crawlLinks: false, routes: ['/'] },
    devProxy: {
      '/api': { target: (process.env.OZ_API || 'http://127.0.0.1:5090') + '/api', changeOrigin: true },
      '/products': { target: (process.env.OZ_API || 'http://127.0.0.1:5090') + '/products', changeOrigin: true },
      '/site': { target: (process.env.OZ_API || 'http://127.0.0.1:5090') + '/site', changeOrigin: true },
      '/uploads': { target: (process.env.OZ_API || 'http://127.0.0.1:5090') + '/uploads', changeOrigin: true },
    },
  },

  tailwindcss: { cssPath: false, configPath: '~/tailwind.config.ts' },
})
