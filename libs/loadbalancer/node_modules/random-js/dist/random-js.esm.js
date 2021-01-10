const SMALLEST_UNSAFE_INTEGER = 0x20000000000000;
const LARGEST_SAFE_INTEGER = SMALLEST_UNSAFE_INTEGER - 1;
const UINT32_MAX = -1 >>> 0;
const UINT32_SIZE = UINT32_MAX + 1;
const INT32_SIZE = UINT32_SIZE / 2;
const INT32_MAX = INT32_SIZE - 1;
const UINT21_SIZE = 1 << 21;
const UINT21_MAX = UINT21_SIZE - 1;

/**
 * Returns a value within [-0x80000000, 0x7fffffff]
 */
function int32(engine) {
    return engine.next() | 0;
}

function add(distribution, addend) {
    if (addend === 0) {
        return distribution;
    }
    else {
        return engine => distribution(engine) + addend;
    }
}

/**
 * Returns a value within [-0x20000000000000, 0x1fffffffffffff]
 */
function int53(engine) {
    const high = engine.next() | 0;
    const low = engine.next() >>> 0;
    return ((high & UINT21_MAX) * UINT32_SIZE +
        low +
        (high & UINT21_SIZE ? -SMALLEST_UNSAFE_INTEGER : 0));
}

/**
 * Returns a value within [-0x20000000000000, 0x20000000000000]
 */
function int53Full(engine) {
    while (true) {
        const high = engine.next() | 0;
        if (high & 0x400000) {
            if ((high & 0x7fffff) === 0x400000 && (engine.next() | 0) === 0) {
                return SMALLEST_UNSAFE_INTEGER;
            }
        }
        else {
            const low = engine.next() >>> 0;
            return ((high & UINT21_MAX) * UINT32_SIZE +
                low +
                (high & UINT21_SIZE ? -SMALLEST_UNSAFE_INTEGER : 0));
        }
    }
}

/**
 * Returns a value within [0, 0xffffffff]
 */
function uint32(engine) {
    return engine.next() >>> 0;
}

/**
 * Returns a value within [0, 0x1fffffffffffff]
 */
function uint53(engine) {
    const high = engine.next() & UINT21_MAX;
    const low = engine.next() >>> 0;
    return high * UINT32_SIZE + low;
}

/**
 * Returns a value within [0, 0x20000000000000]
 */
function uint53Full(engine) {
    while (true) {
        const high = engine.next() | 0;
        if (high & UINT21_SIZE) {
            if ((high & UINT21_MAX) === 0 && (engine.next() | 0) === 0) {
                return SMALLEST_UNSAFE_INTEGER;
            }
        }
        else {
            const low = engine.next() >>> 0;
            return (high & UINT21_MAX) * UINT32_SIZE + low;
        }
    }
}

function isPowerOfTwoMinusOne(value) {
    return ((value + 1) & value) === 0;
}
function bitmask(masking) {
    return (engine) => engine.next() & masking;
}
function downscaleToLoopCheckedRange(range) {
    const extendedRange = range + 1;
    const maximum = extendedRange * Math.floor(UINT32_SIZE / extendedRange);
    return engine => {
        let value = 0;
        do {
            value = engine.next() >>> 0;
        } while (value >= maximum);
        return value % extendedRange;
    };
}
function downscaleToRange(range) {
    if (isPowerOfTwoMinusOne(range)) {
        return bitmask(range);
    }
    else {
        return downscaleToLoopCheckedRange(range);
    }
}
function isEvenlyDivisibleByMaxInt32(value) {
    return (value | 0) === 0;
}
function upscaleWithHighMasking(masking) {
    return engine => {
        const high = engine.next() & masking;
        const low = engine.next() >>> 0;
        return high * UINT32_SIZE + low;
    };
}
function upscaleToLoopCheckedRange(extendedRange) {
    const maximum = extendedRange * Math.floor(SMALLEST_UNSAFE_INTEGER / extendedRange);
    return engine => {
        let ret = 0;
        do {
            const high = engine.next() & UINT21_MAX;
            const low = engine.next() >>> 0;
            ret = high * UINT32_SIZE + low;
        } while (ret >= maximum);
        return ret % extendedRange;
    };
}
function upscaleWithinU53(range) {
    const extendedRange = range + 1;
    if (isEvenlyDivisibleByMaxInt32(extendedRange)) {
        const highRange = ((extendedRange / UINT32_SIZE) | 0) - 1;
        if (isPowerOfTwoMinusOne(highRange)) {
            return upscaleWithHighMasking(highRange);
        }
    }
    return upscaleToLoopCheckedRange(extendedRange);
}
function upscaleWithinI53AndLoopCheck(min, max) {
    return engine => {
        let ret = 0;
        do {
            const high = engine.next() | 0;
            const low = engine.next() >>> 0;
            ret =
                (high & UINT21_MAX) * UINT32_SIZE +
                    low +
                    (high & UINT21_SIZE ? -SMALLEST_UNSAFE_INTEGER : 0);
        } while (ret < min || ret > max);
        return ret;
    };
}
/**
 * Returns a Distribution to return a value within [min, max]
 * @param min The minimum integer value, inclusive. No less than -0x20000000000000.
 * @param max The maximum integer value, inclusive. No greater than 0x20000000000000.
 */
