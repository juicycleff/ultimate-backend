/**
 * Deferred object based on MDN spec
 * https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/Promise.jsm/Deferred
 *
 * @export
 * @class Deferred
 * @template T
 */
export class Deferred<T> {
  resolve;
  reject;
  promise: Promise<T>;

  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
    Object.freeze(this);
  }
}
