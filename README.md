# OPTIZONE — Vision & Style

A full-stack **OPTIZONE** eyewear store — premium eyeglasses, sunglasses, contact
lenses and eye-care services for the Israeli market, with a virtual **Try Mirror**
try-on, a lens/prescription configurator, in-store appointment booking, a complete
**English / עברית** experience with full RTL support, **and a connected admin
panel** for managing everything on the site.

- **Frontend:** Vite + React, built on the OPTIZONE design system.
- **Backend:** Node/Express + **MySQL** (with an automatic JSON-file fallback).
- **Deploys as one Node.js app** — ready for Hostinger Cloud Startup. See
  **[DEPLOY-HOSTINGER.md](./DEPLOY-HOSTINGER.md)**.

## One deployment = the whole site

The customer website and the admin panel ship together in a single deployment:

| URL path | What it serves |
|---|---|
| `/` | **Customer storefront** — home, catalog, product, cart, checkout, booking, stores, account |
| `/admin` | **Admin panel** — products, homepage content, stores/settings, orders, appointments |
| `/api/*` | JSON API used by both |

Admin sign-in is the **owner email + password**. Set `ADMIN_PASSWORD` (or
`ADMIN_PASSWORD_HASH`) in the environment to choose it. If you don't, a strong
random password is generated — **printed once to the server log in development**;
**in production it is not logged** (to keep credentials out of retained logs), so
set `ADMIN_PASSWORD` or use "Forgot password?" to enable admin sign-in. There is
no committed default password, and the app always boots. There is also an
optional **email OTP second step** — set `GMAIL_USER` + `GMAIL_APP_PASSWORD` env
vars to enable codes, and
use "Forgot password?" on the login screen to reset by emailed code. Content
saved in the admin panel appears on the live storefront **automatically**
(version polling + refresh-on-focus, no reload needed).

> **Admin ↔ website connection.** The admin writes to the store and the
> storefront reads from it, so they stay in sync **when they share one store**.
> On an always-on host (Hostinger) with **MySQL**, or any single Node process,
> this is automatic. On **serverless (Vercel) without a database**, each request
> can hit a different instance with its own temporary store, so admin edits may
> not appear on the site — set the `DB_*` env vars to **any** reachable MySQL
> (Hostinger, or a free cloud MySQL like Aiven/Railway/PlanetScale) and both
> sides share it. Existing stores are auto-migrated to the latest content shape
> on boot, so new fields are populated without losing your customizations.

