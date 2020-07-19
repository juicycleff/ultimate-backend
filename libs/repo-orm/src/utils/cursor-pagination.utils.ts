import * as base64url from 'base64-url';

export function toCursor(value) {
  return base64url.encode(value.toString());
}

export function fromCursor(str) {
  const value = base64url.decode(str);
  if (value) {
    return value;
  } else {
    return null;
  }
}

export const CursorUtils = {
  toCursor,
  fromCursor,
};
