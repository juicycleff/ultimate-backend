import { Distribution } from "../types";
/**
 * Returns a Distribution to return a value within [1, sideCount]
 * @param sideCount The number of sides of the die
 */
export declare function die(sideCount: number): Distribution<number>;
