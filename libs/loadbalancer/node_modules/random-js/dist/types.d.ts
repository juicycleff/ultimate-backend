/**
 * A mechanism to retrieve random int32 values
 */
export interface Engine {
    next(): number;
}
/**
 * A function to use an `Engine` to produce a value
 */
export declare type Distribution<T = number> = (engine: Engine) => T;
/**
 * A function to use an `Engine` to produce a string of a requested length
 */
export declare type StringDistribution = (engine: Engine, length: number) => string;
