-- OPTIZONE — MySQL schema (Hostinger / phpMyAdmin)
-- ===========================================================================
-- Agency-grade HYBRID design: each row keeps a JSON `data` column as the
-- flexible source of truth, PLUS first-class indexed columns projected from it
-- (status, totals, customer, timestamps…) so the database is fully queryable and
-- reportable with real SQL. Orders are normalized into oz_order_items (one row
-- per line) for product/sales analytics.
--
-- You do NOT have to run this by hand — the app creates and migrates all of this
-- automatically on first boot (server/store/mysql.js). This file is for
-- reference, or to pre-create the schema in hPanel -> phpMyAdmin -> (your DB) ->
-- SQL. Do NOT add a CREATE DATABASE / USE line: run it inside the database
-- Hostinger already created for you.
--
-- utf8mb4 throughout (Hebrew + Arabic + emoji safe).
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- Editable storefront content (catalog, homepage, settings) — single JSON row.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS oz_content (
  id         TINYINT PRIMARY KEY,
  data       LONGTEXT NOT NULL,
  updated_at DATETIME NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------------
-- Server metadata: persisted JWT secret, seeded admin, OTP challenges,
-- translation cache — single JSON row.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS oz_meta (
  id         TINYINT PRIMARY KEY,
  data       LONGTEXT NOT NULL,
  updated_at DATETIME NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------------
-- Customer orders — document (`data`) + projected, indexed columns.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS oz_orders (
  id             VARCHAR(40) PRIMARY KEY,
  created_at     DATETIME NOT NULL,
  updated_at     DATETIME NULL,
  status         VARCHAR(40) NULL,
  subtotal       DECIMAL(10,2) NULL,
  shipping       DECIMAL(10,2) NULL,
  total          DECIMAL(10,2) NULL,
  payment        VARCHAR(40) NULL,
  fulfilment     VARCHAR(40) NULL,
  user_id        VARCHAR(40) NULL,
  customer_email VARCHAR(190) NULL,
  customer_name  VARCHAR(190) NULL,
  customer_phone VARCHAR(60) NULL,
  item_count     INT NULL,
  data           LONGTEXT NOT NULL,
  INDEX idx_orders_status  (status),
  INDEX idx_orders_email   (customer_email),
  INDEX idx_orders_user    (user_id),
  INDEX idx_orders_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------------
-- Normalized order line-items — one row per product per order (for reporting).
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS oz_order_items (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  order_id    VARCHAR(40) NOT NULL,
  product_id  VARCHAR(40) NULL,
  brand       VARCHAR(120) NULL,
  name        VARCHAR(190) NULL,
  qty         INT NOT NULL DEFAULT 0,
  unit_price  DECIMAL(10,2) NOT NULL DEFAULT 0,
  line_total  DECIMAL(10,2) NOT NULL DEFAULT 0,
  custom_size VARCHAR(20) NULL,
  INDEX idx_items_order   (order_id),
  INDEX idx_items_product (product_id),
  CONSTRAINT fk_items_order FOREIGN KEY (order_id) REFERENCES oz_orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------------
-- Appointment / exam bookings — document + projected columns.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS oz_bookings (
  id         VARCHAR(40) PRIMARY KEY,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NULL,
  status     VARCHAR(40) NULL,
  service    VARCHAR(120) NULL,
  branch     VARCHAR(120) NULL,
  day        VARCHAR(40) NULL,
  slot       VARCHAR(20) NULL,
  user_id    VARCHAR(40) NULL,
  name       VARCHAR(190) NULL,
  phone      VARCHAR(60) NULL,
  data       LONGTEXT NOT NULL,
  INDEX idx_bookings_status  (status),
  INDEX idx_bookings_user    (user_id),
  INDEX idx_bookings_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------------
-- Customer accounts — document + projected columns (email is unique).
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS oz_users (
  id         VARCHAR(40) PRIMARY KEY,
  email      VARCHAR(190) NOT NULL UNIQUE,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NULL,
  name       VARCHAR(190) NULL,
  phone      VARCHAR(60) NULL,
  data       LONGTEXT NOT NULL,
  INDEX idx_users_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------------
-- Example reports you can now run (agency-level analytics):
--   Revenue by day:
--     SELECT DATE(created_at) d, SUM(total) revenue, COUNT(*) orders
--     FROM oz_orders GROUP BY d ORDER BY d DESC;
--   Best-selling products:
--     SELECT brand, name, SUM(qty) units, SUM(line_total) revenue
--     FROM oz_order_items GROUP BY brand, name ORDER BY revenue DESC;
--   Open orders:
--     SELECT id, customer_name, total FROM oz_orders WHERE status = 'New';
-- ---------------------------------------------------------------------------
