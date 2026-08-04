import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  console.error('[db] FATAL: DATABASE_URL is not set. Refusing to start.');
  process.exit(1);
}

// Hosted Postgres (Neon/Supabase/Render) requires SSL; local dev must not use it.
const useSSL = process.env.PGSSL === 'true' || process.env.NODE_ENV === 'production';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useSSL ? { rejectUnauthorized: false } : undefined,
});

pool.on('error', (err) => {
  console.error('PostgreSQL pool error:', err);
});
