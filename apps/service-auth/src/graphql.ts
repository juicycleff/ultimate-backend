
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export enum ServiceTypes {
    Password = "Password",
    Facebook = "Facebook",
    Github = "Github",
    Google = "Google"
}

export class LoginInput {
    service: ServiceTypes;
    params: LoginParamsInput;
}

export class LoginParamsInput {
    accessToken?: string;
    accessTokenSecret?: string;
    password?: string;
    email?: string;
}

export class RegisterInput {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
}

export class AuthPayload {
    id: string;
    sessionId?: string;
    tokens?: Tokens;
}

export class BooleanPayload {
    success: boolean;
}

export class Tokens {
    refreshToken?: string;
    accessToken?: string;
}
