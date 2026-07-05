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

  paths: {
    dist: path.join(__dirname, '..', 'dist'),
    dataDir: path.join(__dirname, 'data'),
    dataFile: path.join(__dirname, 'data', 'db.json'),
    uploads: path.join(__dirname, 'data', 'uploads'),
  },

  // Max upload size for images (bytes).
  maxUpload: Number(process.env.MAX_UPLOAD_BYTES) || 6 * 1024 * 1024,
}

config.useMysql = bool(process.env.USE_MYSQL, !!(config.db.host && config.db.database && config.db.user))

module.exports = config
