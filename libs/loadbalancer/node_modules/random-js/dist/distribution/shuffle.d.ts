import { Engine } from "../types";
/**
 * Shuffles an array in-place
 * @param engine The Engine to use when choosing random values
 * @param array The array to shuffle
 * @param downTo minimum index to shuffle. Only used internally.
 */
export declare function shuffle<T>(engine: Engine, array: T[], downTo?: number): T[];
