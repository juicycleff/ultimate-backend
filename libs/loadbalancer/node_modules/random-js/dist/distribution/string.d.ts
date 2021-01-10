import { StringDistribution } from "../types";
/**
 * Returns a distribution that returns a random string using numbers,
 * uppercase and lowercase letters, `_`, and `-` of length `length`.
 * @param length Length of the result string
 */
export declare function string(): StringDistribution;
/**
 * Returns a distribution that returns a random string using the provided
 * string pool as the possible characters to choose from of length `length`.
 * @param length Length of the result string
 */
export declare function string(pool: string): StringDistribution;
