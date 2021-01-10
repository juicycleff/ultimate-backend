import { Engine } from "../types";
/**
 * From the population array, produce an array with sampleSize elements that
 * are randomly chosen without repeats.
 * @param engine The Engine to use when choosing random values
 * @param population An array that has items to choose a sample from
 * @param sampleSize The size of the result array
 */
export declare function sample<T>(engine: Engine, population: ArrayLike<T>, sampleSize: number): T[];
