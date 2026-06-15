import { Router } from 'express';

const router = Router();

router.post('/', (req, res) => {
  res.json({ success: true });
});

export default router;
