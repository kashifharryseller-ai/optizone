// OPTIZONE server — runtime configuration (CommonJS, Passenger-friendly).
const path = require('path')
try { require('dotenv').config() } catch (_) { /* dotenv optional */ }

const bool = (v, d) => (v == null ? d : /^(1|true|yes|on)$/i.test(String(v)))

const config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'production',

  // Super-admin (store owner). These values only SEED the account on first boot;
  // after that the credentials live in the database and are managed from
  // Admin → Security (change email / password, reset via email OTP).
  admin: {
    email: (process.env.ADMIN_EMAIL || (String(process.env.ADMIN_USERNAME || '').includes('@') ? process.env.ADMIN_USERNAME : '') || 'info@optizone.co.il').toLowerCase(),
    // bcrypt hash only — plaintext is never stored in the repo.
    seedPasswordHash: process.env.ADMIN_PASSWORD_HASH || '',
    seedPassword: process.env.ADMIN_PASSWORD || '', // hashed at boot if provided
    // No committed default password: when neither ADMIN_PASSWORD nor
    // ADMIN_PASSWORD_HASH is set, a random one-time password is generated on
    // first boot and printed to the server log (see store/index.js).
    // OTP mode: 'auto' (on when email is configured) | 'force' | 'off'
    otp: (process.env.ADMIN_OTP || 'auto').toLowerCase(),
    otpTtlMin: Number(process.env.ADMIN_OTP_TTL_MIN) || 10,
  },

  // Outgoing email for admin OTP codes (Gmail app password recommended).
  mail: {
    user: process.env.GMAIL_USER || process.env.SMTP_USER || '',
    pass: process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS || '',
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 465,
    from: process.env.MAIL_FROM || process.env.GMAIL_USER || process.env.SMTP_USER || '',
  },
  // Prefer an explicit JWT_SECRET (stable sessions across restarts/instances,
  // and always wins). If absent, a strong random secret is generated once and
  // PERSISTED in the store on first boot (see store/index.js → ensureJwtSecret),
  // then reused by every instance that shares the same database/file. This keeps
  // sign-ins stable across restarts and across serverless instances WITHOUT
  // deriving the secret from public deployment identifiers. The value below is a
  // per-process placeholder used only until the persisted secret is loaded.
  jwtSecret: process.env.JWT_SECRET || require('crypto').randomBytes(32).toString('hex'),
  jwtSecretFromEnv: !!process.env.JWT_SECRET,
  tokenTtl: process.env.TOKEN_TTL || '12h',
  // Public origin (used for CORS allowlist and OAuth redirect derivation).
  publicUrl: (process.env.PUBLIC_URL || '').trim().replace(/\/$/, ''),

  // MySQL (Hostinger: create the DB in hPanel, then set these). If any of host /
  // database / user is missing, the app falls back to a local JSON file store.
  db: {
    host: process.env.DB_HOST || '',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || '',
  },

  paths: (() => {
    // On Vercel (and other read-only serverless FS) only /tmp is writable.
    const onServerless = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME)
    const dataDir = onServerless ? '/tmp/oz-data' : path.join(__dirname, 'data')
    return {
      dist: path.join(__dirname, '..', 'dist'),
      dataDir,
      dataFile: path.join(dataDir, 'db.json'),
      uploads: path.join(dataDir, 'uploads'),
    }
  })(),

  // Max upload size for images (bytes).
  maxUpload: Number(process.env.MAX_UPLOAD_BYTES) || 6 * 1024 * 1024,

  // Google OAuth ("Continue with Google"). The client ID is public; the SECRET
  // must be provided via env (never committed). Both are set in hPanel/Vercel.
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  },

  // Google Maps (Places Autocomplete + Geocoding at checkout). This is a
  // browser key — restrict it by HTTP referrer (your Vercel/Hostinger domains)
  // in Google Cloud Console. Accepts the NEXT_PUBLIC_* name for parity with
  // the Vercel env naming the shop owner uses.
  mapsKey: (process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY || '').trim(),
}

config.useMysql = bool(process.env.USE_MYSQL, !!(config.db.host && config.db.database && config.db.user))

module.exports = config
