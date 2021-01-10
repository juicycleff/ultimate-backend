import { Distribution } from "../types";
/**
 * Returns a distribution that returns an array of length `dieCount` of values
 * within [1, `sideCount`]
 * @param sideCount The number of sides of each die
 * @param dieCount The number of dice
 */
export declare function dice(sideCount: number, dieCount: number): Distribution<number[]>;
