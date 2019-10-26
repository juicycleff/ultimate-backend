
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export interface LoginInput {
    identifier: string;
    password: string;
}

export interface RegisterInput {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
}

export interface AuthPayload {
    id: string;
    user: any;
}

export interface BooleanPayload {
    success: boolean;
}
