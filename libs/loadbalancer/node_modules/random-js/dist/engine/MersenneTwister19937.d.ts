import { Engine } from "../types";
/**
 * An Engine that is a pseudorandom number generator using the Mersenne
 * Twister algorithm based on the prime 2**19937 − 1
 *
 * See http://en.wikipedia.org/wiki/Mersenne_twister
 */
export declare class MersenneTwister19937 implements Engine {
    /**
     * Returns a MersenneTwister19937 seeded with an initial int32 value
     * @param initial the initial seed value
     */
    static seed(initial: number): MersenneTwister19937;
    /**
     * Returns a MersenneTwister19937 seeded with zero or more int32 values
     * @param source A series of int32 values
     */
    static seedWithArray(source: ArrayLike<number>): MersenneTwister19937;
    /**
     * Returns a MersenneTwister19937 seeded with the current time and
     * a series of natively-generated random values
     */
    static autoSeed(): MersenneTwister19937;
    private readonly data;
    private index;
    private uses;
    /**
     * MersenneTwister19937 should not be instantiated directly.
     * Instead, use the static methods `seed`, `seedWithArray`, or `autoSeed`.
     */
    private constructor();
    /**
     * Returns the next int32 value of the sequence
     */
    next(): number;
    /**
     * Returns the number of times that the Engine has been used.
     *
     * This can be provided to an unused MersenneTwister19937 with the same
     * seed, bringing it to the exact point that was left off.
     */
    getUseCount(): number;
    /**
     * Discards one or more items from the engine
     * @param count The count of items to discard
     */
    discard(count: number): this;
    private seed;
    private seedWithArray;
}
