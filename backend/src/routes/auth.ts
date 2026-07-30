import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../db.js';
import { sendResetCodeEmail, sendAdminResetRequestEmail } from '../utils/mailer.js';
import { createSession } from '../middleware/auth.js';

const router = Router();

const CODE_TTL_MS = 10 * 60 * 1000;

// POST /api/auth/login — super admin (by company email) or a regular admin (by their email).
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password are required' });

  try {
    const superAdmin = await pool.query(
      'SELECT password_hash, email FROM admin_credentials WHERE id=1'
    );
    const superRow = superAdmin.rows[0];
    if (superRow?.email && superRow.email.toLowerCase() === email.toLowerCase()) {
      const match = await bcrypt.compare(password, superRow.password_hash);
      if (!match) return res.status(401).json({ success: false, error: 'Invalid email or password' });
      const { token } = await createSession('super_admin', superRow.email, null);
      return res.json({ success: true, token, role: 'super_admin', email: superRow.email });
    }

    const subAdmin = await pool.query(
      'SELECT id, email, password_hash FROM sub_admins WHERE lower(email)=lower($1)',
      [email]
    );
    const subRow = subAdmin.rows[0];
    if (subRow) {
      const match = await bcrypt.compare(password, subRow.password_hash);
      if (!match) return res.status(401).json({ success: false, error: 'Invalid email or password' });
      const { token } = await createSession('admin', subRow.email, subRow.id);
      return res.json({ success: true, token, role: 'admin', email: subRow.email });
    }

    res.status(401).json({ success: false, error: 'Invalid email or password' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /api/auth/logout
router.post('/logout', async (req, res) => {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
  if (token) {
    try { await pool.query('DELETE FROM admin_sessions WHERE token=$1', [token]); } catch { /* best-effort */ }
  }
  res.json({ success: true });
});

// POST /api/auth/request-code — emails a verification code to the company inbox.
// Only the super admin's own email can actually proceed to reset-password (resettable:true).
// A regular admin's email just triggers a notice email — the super admin resets it for them.
router.post('/request-code', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'email is required' });

  try {
    const superAdmin = await pool.query('SELECT email FROM admin_credentials WHERE id=1');
    const superEmail = superAdmin.rows[0]?.email;

    if (superEmail && superEmail.toLowerCase() === email.toLowerCase()) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + CODE_TTL_MS);
      await pool.query(
        'UPDATE admin_credentials SET reset_code=$1, reset_code_expires_at=$2 WHERE id=1',
        [code, expiresAt]
      );
      await sendResetCodeEmail(code);
      return res.json({ success: true, resettable: true });
    }

    const subAdmin = await pool.query('SELECT 1 FROM sub_admins WHERE lower(email)=lower($1)', [email]);
    if (subAdmin.rows[0]) {
      await sendAdminResetRequestEmail(email);
      return res.json({ success: true, resettable: false });
    }

    res.status(404).json({ error: 'No account found with that email' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send verification code' });
  }
});

// POST /api/auth/reset-password — verify the emailed code and set the super admin's new password.
router.post('/reset-password', async (req, res) => {
  const { code, newPassword } = req.body;
  if (!code || !newPassword) return res.status(400).json({ error: 'code and newPassword are required' });
  if (newPassword.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });

  try {
    const result = await pool.query(
      'SELECT reset_code, reset_code_expires_at FROM admin_credentials WHERE id=1'
    );
    const row = result.rows[0];
    const validCode = row?.reset_code && row.reset_code === code;
    const notExpired = row?.reset_code_expires_at && new Date(row.reset_code_expires_at) > new Date();
    if (!validCode || !notExpired) {
      return res.status(400).json({ error: 'Invalid or expired code' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await pool.query(
      `UPDATE admin_credentials
       SET password_hash=$1, reset_code=NULL, reset_code_expires_at=NULL, updated_at=NOW()
       WHERE id=1`,
      [passwordHash]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
