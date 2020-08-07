import { randomBytes } from 'crypto';

async function generateUniqueByte() {
  const buffer = await randomBytes(12);
  return buffer.toString('hex');
}
