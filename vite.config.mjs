import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// OPTIZONE — Vite + React frontend.
// In production the Express server (app.js) serves the built dist/ at the domain
// root and exposes the API under /api. In dev, Vite runs on 5173 and proxies
// /api and /uploads to the Express server on 5000.
const API = process.env.VITE_API_TARGET || 'http://localhost:5000'

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': { target: API, changeOrigin: true },
      '/uploads': { target: API, changeOrigin: true },
    },
  },
  build: { outDir: 'dist', sourcemap: false },
})