function integer(min, max) {
    min = Math.floor(min);
    max = Math.floor(max);
    if (min < -SMALLEST_UNSAFE_INTEGER || !isFinite(min)) {
        throw new RangeError(`Expected min to be at least ${-SMALLEST_UNSAFE_INTEGER}`);
    }
    else if (max > SMALLEST_UNSAFE_INTEGER || !isFinite(max)) {
        throw new RangeError(`Expected max to be at most ${SMALLEST_UNSAFE_INTEGER}`);
    }
    const range = max - min;
    if (range <= 0 || !isFinite(range)) {
        return () => min;
    }
    else if (range === UINT32_MAX) {
        if (min === 0) {
            return uint32;
        }
        else {
            return add(int32, min + INT32_SIZE);
        }
    }
    else if (range < UINT32_MAX) {
        return add(downscaleToRange(range), min);
    }
    else if (range === LARGEST_SAFE_INTEGER) {
        return add(uint53, min);
    }
    else if (range < LARGEST_SAFE_INTEGER) {
        return add(upscaleWithinU53(range), min);
    }
    else if (max - 1 - min === LARGEST_SAFE_INTEGER) {
        return add(uint53Full, min);
    }
    else if (min === -SMALLEST_UNSAFE_INTEGER &&
        max === SMALLEST_UNSAFE_INTEGER) {
        return int53Full;
    }
    else if (min === -SMALLEST_UNSAFE_INTEGER && max === LARGEST_SAFE_INTEGER) {
        return int53;
    }
    else if (min === -LARGEST_SAFE_INTEGER && max === SMALLEST_UNSAFE_INTEGER) {
        return add(int53, 1);
    }
    else if (max === SMALLEST_UNSAFE_INTEGER) {
        return add(upscaleWithinI53AndLoopCheck(min - 1, max - 1), 1);
    }
    else {
        return upscaleWithinI53AndLoopCheck(min, max);
    }
}

function isLeastBitTrue(engine) {
    return (engine.next() & 1) === 1;
}
function lessThan(distribution, value) {
    return engine => distribution(engine) < value;
}
function probability(percentage) {
    if (percentage <= 0) {
        return () => false;
    }
    else if (percentage >= 1) {
        return () => true;
    }
    else {
        const scaled = percentage * UINT32_SIZE;
        if (scaled % 1 === 0) {
            return lessThan(int32, (scaled - INT32_SIZE) | 0);
        }
        else {
            return lessThan(uint53, Math.round(percentage * SMALLEST_UNSAFE_INTEGER));
        }
    }
}
function bool(numerator, denominator) {
    if (denominator == null) {
        if (numerator == null) {
            return isLeastBitTrue;
        }
        return probability(numerator);
    }
    else {
        if (numerator <= 0) {
            return () => false;
        }
        else if (numerator >= denominator) {
            return () => true;
        }
        return lessThan(integer(0, denominator - 1), numerator);
    }
}

/**
 * Returns a Distribution that returns a random `Date` within the inclusive
 * range of [`start`, `end`].
 * @param start The minimum `Date`
 * @param end The maximum `Date`
 */
