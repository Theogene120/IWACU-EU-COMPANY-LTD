import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

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

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

// CORS — allow the Vite dev server and any configured origins
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(s => s.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Uploads — serve from <project_root>/public/uploads by default
const UPLOADS_DIR = process.env.UPLOADS_DIR
  ? path.resolve(process.env.UPLOADS_DIR)
  : path.join(process.cwd(), '..', 'public', 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use('/uploads', express.static(UPLOADS_DIR));

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

// Serve the built frontend in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(process.cwd(), '..', 'dist');
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }
}

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
