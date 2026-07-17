# OPTIZONE — Security overview

A summary of the protections built into the app and the checklist for a hardened
production deployment.

## What's protected in code

| Area | Protection |
|---|---|
| **DoS / floods** | Per-IP rate limiting on the whole API (`RL_GLOBAL`, default 300/min), tighter on auth (`RL_AUTH`, 25/10min) and public writes — orders/bookings/register (`RL_WRITE`, 40/10min). Request bodies capped at 1 MB; oversized → `413`. |
| **Brute-force login** | Rate limiter + persistent per-account lockout: admin 6 fails → 15-min lockout, customer 8 fails → 15-min lockout (survives restarts and applies across instances). |
| **Clickjacking** | CSP `frame-ancestors 'self'` (only the app's own admin live-preview iframe may frame the site; no third-party framing). |
| **XSS** | React auto-escapes all output; no `dangerouslySetInnerHTML`/`eval`. A tuned Content-Security-Policy: `script-src` is `'self'` plus a small pinned allowlist (Google Maps, MediaPipe CDNs, Calendly) each tied to a specific feature; stored content is tag-stripped server-side as defence-in-depth. |
| **MIME sniffing** | `X-Content-Type-Options: nosniff` everywhere. |
| **Transport** | `Strict-Transport-Security` (HSTS, 180 days) — forces HTTPS. |
| **SQL injection** | All MySQL queries are parameterized (`?` placeholders); no string-built SQL. |
| **Auth tokens** | JWT pinned to `HS256` (blocks `alg:none`/algorithm-confusion). Admin and customer roles are separate — a customer token cannot reach any `/api/admin/*` route. |
| **Passwords** | bcrypt-hashed (cost 10). Owner password stored only as a hash — there is **no committed default password**: when none is configured, a strong one-time password is generated on first boot and printed once to the server log. |
| **Order pricing** | Prices and totals are always recomputed on the server from the catalog; client-supplied amounts/subtotal/total are never trusted (each line is floored at the catalog price). |
| **Account data** | "My orders" / "My appointments" are matched only by the authenticated session (never by unverified checkout email/phone), so one account can't see another's records. |
| **Admin 2FA** | Optional email OTP (6-digit, hashed at rest, 5-attempt cap, 10-min expiry) + self-service password reset by emailed code. |
| **Uploads** | Admin-only. Only raster image types accepted (SVG rejected), validated by **file magic bytes** — not just the client-supplied MIME/extension. Random filenames, 1 file, size-capped. Served with `nosniff`, `Content-Disposition: inline` and a sandboxed CSP so a crafted file can never execute. |
| **CORS** | Denied cross-origin by default (SPA is same-origin as the API); extra origins only via `CORS_ORIGINS`. |
| **Info leakage** | `X-Powered-By` disabled; the error handler never returns stack traces. |
| **OAuth** | Google sign-in uses the server-side code flow with a CSRF `state` cookie; the id_token's `iss`/`aud`/`exp`/`email_verified` are validated. The client secret is server-side only. |
| **Secrets** | No secrets in the repo. When `JWT_SECRET` is not set, a strong random secret is generated once and **persisted in the store** (shared by every instance on the same database), so sessions stay stable across restarts without deriving the secret from public deployment identifiers. Setting an explicit `JWT_SECRET` is still recommended. |

## Production checklist

Set these environment variables on your host (Hostinger hPanel / Vercel):

- [ ] `JWT_SECRET` — a long random string (keeps sessions valid across restarts).
- [ ] `ADMIN_EMAIL` — the owner login email (or manage it in Admin → Security).
- [ ] `GMAIL_USER` + `GMAIL_APP_PASSWORD` — to enable admin email OTP.
- [ ] `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` — for "Continue with Google".
- [ ] `PUBLIC_URL` — your real site origin (`https://…`) for CORS + OAuth redirect.
- [ ] MySQL (`DB_*`) — for durable, production-grade storage.
- [ ] Serve over **HTTPS** (Hostinger/Vercel provide this).
- [ ] After first login, change the owner password from **Admin → Security**, and
      **revoke** any tokens/secrets shared during setup.

## Notes & limits

- **Serverless (Vercel):** rate-limit counters are per-instance (in-memory), so
  they're best-effort when traffic is spread across many cold starts. On an
  always-on host (**Hostinger**, single Node process) they are fully effective.
  For serverless at scale, back the limiter with a shared store (e.g. Redis).
- **Not covered by app code** (handled by your host/CDN): network-layer DDoS
  absorption, WAF, TLS termination. Hostinger and Vercel both provide these.
- The admin panel is a trusted surface — it can edit all site content by design;
  protect the owner credentials accordingly.

_Report a vulnerability: email the address in the site footer._