function date(start, end) {
    const distribution = integer(+start, +end);
    return engine => new Date(distribution(engine));
}

/**
 * Returns a Distribution to return a value within [1, sideCount]
 * @param sideCount The number of sides of the die
 */
function die(sideCount) {
    return integer(1, sideCount);
}

/**
 * Returns a distribution that returns an array of length `dieCount` of values
 * within [1, `sideCount`]
 * @param sideCount The number of sides of each die
 * @param dieCount The number of dice
 */
function dice(sideCount, dieCount) {
    const distribution = die(sideCount);
    return engine => {
        const result = [];
        for (let i = 0; i < dieCount; ++i) {
            result.push(distribution(engine));
        }
        return result;
    };
}

// tslint:disable:unified-signatures
// has 2**x chars, for faster uniform distribution
const DEFAULT_STRING_POOL = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-";
function string(pool = DEFAULT_STRING_POOL) {
    const poolLength = pool.length;
    if (!poolLength) {
        throw new Error("Expected pool not to be an empty string");
    }
    const distribution = integer(0, poolLength - 1);
    return (engine, length) => {
        let result = "";
        for (let i = 0; i < length; ++i) {
            const j = distribution(engine);
            result += pool.charAt(j);
        }
        return result;
    };
}

const LOWER_HEX_POOL = "0123456789abcdef";
const lowerHex = string(LOWER_HEX_POOL);
const upperHex = string(LOWER_HEX_POOL.toUpperCase());
/**
 * Returns a Distribution that returns a random string comprised of numbers
 * or the characters `abcdef` (or `ABCDEF`) of length `length`.
 * @param length Length of the result string
 * @param uppercase Whether the string should use `ABCDEF` instead of `abcdef`
 */
function hex(uppercase) {
    if (uppercase) {
        return upperHex;
    }
    else {
        return lowerHex;
    }
}

function convertSliceArgument(value, length) {
    if (value < 0) {
        return Math.max(value + length, 0);
    }
    else {
        return Math.min(value, length);
    }
}

function toInteger(value) {
    const num = +value;
    if (num < 0) {
        return Math.ceil(num);
    }
    else {
        return Math.floor(num);
    }
}

/**
 * Returns a random value within the provided `source` within the sliced
 * bounds of `begin` and `end`.
 * @param source an array of items to pick from
 * @param begin the beginning slice index (defaults to `0`)
 * @param end the ending slice index (defaults to `source.length`)
 */
function pick(engine, source, begin, end) {
    const length = source.length;
    if (length === 0) {
        throw new RangeError("Cannot pick from an empty array");
    }
    const start = begin == null ? 0 : convertSliceArgument(toInteger(begin), length);
    const finish = end === void 0 ? length : convertSliceArgument(toInteger(end), length);
    if (start >= finish) {
        throw new RangeError(`Cannot pick between bounds ${start} and ${finish}`);
    }
    const distribution = integer(start, finish - 1);
    return source[distribution(engine)];
}

function multiply(distribution, multiplier) {
    if (multiplier === 1) {
        return distribution;
    }
    else if (multiplier === 0) {
        return () => 0;
    }
    else {
        return engine => distribution(engine) * multiplier;
    }
}

/**
 * Returns a floating-point value within [0.0, 1.0)
 */
function realZeroToOneExclusive(engine) {
    return uint53(engine) / SMALLEST_UNSAFE_INTEGER;
}

/**
 * Returns a floating-point value within [0.0, 1.0]
 */
function realZeroToOneInclusive(engine) {
    return uint53Full(engine) / SMALLEST_UNSAFE_INTEGER;
}

/**
 * Returns a floating-point value within [min, max) or [min, max]
 * @param min The minimum floating-point value, inclusive.
 * @param max The maximum floating-point value.
 * @param inclusive If true, `max` will be inclusive.
 */
function real(min, max, inclusive = false) {
    if (!isFinite(min)) {
        throw new RangeError("Expected min to be a finite number");
    }
    else if (!isFinite(max)) {
        throw new RangeError("Expected max to be a finite number");
    }
    return add(multiply(inclusive ? realZeroToOneInclusive : realZeroToOneExclusive, max - min), min);
}

