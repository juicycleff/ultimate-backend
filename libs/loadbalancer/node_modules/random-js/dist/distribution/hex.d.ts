import { StringDistribution } from "../types";
/**
 * Returns a Distribution that returns a random string comprised of numbers
 * or the characters `abcdef` (or `ABCDEF`) of length `length`.
 * @param length Length of the result string
 * @param uppercase Whether the string should use `ABCDEF` instead of `abcdef`
 */
export declare function hex(uppercase?: boolean): StringDistribution;
