import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

function toIso(v: any) {
  if (!v) return undefined;
  return v instanceof Date ? v.toISOString() : String(v);
}

function rowToMessage(row: any) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    subject: row.subject,
    message: row.message,
    createdAt: toIso(row.created_at) ?? new Date().toISOString(),
    read: row.read,
    ...(row.reply ? { reply: row.reply } : {}),
    ...(row.replied_at ? { repliedAt: toIso(row.replied_at) } : {}),
  };
}

// GET /api/messages
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
    res.json(result.rows.map(rowToMessage));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT /api/messages — bulk sync
router.put('/', async (req, res) => {
  const messages: any[] = req.body;
  if (!Array.isArray(messages)) return res.status(400).json({ error: 'Expected array' });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM messages');
    for (const m of messages) {
      await client.query(
        `INSERT INTO messages (id,name,email,subject,message,created_at,read,reply,replied_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [m.id, m.name, m.email, m.subject, m.message, m.createdAt, m.read ?? false, m.reply ?? null, m.repliedAt ?? null]
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

// POST /api/messages — create one
router.post('/', async (req, res) => {
  const m = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO messages (id,name,email,subject,message,created_at,read,reply,replied_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [m.id, m.name, m.email, m.subject, m.message, m.createdAt, m.read ?? false, m.reply ?? null, m.repliedAt ?? null]
    );
    res.json(rowToMessage(result.rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT /api/messages/:id — update (mark read, reply)
router.put('/:id', async (req, res) => {
  const m = req.body;
  try {
    const result = await pool.query(
      `UPDATE messages SET read=$2,reply=$3,replied_at=$4 WHERE id=$1 RETURNING *`,
      [req.params.id, m.read ?? false, m.reply ?? null, m.repliedAt ?? null]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(rowToMessage(result.rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE /api/messages/:id
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM messages WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
