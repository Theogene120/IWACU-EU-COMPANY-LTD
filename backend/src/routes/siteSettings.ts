import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

function rowToSettings(row: any) {
  return {
    logoUrl: row.logo_url ?? '',
    heroSlides: row.hero_slides ?? [],
    teamMembers: row.team_members ?? [],
    testimonials: row.testimonials ?? [],
  };
}

// GET /api/site-settings
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM site_settings WHERE id=1');
    if (!result.rows[0]) return res.json({ logoUrl: '', heroSlides: [], teamMembers: [], testimonials: [] });
    res.json(rowToSettings(result.rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT /api/site-settings — upsert
router.put('/', async (req, res) => {
  const s = req.body;
  try {
    await pool.query(
      `INSERT INTO site_settings (id,logo_url,hero_slides,team_members,testimonials)
       VALUES (1,$1,$2,$3,$4)
       ON CONFLICT (id) DO UPDATE SET
         logo_url=$1, hero_slides=$2, team_members=$3, testimonials=$4`,
      [s.logoUrl ?? null, JSON.stringify(s.heroSlides ?? []), JSON.stringify(s.teamMembers ?? []), JSON.stringify(s.testimonials ?? [])]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
