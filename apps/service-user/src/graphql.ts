
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export class Paginate {
    first?: number;
    offset?: number;
}

export interface Node {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export class User implements Node {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    firstname: string;
    lastname: string;
    email: string;
}

export type DateTime = any;
export type JSON = any;
