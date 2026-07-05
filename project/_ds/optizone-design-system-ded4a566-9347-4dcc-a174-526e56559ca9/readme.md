# OPTIZONE — Design System

**OPTIZONE — "Vision & Style"** is a premium optical retailer for the Israeli market: eyeglasses, sunglasses, contact lenses and eye-care services, sold online with a first-class virtual **"Try Mirror"** try-on, prescription/lens configurator, and in-store appointment booking. The storefront is **mobile-first and fully bilingual — Hebrew/RTL primary**, with English and Arabic toggles.

This design system captures the OPTIZONE brand — deep pine green, warm amber-orange, cream, a geometric all-caps wordmark and a round-glasses mark — as reusable tokens, components, UI kits and specimen cards.

## Sources used
- **Brand collateral photos** (WhatsApp, 2026-07-05): pine-green coffee cups and shopping bags carrying the full OPTIZONE logo lockup, tagline, service icon column, and contact block. Saved to `uploads/ref1–ref3.jpeg`. These are the ground truth for color, logo, typography and iconography.
- **Brand video** `uploads/WhatsApp Video 2026-07-05 at 1.12.09 AM.mp4` — motion/brand film (not frame-analyzed in depth; see Caveats).
- **SRS** — a full Software Requirements Specification for the OPTIZONE e-commerce + booking + Try Mirror website (roles, functional/non-functional requirements, data & media architecture, integrations). This defines the *product surfaces* the UI kits recreate.

There is **no source codebase or Figma** — the visual system is reconstructed faithfully from the collateral and the SRS.

---

## CONTENT FUNDAMENTALS — how OPTIZONE writes

**Voice:** confident, boutique, service-led. Premium but warm and human — an optician who knows style, not a discount chain. Reassuring around eye health; aspirational around frames.

**Bilingual, Hebrew-first.** Hebrew (RTL) is the primary layout; English and Arabic are toggles. English copy is used for the brand line and international polish; Hebrew for the shopping journey.

- **Wordmark & tagline** are fixed English lockups: `OPTIZONE` (all-caps) and `VISION & STYLE` (all-caps, wide-tracked, sits under an amber diamond rule). Never translate or re-case these.
- **Casing:** ALL-CAPS with wide tracking for the wordmark, eyebrows, nav labels, and buttons feels on-brand. Sentence case for body copy and product descriptions. Headlines are Title Case or all-caps display.
- **Person:** speaks *to* the customer — "your prescription", "try it on", "book your exam" / בזמן אמת, "שלך". Warm second person; the brand refers to itself as OPTIZONE, rarely "we".
- **Service vocabulary** (from the bag icon column, Hebrew): בדיקות ראיה (eye exams), משקפי ראיה ושמש (prescription & sun glasses), עדשות מגע (contact lenses), שליטה בקוצר ראיה (myopia control), מומחים למולטיפוקל (multifocal experts), מומחים לטיפול בקרטוקונוס (keratoconus care). Use this exact service framing.
- **Numbers & units:** prices in shekels `₪`, RTL-aware dates, phone `058-644-2303`, site `www.optizone.co.il`.
- **Emoji:** none. The brand never uses emoji. Meaning is carried by thin line icons and the amber diamond motif.
- **Punctuation flourish:** the small **amber diamond (◆ rotated square)** flanked by hairlines is the brand's signature separator — the typographic equivalent of a full stop. Use it between the wordmark and tagline and as a section divider.

**Example microcopy**
- CTA: `TRY MIRROR` · `BOOK AN EYE EXAM` · `ADD TO CART` · (He) `נסה עכשיו`, `קבע תור`
- Eyebrow: `NEW · 2026 COLLECTION`
- Reassurance: "No card needed to reserve — complete your fitting in-store."

---

## VISUAL FOUNDATIONS

**Palette.** Deep **pine green** `--pine-700 #274A3B` (calibrated to the OPTIZONE logo/packaging green) is the primary/brand surface (packaging, dark sections, footer). Warm **amber-orange** `--amber-600 #E08A2A` is the single accent — foil lines, the diamond, active states, price highlights, the "ZONE" of the wordmark. **Cream** `--cream-200 #F5F0E4` is the light page background; white cards sit on it. White hairlines detail the pine surfaces. The palette is warm, earthy and restrained — two brand hues plus cream, never more. Backgrounds are **flat color**, not gradients.

**Imagery vibe.** Product/lifestyle imagery is warm-toned, softly lit, editorial. Packaging photography reads dark, moody, luxe (pine on marble). No cold blue casts, no heavy grain. Full-bleed hero imagery pairs with pine or cream overlays; product shots sit on clean cream/white.

