import { pool } from './db.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runMigrations() {
  const schemaPath = path.join(__dirname, '..', 'schema.sql');
  const schema = readFileSync(schemaPath, 'utf-8');
  await pool.query(schema);
  console.log('[migrate] Tables created/verified');
}

if (process.argv[1] === __filename) {
  runMigrations()
    .then(() => pool.end())
    .catch((err) => { console.error('[migrate] Error:', err); process.exit(1); });
}
