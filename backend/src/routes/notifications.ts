import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

function toIso(v: any) {
  if (!v) return undefined;
  return v instanceof Date ? v.toISOString() : String(v);
}

function rowToNotification(row: any) {
  return {
    id: row.id,
    title: row.title,
    message: row.message,
    type: row.type,
    createdAt: toIso(row.created_at) ?? new Date().toISOString(),
    read: row.read,
  };
}

// GET /api/notifications
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM notifications ORDER BY created_at DESC');
    res.json(result.rows.map(rowToNotification));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT /api/notifications — bulk sync
router.put('/', async (req, res) => {
  const notifications: any[] = req.body;
  if (!Array.isArray(notifications)) return res.status(400).json({ error: 'Expected array' });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM notifications');
    for (const n of notifications) {
      await client.query(
        `INSERT INTO notifications (id,title,message,type,created_at,read) VALUES ($1,$2,$3,$4,$5,$6)`,
        [n.id, n.title, n.message, n.type, n.createdAt, n.read ?? false]
      );
    }
    await client.query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  } finally {
    client.release();
  }
});

// POST /api/notifications — create one
router.post('/', async (req, res) => {
  const n = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO notifications (id,title,message,type,created_at,read) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [n.id, n.title, n.message, n.type, n.createdAt, n.read ?? false]
    );
    res.json(rowToNotification(result.rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT /api/notifications/:id — mark read
router.put('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE notifications SET read=$2 WHERE id=$1 RETURNING *',
      [req.params.id, req.body.read ?? true]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(rowToNotification(result.rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
