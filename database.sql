-- OPTIZONE — MySQL schema (Hostinger / phpMyAdmin)
-- ---------------------------------------------------------------------------
-- You do NOT have to run this by hand. The app creates these tables itself on
-- first boot (see server/store/mysql.js -> ensureSchema) and seeds the default
-- catalog + content. This file is provided for reference, or so you can create
-- the tables up front in hPanel -> Databases -> phpMyAdmin -> (your DB) -> SQL.
--
-- HOW TO USE IN HOSTINGER
--   1. hPanel -> Databases -> MySQL Databases: create a database + user, and
--      grant the user ALL PRIVILEGES on that database.
--   2. Open phpMyAdmin for that database, go to the "SQL" tab, paste this file,
--      and click "Go".  (Do NOT include a CREATE DATABASE / USE line — Hostinger
--      already created the database and you are running this inside it.)
--   3. Set the DB_* environment variables on the Node.js app (see .env.example)
--      and restart. On boot the app fills these tables with the storefront data.
--
-- Character set utf8mb4 is required (Hebrew + Arabic + emoji safe).
-- ---------------------------------------------------------------------------

-- Editable storefront content (catalog, homepage, settings) — a single JSON row.
CREATE TABLE IF NOT EXISTS oz_content (
  id   TINYINT PRIMARY KEY,
  data LONGTEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Customer orders (one JSON row per order).
CREATE TABLE IF NOT EXISTS oz_orders (
  id         VARCHAR(40) PRIMARY KEY,
  created_at DATETIME NOT NULL,
  data       LONGTEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Appointment / exam bookings (one JSON row per booking).
CREATE TABLE IF NOT EXISTS oz_bookings (
  id         VARCHAR(40) PRIMARY KEY,
  created_at DATETIME NOT NULL,
  data       LONGTEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Customer accounts (email is unique; profile stored as JSON).
CREATE TABLE IF NOT EXISTS oz_users (
  id         VARCHAR(40) PRIMARY KEY,
  email      VARCHAR(190) NOT NULL UNIQUE,
  created_at DATETIME NOT NULL,
  data       LONGTEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Server metadata: persisted JWT secret, seeded admin account, OTP challenges,
-- and the translation cache — a single JSON row.
CREATE TABLE IF NOT EXISTS oz_meta (
  id   TINYINT PRIMARY KEY,
  data LONGTEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
