import {randomBytes} from 'crypto';

export async function generateUniqueByte() {
  const buffer = await randomBytes(12);
  return buffer.toString('hex');
}
