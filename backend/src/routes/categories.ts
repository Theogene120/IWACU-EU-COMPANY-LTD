import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

// GET /api/categories — returns string[]
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT name FROM categories ORDER BY name');
    res.json(result.rows.map(r => r.name));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT /api/categories — bulk sync (replaces all categories)
router.put('/', async (req, res) => {
  const categories: string[] = req.body;
  if (!Array.isArray(categories)) return res.status(400).json({ error: 'Expected array' });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM categories');
    for (const cat of categories) {
      await client.query('INSERT INTO categories (name) VALUES ($1)', [cat]);
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

// POST /api/categories — add one
router.post('/', async (req, res) => {
  const { name } = req.body;
  try {
    await pool.query('INSERT INTO categories (name) VALUES ($1) ON CONFLICT DO NOTHING', [name]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE /api/categories/:name — remove one (products keep their category text)
router.delete('/:name', async (req, res) => {
  try {
    await pool.query('DELETE FROM categories WHERE name=$1', [req.params.name]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