### Deploy targets
- **Vercel (preview/demo):** import this repo at [vercel.com/new](https://vercel.com/new) —
  `vercel.json` configures the Vite build, the serverless API (`api/index.js`)
  and SPA routing automatically. Note: on Vercel, admin edits and uploads are
  **ephemeral** (serverless `/tmp`); use it to preview, not as the production store.
- **Hostinger / any Node host (production):** persistent MySQL + disk uploads.
  Follow [DEPLOY-HOSTINGER.md](./DEPLOY-HOSTINGER.md).

## Features

### Storefront
- Home, catalog (live filters + sort), product detail (colourways, lens
  configurator, specs/reviews), cart, multi-step checkout, booking, store
  locator, account login + dashboard, and a live search overlay.
- **Try Mirror** — camera-consent dialog and an animated virtual try-on mock.
- **Customer accounts** — register / sign in (bcrypt-hashed passwords, JWT
  sessions) **plus "Continue with Google"** (server-side OAuth code flow;
  set `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` env vars and register
  `https://YOUR-DOMAIN/api/auth/google/callback` as an authorized redirect URI
  in Google Cloud Console). A header account menu (My account ·
  My orders · My appointments · My wishlist · My settings · Sign out), a live
  account dashboard, server-side wishlist, profile & password settings, and
  checkout / booking prefilled from the profile.
- **Fully bilingual** — every page translated EN ⇄ עברית; the toggle flips the
  whole layout to RTL (the `OPTIZONE` wordmark and prices stay LTR).
- Checkout submits **real orders** and booking submits **real appointments** to
  the backend — linked to the signed-in customer and visible in both the
  customer's account and the admin panel.

### Admin panel (`/admin`)
A password-protected dashboard, styled with the OPTIZONE design system, that lets
the owner control the whole site — no code needed:
- **Products & catalog** — add/edit/reorder/delete frames: brand, name, price,
  sale price, rating, badges, colourways, Try-Mirror flag, shape/material/gender,
  and a product photo upload.
- **Homepage & content** — announcement bar, hero copy, section headings, the six
  services, and category tiles — all bilingual (EN + עברית) — plus hero and
  category photo uploads.
- **Stores & settings** — branches (address, hours, phone, map pin, service tags),
  booking services, popular searches, catalog filters, free-shipping threshold,
  contact details and footer copy.
- **Orders & appointments** — everything submitted through the site, with status
  updates and delete.
- **Customers** — every registered user with their orders, appointments, total
  spend and join date; search, disable (blocks sign-in) or delete accounts.

## Getting started (local)

```bash
npm install

# Option A — one command runs the API (5000) + Vite web (5173) together:
npm run dev:all
#   → storefront  http://localhost:5173
#   → admin       http://localhost:5173/admin   (owner email + password; see Admin → Security)

# Option B — production build served by the Node server on one port:
npm run build && npm start        # → http://localhost:3000  (and /admin)
```

With no `DB_*` env vars set, the app uses a local JSON store
(`server/data/db.json`) so it runs with zero setup. Copy `.env.example` → `.env`
to configure MySQL and admin credentials.

### Production checklist (required env vars)

All of these are documented with examples in [.env.example](.env.example) —
the admin **Security → Production readiness** panel shows live ✓/✗ status:

1. **`JWT_SECRET`** *(required — the server refuses to boot in production
   without it on a normal host; on serverless it falls back to a
   deployment-derived secret with a warning)*. Generate one:
   `openssl rand -hex 32`.
2. **Persistent database** — `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
   (+ optional `DB_PORT`). The MySQL store creates its tables automatically on
   first boot and seeds content; without it, serverless hosts (Vercel) keep
   data in **temporary per-instance storage** that resets on redeploys.
3. **Email OTP (two-step admin sign-in)** — `GMAIL_USER` +
   `GMAIL_APP_PASSWORD` (Google Account → Security → 2-Step Verification →
   App passwords). OTP turns on automatically once email works
   (`ADMIN_OTP=force|off` to override).
4. **`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`** — checkout address autocomplete
   (referrer-restricted browser key; optional, checkout degrades gracefully).

Health check: `GET /api/health` returns `{ ok, uptime, store: { driver,
ephemeral } }` for uptime monitors and deploy verification.

### Scripts
| Script | What it does |
|---|---|
| `npm run dev` | Vite dev server (frontend only) |
| `npm run dev:server` | Express API only (port 5000) |
| `npm run dev:all` | Both together (frontend proxies `/api` to the API) |
| `npm run build` | Build the frontend into `dist/` |
| `npm start` | Run the production server (`app.js`) — serves `dist/` + API |
| `npm run seed` | Reset site content to defaults (keeps orders/bookings) |

## Project structure

```
app.js                 Production entry (Hostinger "startup file") — serves dist/ + API
server/                Express API (CommonJS)
  config.js            Env-driven config
  app.js               App factory + start()
  auth.js              Admin JWT auth
  seed-data.js         Default site content (seed)
  store/               MySQL + JSON-file backends behind one interface
  routes/              public (content, orders, bookings) + admin (CRUD, upload)
src/                   Storefront (Vite + React)
  api.js               Fetch client for the API
  content/             ContentProvider — live site content
  i18n/                Bilingual UI strings (EN/עברית) + RTL
  ds/                  OPTIZONE design-system components
  pages/               Home, Catalog, Product, Booking, Cart, Checkout, …
  admin/               Admin panel (login, shell, section editors)
DEPLOY-HOSTINGER.md    Step-by-step Hostinger deployment guide
.env.example           All environment variables
```

## Notes

- **Storage.** MySQL when `DB_*` is set (tables auto-created + seeded on first
  boot); otherwise a JSON file. Uploaded images live in `server/data/uploads/`.
- **Sample data.** Products/prices are placeholder content — edit them in the
  admin panel or `server/seed-data.js`.
- **Fonts & icons** are stand-ins (Jost, Assistant, Lucide) vendored locally — no
  runtime CDN; swap in licensed brand assets when available.
