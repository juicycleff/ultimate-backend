import { Engine } from "./types";
/**
 * A wrapper around an Engine that provides easy-to-use methods for
 * producing values based on known distributions
 */
export declare class Random {
    private readonly engine;
    /**
     * Creates a new Random wrapper
     * @param engine The engine to use (defaults to a `Math.random`-based implementation)
     */
    constructor(engine?: Engine);
    /**
     * Returns a value within [-0x80000000, 0x7fffffff]
     */
    int32(): number;
    /**
     * Returns a value within [0, 0xffffffff]
     */
    uint32(): number;
    /**
     * Returns a value within [0, 0x1fffffffffffff]
     */
    uint53(): number;
    /**
     * Returns a value within [0, 0x20000000000000]
     */
    uint53Full(): number;
    /**
     * Returns a value within [-0x20000000000000, 0x1fffffffffffff]
     */
    int53(): number;
    /**
     * Returns a value within [-0x20000000000000, 0x20000000000000]
     */
    int53Full(): number;
    /**
     * Returns a value within [min, max]
     * @param min The minimum integer value, inclusive. No less than -0x20000000000000.
     * @param max The maximum integer value, inclusive. No greater than 0x20000000000000.
     */
    integer(min: number, max: number): number;
    /**
     * Returns a floating-point value within [0.0, 1.0]
     */
    realZeroToOneInclusive(): number;
    /**
     * Returns a floating-point value within [0.0, 1.0)
     */
    realZeroToOneExclusive(): number;
    /**
     * Returns a floating-point value within [min, max) or [min, max]
     * @param min The minimum floating-point value, inclusive.
     * @param max The maximum floating-point value.
     * @param inclusive If true, `max` will be inclusive.
     */
    real(min: number, max: number, inclusive?: boolean): number;
    /**
     * Returns a boolean with 50% probability of being true or false
     */
    bool(): boolean;
    /**
     * Returns a boolean with the provided `percentage` of being true
     * @param percentage A number within [0, 1] of how often the result should be `true`
     */
    bool(percentage: number): boolean;
    /**
     * Returns a boolean with a probability of `numerator`/`denominator` of being true
     * @param numerator The numerator of the probability
     * @param denominator The denominator of the probability
     */
    bool(numerator: number, denominator: number): boolean;
    /**
     * Return a random value within the provided `source` within the sliced
     * bounds of `begin` and `end`.
     * @param source an array of items to pick from
     * @param begin the beginning slice index (defaults to `0`)
     * @param end the ending slice index (defaults to `source.length`)
     */
    pick<T>(source: ArrayLike<T>, begin?: number, end?: number): T;
    /**
     * Shuffles an array in-place
     * @param array The array to shuffle
     */
    shuffle<T>(array: T[]): T[];
    /**
     * From the population array, returns an array with sampleSize elements that
     * are randomly chosen without repeats.
     * @param population An array that has items to choose a sample from
     * @param sampleSize The size of the result array
     */
    sample<T>(population: ArrayLike<T>, sampleSize: number): T[];
    /**
     * Returns a value within [1, sideCount]
     * @param sideCount The number of sides of the die
     */
    die(sideCount: number): number;
    /**
     * Returns an array of length `dieCount` of values within [1, sideCount]
     * @param sideCount The number of sides of each die
     * @param dieCount The number of dice
     */
    dice(sideCount: number, dieCount: number): number[];
    /**
     * Returns a Universally Unique Identifier Version 4.
     *
     * See http://en.wikipedia.org/wiki/Universally_unique_identifier
     */
    uuid4(): string;
    /**
     * Returns a random string using numbers, uppercase and lowercase letters,
     * `_`, and `-` of length `length`.
     * @param length Length of the result string
     */
    string(length: number): string;
    /**
     * Returns a random string using the provided string pool as the possible
     * characters to choose from of length `length`.
     * @param length Length of the result string
     */
    string(length: number, pool: string): string;
    /**
     * Returns a random string comprised of numbers or the characters `abcdef`
     * (or `ABCDEF`) of length `length`.
     * @param length Length of the result string
     * @param uppercase Whether the string should use `ABCDEF` instead of `abcdef`
     */
    hex(length: number, uppercase?: boolean): string;
    /**
     * Returns a random `Date` within the inclusive range of [`start`, `end`].
     * @param start The minimum `Date`
     * @param end The maximum `Date`
     */
    date(start: Date, end: Date): Date;
}
