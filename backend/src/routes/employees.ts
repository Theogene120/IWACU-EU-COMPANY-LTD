import { Router } from 'express';
import { pool } from '../db.js';
import { toDateString } from '../utils/date.js';

const router = Router();

function rowToEmployee(row: any) {
  return {
    id: row.id,
    name: row.name,
    salary: parseFloat(row.salary),
    startDate: toDateString(row.start_date),
    latestPayment: row.latest_payment
      ? {
          id: row.latest_payment.id,
          amount: parseFloat(row.latest_payment.amount),
          status: row.latest_payment.status,
          date: toDateString(row.latest_payment.date),
        }
      : null,
  };
}

function rowToPayment(row: any) {
  return {
    id: row.id,
    amount: parseFloat(row.amount),
    status: row.status,
    date: toDateString(row.date),
  };
}

// GET /api/employees — lean list with each employee's latest payment only
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT e.*, lp.latest_payment
      FROM employees e
      LEFT JOIN LATERAL (
        SELECT row_to_json(p) AS latest_payment
        FROM (
          SELECT id, amount, status, date FROM employee_payments
          WHERE employee_id = e.id
          ORDER BY date DESC, created_at DESC
          LIMIT 1
        ) p
      ) lp ON true
      ORDER BY e.created_at DESC
    `);
    res.json(result.rows.map(rowToEmployee));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /api/employees
router.post('/', async (req, res) => {
  const { id, name, salary, startDate } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  const empId = id || Math.random().toString(36).substr(2, 9);
  try {
    const result = await pool.query(
      `INSERT INTO employees (id, name, salary, start_date)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [empId, name, salary ?? 0, startDate || null]
    );
    res.status(201).json(rowToEmployee({ ...result.rows[0], latest_payment: null }));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT /api/employees/:id
router.put('/:id', async (req, res) => {
  const { name, salary, startDate } = req.body;
  try {
    const result = await pool.query(
      `UPDATE employees
       SET name=$1, salary=$2, start_date=$3, updated_at=NOW()
       WHERE id=$4 RETURNING *`,
      [name, salary ?? 0, startDate || null, req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
    const latest = await pool.query(
      `SELECT id, amount, status, date FROM employee_payments
       WHERE employee_id = $1 ORDER BY date DESC, created_at DESC LIMIT 1`,
      [req.params.id]
    );
    res.json(rowToEmployee({ ...result.rows[0], latest_payment: latest.rows[0] || null }));
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

// GET /api/employees/payments?from=YYYY-MM-DD&to=YYYY-MM-DD
// Full payment list across every employee, with employee name attached — used for the
// printable payroll report (prints the filtered range, or everything if unfiltered).
router.get('/payments', async (req, res) => {
  const { from, to } = req.query;
  const conditions: string[] = [];
  const params: any[] = [];

  if (from) {
    params.push(from);
    conditions.push(`p.date >= $${params.length}`);
  }
  if (to) {
    params.push(to);
    conditions.push(`p.date <= $${params.length}`);
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  try {
    const result = await pool.query(
      `SELECT p.id, p.employee_id, e.name AS employee_name, p.amount, p.status, p.date
       FROM employee_payments p
       JOIN employees e ON e.id = p.employee_id
       ${where}
       ORDER BY p.date DESC, p.created_at DESC`,
      params
    );
    res.json(result.rows.map(row => ({
      id: row.id,
      employeeId: row.employee_id,
      employeeName: row.employee_name,
      amount: parseFloat(row.amount),
      status: row.status,
      date: toDateString(row.date),
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET /api/employees/payments/summary?from=YYYY-MM-DD&to=YYYY-MM-DD
// Total confirmed salary paid across every employee, optionally scoped to a date range.
router.get('/payments/summary', async (req, res) => {
  const { from, to } = req.query;
  const conditions = [`status = 'confirmed'`];
  const params: any[] = [];

  if (from) {
    params.push(from);
    conditions.push(`date >= $${params.length}`);
  }
  if (to) {
    params.push(to);
    conditions.push(`date <= $${params.length}`);
  }

  try {
    const result = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) AS total, COUNT(*) AS count
       FROM employee_payments WHERE ${conditions.join(' AND ')}`,
      params
    );
    res.json({
      totalPaid: parseFloat(result.rows[0].total),
      count: parseInt(result.rows[0].count, 10),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET /api/employees/:id/payments?from=YYYY-MM-DD&to=YYYY-MM-DD
router.get('/:id/payments', async (req, res) => {
  const { from, to } = req.query;
  const conditions = ['employee_id = $1'];
  const params: any[] = [req.params.id];

  if (from) {
    params.push(from);
    conditions.push(`date >= $${params.length}`);
  }
  if (to) {
    params.push(to);
    conditions.push(`date <= $${params.length}`);
  }

  try {
    const result = await pool.query(
      `SELECT id, amount, status, date FROM employee_payments
       WHERE ${conditions.join(' AND ')}
       ORDER BY date DESC, created_at DESC`,
      params
    );
    res.json(result.rows.map(rowToPayment));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /api/employees/:id/payments
router.post('/:id/payments', async (req, res) => {
  const { amount, status, date } = req.body;
  if (!amount || amount <= 0) return res.status(400).json({ error: 'amount must be greater than 0' });
  if (!date) return res.status(400).json({ error: 'date is required' });
  const paymentId = Math.random().toString(36).substr(2, 9);
  try {
    const result = await pool.query(
      `INSERT INTO employee_payments (id, employee_id, amount, status, date)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [paymentId, req.params.id, amount, status || 'pending', date]
    );
    res.status(201).json(rowToPayment(result.rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT /api/employees/:id/payments/:paymentId
router.put('/:id/payments/:paymentId', async (req, res) => {
  const { amount, status, date } = req.body;
  try {
    const result = await pool.query(
      `UPDATE employee_payments
       SET amount = COALESCE($1, amount), status = COALESCE($2, status), date = COALESCE($3, date)
       WHERE id = $4 AND employee_id = $5 RETURNING *`,
      [amount ?? null, status ?? null, date ?? null, req.params.paymentId, req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(rowToPayment(result.rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE /api/employees/:id/payments/:paymentId
router.delete('/:id/payments/:paymentId', async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM employee_payments WHERE id=$1 AND employee_id=$2',
      [req.params.paymentId, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
