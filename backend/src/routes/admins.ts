import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../db.js';
import { requireSuperAdmin } from '../middleware/auth.js';

const router = Router();

// Every route here manages who is allowed to log in — restricted to the super admin.
router.use(requireSuperAdmin);

// GET /api/admins — list regular admins (never the password hash).
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, created_at FROM sub_admins ORDER BY created_at'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /api/admins — create a regular admin.
router.post('/', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password are required' });
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });

  try {
    const existing = await pool.query('SELECT 1 FROM sub_admins WHERE lower(email)=lower($1)', [email]);
    if (existing.rows[0]) return res.status(409).json({ error: 'An admin with that email already exists' });

    const passwordHash = await bcrypt.hash(password, 10);
    const id = `admin-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const result = await pool.query(
      'INSERT INTO sub_admins (id, email, password_hash) VALUES ($1,$2,$3) RETURNING id, email, created_at',
      [id, email, passwordHash]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT /api/admins/:id/password — super admin resets a regular admin's password directly.
router.put('/:id/password', async (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    const passwordHash = await bcrypt.hash(newPassword, 10);
    const result = await pool.query(
      'UPDATE sub_admins SET password_hash=$1, updated_at=NOW() WHERE id=$2 RETURNING id',
      [passwordHash, req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Admin not found' });
    // Invalidate their existing sessions so the old password stops working immediately.
    await pool.query('DELETE FROM admin_sessions WHERE admin_id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE /api/admins/:id
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM admin_sessions WHERE admin_id=$1', [req.params.id]);
    await pool.query('DELETE FROM sub_admins WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
