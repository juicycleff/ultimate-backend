import { Engine } from "../types";
/**
 * Returns an array of random int32 values, based on current time
 * and a random number engine
 *
 * @param engine an Engine to pull random values from, default `nativeMath`
 * @param length the length of the Array, minimum 1, default 16
 */
export declare function createEntropy(engine?: Engine, length?: number): number[];
