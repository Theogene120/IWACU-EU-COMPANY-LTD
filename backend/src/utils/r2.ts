import { S3Client } from '@aws-sdk/client-s3';

const REQUIRED_VARS = [
  'R2_ACCOUNT_ID',
  'R2_ACCESS_KEY_ID',
  'R2_SECRET_ACCESS_KEY',
  'R2_BUCKET_NAME',
  'R2_PUBLIC_URL',
] as const;

for (const name of REQUIRED_VARS) {
  if (!process.env[name]) {
    throw new Error(`[r2] Missing required env var ${name} — uploads require all of ${REQUIRED_VARS.join(', ')}`);
  }
}

export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME as string;
export const R2_PUBLIC_URL = (process.env.R2_PUBLIC_URL as string).replace(/\/+$/, '');

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
  },
});
