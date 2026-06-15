import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

function toIso(v: any) {
  if (!v) return undefined;
  return v instanceof Date ? v.toISOString() : String(v);
}

function rowToLog(row: any) {
  return {
    id: row.id,
    action: row.action,
    timestamp: toIso(row.timestamp) ?? new Date().toISOString(),
    type: row.type,
    adminName: row.admin_name,
  };
}

// GET /api/activity-log
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM activity_log ORDER BY timestamp DESC');
    res.json(result.rows.map(rowToLog));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT /api/activity-log — bulk sync (replaces all, keeps latest 50)
router.put('/', async (req, res) => {
  const logs: any[] = req.body;
  if (!Array.isArray(logs)) return res.status(400).json({ error: 'Expected array' });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM activity_log');
    for (const log of logs) {
      await client.query(
        `INSERT INTO activity_log (id,action,timestamp,type,admin_name) VALUES ($1,$2,$3,$4,$5)`,
        [log.id, log.action, log.timestamp, log.type, log.adminName ?? 'System']
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

// POST /api/activity-log — add one entry
router.post('/', async (req, res) => {
  const log = req.body;
  try {
    await pool.query(
      `INSERT INTO activity_log (id,action,timestamp,type,admin_name) VALUES ($1,$2,$3,$4,$5)`,
      [log.id, log.action, log.timestamp, log.type, log.adminName ?? 'System']
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
