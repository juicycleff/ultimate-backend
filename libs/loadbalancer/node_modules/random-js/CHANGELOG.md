# 2.1.0 (2019-05-30)

- Changed `dist/` outputs:
  - `random-js.js` => `random-js.umd.js`
  - `random-js.mjs` => `random-js.esm.js`
  - `random-js.min.js` => `random-js.umd.min.js`

# 2.0.0 (2019-04-01)

- Release 2.0.0 (no code changes from 2.0.0-rc5)

# 2.0.0-rc5 (2019-03-15)

- Add sourcemaps

# 2.0.0-rc4 (2019-03-15)

- Improve minified bundle size
- Add `"sideEffects": false` to `package.json` as a hint to Webpack

# 2.0.0-rc3 (2019-03-10)

- Provide a binding for `try`-`catch` to help parsing issues [#30](https://github.com/ckknight/random-js/issues/30)

# 2.0.0-rc2 (2019-02-20)

- Added `nodeCrypto` engine
- Exposed `createEntropy` function, which can be used when seeding a Mersenne Twister
- Changed `browserCrypto` to no longer be `null` if outside of a browser context, instead `throw`ing on first use.

# 2.0.0-rc1 (2019-02-17)

- Converted to TypeScript, with type definitions available.
- Using ESNext-style modules (though still available as UMD)
- Changed exports so that they are not available on the `Random` class, but instead in a flat hierarchy.
- Switched from jasmine to jest
- Using rollup to package the build
- Changed .travis.yml node versions

# 1.0.8 (2015-10-13)

- add `getUseCount()` to the `mt19937` engine, which returns how many requests or discards have occurred.

# 1.0.7 (2015-10-13)

- the current time is now used in `Random.generateEntropyArray`

# 1.0.6 (2015-09-28)

- removed the optionalDependencies in package.json "benchmark" and "microtime".

# 1.0.5 (2015-03-03)

- `sample()` results are no longer biased toward the final element.
- `discard(count)` on the `mt19937` engine properly works when count is less than 625
- Clarify that the built-in engines return signed 32-bit integers (not unsigned).

# 1.0.4 (2014-05-11)

- `string('')` now throws an error
- `hex(upper)` now returns a cached function, for efficiency.
- add `int32()`, which returns an integer from `-0x80000000` to `0x7fffffff`.
- performance enhancements
- add benchmark suite, covers engines, integer, bool, and real.
- add `date(start, end)`, which returns a Date within a uniform distribution.

# 1.0.3 (2014-04-23)

- `Random` no longer needs to be called with new, allowing `var r = require('random-js')()`
- Add `begin` and `end` arguments to `pick` and `picker`.

# 1.0.2 (2014-03-20)

- Even if `shuffle` receives an empty array, it should return that same array.

# 1.0.1 (2014-03-20)

- Fix `sample` and `shuffle` when they are passed an empty array.
- Include `-c` (compress) option when uglifying.

# 1.0.0 (2014-02-16)

Initial release