const sliceArray = Array.prototype.slice;

/**
 * Shuffles an array in-place
 * @param engine The Engine to use when choosing random values
 * @param array The array to shuffle
 * @param downTo minimum index to shuffle. Only used internally.
 */
function shuffle(engine, array, downTo = 0) {
    const length = array.length;
    if (length) {
        for (let i = (length - 1) >>> 0; i > downTo; --i) {
            const distribution = integer(0, i);
            const j = distribution(engine);
            if (i !== j) {
                const tmp = array[i];
                array[i] = array[j];
                array[j] = tmp;
            }
        }
    }
    return array;
}

/**
 * From the population array, produce an array with sampleSize elements that
 * are randomly chosen without repeats.
 * @param engine The Engine to use when choosing random values
 * @param population An array that has items to choose a sample from
 * @param sampleSize The size of the result array
 */
function sample(engine, population, sampleSize) {
    if (sampleSize < 0 ||
        sampleSize > population.length ||
        !isFinite(sampleSize)) {
        throw new RangeError("Expected sampleSize to be within 0 and the length of the population");
    }
    if (sampleSize === 0) {
        return [];
    }
    const clone = sliceArray.call(population);
    const length = clone.length;
    if (length === sampleSize) {
        return shuffle(engine, clone, 0);
    }
    const tailLength = length - sampleSize;
    return shuffle(engine, clone, tailLength - 1).slice(tailLength);
}

const stringRepeat = (() => {
    try {
        if ("x".repeat(3) === "xxx") {
            return (pattern, count) => pattern.repeat(count);
        }
    }
    catch (_) {
        // nothing to do here
    }
    return (pattern, count) => {
        let result = "";
        while (count > 0) {
            if (count & 1) {
                result += pattern;
            }
            count >>= 1;
            pattern += pattern;
        }
        return result;
    };
})();

function zeroPad(text, zeroCount) {
    return stringRepeat("0", zeroCount - text.length) + text;
}
/**
 * Returns a Universally Unique Identifier Version 4.
 *
 * See http://en.wikipedia.org/wiki/Universally_unique_identifier
 */
function uuid4(engine) {
    const a = engine.next() >>> 0;
    const b = engine.next() | 0;
    const c = engine.next() | 0;
    const d = engine.next() >>> 0;
    return (zeroPad(a.toString(16), 8) +
        "-" +
        zeroPad((b & 0xffff).toString(16), 4) +
        "-" +
        zeroPad((((b >> 4) & 0x0fff) | 0x4000).toString(16), 4) +
        "-" +
        zeroPad(((c & 0x3fff) | 0x8000).toString(16), 4) +
        "-" +
        zeroPad(((c >> 4) & 0xffff).toString(16), 4) +
        zeroPad(d.toString(16), 8));
}

/**
 * An int32-producing Engine that uses `Math.random()`
 */
const nativeMath = {
    next() {
        return (Math.random() * UINT32_SIZE) | 0;
    }
};

// tslint:disable:unified-signatures
/**
 * A wrapper around an Engine that provides easy-to-use methods for
 * producing values based on known distributions
 */
