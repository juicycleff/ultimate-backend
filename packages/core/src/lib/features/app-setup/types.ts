/*******************************************************************************
 * Copyright (c) 2021. Rex Isaac Raphael
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files
 * (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 * THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 * File name:         types.ts
 * Last modified:     15/07/2021, 21:31
 ******************************************************************************/

export interface CookieOptions {
  /**
   * @defautl '_csrf'
   */
  key?: string;
  maxAge?: number;
  signed?: boolean;
  expires?: Date;
  httpOnly?: boolean;
  path?: string;
  domain?: string;
  secure?: boolean;
  encode?: (val: string) => string;
  sameSite?: boolean | 'lax' | 'strict' | 'none';
}

export interface SessionOptions {
  /**
   * This is the secret used to sign the session cookie. This can be either a string for a single secret, or an array of multiple secrets.
   * If an array of secrets is provided, **only the first element will be used to sign** the session ID cookie,
   *   while **all the elements will be considered when verifying the signature** in requests.
   * The secret itself should be not easily parsed by a human and would best be a random set of characters
   *
   * Best practices may include:
   * - The use of environment variables to store the secret, ensuring the secret itself does not exist in your repository.
   * - Periodic updates of the secret, while ensuring the previous secret is in the array.
   *
   * Using a secret that cannot be guessed will reduce the ability to hijack a session to only guessing the session ID (as determined by the `genid` option).
   *
   * Changing the secret value will invalidate all existing sessions.
   * In order to rotate the secret without invalidating sessions, provide an array of secrets,
   *   with the new secret as first element of the array, and including previous secrets as the later elements.
   */
  secret: string | string[];

  /**
   * Function to call to generate a new session ID. Provide a function that returns a string that will be used as a session ID.
   * The function is given the request as the first argument if you want to use some value attached to it when generating the ID.
   *
   * The default value is a function which uses the uid-safe library to generate IDs.
   * Be careful to generate unique IDs so your sessions do not conflict.
   */
  genid?(req: any): string;

  /**
   * The name of the session ID cookie to set in the response (and read from in the request).
   * The default value is 'connect.sid'.
   *
   * Note if you have multiple apps running on the same hostname (this is just the name, i.e. `localhost` or `127.0.0.1`; different schemes and ports do not name a different hostname),
   *   then you need to separate the session cookies from each other.
   * The simplest method is to simply set different names per app.
   */
  name?: string;

  /**
   * The session store instance, defaults to a new `MemoryStore` instance.
   * @see MemoryStore
   */
  store?: any;

  /**
   * Settings object for the session ID cookie.
   * @see CookieOptions
   */
  cookie?: CookieOptions;

  /**
   * Force the session identifier cookie to be set on every response. The expiration is reset to the original `maxAge`, resetting the expiration countdown.
   * The default value is `false`.
   *
   * With this enabled, the session identifier cookie will expire in `maxAge` *since the last response was sent* instead of in `maxAge` *since the session was last modified by the server*.
   * This is typically used in conjuction with short, non-session-length `maxAge` values to provide a quick timeout of the session data
   *   with reduced potential of it occurring during on going server interactions.
   *
   * Note that when this option is set to `true` but the `saveUninitialized` option is set to `false`, the cookie will not be set on a response with an uninitialized session.
   * This option only modifies the behavior when an existing session was loaded for the request.
   *
   * @see saveUninitialized
   */
  rolling?: boolean;

  /**
   * Forces the session to be saved back to the session store, even if the session was never modified during the request.
   * Depending on your store this may be necessary, but it can also create race conditions where a client makes two parallel requests to your server
   *   and changes made to the session in one request may get overwritten when the other request ends, even if it made no changes (this behavior also depends on what store you're using).
   *
   * The default value is `true`, but using the default has been deprecated, as the default will change in the future.
   * Please research into this setting and choose what is appropriate to your use-case. Typically, you'll want `false`.
   *
   * How do I know if this is necessary for my store? The best way to know is to check with your store if it implements the `touch` method.
   * If it does, then you can safely set `resave: false`.
   * If it does not implement the `touch` method and your store sets an expiration date on stored sessions, then you likely need `resave: true`.
   */
  resave?: boolean;

  /**
   * Trust the reverse proxy when setting secure cookies (via the "X-Forwarded-Proto" header).
   * The default value is undefined.
   *
   * - `true`: The `X-Forwarded-Proto` header will be used.
   * - `false`: All headers are ignored and the connection is considered secure only if there is a direct TLS/SSL connection.
   * - `undefined`: Uses the "trust proxy" setting from express
   */
  proxy?: boolean;

  /**
   * Forces a session that is "uninitialized" to be saved to the store. A session is uninitialized when it is new but not modified.
   * Choosing `false` is useful for implementing login sessions, reducing server storage usage, or complying with laws that require permission before setting a cookie.
   * Choosing `false` will also help with race conditions where a client makes multiple parallel requests without a session.
   *
   * The default value is `true`, but using the default has been deprecated, as the default will change in the future.
   * Please research into this setting and choose what is appropriate to your use-case.
   *
   * **If you are using `express-session` in conjunction with PassportJS:**
   * Passport will add an empty Passport object to the session for use after a user is authenticated, which will be treated as a modification to the session, causing it to be saved.
   * This has been fixed in PassportJS 0.3.0.
   */
  saveUninitialized?: boolean;

  /**
   * Control the result of unsetting req.session (through delete, setting to null, etc.).
   * - `destroy`: The session will be destroyed (deleted) when the response ends.
   * - `keep`: The session in the store will be kept, but modifications made during the request are ignored and not saved.
   * @default 'keep'
   */
  unset?: 'destroy' | 'keep';
}

export interface SwaggerCustomOptions {
  explorer?: boolean;
  swaggerOptions?: Record<string, any>;
  customCss?: string;
  customCssUrl?: string;
  customJs?: string;
  customfavIcon?: string;
  swaggerUrl?: string;
  customSiteTitle?: string;
  validatorUrl?: string;
  url?: string;
  urls?: Record<'url' | 'name', string>[];
}

export interface SwaggerDocumentOptions {
  include?: Function[];
  extraModels?: Function[];
  ignoreGlobalPrefix?: boolean;
  deepScanRoutes?: boolean;
  operationIdFactory?: (controllerKey: string, methodKey: string) => string;
}
