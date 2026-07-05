# OPTIZONE — Security overview

A summary of the protections built into the app and the checklist for a hardened
production deployment.

## What's protected in code

| Area | Protection |
|---|---|
| **DoS / floods** | Per-IP rate limiting on the whole API (`RL_GLOBAL`, default 300/min), tighter on auth (`RL_AUTH`, 25/10min) and public writes — orders/bookings/register (`RL_WRITE`, 40/10min). Request bodies capped at 1 MB; oversized → `413`. |
| **Brute-force login** | Rate limiter + per-account lockout (8 fails → 10-min lockout) on both admin and customer login. |
| **Clickjacking** | `X-Frame-Options: SAMEORIGIN` + CSP `frame-ancestors 'none'`. |
| **XSS** | React auto-escapes all output; no `dangerouslySetInnerHTML`/`eval`. Strict Content-Security-Policy (`script-src 'self'`). |
| **MIME sniffing** | `X-Content-Type-Options: nosniff` everywhere. |
| **Transport** | `Strict-Transport-Security` (HSTS, 180 days) — forces HTTPS. |
| **SQL injection** | All MySQL queries are parameterized (`?` placeholders); no string-built SQL. |
| **Auth tokens** | JWT pinned to `HS256` (blocks `alg:none`/algorithm-confusion). Admin and customer roles are separate — a customer token cannot reach any `/api/admin/*` route. |
| **Passwords** | bcrypt-hashed (cost 10). Owner password stored only as a hash; never in the repo. |
| **Admin 2FA** | Optional email OTP (6-digit, hashed at rest, 5-attempt cap, 10-min expiry) + self-service password reset by emailed code. |
| **Uploads** | Only raster image types accepted (SVG rejected). Random filenames, 1 file, size-capped. Served with `nosniff`, `Content-Disposition: inline` and a sandboxed CSP so a crafted file can never execute. |
| **CORS** | Denied cross-origin by default (SPA is same-origin as the API); extra origins only via `CORS_ORIGINS`. |
| **Info leakage** | `X-Powered-By` disabled; the error handler never returns stack traces. |
| **OAuth** | Google sign-in uses the server-side code flow with a CSRF `state` cookie; the id_token's `iss`/`aud`/`exp`/`email_verified` are validated. The client secret is server-side only. |
| **Secrets** | No secrets in the repo. Missing `JWT_SECRET` falls back to a strong random per-process secret (never a shared default). |

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