class Random {
    /**
     * Creates a new Random wrapper
     * @param engine The engine to use (defaults to a `Math.random`-based implementation)
     */
    constructor(engine = nativeMath) {
        this.engine = engine;
    }
    /**
     * Returns a value within [-0x80000000, 0x7fffffff]
     */
    int32() {
        return int32(this.engine);
    }
    /**
     * Returns a value within [0, 0xffffffff]
     */
    uint32() {
        return uint32(this.engine);
    }
    /**
     * Returns a value within [0, 0x1fffffffffffff]
     */
    uint53() {
        return uint53(this.engine);
    }
    /**
     * Returns a value within [0, 0x20000000000000]
     */
    uint53Full() {
        return uint53Full(this.engine);
    }
    /**
     * Returns a value within [-0x20000000000000, 0x1fffffffffffff]
     */
    int53() {
        return int53(this.engine);
    }
    /**
     * Returns a value within [-0x20000000000000, 0x20000000000000]
     */
    int53Full() {
        return int53Full(this.engine);
    }
    /**
     * Returns a value within [min, max]
     * @param min The minimum integer value, inclusive. No less than -0x20000000000000.
     * @param max The maximum integer value, inclusive. No greater than 0x20000000000000.
     */
    integer(min, max) {
        return integer(min, max)(this.engine);
    }
    /**
     * Returns a floating-point value within [0.0, 1.0]
     */
    realZeroToOneInclusive() {
        return realZeroToOneInclusive(this.engine);
    }
    /**
     * Returns a floating-point value within [0.0, 1.0)
     */
    realZeroToOneExclusive() {
        return realZeroToOneExclusive(this.engine);
    }
    /**
     * Returns a floating-point value within [min, max) or [min, max]
     * @param min The minimum floating-point value, inclusive.
     * @param max The maximum floating-point value.
     * @param inclusive If true, `max` will be inclusive.
     */
    real(min, max, inclusive = false) {
        return real(min, max, inclusive)(this.engine);
    }
    bool(numerator, denominator) {
        return bool(numerator, denominator)(this.engine);
    }
    /**
     * Return a random value within the provided `source` within the sliced
     * bounds of `begin` and `end`.
     * @param source an array of items to pick from
     * @param begin the beginning slice index (defaults to `0`)
     * @param end the ending slice index (defaults to `source.length`)
     */
    pick(source, begin, end) {
        return pick(this.engine, source, begin, end);
    }
    /**
     * Shuffles an array in-place
     * @param array The array to shuffle
     */
    shuffle(array) {
        return shuffle(this.engine, array);
    }
    /**
     * From the population array, returns an array with sampleSize elements that
     * are randomly chosen without repeats.
     * @param population An array that has items to choose a sample from
     * @param sampleSize The size of the result array
     */
    sample(population, sampleSize) {
        return sample(this.engine, population, sampleSize);
    }
    /**
     * Returns a value within [1, sideCount]
     * @param sideCount The number of sides of the die
     */
    die(sideCount) {
        return die(sideCount)(this.engine);
    }
    /**
     * Returns an array of length `dieCount` of values within [1, sideCount]
     * @param sideCount The number of sides of each die
     * @param dieCount The number of dice
     */
    dice(sideCount, dieCount) {
        return dice(sideCount, dieCount)(this.engine);
    }
    /**
     * Returns a Universally Unique Identifier Version 4.
     *
     * See http://en.wikipedia.org/wiki/Universally_unique_identifier
     */
    uuid4() {
        return uuid4(this.engine);
    }
    string(length, pool) {
        return string(pool)(this.engine, length);
    }
    /**
     * Returns a random string comprised of numbers or the characters `abcdef`
     * (or `ABCDEF`) of length `length`.
     * @param length Length of the result string
     * @param uppercase Whether the string should use `ABCDEF` instead of `abcdef`
     */
    hex(length, uppercase) {
        return hex(uppercase)(this.engine, length);
    }
    /**
     * Returns a random `Date` within the inclusive range of [`start`, `end`].
     * @param start The minimum `Date`
     * @param end The maximum `Date`
     */
    date(start, end) {
        return date(start, end)(this.engine);
    }
}

/**
 * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int32Array
 */
const I32Array = (() => {
    try {
        const buffer = new ArrayBuffer(4);
        const view = new Int32Array(buffer);
        view[0] = INT32_SIZE;
        if (view[0] === -INT32_SIZE) {
            return Int32Array;
        }
    }
    catch (_) {
        // nothing to do here
    }
    return Array;
})();

let data = null;
const COUNT = 128;
let index = COUNT;
/**
 * An Engine that relies on the globally-available `crypto.getRandomValues`,
 * which is typically available in modern browsers.
 *
 * See https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues
 *
 * If unavailable or otherwise non-functioning, then `browserCrypto` will
 * likely `throw` on the first call to `next()`.
 */
const browserCrypto = {
    next() {
        if (index >= COUNT) {
            if (data === null) {
                data = new I32Array(COUNT);
            }
            crypto.getRandomValues(data);
            index = 0;
        }
        return data[index++] | 0;
    }
};

