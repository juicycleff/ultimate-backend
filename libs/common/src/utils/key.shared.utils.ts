import { readFileSync } from 'fs';

export function extractKey(path: string) {
  return readFileSync(path).toString();
}
