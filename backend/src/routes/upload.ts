import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from '../utils/r2.js';

const router = Router();

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/', upload.single('image'), async (req: any, res: any) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const key = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(req.file.originalname);

  try {
    await r2Client.send(new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    }));
    res.json({ url: `${R2_PUBLIC_URL}/${key}` });
  } catch (err) {
    console.error('[upload] R2 upload failed:', err);
    res.status(502).json({ error: 'Upload failed' });
  }
});

export default router;