**Typography.** Geometric all-caps display (**Jost**, standing in for the logo's Futura-like face) with wide tracking for the wordmark, eyebrows, nav and buttons. Body and UI in **Assistant** (bilingual Latin + Hebrew). Big generous headings; airy tracking on caps; comfortable body line-height (1.45). The wordmark tracking is a dramatic `0.28em`.

**Spacing & layout.** 4px base scale, generous whitespace, boutique breathing room. Centered lockups (mark over wordmark over tagline). Content max ~1240px. Mobile-first; hit targets ≥44px.

**Corners & cards.** Restrained radii — cards `10px`, inputs `6–10px`, rarely fully pill except tags/toggles. Cards are **white on cream with a hairline border and a soft warm low shadow** (`--shadow-sm/md`), not heavy. Premium = crisp edges + soft shadow, not big rounding.

**Borders & rules.** Hairline `1px` borders in warm neutral. The signature **amber rule** — a thin line, or two lines flanking a diamond — divides sections and underlines the wordmark. On packaging, a white hairline + amber band runs along the base; echo that as a footer/section device.

**Shadows.** Soft, warm-tinted, low-spread (`rgba(22,19,14,·)`). On pine surfaces use the deeper `--shadow-dark`. No hard black drop shadows, no neon glows.

**Motion.** Understated and elegant. Fades and short slides with an ease-out curve (`--ease-out`), `140–380ms`. No bounce, no spring, no attention-seeking loops. Hover = gentle lift or amber underline reveal; transitions feel calm.

**States.** Hover: primary buttons darken slightly (pine→pine-800) or amber→amber-700; ghost/link items reveal an amber underline or shift to amber text. Press: subtle darken + `translateY(1px)` / `scale(0.99)`. Focus: `3px` amber focus ring, `2px` offset — visible for accessibility (IS 5568 / WCAG AA). Disabled: reduced opacity, no shadow.

**Transparency & blur.** Sparingly. Sticky headers may use a translucent cream/pine with slight backdrop blur. Scrims over hero imagery use pine at ~55% (`--overlay-scrim`). No frosted-glass everywhere.

**RTL.** Layout mirrors for Hebrew; the amber diamond rule, icons and lockups are symmetric and read the same both directions. Numerals and the English wordmark stay LTR within RTL text.

---

## ICONOGRAPHY

- **Style:** thin, single-weight **line icons**, rounded caps, generous negative space — matching the service-icon column on the OPTIZONE bag (eye, glasses, sunglasses, contact lens, focus target, multifocal venn, keratoconus care). Amber or white on pine; ink on cream. Consistent ~1.75–2px stroke at 24px.
- **Source:** the brand's own icons are bespoke line drawings; there is **no icon font in the provided assets**. We substitute **[Lucide](https://lucide.dev)** (loaded from CDN) as the closest match — same thin, rounded, single-weight line style — for generic UI glyphs (cart, search, user, chevrons, map-pin, calendar, etc.). **Flagged substitution** — replace with OPTIZONE's own SVG set when available. A small set of brand-specific glyphs (glasses, eye-exam, contact-lens, try-mirror) is drawn to match Lucide's stroke and lives in `assets/icons/`.
- **The glasses mark** (`assets/glasses-mark.svg`) is a reconstructed round-eyeglasses line mark (two circles + bridge + temples) — the brand's primary symbol, used with or without the wordmark.
- **The diamond** (rotated square) is used as a bullet/separator, not a full icon.
- **Emoji / unicode icons:** never used.

---

## Caveats
- **Font substitution:** the logo's exact typeface isn't provided; **Jost** (Google Fonts) stands in for the geometric display face and **Assistant** for bilingual body. Swap in the licensed brand fonts if available.
- **Icon substitution:** **Lucide** stands in for generic UI icons pending OPTIZONE's own set.
- **Logo:** reconstructed from packaging photos as SVG + a `Logo` component. It's faithful but not vector-extracted from a master file — replace with the official artwork if provided.
- The brand **video** was not analyzed frame-by-frame; motion guidance is inferred from the static collateral and premium-brand conventions.

---

## Index / manifest

**Root files:** `styles.css` (entry — @imports only), `readme.md`, `SKILL.md`. Tokens in `tokens/` (`colors.css`, `typography.css`, `fonts.css`, `spacing.css`, `base.css`). Foundation specimen cards in `guidelines/`. Brand assets in `assets/` (`glasses-mark.svg`, `icons/`).

**Components** (`components/<group>/`, namespace `OPTIZONEDesignSystem_ded4a5`):
- **brand** — `DiamondRule`, `Icon`, `GlassesMark`, `Logo`
- **display** — `Badge`, `Card`, `Price`, `ProductCard`, `Rating`, `Tag`
- **feedback** — `Dialog`, `Toast`
- **forms** — `Button`, `Checkbox`, `IconButton`, `Input`, `QuantityStepper`, `Select`, `Switch`
- **navigation** — `Tabs`

**UI kits:** `ui_kits/storefront/` — the OPTIZONE storefront (browse, product, Try Mirror, search, account, checkout, store locator). `ui_kits/admin/` — the OPTIZONE admin/management console (dashboard & reports, products + add/edit editor, orders, appointments, content & campaigns, users & roles / RBAC).
