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
