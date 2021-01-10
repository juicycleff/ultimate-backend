import { Distribution } from "../types";
/**
 * Returns a boolean Distribution with 50% probability of being true or false
 */
export declare function bool(): Distribution<boolean>;
/**
 * Returns a boolean Distribution with the provided `percentage` of being true
 * @param percentage A number within [0, 1] of how often the result should be `true`
 */
export declare function bool(percentage: number): Distribution<boolean>;
/**
 * Returns a boolean Distribution with a probability of
 * `numerator` divided by `denominator` of being true
 * @param numerator The numerator of the probability
 * @param denominator The denominator of the probability
 */
export declare function bool(numerator: number, denominator: number): Distribution<boolean>;
