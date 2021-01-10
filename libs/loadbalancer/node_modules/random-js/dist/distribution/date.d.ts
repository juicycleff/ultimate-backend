import { Distribution } from "../types";
/**
 * Returns a Distribution that returns a random `Date` within the inclusive
 * range of [`start`, `end`].
 * @param start The minimum `Date`
 * @param end The maximum `Date`
 */
export declare function date(start: Date, end: Date): Distribution<Date>;
