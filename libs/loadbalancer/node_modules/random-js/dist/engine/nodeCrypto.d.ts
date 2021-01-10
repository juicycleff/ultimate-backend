import { Engine } from "../types";
/**
 * An Engine that relies on the node-available
 * `require('crypto').randomBytes`, which has been available since 0.58.
 *
 * See https://nodejs.org/api/crypto.html#crypto_crypto_randombytes_size_callback
 *
 * If unavailable or otherwise non-functioning, then `nodeCrypto` will
 * likely `throw` on the first call to `next()`.
 */
export declare const nodeCrypto: Engine;
