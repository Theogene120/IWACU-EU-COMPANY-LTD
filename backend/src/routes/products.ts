import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

function rowToProduct(row: any) {
  return {
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
}

function productParams(p: any) {
  return [
    p.id, p.title, p.description, p.price,
    p.oldPrice ?? null, p.category,
    JSON.stringify(p.images ?? []),
    p.stock, p.rating, p.isFeatured ?? false,
    JSON.stringify(p.specifications ?? []),
    JSON.stringify(p.variations ?? []),
  ];
}

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY created_at');
    res.json(result.rows.map(rowToProduct));
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
    res.json(rowToProduct(result.rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /api/products — create one
router.post('/', async (req, res) => {
  const p = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO products
         (id,title,description,price,old_price,category,images,stock,rating,is_featured,specifications,variations)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       ON CONFLICT (id) DO UPDATE SET
         title=$2,description=$3,price=$4,old_price=$5,category=$6,images=$7,
         stock=$8,rating=$9,is_featured=$10,specifications=$11,variations=$12,updated_at=NOW()
       RETURNING *`,
      productParams(p)
    );
    res.json(rowToProduct(result.rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT /api/products — bulk sync (replaces all products)
router.put('/', async (req, res) => {
  const products: any[] = req.body;
  if (!Array.isArray(products) || products.length === 0) return res.json({ success: true });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const p of products) {
      await client.query(
        `INSERT INTO products
           (id,title,description,price,old_price,category,images,stock,rating,is_featured,specifications,variations)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
         ON CONFLICT (id) DO UPDATE SET
           title=$2,description=$3,price=$4,old_price=$5,category=$6,images=$7,
           stock=$8,rating=$9,is_featured=$10,specifications=$11,variations=$12,updated_at=NOW()`,
        productParams(p)
      );
    }
    const ids = products.map(p => p.id);
    await client.query('DELETE FROM products WHERE id != ALL($1::text[])', [ids]);
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
    const params = productParams({ ...p, id: req.params.id });
    const result = await pool.query(
      `UPDATE products SET
         title=$2,description=$3,price=$4,old_price=$5,category=$6,images=$7,
         stock=$8,rating=$9,is_featured=$10,specifications=$11,variations=$12,updated_at=NOW()
       WHERE id=$1 RETURNING *`,
      params
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(rowToProduct(result.rows[0]));
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
