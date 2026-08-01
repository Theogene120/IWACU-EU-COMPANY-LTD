import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

function rowToSettings(row: any) {
  return {
    logoUrl: row.logo_url ?? '',
    heroSlides: row.hero_slides ?? [],
    teamMembers: row.team_members ?? [],
    testimonials: row.testimonials ?? [],
    categoryTranslations: row.category_translations ?? {},
  };
}

// GET /api/site-settings
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM site_settings WHERE id=1');
    if (!result.rows[0]) return res.json({ logoUrl: '', heroSlides: [], teamMembers: [], testimonials: [], categoryTranslations: {} });
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
      `INSERT INTO site_settings (id,logo_url,hero_slides,team_members,testimonials,category_translations)
       VALUES (1,$1,$2,$3,$4,$5)
       ON CONFLICT (id) DO UPDATE SET
         logo_url=$1, hero_slides=$2, team_members=$3, testimonials=$4, category_translations=$5`,
      [s.logoUrl ?? null, JSON.stringify(s.heroSlides ?? []), JSON.stringify(s.teamMembers ?? []), JSON.stringify(s.testimonials ?? []), JSON.stringify(s.categoryTranslations ?? {})]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
