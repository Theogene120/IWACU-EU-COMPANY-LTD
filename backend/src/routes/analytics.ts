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

// POST /api/analytics/track — atomically record one page view. The increment is
// computed from the CURRENT row in SQL, never from client-sent totals, so a client
// whose local analytics state never loaded (e.g. the initial GET failed) can never
// clobber real counts the way the old full-state PUT sync could.
router.post('/track', async (req, res) => {
  const path = typeof req.body?.path === 'string' ? req.body.path : '';
  try {
    const result = await pool.query(
      `UPDATE analytics
       SET total_visitors = total_visitors + 1,
           page_views = (
             SELECT CASE
               WHEN bool_or(e->>'path' = $1) THEN jsonb_agg(
                 CASE WHEN e->>'path' = $1
                      THEN jsonb_set(e, '{count}', to_jsonb(COALESCE((e->>'count')::int, 0) + 1))
                      ELSE e END
               )
               ELSE page_views || jsonb_build_array(jsonb_build_object('path', $1::text, 'count', 1))
             END
             FROM jsonb_array_elements(page_views) e
           )
       WHERE id = 1
       RETURNING *`,
      [path]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
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
