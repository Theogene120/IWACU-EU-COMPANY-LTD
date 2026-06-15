import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

function rowToAnalytics(row: any) {
  return {
    totalVisitors: row.total_visitors,
    dailyTraffic: row.daily_traffic,
    pageViews: row.page_views,
    activeUsers: row.active_users,
  };
}

// GET /api/analytics
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM analytics WHERE id=1');
    if (!result.rows[0]) return res.json({ totalVisitors: 0, dailyTraffic: [], pageViews: [], activeUsers: 0 });
    res.json(rowToAnalytics(result.rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT /api/analytics — upsert
router.put('/', async (req, res) => {
  const a = req.body;
  try {
    await pool.query(
      `INSERT INTO analytics (id,total_visitors,daily_traffic,page_views,active_users)
       VALUES (1,$1,$2,$3,$4)
       ON CONFLICT (id) DO UPDATE SET
         total_visitors=$1, daily_traffic=$2, page_views=$3, active_users=$4`,
      [a.totalVisitors ?? 0, JSON.stringify(a.dailyTraffic ?? []), JSON.stringify(a.pageViews ?? []), a.activeUsers ?? 0]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
