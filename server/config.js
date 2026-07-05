// OPTIZONE server — runtime configuration (CommonJS, Passenger-friendly).
const path = require('path')
try { require('dotenv').config() } catch (_) { /* dotenv optional */ }

const bool = (v, d) => (v == null ? d : /^(1|true|yes|on)$/i.test(String(v)))

const config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'production',

  // Admin credentials (set these in your Hostinger env / .env).
  admin: {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD || 'optizone-admin',
  },
  jwtSecret: process.env.JWT_SECRET || 'dev-only-insecure-secret-change-in-production',
  tokenTtl: process.env.TOKEN_TTL || '12h',

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
    clientId: process.env.GOOGLE_CLIENT_ID || '1034284379097-2qh5htoh5ma02cln4pvu8i4p9qnj5bhr.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  },
}

config.useMysql = bool(process.env.USE_MYSQL, !!(config.db.host && config.db.database && config.db.user))

module.exports = config
