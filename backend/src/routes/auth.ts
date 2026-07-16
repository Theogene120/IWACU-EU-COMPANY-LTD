import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../db.js';
import { sendResetCodeEmail } from '../utils/mailer.js';

const router = Router();

const CODE_TTL_MS = 10 * 60 * 1000;

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: 'password is required' });
  try {
    const result = await pool.query('SELECT password_hash FROM admin_credentials WHERE id=1');
    const hash = result.rows[0]?.password_hash;
    const match = hash ? await bcrypt.compare(password, hash) : false;
    if (!match) return res.status(401).json({ success: false, error: 'Invalid password' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /api/auth/request-code — emails a verification code to the company inbox.
// Shared by both the logged-in "change password" flow and the logged-out "forgot password" flow.
router.post('/request-code', async (req, res) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + CODE_TTL_MS);
  try {
    await pool.query(
      'UPDATE admin_credentials SET reset_code=$1, reset_code_expires_at=$2 WHERE id=1',
      [code, expiresAt]
    );
    await sendResetCodeEmail(code);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send verification code' });
  }
});

// POST /api/auth/reset-password — verify the emailed code and set the new password.
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
