import { pool } from './db.js';
import { runMigrations } from './migrate.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seed() {
  await runMigrations();

  const dbPath = path.join(__dirname, '..', '..', 'db.json');
  const db = JSON.parse(readFileSync(dbPath, 'utf-8'));

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // ── Products ────────────────────────────────────────────────────────────
    await client.query('DELETE FROM products');
    for (const p of (db.products || [])) {
      await client.query(
        `INSERT INTO products
           (id, title, description, price, old_price, category, images, stock, rating, is_featured, specifications, variations)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
         ON CONFLICT (id) DO NOTHING`,
        [
          p.id, p.title, p.description, p.price,
          p.oldPrice ?? null, p.category,
          JSON.stringify(p.images ?? []),
          p.stock, p.rating, p.isFeatured ?? false,
          JSON.stringify(p.specifications ?? []),
          JSON.stringify(p.variations ?? []),
        ]
      );
    }
    console.log(`[seed] ${(db.products || []).length} products`);

    // ── Categories ──────────────────────────────────────────────────────────
    await client.query('DELETE FROM categories');
    for (const cat of (db.categories || [])) {
      await client.query('INSERT INTO categories (name) VALUES ($1) ON CONFLICT DO NOTHING', [cat]);
    }
    console.log(`[seed] ${(db.categories || []).length} categories`);

    // ── Orders ──────────────────────────────────────────────────────────────
    await client.query('DELETE FROM orders');
    for (const o of (db.orders || [])) {
      await client.query(
        `INSERT INTO orders
           (id, customer_name, phone, address, items, total, status,
            payment_method, payment_status, payment_message, transaction_id,
            payer_phone, receiver_phone, payment_date, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
         ON CONFLICT (id) DO NOTHING`,
        [
          o.id, o.customerName, o.phone, o.address,
          JSON.stringify(o.items ?? []), o.total, o.status,
          o.paymentMethod, o.paymentStatus,
          o.paymentMessage ?? null, o.transactionId ?? null,
          o.payerPhone ?? null, o.receiverPhone ?? null,
          o.paymentDate ?? null, o.createdAt ?? new Date().toISOString(),
        ]
      );
    }
    console.log(`[seed] ${(db.orders || []).length} orders`);

    // ── Messages ────────────────────────────────────────────────────────────
    await client.query('DELETE FROM messages');
    for (const m of (db.messages || [])) {
      await client.query(
        `INSERT INTO messages (id, name, email, subject, message, created_at, read, reply, replied_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
         ON CONFLICT (id) DO NOTHING`,
        [m.id, m.name, m.email, m.subject, m.message, m.createdAt, m.read ?? false, m.reply ?? null, m.repliedAt ?? null]
      );
    }
    console.log(`[seed] ${(db.messages || []).length} messages`);

    // ── Notifications ───────────────────────────────────────────────────────
    await client.query('DELETE FROM notifications');
    for (const n of (db.notifications || [])) {
      await client.query(
        `INSERT INTO notifications (id, title, message, type, created_at, read)
         VALUES ($1,$2,$3,$4,$5,$6)
         ON CONFLICT (id) DO NOTHING`,
        [n.id, n.title, n.message, n.type, n.createdAt, n.read ?? false]
      );
    }
    console.log(`[seed] ${(db.notifications || []).length} notifications`);

    // ── Analytics ───────────────────────────────────────────────────────────
    const a = db.analytics || { totalVisitors: 0, dailyTraffic: [], pageViews: [], activeUsers: 0 };
    await client.query(
      `INSERT INTO analytics (id, total_visitors, daily_traffic, page_views, active_users)
       VALUES (1,$1,$2,$3,$4)
       ON CONFLICT (id) DO UPDATE SET
         total_visitors=$1, daily_traffic=$2, page_views=$3, active_users=$4`,
      [a.totalVisitors ?? 0, JSON.stringify(a.dailyTraffic ?? []), JSON.stringify(a.pageViews ?? []), a.activeUsers ?? 0]
    );
    console.log('[seed] analytics');

    // ── Activity log ────────────────────────────────────────────────────────
    await client.query('DELETE FROM activity_log');
    for (const log of (db.activityLog || [])) {
      await client.query(
        `INSERT INTO activity_log (id, action, timestamp, type, admin_name)
         VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT (id) DO NOTHING`,
        [log.id, log.action, log.timestamp, log.type, log.adminName ?? 'System']
      );
    }
    console.log(`[seed] ${(db.activityLog || []).length} activity log entries`);

    // ── Site settings ────────────────────────────────────────────────────────
    const s = db.siteSettings || { logoUrl: '', heroSlides: [], teamMembers: [], testimonials: [] };
    await client.query(
      `INSERT INTO site_settings (id, logo_url, hero_slides, team_members, testimonials)
       VALUES (1,$1,$2,$3,$4)
       ON CONFLICT (id) DO UPDATE SET
         logo_url=$1, hero_slides=$2, team_members=$3, testimonials=$4`,
      [s.logoUrl ?? null, JSON.stringify(s.heroSlides ?? []), JSON.stringify(s.teamMembers ?? []), JSON.stringify(s.testimonials ?? [])]
    );
    console.log('[seed] site_settings');

    await client.query('COMMIT');
    console.log('\n[seed] ✓ All data imported from db.json. You can now delete db.json.');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error('[seed] Error:', err);
  process.exit(1);
});
