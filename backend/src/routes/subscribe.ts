import { Router } from 'express';
import { sendSubscriptionEmail } from '../utils/mailer.js';

const router = Router();

const VALID_TYPES = ['advertise', 'partner', 'agent'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/subscribe — emails the company inbox with the subscriber's email and interest type.
router.post('/', async (req, res) => {
  const { email, type } = req.body;
  if (!email || typeof email !== 'string' || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'A valid email is required' });
  }
  if (!type || !VALID_TYPES.includes(type)) {
    return res.status(400).json({ error: 'A valid subscription type is required' });
  }

  try {
    await sendSubscriptionEmail(email, type);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send subscription email' });
  }
});

export default router;
