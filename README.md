# OPTIZONE — Vision & Style

A full, clickable **OPTIZONE** eyewear storefront — premium eyeglasses, sunglasses,
contact lenses and eye-care services for the Israeli market, with a virtual
**Try Mirror** try-on, a lens/prescription configurator, in-store appointment
booking, and a complete **English / עברית** experience with full RTL support.

Built as a **Vite + React** app, recreated faithfully from the Claude Design
handoff bundle (the original HTML/CSS/JS prototype lives in [`project/`](./project)).

## Features

- **Storefront journey** — home, catalog (with live filters + sort), product
  detail (colourways, lens configurator, specs/reviews tabs), cart, multi-step
  checkout, booking flow, store locator, account login + dashboard, and a
  live search overlay.
- **Try Mirror** — camera-consent dialog and an animated virtual try-on mock.
- **Fully bilingual** — every page is translated EN ⇄ עברית; toggling the
  language flips the whole layout to RTL. The `OPTIZONE` wordmark and prices
  stay LTR within RTL text, per the brand guidelines.
- **Design system** — all 20 OPTIZONE components (Button, ProductCard, Price,
  Badge, Tabs, Dialog, …) ported to React with the brand's pine/amber/cream
  tokens, Jost + Assistant type, and the amber diamond-rule motif.
- **Fillable image slots** — hero, category and product photo placeholders
  accept a drag-and-drop / click-to-upload image, persisted in `localStorage`.
  Swap these for real product photography when available.
- **Self-contained** — React, Lucide icons and the Jost/Assistant fonts are all
  vendored locally (via npm / `@fontsource`); nothing loads from a CDN at runtime.

## Getting started

```bash
npm install
npm run dev       # start the dev server (http://localhost:5173)
npm run build     # production build → dist/
npm run preview   # preview the production build
```

## Project structure

```
src/
  main.jsx            App entry (mounts <App>, imports fonts + global CSS)
  App.jsx             Client-side router + cart / toast / language state
  i18n/               Bilingual string tables + <LangProvider> / useLang()
  data/catalog.js     Sample catalog, services, stores, orders (bilingual)
  ds/                 OPTIZONE design-system components (React port)
  pages/              Home, Catalog, Product, Booking, Cart, Checkout,
                      StoreLocator, Account, Search, Chrome (header/footer)
  components/         ImageSlot (fillable photo placeholder)
  lib/anim.jsx        Scroll-reveal, sticky-header and count-up helpers
  styles/             Design tokens (copied verbatim) + animations
project/              Original Claude Design export (reference / source of truth)
```

## Notes & next steps

- **Sample data.** Product names, prices, prescriptions and orders are
  placeholder content — replace the entries in `src/data/catalog.js` with real
  OPTIZONE inventory.
- **Try Mirror** is a visual mock; wire it to your on-device try-on / camera
  pipeline when ready.
- **Auth, payments and booking** are front-end flows only — connect them to
  your backend, payment gateway and scheduling system.
- **Fonts & icons** are stand-ins (Jost for the geometric wordmark face,
  Assistant for bilingual body, Lucide for line icons); swap in the licensed
  brand assets when available, as flagged in the design system.
