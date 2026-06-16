import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

function toIso(v: any): string {
  if (!v) return '';
  return v instanceof Date ? v.toISOString() : String(v);
}

function rowToOrder(row: any) {
  return {
    id: row.id,
    customerName: row.customer_name,
    phone: row.phone,
    address: row.address,
    items: row.items,
    total: parseFloat(row.total),
    deliveryFee: row.delivery_fee != null ? parseFloat(row.delivery_fee) : 0,
    status: row.status,
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    ...(row.payment_message ? { paymentMessage: row.payment_message } : {}),
    ...(row.transaction_id ? { transactionId: row.transaction_id } : {}),
    ...(row.payer_phone ? { payerPhone: row.payer_phone } : {}),
    ...(row.receiver_phone ? { receiverPhone: row.receiver_phone } : {}),
    paymentDate: toIso(row.payment_date),
    createdAt: toIso(row.created_at),
  };
}

function orderParams(o: any) {
  return [
    o.id, o.customerName, o.phone, o.address,
    JSON.stringify(o.items ?? []), o.total, o.status,
    o.paymentMethod, o.paymentStatus,
    o.paymentMessage ?? null, o.transactionId ?? null,
    o.payerPhone ?? null, o.receiverPhone ?? null,
    o.paymentDate ?? null, o.deliveryFee ?? 0, o.createdAt ?? new Date().toISOString(),
  ];
}

// GET /api/orders
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(result.rows.map(rowToOrder));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /api/orders — create one
router.post('/', async (req, res) => {
  const o = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO orders
         (id,customer_name,phone,address,items,total,status,payment_method,payment_status,
          payment_message,transaction_id,payer_phone,receiver_phone,payment_date,delivery_fee,created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
       ON CONFLICT (id) DO UPDATE SET
         customer_name=$2,phone=$3,address=$4,items=$5,total=$6,status=$7,
         payment_method=$8,payment_status=$9,payment_message=$10,transaction_id=$11,
         payer_phone=$12,receiver_phone=$13,payment_date=$14,delivery_fee=$15
       RETURNING *`,
      orderParams(o)
    );
    res.json(rowToOrder(result.rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT /api/orders — bulk sync (replaces all orders)
router.put('/', async (req, res) => {
  const orders: any[] = req.body;
  if (!Array.isArray(orders)) return res.status(400).json({ error: 'Expected array' });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const o of orders) {
      await client.query(
        `INSERT INTO orders
           (id,customer_name,phone,address,items,total,status,payment_method,payment_status,
            payment_message,transaction_id,payer_phone,receiver_phone,payment_date,delivery_fee,created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
         ON CONFLICT (id) DO UPDATE SET
           customer_name=$2,phone=$3,address=$4,items=$5,total=$6,status=$7,
           payment_method=$8,payment_status=$9,payment_message=$10,transaction_id=$11,
           payer_phone=$12,receiver_phone=$13,payment_date=$14,delivery_fee=$15`,
        orderParams(o)
      );
    }
    if (orders.length > 0) {
      await client.query('DELETE FROM orders WHERE id != ALL($1::text[])', [orders.map(o => o.id)]);
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

// PUT /api/orders/:id — update one
router.put('/:id', async (req, res) => {
  const o = { ...req.body, id: req.params.id };
  try {
    const result = await pool.query(
      `UPDATE orders SET
         customer_name=$2,phone=$3,address=$4,items=$5,total=$6,status=$7,
         payment_method=$8,payment_status=$9,payment_message=$10,transaction_id=$11,
         payer_phone=$12,receiver_phone=$13,payment_date=$14,delivery_fee=$15
       WHERE id=$1 RETURNING *`,
      orderParams(o).slice(0, 15) // exclude created_at for update
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(rowToOrder(result.rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE /api/orders/:id
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM orders WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
