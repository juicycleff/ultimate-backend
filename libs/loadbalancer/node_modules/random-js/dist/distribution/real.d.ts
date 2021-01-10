import { Distribution } from "../types";
/**
 * Returns a floating-point value within [min, max) or [min, max]
 * @param min The minimum floating-point value, inclusive.
 * @param max The maximum floating-point value.
 * @param inclusive If true, `max` will be inclusive.
 */
export declare function real(min: number, max: number, inclusive?: boolean): Distribution;
