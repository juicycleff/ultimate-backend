
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export enum AppRole {
    SUPER = "SUPER",
    OWNER = "OWNER",
    ADMIN = "ADMIN",
    DEVELOPER = "DEVELOPER",
    MEMBER = "MEMBER"
}

export enum InvitationStatus {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED"
}

export class CreateTenantInput {
    name: string;
}

export class InviteTenantMemberInput {
    email?: string;
    role?: AppRole;
}

export class Paginate {
    first?: number;
    offset?: number;
}

export class UpdateTenantInput {
    name: string;
}

export class UpdateTenantMemberInput {
    email?: string;
    role?: AppRole;
}

export interface Node {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export class Tenant implements Node {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    name: string;
    normalizeName: string;
    members: TenantMember;
}

export class TenantAccessToken {
    key: string;
    secert: AppRole;
    active: boolean;
    createdAt: DateTime;
}

export class TenantMember implements Node {
    id: string;
    email: string;
    role: AppRole;
    status: InvitationStatus;
    createdAt: DateTime;
    updatedAt: DateTime;
    tenant: Tenant;
}

export type DateTime = any;
export type JSON = any;
