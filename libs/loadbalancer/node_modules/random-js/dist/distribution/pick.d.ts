import { Engine } from "../types";
/**
 * Returns a random value within the provided `source` within the sliced
 * bounds of `begin` and `end`.
 * @param source an array of items to pick from
 * @param begin the beginning slice index (defaults to `0`)
 * @param end the ending slice index (defaults to `source.length`)
 */
export declare function pick<T>(engine: Engine, source: ArrayLike<T>, begin?: number, end?: number): T;