/**
 * Returns an array of random int32 values, based on current time
 * and a random number engine
 *
 * @param engine an Engine to pull random values from, default `nativeMath`
 * @param length the length of the Array, minimum 1, default 16
 */
function createEntropy(engine = nativeMath, length = 16) {
    const array = [];
    array.push(new Date().getTime() | 0);
    for (let i = 1; i < length; ++i) {
        array[i] = engine.next() | 0;
    }
    return array;
}

/**
 * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/imul
 */
const imul = (() => {
    try {
        if (Math.imul(UINT32_MAX, 5) === -5) {
            return Math.imul;
        }
    }
    catch (_) {
        // nothing to do here
    }
    const UINT16_MAX = 0xffff;
    return (a, b) => {
        const ah = (a >>> 16) & UINT16_MAX;
        const al = a & UINT16_MAX;
        const bh = (b >>> 16) & UINT16_MAX;
        const bl = b & UINT16_MAX;
        // the shift by 0 fixes the sign on the high part
        // the final |0 converts the unsigned value into a signed value
        return (al * bl + (((ah * bl + al * bh) << 16) >>> 0)) | 0;
    };
})();

const ARRAY_SIZE = 624;
const ARRAY_MAX = ARRAY_SIZE - 1;
const M = 397;
const ARRAY_SIZE_MINUS_M = ARRAY_SIZE - M;
const A = 0x9908b0df;
/**
 * An Engine that is a pseudorandom number generator using the Mersenne
 * Twister algorithm based on the prime 2**19937 − 1
 *
 * See http://en.wikipedia.org/wiki/Mersenne_twister
 */
class MersenneTwister19937 {
    /**
     * MersenneTwister19937 should not be instantiated directly.
     * Instead, use the static methods `seed`, `seedWithArray`, or `autoSeed`.
     */
    constructor() {
        this.data = new I32Array(ARRAY_SIZE);
        this.index = 0; // integer within [0, 624]
        this.uses = 0;
    }
    /**
     * Returns a MersenneTwister19937 seeded with an initial int32 value
     * @param initial the initial seed value
     */
    static seed(initial) {
        return new MersenneTwister19937().seed(initial);
    }
    /**
     * Returns a MersenneTwister19937 seeded with zero or more int32 values
     * @param source A series of int32 values
     */
    static seedWithArray(source) {
        return new MersenneTwister19937().seedWithArray(source);
    }
    /**
     * Returns a MersenneTwister19937 seeded with the current time and
     * a series of natively-generated random values
     */
    static autoSeed() {
        return MersenneTwister19937.seedWithArray(createEntropy());
    }
    /**
     * Returns the next int32 value of the sequence
     */
    next() {
        if ((this.index | 0) >= ARRAY_SIZE) {
            refreshData(this.data);
            this.index = 0;
        }
        const value = this.data[this.index];
        this.index = (this.index + 1) | 0;
        this.uses += 1;
        return temper(value) | 0;
    }
    /**
     * Returns the number of times that the Engine has been used.
     *
     * This can be provided to an unused MersenneTwister19937 with the same
     * seed, bringing it to the exact point that was left off.
     */
    getUseCount() {
        return this.uses;
    }
    /**
     * Discards one or more items from the engine
     * @param count The count of items to discard
     */
    discard(count) {
        if (count <= 0) {
            return this;
        }
        this.uses += count;
        if ((this.index | 0) >= ARRAY_SIZE) {
            refreshData(this.data);
            this.index = 0;
        }
        while (count + this.index > ARRAY_SIZE) {
            count -= ARRAY_SIZE - this.index;
            refreshData(this.data);
            this.index = 0;
        }
        this.index = (this.index + count) | 0;
        return this;
    }
    seed(initial) {
        let previous = 0;
        this.data[0] = previous = initial | 0;
        for (let i = 1; i < ARRAY_SIZE; i = (i + 1) | 0) {
            this.data[i] = previous =
                (imul(previous ^ (previous >>> 30), 0x6c078965) + i) | 0;
        }
        this.index = ARRAY_SIZE;
        this.uses = 0;
        return this;
    }
    seedWithArray(source) {
        this.seed(0x012bd6aa);
        seedWithArray(this.data, source);
        return this;
    }
}
function refreshData(data) {
    let k = 0;
    let tmp = 0;
    for (; (k | 0) < ARRAY_SIZE_MINUS_M; k = (k + 1) | 0) {
        tmp = (data[k] & INT32_SIZE) | (data[(k + 1) | 0] & INT32_MAX);
        data[k] = data[(k + M) | 0] ^ (tmp >>> 1) ^ (tmp & 0x1 ? A : 0);
    }
    for (; (k | 0) < ARRAY_MAX; k = (k + 1) | 0) {
        tmp = (data[k] & INT32_SIZE) | (data[(k + 1) | 0] & INT32_MAX);
        data[k] =
            data[(k - ARRAY_SIZE_MINUS_M) | 0] ^ (tmp >>> 1) ^ (tmp & 0x1 ? A : 0);
    }
    tmp = (data[ARRAY_MAX] & INT32_SIZE) | (data[0] & INT32_MAX);
    data[ARRAY_MAX] = data[M - 1] ^ (tmp >>> 1) ^ (tmp & 0x1 ? A : 0);
}
function temper(value) {
    value ^= value >>> 11;
    value ^= (value << 7) & 0x9d2c5680;
    value ^= (value << 15) & 0xefc60000;
    return value ^ (value >>> 18);
}
function seedWithArray(data, source) {
    let i = 1;
    let j = 0;
    const sourceLength = source.length;
    let k = Math.max(sourceLength, ARRAY_SIZE) | 0;
    let previous = data[0] | 0;
    for (; (k | 0) > 0; --k) {
        data[i] = previous =
            ((data[i] ^ imul(previous ^ (previous >>> 30), 0x0019660d)) +
                (source[j] | 0) +
                (j | 0)) |
                0;
        i = (i + 1) | 0;
        ++j;
        if ((i | 0) > ARRAY_MAX) {
            data[0] = data[ARRAY_MAX];
            i = 1;
        }
        if (j >= sourceLength) {
            j = 0;
        }
    }
    for (k = ARRAY_MAX; (k | 0) > 0; --k) {
        data[i] = previous =
            ((data[i] ^ imul(previous ^ (previous >>> 30), 0x5d588b65)) - i) | 0;
        i = (i + 1) | 0;
        if ((i | 0) > ARRAY_MAX) {
            data[0] = data[ARRAY_MAX];
            i = 1;
        }
    }
    data[0] = INT32_SIZE;
}

