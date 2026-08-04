import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import { pool } from './db.js';
import authRouter from './routes/auth.js';
import productsRouter from './routes/products.js';
import categoriesRouter from './routes/categories.js';
import ordersRouter from './routes/orders.js';
import messagesRouter from './routes/messages.js';
import notificationsRouter from './routes/notifications.js';
import analyticsRouter from './routes/analytics.js';
import activityLogRouter from './routes/activityLog.js';
import siteSettingsRouter from './routes/siteSettings.js';
import uploadRouter from './routes/upload.js';
import payRouter from './routes/pay.js';
import employeesRouter from './routes/employees.js';
import otherExpensesRouter from './routes/otherExpenses.js';
import adminsRouter from './routes/admins.js';
import subscribeRouter from './routes/subscribe.js';
import { runMigrations } from './migrate.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

// CORS — allow the Vite dev server and any configured origins
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(s => s.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Uploads — serve from <project_root>/public/uploads by default.
// In production UPLOADS_DIR must be set to a writable, persistent path (the
// process.cwd()-relative fallback below is only safe for local dev). On ephemeral
// hosts these files still won't survive redeploys — that's handled separately.
const UPLOADS_DIR = process.env.UPLOADS_DIR
  ? path.resolve(process.env.UPLOADS_DIR)
  : path.join(process.cwd(), '..', 'public', 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use('/uploads', express.static(UPLOADS_DIR));

// Health checks — used by hosting platforms to verify the service is up.
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/api/health/db', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({ status: 'ok' });
  } catch (err) {
    console.error('[health/db] DB check failed:', err);
    res.status(503).json({ status: 'error' });
  }
});

// API routes
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/activity-log', activityLogRouter);
app.use('/api/site-settings', siteSettingsRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/pay', payRouter);
app.use('/api/employees', employeesRouter);
app.use('/api/other-expenses', otherExpensesRouter);
app.use('/api/admins', adminsRouter);
app.use('/api/subscribe', subscribeRouter);

// Serve the built frontend in production, if it's colocated with the backend
// (only applies to a combined deploy — a separate static-host frontend deploy
// won't have a dist/ here and this block is skipped entirely). Registered after
// /uploads and /api above, so the catch-all below can never shadow those routes —
// Express matches routes in registration order and only falls through to '*'
// when nothing earlier matched.
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(process.cwd(), '..', 'dist');
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }
}

// Applies schema.sql (idempotent — safe to re-run) before accepting traffic, so the
// running code and the database schema it expects can never drift apart, as happened
// when the products.title/description JSONB migration shipped without being run.
runMigrations()
  .then(() => {
    app.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('[startup] Migration failed — refusing to start with a stale schema:', err);
    process.exit(1);
  });
