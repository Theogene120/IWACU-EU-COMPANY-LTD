import { Router } from 'express';
import { pool } from '../db.js';
import { toDateString } from '../utils/date.js';

const router = Router();

function rowToExpense(row: any) {
  return {
    id: row.id,
    name: row.name,
    cost: parseFloat(row.cost),
    date: toDateString(row.date),
    notes: row.notes || undefined,
  };
}

// GET /api/other-expenses?from=YYYY-MM-DD&to=YYYY-MM-DD
router.get('/', async (req, res) => {
  const { from, to } = req.query;
  const conditions: string[] = [];
  const params: any[] = [];

  if (from) {
    params.push(from);
    conditions.push(`date >= $${params.length}`);
  }
  if (to) {
    params.push(to);
    conditions.push(`date <= $${params.length}`);
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  try {
    const result = await pool.query(
      `SELECT * FROM other_expenses ${where} ORDER BY date DESC, created_at DESC`,
      params
    );
    res.json(result.rows.map(rowToExpense));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /api/other-expenses
router.post('/', async (req, res) => {
  const { id, name, cost, date, notes } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  if (!date) return res.status(400).json({ error: 'date is required' });
  const expenseId = id || Math.random().toString(36).substr(2, 9);
  try {
    const result = await pool.query(
      `INSERT INTO other_expenses (id, name, cost, date, notes)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [expenseId, name, cost ?? 0, date, notes || null]
    );
    res.status(201).json(rowToExpense(result.rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT /api/other-expenses/:id
router.put('/:id', async (req, res) => {
  const { name, cost, date, notes } = req.body;
  try {
    const result = await pool.query(
      `UPDATE other_expenses
       SET name=$1, cost=$2, date=$3, notes=$4, updated_at=NOW()
       WHERE id=$5 RETURNING *`,
      [name, cost ?? 0, date, notes || null, req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(rowToExpense(result.rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE /api/other-expenses/:id
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM other_expenses WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
