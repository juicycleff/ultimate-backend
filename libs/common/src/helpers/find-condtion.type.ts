import { FindOperator } from './find-operator';

/**
 * Used for find operations.
 */
export type FindConditions<T> = {
  [P in keyof T]?: T[P] extends never
    ? FindConditions<T[P]> | FindOperator<FindConditions<T[P]>>
    : FindConditions<T[P]> | FindOperator<FindConditions<T[P]>>;
};
