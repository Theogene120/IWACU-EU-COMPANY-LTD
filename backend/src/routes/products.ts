import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

function toIso(v: any): string | undefined {
  if (!v) return undefined;
  return v instanceof Date ? v.toISOString() : String(v);
}

// `admin` controls whether admin-only fields (cost, salesType, published, offline sale
// details) are included. Public/storefront responses MUST NEVER include these.
function rowToProduct(row: any, admin: boolean) {
  const base = {
    id: row.id,
    title: row.title,
    description: row.description,
    price: parseFloat(row.price),
    ...(row.old_price != null ? { oldPrice: parseFloat(row.old_price) } : {}),
    category: row.category,
    images: row.images,
    stock: row.stock,
    rating: parseFloat(row.rating),
    isFeatured: row.is_featured,
    specifications: row.specifications,
    variations: row.variations,
  };

  if (!admin) return base;

  return {
    ...base,
    cost: row.cost != null ? parseFloat(row.cost) : 0,
    salesType: row.sales_type || 'online',
    published: row.published !== false,
    ...(row.sale_price != null ? { salePrice: parseFloat(row.sale_price) } : {}),
    ...(toIso(row.sale_date) ? { saleDate: toIso(row.sale_date) } : {}),
    offlineDeliveryFee: row.offline_delivery_fee != null ? parseFloat(row.offline_delivery_fee) : 0,
  };
}

// Returns the full positional param list used by INSERT/UPDATE queries below.
// Admin-only fields ($13-$18) are passed as `null` when absent (e.g. a public/partial
// payload) so COALESCE in the SQL preserves whatever is already stored — they are never
// blindly overwritten with a default just because a caller didn't send them.
function productParams(p: any) {
  return [
    p.id, JSON.stringify(p.title), JSON.stringify(p.description ?? null), p.price,
    p.oldPrice ?? null, p.category,
    JSON.stringify(p.images ?? []),
    p.stock, p.rating, p.isFeatured ?? false,
    JSON.stringify(p.specifications ?? []),
    JSON.stringify(p.variations ?? []),
    p.cost ?? null,
    p.salesType ?? null,
    p.published ?? null,
    p.salePrice ?? null,
    p.saleDate ?? null,
    p.offlineDeliveryFee ?? null,
  ];
}

const UPSERT_SQL = `
  INSERT INTO products
    (id,title,description,price,old_price,category,images,stock,rating,is_featured,specifications,variations,
     cost,sales_type,published,sale_price,sale_date,offline_delivery_fee)
  VALUES
    ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,
     COALESCE($13,0),COALESCE($14,'online'),COALESCE($15,true),$16,$17,COALESCE($18,0))
  ON CONFLICT (id) DO UPDATE SET
    title=$2,description=$3,price=$4,old_price=$5,category=$6,images=$7,
    stock=$8,rating=$9,is_featured=$10,specifications=$11,variations=$12,
    cost=COALESCE($13,products.cost),
    sales_type=COALESCE($14,products.sales_type),
    published=COALESCE($15,products.published),
    sale_price=COALESCE($16,products.sale_price),
    sale_date=COALESCE($17,products.sale_date),
    offline_delivery_fee=COALESCE($18,products.offline_delivery_fee),
    updated_at=NOW()
  RETURNING *`;

// GET /api/products — PUBLIC/storefront: only published, online products; cost stripped.
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM products WHERE published = true AND sales_type = 'online' ORDER BY created_at`
    );
    res.json(result.rows.map(row => rowToProduct(row, false)));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET /api/products/admin — ADMIN DASHBOARD ONLY: every product (online + offline,
// published + unpublished), including cost. Must never be called from public pages.
router.get('/admin', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY created_at');
    res.json(result.rows.map(row => rowToProduct(row, true)));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE id=$1', [req.params.id]);
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(rowToProduct(result.rows[0], false));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /api/products — create one (admin use)
router.post('/', async (req, res) => {
  const p = req.body;
  try {
    const result = await pool.query(UPSERT_SQL, productParams(p));
    res.json(rowToProduct(result.rows[0], true));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT /api/products — bulk sync (upsert only — never deletes).
// Both the admin's full product list and the storefront's filtered/cost-stripped list
// get synced through here (the storefront syncs stock changes from cart actions). Because
// admin-only columns are COALESCE-preserved in UPSERT_SQL, a storefront payload that lacks
// cost/salesType/published/etc. can never wipe that data. Deletion is handled explicitly
// via DELETE /api/products/:id so a partial (filtered) payload can never drop rows it
// simply doesn't know about (e.g. offline products hidden from public clients).
router.put('/', async (req, res) => {
  const products: any[] = req.body;
  if (!Array.isArray(products) || products.length === 0) return res.json({ success: true });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const p of products) {
      await client.query(UPSERT_SQL, productParams(p));
    }
    await client.query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  } finally {
    client.release();
  }
});

// PUT /api/products/:id — update one
router.put('/:id', async (req, res) => {
  const p = req.body;
  try {
    const result = await pool.query(UPSERT_SQL, productParams({ ...p, id: req.params.id }));
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(rowToProduct(result.rows[0], true));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE /api/products/:id
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM products WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
