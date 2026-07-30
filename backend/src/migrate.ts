import { pool } from './db.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_ADMIN_PASSWORD = 'admin123';

export async function runMigrations() {
  const schemaPath = path.join(__dirname, '..', 'schema.sql');
  const schema = readFileSync(schemaPath, 'utf-8');
  await pool.query(schema);
  console.log('[migrate] Tables created/verified');

  const existing = await pool.query('SELECT 1 FROM admin_credentials WHERE id=1');
  if (existing.rows.length === 0) {
    const passwordHash = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10);
    await pool.query('INSERT INTO admin_credentials (id, password_hash) VALUES (1, $1)', [passwordHash]);
    console.log(`[migrate] Seeded default admin password ("${DEFAULT_ADMIN_PASSWORD}") — change it after first login`);
  }

  // Super admin always logs in with the company email — backfill it if not set yet.
  if (process.env.COMPANY_EMAIL) {
    await pool.query(
      'UPDATE admin_credentials SET email = $1 WHERE id=1 AND email IS NULL',
      [process.env.COMPANY_EMAIL]
    );
  }
}

if (process.argv[1] === __filename) {
  runMigrations()
    .then(() => pool.end())
    .catch((err) => { console.error('[migrate] Error:', err); process.exit(1); });
}
