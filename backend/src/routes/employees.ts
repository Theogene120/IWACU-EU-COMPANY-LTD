import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

function trimPayments(payments: any[]): any[] {
  return [...payments]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
}

function toDateString(raw: any): string | undefined {
  if (!raw) return undefined;
  // pg may return DATE as a Date object or as a 'YYYY-MM-DD' string
  if (raw instanceof Date) return raw.toISOString().split('T')[0];
  return String(raw).split('T')[0];
}

function rowToEmployee(row: any) {
  const payments: any[] = row.payments || [];
  return {
    id: row.id,
    name: row.name,
    salary: parseFloat(row.salary),
    startDate: toDateString(row.start_date),
    payments: [...payments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  };
}

// GET /api/employees
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM employees ORDER BY created_at DESC');
    res.json(result.rows.map(rowToEmployee));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /api/employees
router.post('/', async (req, res) => {
  const { id, name, salary, startDate, payments } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  const empId = id || Math.random().toString(36).substr(2, 9);
  const trimmed = trimPayments(payments || []);
  try {
    const result = await pool.query(
      `INSERT INTO employees (id, name, salary, start_date, payments)
       VALUES ($1, $2, $3, $4, $5::jsonb) RETURNING *`,
      [empId, name, salary ?? 0, startDate || null, JSON.stringify(trimmed)]
    );
    res.status(201).json(rowToEmployee(result.rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT /api/employees/:id
router.put('/:id', async (req, res) => {
  const { name, salary, startDate, payments } = req.body;
  const trimmed = trimPayments(payments || []);
  try {
    const result = await pool.query(
      `UPDATE employees
       SET name=$1, salary=$2, start_date=$3, payments=$4::jsonb, updated_at=NOW()
       WHERE id=$5 RETURNING *`,
      [name, salary ?? 0, startDate || null, JSON.stringify(trimmed), req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(rowToEmployee(result.rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE /api/employees/:id
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM employees WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
