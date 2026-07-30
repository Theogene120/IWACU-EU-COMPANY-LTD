import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { pool } from '../db.js';

const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

export type AdminRole = 'super_admin' | 'admin';

export async function createSession(role: AdminRole, email: string, adminId: string | null) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await pool.query(
    'INSERT INTO admin_sessions (token, role, email, admin_id, expires_at) VALUES ($1,$2,$3,$4,$5)',
    [token, role, email, adminId, expiresAt]
  );
  return { token, expiresAt };
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      admin?: { role: AdminRole; email: string; adminId: string | null };
    }
  }
}

// Requires a valid, unexpired session belonging to the super admin. Regular admins get 403.
export async function requireSuperAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Authentication required' });

    const result = await pool.query(
      'SELECT role, email, admin_id, expires_at FROM admin_sessions WHERE token=$1',
      [token]
    );
    const session = result.rows[0];
    if (!session || new Date(session.expires_at) <= new Date()) {
      return res.status(401).json({ error: 'Session expired or invalid' });
    }
    if (session.role !== 'super_admin') {
      return res.status(403).json({ error: 'Super admin access required' });
    }

    req.admin = { role: session.role, email: session.email, adminId: session.admin_id };
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}
