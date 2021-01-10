# Random.js

[![Build Status](https://travis-ci.org/ckknight/random-js.svg?branch=master)](https://travis-ci.org/ckknight/random-js)

This is designed to be a mathematically correct random number generator library for JavaScript.

Inspiration was primarily taken from C++11's `<random>`.

## Upgrading from 1.0
Upgrading from 1.0 to 2.0 is a major, breaking change. For the most part, the way exports are defined is different. Instead of everything being available as static properties on a class-like function, random-js 2.0 exports each binding in accordance with current ECMAScript standards.

## Why is this needed?

Despite `Math.random()` being capable of producing numbers within [0, 1), there are a few downsides to doing so:

- It is inconsistent between engines as to how many bits of randomness:
  - Internet Explorer: 53 bits
  - Mozilla Firefox: 53 bits
  - Google Chrome/node.js: 32 bits
  - Apple Safari: 32 bits
- It is non-deterministic, which means you can't replay results consistently
- In older browsers, there can be manipulation through cross-frame random polling. _This is mostly fixed in newer browsers and is required to be fixed in ECMAScript 6._

Also, and most crucially, most developers tend to use improper and biased logic as to generating integers within a uniform distribution.

## How does Random.js alleviate these problems?

Random.js provides a set of "engines" for producing random integers, which consistently provide values within [0, 4294967295], i.e. 32 bits of randomness.

- `nativeMath`: Utilizes [`Math.random()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random) and converts its result to a signed integer. This is appropriate to use if you do not care for a deterministic implementation. Based on the implementation (which is hidden to you as a developer), the period may be shorter than expected and start repeating itself.
- `browserCrypto`: Utilizes [`crypto.getRandomValues(Int32Array)`](https://developer.mozilla.org/en-US/docs/Web/API/window.crypto.getRandomValues). Only supported on newer browsers, but promises cryptographically random numbers.
- `nodeCrypto`: Utilizes [`require('crypto').randomBytes(size)`](https://nodejs.org/api/crypto.html#crypto_crypto_randombytes_size_callback). Only supported on node.
- `MersenneTwister19937`: An implementation of the [Mersenne Twister](http://en.wikipedia.org/wiki/Mersenne_twister) algorithm. Not cryptographically secure, but its results are repeatable. Must be seeded with a single integer or an array of integers or call `.autoSeed()` to automatically seed initial data. Guaranteed to produce consistent results across all JavaScript implementations assuming the same seed.

One is also free to implement their own engine as long as it returns 32-bit integers, either signed or unsigned.

Some common, biased, _incorrect_ tool for generating random integers is as follows:

    // DO NOT USE, BIASED LOGIC
    function randomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }
    // DO NOT USE, BIASED LOGIC (typical C-like implementation)
    function randomIntByModulo(min, max) {
      var i = (Math.random() * 32768) >>> 0;
      return (i % (min - max)) + min;
    }

The problem with both of these approaches is that the distribution of integers that it returns is not uniform. That is, it might be more biased to return `0` rather than `1`, making it inherently broken.

`randomInt` may more evenly distribute its biased, but it is still wrong. `randomIntByModulo`, at least in the example given, is heavily biased to return [0, 67] over [68, 99].

In order to eliminate bias, sometimes the engine which random data is pulled from may need to be used more than once.

Random.js provides a series of distributions to alleviate this.

## API

### Engines

- `nativeMath`: Utilizes `Math.random()`
- `browserCrypto`: Utilizes `crypto.getRandomValues()`
- `nodeCrypto`: Utilizes `require('crypto').randomBytes()`
- `MersenneTwister19937`: Produces a new Mersenne Twister. Must be seeded before use.

Or you can make your own!

```ts
interface Engine {
  next(): number; // an int32
}
```

Any object that fulfills that interface is an `Engine`.

### Mersenne Twister API

- `const mt = MersenneTwister19937.seed(value)`: Seed the twister with an initial 32-bit integer.
- `const mt = MersenneTwister19937.seedWithArray(array)`: Seed the twister with an array of 32-bit integers.
- `const mt = MersenneTwister19937.autoSeed()`: Seed the twister with automatic information. This uses the current Date and other entropy sources.
- `mt.next()`: Produce a 32-bit signed integer.
- `mt.discard(count)`: Discard `count` random values. More efficient than running `mt.next()` repeatedly.
- `mt.getUseCount()`: Return the number of times the engine has been used plus the number of discarded values.

One can seed a Mersenne Twister with the same value (`MersenneTwister19937.seed(value)`) or values (`MersenneTwister19937.seedWithArray(array)`) and discard the number of uses (`mt.getUseCount()`) to achieve the exact same state.

If you wish to know the initial seed of `MersenneTwister19937.autoSeed()`, it is recommended to use the `createEntropy()` function to create the seed manually (this is what `autoSeed` does under-the-hood).

```js
const seed = createEntropy();
const mt = MersenneTwister19937.seedWithArray(seed);
useTwisterALot(mt); // you'll have to implement this yourself
const clone = MersenneTwister19937.seedWithArray(seed).discard(
  mt.getUseCount()
);
// at this point, `mt` and `clone` will produce equivalent values
```

### Distributions

Random.js also provides a set of methods for producing useful data from an engine.

- `integer(min, max)(engine)`: Produce an integer within the inclusive range [`min`, `max`]. `min` can be at its minimum -9007199254740992 (-2 ** 53). `max` can be at its maximum 9007199254740992 (2 ** 53).
- `real(min, max, inclusive)(engine)`: Produce a floating point number within the range [`min`, `max`) or [`min`, `max`]. Uses 53 bits of randomness.
- `bool()(engine)`: Produce a boolean with a 50% chance of it being `true`.
- `bool(percentage)(engine)`: Produce a boolean with the specified chance causing it to be `true`.
- `bool(numerator, denominator)(engine)`: Produce a boolean with `numerator`/`denominator` chance of it being true.
- `pick(engine, array[, begin[, end]])`: Return a random value within the provided `array` within the sliced bounds of `begin` and `end`.
- `picker(array[, begin[, end]])(engine)`: Same as `pick(engine, array, begin, end)`.
- `shuffle(engine, array)`: Shuffle the provided `array` (in-place). Similar to `.sort()`.
- `sample(engine, population, sampleSize)`: From the `population` array, produce an array with `sampleSize` elements that are randomly chosen without repeats.
- `die(sideCount)(engine)`: Same as `integer(1, sideCount)(engine)`
- `dice(sideCount, dieCount)(engine)`: Produce an array of length `dieCount` with as many `die` rolls.
- `uuid4(engine)`: Produce a [Universally Unique Identifier](http://en.wikipedia.org/wiki/Universally_unique_identifier) Version 4.
- `string()(engine, length)`: Produce a random string using numbers, uppercase and lowercase letters, `_`, and `-` of length `length`.
- `string(pool)(engine, length)`: Produce a random string using the provided string `pool` as the possible characters to choose from of length `length`.
- `hex()(engine, length)` or `hex(false)(engine, length)`: Produce a random string comprised of numbers or the characters `abcdef` of length `length`.
- `hex(true)(engine, length)`: Produce a random string comprised of numbers or the characters `ABCDEF` of length `length`.
- `date(start, end)(engine)`: Produce a random `Date` within the inclusive range of [`start`, `end`]. `start` and `end` must both be `Date`s.

An example of using `integer` would be as such:

```js
// create a Mersenne Twister-19937 that is auto-seeded based on time and other random values
const engine = MersenneTwister19937.autoSeed();
// create a distribution that will consistently produce integers within inclusive range [0, 99].
const distribution = integer(0, 99);
// generate a number that is guaranteed to be within [0, 99] without any particular bias.
function generateNaturalLessThan100() {
  return distribution(engine);
}
```

Producing a distribution should be considered a cheap operation, but producing a new Mersenne Twister can be expensive.

An example of producing a random SHA1 hash:

```js
// using essentially Math.random()
var engine = nativeMath;
// lower-case Hex string distribution
var distribution = hex(false);
// generate a 40-character hex string
function generateSHA1() {
  return distribution(engine, 40);
}
```

## Alternate API

There is an alternate API which may be easier to use, but may be less performant. In scenarios where performance is paramount, it is recommended to use the aforementioned API.

```js
const random = new Random(
  MersenneTwister19937.seedWithArray([0x12345678, 0x90abcdef])
);
const value = r.integer(0, 99);

const otherRandom = new Random(); // same as new Random(nativeMath)
```

This abstracts the concepts of engines and distributions.

- `r.integer(min, max)`: Produce an integer within the inclusive range [`min`, `max`]. `min` can be at its minimum -9007199254740992 (2 ** 53). `max` can be at its maximum 9007199254740992 (2 ** 53). The special number `-0` is never returned.
- `r.real(min, max, inclusive)`: Produce a floating point number within the range [`min`, `max`) or [`min`, `max`]. Uses 53 bits of randomness.
- `r.bool()`: Produce a boolean with a 50% chance of it being `true`.
- `r.bool(percentage)`: Produce a boolean with the specified chance causing it to be `true`.
- `r.bool(numerator, denominator)`: Produce a boolean with `numerator`/`denominator` chance of it being true.
- `r.pick(array[, begin[, end]])`: Return a random value within the provided `array` within the sliced bounds of `begin` and `end`.
- `r.shuffle(array)`: Shuffle the provided `array` (in-place). Similar to `.sort()`.
- `r.sample(population, sampleSize)`: From the `population` array, produce an array with `sampleSize` elements that are randomly chosen without repeats.
- `r.die(sideCount)`: Same as `r.integer(1, sideCount)`
- `r.dice(sideCount, dieCount)`: Produce an array of length `dieCount` with as many `die` rolls.
- `r.uuid4()`: Produce a [Universally Unique Identifier](http://en.wikipedia.org/wiki/Universally_unique_identifier) Version 4.
- `r.string(length)`: Produce a random string using numbers, uppercase and lowercase letters, `_`, and `-` of length `length`.
- `r.string(length, pool)`: Produce a random string using the provided string `pool` as the possible characters to choose from of length `length`.
- `r.hex(length)` or `r.hex(length, false)`: Produce a random string comprised of numbers or the characters `abcdef` of length `length`.
- `r.hex(length, true)`: Produce a random string comprised of numbers or the characters `ABCDEF` of length `length`.
- `r.date(start, end)`: Produce a random `Date` within the inclusive range of [`start`, `end`]. `start` and `end` must both be `Date`s.

## Usage

### node.js

In your project, run the following command:

```sh
npm install random-js
```

or

```sh
yarn add random-js
```

In your code:

```js
// ES6 Modules
import { Random } from "random-js";
const random = new Random(); // uses the nativeMath engine
const value = random.integer(1, 100);
```

```js
// CommonJS Modules
const { Random } = require("random-js");
const random = new Random(); // uses the nativeMath engine
const value = random.integer(1, 100);
```

Or to have more control:

```js
const Random = require("random-js").Random;
const random = new Random(MersenneTwister19937.autoSeed());
const value = random.integer(1, 100);
```

It is recommended to create one shared engine and/or `Random` instance per-process rather than one per file.

### Browser using AMD or RequireJS

Download `random.min.js` and place it in your project, then use one of the following patterns:

```js
define(function(require) {
  var Random = require("random");
  return new Random.Random(Random.MersenneTwister19937.autoSeed());
});

define(function(require) {
  var Random = require("random");
  return new Random.Random();
});

define(["random"], function(Random) {
  return new Random.Random(Random.MersenneTwister19937.autoSeed());
});
```

### Browser using `<script>` tag

Download `random-js.min.js` and place it in your project, then add it as a `<script>` tag as such:

```html
<script src="lib/random-js.min.js"></script>
<script>
  // Random is now available as a global (on the window object)
  var random = new Random.Random();
  alert("Random value from 1 to 100: " + random.integer(1, 100));
</script>
```

## Extending

You can add your own methods to `Random` instances, as such:

```js
var random = new Random();
random.bark = function() {
  if (this.bool()) {
    return "arf!";
  } else {
    return "woof!";
  }
};
random.bark(); //=> "arf!" or "woof!"
```

This is the recommended approach, especially if you only use one instance of `Random`.

Or you could even make your own subclass of Random:

```js
function MyRandom(engine) {
  return Random.call(this, engine);
}
MyRandom.prototype = Object.create(Random.prototype);
MyRandom.prototype.constructor = MyRandom;
MyRandom.prototype.mood = function() {
  switch (this.integer(0, 2)) {
    case 0:
      return "Happy";
    case 1:
      return "Content";
    case 2:
      return "Sad";
  }
};
var random = new MyRandom();
random.mood(); //=> "Happy", "Content", or "Sad"
```

Or, if you have a build tool are are in an ES6+ environment:

```js
class MyRandom extends Random {
  mood() {
    switch (this.integer(0, 2)) {
      case 0:
        return "Happy";
      case 1:
        return "Content";
      case 2:
        return "Sad";
    }
  }
}
const random = new MyRandom();
random.mood(); //=> "Happy", "Content", or "Sad"
```

## Testing

All the code in Random.js is fully tested and covered using `jest`.

To run tests in node.js:

```sh
npm install
npm test
```

or

```sh
yarn install
yarn test
```

## License

The MIT License (MIT).

See the LICENSE file in this project for more details.
