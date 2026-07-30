-- Iwacu EU Company — PostgreSQL schema
-- Run once to create all tables; safe to re-run (IF NOT EXISTS).

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(12,2) NOT NULL,
  old_price NUMERIC(12,2),
  category TEXT,
  images JSONB NOT NULL DEFAULT '[]',
  stock INTEGER NOT NULL DEFAULT 0,
  rating NUMERIC(3,2) DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  specifications JSONB DEFAULT '[]',
  variations JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
  name TEXT PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  items JSONB NOT NULL DEFAULT '[]',
  total NUMERIC(12,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  payment_status TEXT,
  payment_message TEXT,
  transaction_id TEXT,
  payer_phone TEXT,
  receiver_phone TEXT,
  payment_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  subject TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read BOOLEAN DEFAULT false,
  reply TEXT,
  replied_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS analytics (
  id INTEGER PRIMARY KEY DEFAULT 1,
  total_visitors INTEGER DEFAULT 0,
  daily_traffic JSONB DEFAULT '[]',
  page_views JSONB DEFAULT '[]',
  active_users INTEGER DEFAULT 0,
  CONSTRAINT analytics_single_row CHECK (id = 1)
);

INSERT INTO analytics (id) VALUES (1) ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS activity_log (
  id TEXT PRIMARY KEY,
  action TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  type TEXT,
  admin_name TEXT
);

CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  logo_url TEXT,
  hero_slides JSONB DEFAULT '[]',
  team_members JSONB DEFAULT '[]',
  testimonials JSONB DEFAULT '[]',
  CONSTRAINT site_settings_single_row CHECK (id = 1)
);

INSERT INTO site_settings (id) VALUES (1) ON CONFLICT DO NOTHING;

-- Profit tracking migration (adds columns only — never drops/alters existing data).
-- products: admin-only cost field + online/offline sales tracking.
ALTER TABLE products ADD COLUMN IF NOT EXISTS cost NUMERIC(12,2) NOT NULL DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS sales_type TEXT NOT NULL DEFAULT 'online';
ALTER TABLE products ADD COLUMN IF NOT EXISTS published BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE products ADD COLUMN IF NOT EXISTS sale_price NUMERIC(12,2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS sale_date TIMESTAMPTZ;
ALTER TABLE products ADD COLUMN IF NOT EXISTS offline_delivery_fee NUMERIC(12,2) NOT NULL DEFAULT 0;

-- Backfill safety net: any pre-existing row explicitly becomes a published online product
-- (matches current catalog behavior exactly — nothing changes for existing data).
UPDATE products SET sales_type = 'online' WHERE sales_type IS NULL;
UPDATE products SET published = true WHERE published IS NULL;

-- orders: persist the location-based delivery fee computed at checkout.
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_fee NUMERIC(12,2) NOT NULL DEFAULT 0;

-- Update team member photos to use local images (safe to re-run — matches by name).
UPDATE site_settings
SET team_members = (
  SELECT jsonb_agg(
    CASE
      WHEN m->>'name' = 'MANIRAKIZA Emmanuel'
        THEN jsonb_set(m, '{image}', '"/Emmanuel.jpeg"'::jsonb)
      WHEN m->>'name' = 'UJENEZA Annonciata'
        THEN jsonb_set(m, '{image}', '"/Annonciata.jpeg"'::jsonb)
      ELSE m
    END
  )
  FROM jsonb_array_elements(team_members) m
)
WHERE id = 1
  AND team_members IS NOT NULL
  AND jsonb_typeof(team_members) = 'array';

-- Employee salary tracking migration (add-only, safe to re-run).
CREATE TABLE IF NOT EXISTS employees (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  salary        NUMERIC(12,2) NOT NULL DEFAULT 0,
  start_date    DATE,
  payments      JSONB NOT NULL DEFAULT '[]',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Employee payments migration: move payment history off the capped `payments` JSONB
-- blob (previously trimmed to the 3 most recent) into its own table so every payment
-- is kept permanently and can be filtered by date range with plain SQL.
CREATE TABLE IF NOT EXISTS employee_payments (
  id            TEXT PRIMARY KEY,
  employee_id   TEXT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  amount        NUMERIC(12,2) NOT NULL,
  status        TEXT NOT NULL DEFAULT 'pending',
  date          DATE NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_employee_payments_employee_id ON employee_payments(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_payments_date ON employee_payments(date);

-- One-time backfill from the old JSONB column, then drop it. Guarded so it's a no-op
-- once the column is gone (safe to re-run on every deploy).
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'employees' AND column_name = 'payments'
  ) THEN
    INSERT INTO employee_payments (id, employee_id, amount, status, date)
    SELECT
      COALESCE(NULLIF(p->>'id', ''), e.id || '-' || row_number() OVER (PARTITION BY e.id)),
      e.id,
      (p->>'amount')::numeric,
      COALESCE(p->>'status', 'pending'),
      (p->>'date')::date
    FROM employees e, jsonb_array_elements(e.payments) p
    WHERE jsonb_typeof(e.payments) = 'array'
    ON CONFLICT (id) DO NOTHING;

    ALTER TABLE employees DROP COLUMN payments;
  END IF;
END $$;

-- Other expenses tracking (add-only, safe to re-run).
CREATE TABLE IF NOT EXISTS other_expenses (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  cost          NUMERIC(12,2) NOT NULL DEFAULT 0,
  date          DATE NOT NULL,
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_other_expenses_date ON other_expenses(date);

-- Category attribute removed — drop it if a prior run of this schema created it.
ALTER TABLE other_expenses DROP COLUMN IF EXISTS category;

-- Admin password storage + email-verified reset flow (single shared admin credential).
-- This is the SUPER ADMIN — always logs in with the company email.
CREATE TABLE IF NOT EXISTS admin_credentials (
  id                     INTEGER PRIMARY KEY DEFAULT 1,
  password_hash          TEXT NOT NULL,
  reset_code             TEXT,
  reset_code_expires_at  TIMESTAMPTZ,
  updated_at             TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT admin_credentials_single_row CHECK (id = 1)
);

-- Super admin's login email (add-only, safe to re-run). Backfilled from COMPANY_EMAIL
-- in migrate.ts so the existing admin can log in immediately after this migration.
ALTER TABLE admin_credentials ADD COLUMN IF NOT EXISTS email TEXT;

-- Regular admins — created by the super admin from the dashboard. They can do everything
-- a super admin can except see Overview/Profit/Employees/Other Expenses (enforced by
-- requireSuperAdmin on those routes, and hidden client-side).
CREATE TABLE IF NOT EXISTS sub_admins (
  id            TEXT PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Bearer-token sessions issued on login, checked by requireSuperAdmin.
CREATE TABLE IF NOT EXISTS admin_sessions (
  token       TEXT PRIMARY KEY,
  role        TEXT NOT NULL, -- 'super_admin' | 'admin'
  email       TEXT NOT NULL,
  admin_id    TEXT, -- sub_admins.id when role='admin', NULL for the super admin
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  expires_at  TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON admin_sessions(expires_at);