let data$1 = null;
const COUNT$1 = 128;
let index$1 = COUNT$1;
/**
 * An Engine that relies on the node-available
 * `require('crypto').randomBytes`, which has been available since 0.58.
 *
 * See https://nodejs.org/api/crypto.html#crypto_crypto_randombytes_size_callback
 *
 * If unavailable or otherwise non-functioning, then `nodeCrypto` will
 * likely `throw` on the first call to `next()`.
 */
const nodeCrypto = {
    next() {
        if (index$1 >= COUNT$1) {
            data$1 = new Int32Array(new Int8Array(require("crypto").randomBytes(4 * COUNT$1)).buffer);
            index$1 = 0;
        }
        return data$1[index$1++] | 0;
    }
};

/**
 * Returns a Distribution to random value within the provided `source`
 * within the sliced bounds of `begin` and `end`.
 * @param source an array of items to pick from
 * @param begin the beginning slice index (defaults to `0`)
 * @param end the ending slice index (defaults to `source.length`)
 */
function picker(source, begin, end) {
    const clone = sliceArray.call(source, begin, end);
    if (clone.length === 0) {
        throw new RangeError(`Cannot pick from a source with no items`);
    }
    const distribution = integer(0, clone.length - 1);
    return engine => clone[distribution(engine)];
}

export { Random, browserCrypto, nativeMath, MersenneTwister19937, nodeCrypto, bool, date, dice, die, hex, int32, int53, int53Full, integer, pick, picker, real, realZeroToOneExclusive, realZeroToOneInclusive, sample, shuffle, string, uint32, uint53, uint53Full, uuid4, createEntropy };
//# sourceMappingURL=random-js.esm.js.map
