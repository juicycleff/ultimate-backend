import { Engine } from "../types";
/**
 * An Engine that relies on the globally-available `crypto.getRandomValues`,
 * which is typically available in modern browsers.
 *
 * See https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues
 *
 * If unavailable or otherwise non-functioning, then `browserCrypto` will
 * likely `throw` on the first call to `next()`.
 */
export declare const browserCrypto: Engine;
