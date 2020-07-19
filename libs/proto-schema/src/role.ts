/* eslint-disable */
import { Observable } from 'rxjs';
import { Writer, Reader } from 'protobufjs/minimal';


export interface StringMessage {
  params: string[];
}

export interface BooleanPayload {
  success: boolean;
}

export interface Role {
  id: string;
  role: string;
  domain: string;
  resource: string;
  action: string;
  name: string;
  normalizedName: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserRole {
  userId: string;
  role: string;
  domain: string;
}

export interface CreateRoleRequest {
  role: string;
  domain: string;
  resource: string;
  action: string;
}

export interface CreateRoleResponse {
  role: Role | undefined;
}

export interface ReadRoleRequest {
  roleId: string;
  domain: string;
}

export interface ReadRoleResponse {
  role: Role | undefined;
}

export interface ReadUserRolesResponse {
  roles: string[];
}

export interface HasRightsRequest {
  sub: string;
  dom: string;
  res: string;
  act: string;
  auth: string;
}

export interface HasRightsResponse {
  access: boolean;
}

export interface ReadUserRolesRequest {
  userId: string;
  tenant: string;
}

export interface FindRolesRequest {
  subId: string;
}

export interface FindRolesResponse {
  roles: Role[];
}

export interface AddUserToRoleRequest {
  role: string;
  userId: string;
  actor: string;
  domain: string;
}

export interface AddUserToRoleResponse {
  roles: string[];
}

export interface AddTenantRolesRequest {
  domain: string;
}

export interface AddTenantRolesResponse {
  success: boolean;
}

export interface RemoveUserFromRoleRequest {
  tenantId: string;
  userId: string;
}

export interface RemoveUserFromRoleResponse {
  success: boolean;
}

export interface AddPolicyRequest {
  params: string[];
}

export interface AddPolicyResponse {
  success: boolean;
}

const baseStringMessage: object = {
  params: '',
};

const baseBooleanPayload: object = {
  success: false,
};

const baseRole: object = {
  id: '',
  role: '',
  domain: '',
  resource: '',
  action: '',
  name: '',
  normalizedName: '',
  createdAt: '',
  updatedAt: '',
};

const baseUserRole: object = {
  userId: '',
  role: '',
  domain: '',
};

const baseCreateRoleRequest: object = {
  role: '',
  domain: '',
  resource: '',
  action: '',
};

const baseCreateRoleResponse: object = {
  role: undefined,
};

const baseReadRoleRequest: object = {
  roleId: '',
  domain: '',
};

const baseReadRoleResponse: object = {
  role: undefined,
};

const baseReadUserRolesResponse: object = {
  roles: '',
};

const baseHasRightsRequest: object = {
  sub: '',
  dom: '',
  res: '',
  act: '',
  auth: '',
};

const baseHasRightsResponse: object = {
  access: false,
};

const baseReadUserRolesRequest: object = {
  userId: '',
  tenant: '',
};

const baseFindRolesRequest: object = {
  subId: '',
};

const baseFindRolesResponse: object = {
  roles: undefined,
};

const baseAddUserToRoleRequest: object = {
  role: '',
  userId: '',
  actor: '',
  domain: '',
};

const baseAddUserToRoleResponse: object = {
  roles: '',
};

const baseAddTenantRolesRequest: object = {
  domain: '',
};

const baseAddTenantRolesResponse: object = {
  success: false,
};

const baseRemoveUserFromRoleRequest: object = {
  tenantId: '',
  userId: '',
};

const baseRemoveUserFromRoleResponse: object = {
  success: false,
};

const baseAddPolicyRequest: object = {
  params: '',
};

const baseAddPolicyResponse: object = {
  success: false,
};

export interface RoleService<Context extends DataLoaders> {

  createRole(request: CreateRoleRequest, ctx: Context): Promise<CreateRoleResponse>;

  readRole(request: ReadRoleRequest, ctx: Context): Promise<ReadRoleResponse>;

  hasRights(request: HasRightsRequest, ctx: Context): Promise<HasRightsResponse>;

  addPolicy(request: AddPolicyRequest, ctx: Context): Promise<AddPolicyResponse>;

  addTenantRoles(request: AddTenantRolesRequest, ctx: Context): Promise<AddTenantRolesResponse>;

  addUserToRole(request: AddUserToRoleRequest, ctx: Context): Promise<AddUserToRoleResponse>;

  removeUserFromRole(request: RemoveUserFromRoleRequest, ctx: Context): Promise<RemoveUserFromRoleResponse>;

  readUserRoles(request: ReadUserRolesRequest, ctx: Context): Promise<ReadUserRolesResponse>;

}

export interface RoleServiceClient<Context extends DataLoaders> {

  createRole(request: CreateRoleRequest, ctx?: Context): Observable<CreateRoleResponse>;

  readRole(request: ReadRoleRequest, ctx?: Context): Observable<ReadRoleResponse>;

  hasRights(request: HasRightsRequest, ctx?: Context): Observable<HasRightsResponse>;

  addPolicy(request: AddPolicyRequest, ctx?: Context): Observable<AddPolicyResponse>;

  addTenantRoles(request: AddTenantRolesRequest, ctx?: Context): Observable<AddTenantRolesResponse>;

  addUserToRole(request: AddUserToRoleRequest, ctx?: Context): Observable<AddUserToRoleResponse>;

  removeUserFromRole(request: RemoveUserFromRoleRequest, ctx?: Context): Observable<RemoveUserFromRoleResponse>;

  readUserRoles(request: ReadUserRolesRequest, ctx?: Context): Observable<ReadUserRolesResponse>;

}

interface DataLoaders {

  getDataLoader<T>(identifier: string, constructorFn: () => T): T;

}

export const StringMessage = {
  encode(message: StringMessage, writer: Writer = Writer.create()): Writer {
    for (const v of message.params) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },
  decode(reader: Reader, length?: number): StringMessage {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseStringMessage) as StringMessage;
    message.params = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.params.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): StringMessage {
    const message = Object.create(baseStringMessage) as StringMessage;
    message.params = [];
    if (object.params !== undefined && object.params !== null) {
      for (const e of object.params) {
        message.params.push(String(e));
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<StringMessage>): StringMessage {
    const message = Object.create(baseStringMessage) as StringMessage;
    message.params = [];
    if (object.params !== undefined && object.params !== null) {
      for (const e of object.params) {
        message.params.push(e);
      }
    }
    return message;
  },
  toJSON(message: StringMessage): unknown {
    const obj: any = {};
    if (message.params) {
      obj.params = message.params.map(e => e || '');
    } else {
      obj.params = [];
    }
    return obj;
  },
};

export const BooleanPayload = {
  encode(message: BooleanPayload, writer: Writer = Writer.create()): Writer {
    writer.uint32(8).bool(message.success);
    return writer;
  },
  decode(reader: Reader, length?: number): BooleanPayload {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseBooleanPayload) as BooleanPayload;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.success = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): BooleanPayload {
    const message = Object.create(baseBooleanPayload) as BooleanPayload;
    if (object.success !== undefined && object.success !== null) {
      message.success = Boolean(object.success);
    } else {
      message.success = false;
    }
    return message;
  },
  fromPartial(object: DeepPartial<BooleanPayload>): BooleanPayload {
    const message = Object.create(baseBooleanPayload) as BooleanPayload;
    if (object.success !== undefined && object.success !== null) {
      message.success = object.success;
    } else {
      message.success = false;
    }
    return message;
  },
  toJSON(message: BooleanPayload): unknown {
    const obj: any = {};
    obj.success = message.success || false;
    return obj;
  },
};

export const Role = {
  encode(message: Role, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.id);
    writer.uint32(18).string(message.role);
    writer.uint32(26).string(message.domain);
    writer.uint32(34).string(message.resource);
    writer.uint32(42).string(message.action);
    writer.uint32(50).string(message.name);
    writer.uint32(58).string(message.normalizedName);
    writer.uint32(66).string(message.createdAt);
    writer.uint32(74).string(message.updatedAt);
    return writer;
  },
  decode(reader: Reader, length?: number): Role {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseRole) as Role;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.role = reader.string();
          break;
        case 3:
          message.domain = reader.string();
          break;
        case 4:
          message.resource = reader.string();
          break;
        case 5:
          message.action = reader.string();
          break;
        case 6:
          message.name = reader.string();
          break;
        case 7:
          message.normalizedName = reader.string();
          break;
        case 8:
          message.createdAt = reader.string();
          break;
        case 9:
          message.updatedAt = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): Role {
    const message = Object.create(baseRole) as Role;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    } else {
      message.id = '';
    }
    if (object.role !== undefined && object.role !== null) {
      message.role = String(object.role);
    } else {
      message.role = '';
    }
    if (object.domain !== undefined && object.domain !== null) {
      message.domain = String(object.domain);
    } else {
      message.domain = '';
    }
    if (object.resource !== undefined && object.resource !== null) {
      message.resource = String(object.resource);
    } else {
      message.resource = '';
    }
    if (object.action !== undefined && object.action !== null) {
      message.action = String(object.action);
    } else {
      message.action = '';
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    } else {
      message.name = '';
    }
    if (object.normalizedName !== undefined && object.normalizedName !== null) {
      message.normalizedName = String(object.normalizedName);
    } else {
      message.normalizedName = '';
    }
    if (object.createdAt !== undefined && object.createdAt !== null) {
      message.createdAt = String(object.createdAt);
    } else {
      message.createdAt = '';
    }
    if (object.updatedAt !== undefined && object.updatedAt !== null) {
      message.updatedAt = String(object.updatedAt);
    } else {
      message.updatedAt = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<Role>): Role {
    const message = Object.create(baseRole) as Role;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = '';
    }
    if (object.role !== undefined && object.role !== null) {
      message.role = object.role;
    } else {
      message.role = '';
    }
    if (object.domain !== undefined && object.domain !== null) {
      message.domain = object.domain;
    } else {
      message.domain = '';
    }
    if (object.resource !== undefined && object.resource !== null) {
      message.resource = object.resource;
    } else {
      message.resource = '';
    }
    if (object.action !== undefined && object.action !== null) {
      message.action = object.action;
    } else {
      message.action = '';
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    } else {
      message.name = '';
    }
    if (object.normalizedName !== undefined && object.normalizedName !== null) {
      message.normalizedName = object.normalizedName;
    } else {
      message.normalizedName = '';
    }
    if (object.createdAt !== undefined && object.createdAt !== null) {
      message.createdAt = object.createdAt;
    } else {
      message.createdAt = '';
    }
    if (object.updatedAt !== undefined && object.updatedAt !== null) {
      message.updatedAt = object.updatedAt;
    } else {
      message.updatedAt = '';
    }
    return message;
  },
  toJSON(message: Role): unknown {
    const obj: any = {};
    obj.id = message.id || '';
    obj.role = message.role || '';
    obj.domain = message.domain || '';
    obj.resource = message.resource || '';
    obj.action = message.action || '';
    obj.name = message.name || '';
    obj.normalizedName = message.normalizedName || '';
    obj.createdAt = message.createdAt || '';
    obj.updatedAt = message.updatedAt || '';
    return obj;
  },
};

export const UserRole = {
  encode(message: UserRole, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.userId);
    writer.uint32(18).string(message.role);
    writer.uint32(26).string(message.domain);
    return writer;
  },
  decode(reader: Reader, length?: number): UserRole {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseUserRole) as UserRole;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userId = reader.string();
          break;
        case 2:
          message.role = reader.string();
          break;
        case 3:
          message.domain = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): UserRole {
    const message = Object.create(baseUserRole) as UserRole;
    if (object.userId !== undefined && object.userId !== null) {
      message.userId = String(object.userId);
    } else {
      message.userId = '';
    }
    if (object.role !== undefined && object.role !== null) {
      message.role = String(object.role);
    } else {
      message.role = '';
    }
    if (object.domain !== undefined && object.domain !== null) {
      message.domain = String(object.domain);
    } else {
      message.domain = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<UserRole>): UserRole {
    const message = Object.create(baseUserRole) as UserRole;
    if (object.userId !== undefined && object.userId !== null) {
      message.userId = object.userId;
    } else {
      message.userId = '';
    }
    if (object.role !== undefined && object.role !== null) {
      message.role = object.role;
    } else {
      message.role = '';
    }
    if (object.domain !== undefined && object.domain !== null) {
      message.domain = object.domain;
    } else {
      message.domain = '';
    }
    return message;
  },
  toJSON(message: UserRole): unknown {
    const obj: any = {};
    obj.userId = message.userId || '';
    obj.role = message.role || '';
    obj.domain = message.domain || '';
    return obj;
  },
};

export const CreateRoleRequest = {
  encode(message: CreateRoleRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(18).string(message.role);
    writer.uint32(26).string(message.domain);
    writer.uint32(34).string(message.resource);
    writer.uint32(42).string(message.action);
    return writer;
  },
  decode(reader: Reader, length?: number): CreateRoleRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseCreateRoleRequest) as CreateRoleRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 2:
          message.role = reader.string();
          break;
        case 3:
          message.domain = reader.string();
          break;
        case 4:
          message.resource = reader.string();
          break;
        case 5:
          message.action = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): CreateRoleRequest {
    const message = Object.create(baseCreateRoleRequest) as CreateRoleRequest;
    if (object.role !== undefined && object.role !== null) {
      message.role = String(object.role);
    } else {
      message.role = '';
    }
    if (object.domain !== undefined && object.domain !== null) {
      message.domain = String(object.domain);
    } else {
      message.domain = '';
    }
    if (object.resource !== undefined && object.resource !== null) {
      message.resource = String(object.resource);
    } else {
      message.resource = '';
    }
    if (object.action !== undefined && object.action !== null) {
      message.action = String(object.action);
    } else {
      message.action = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<CreateRoleRequest>): CreateRoleRequest {
    const message = Object.create(baseCreateRoleRequest) as CreateRoleRequest;
    if (object.role !== undefined && object.role !== null) {
      message.role = object.role;
    } else {
      message.role = '';
    }
    if (object.domain !== undefined && object.domain !== null) {
      message.domain = object.domain;
    } else {
      message.domain = '';
    }
    if (object.resource !== undefined && object.resource !== null) {
      message.resource = object.resource;
    } else {
      message.resource = '';
    }
    if (object.action !== undefined && object.action !== null) {
      message.action = object.action;
    } else {
      message.action = '';
    }
    return message;
  },
  toJSON(message: CreateRoleRequest): unknown {
    const obj: any = {};
    obj.role = message.role || '';
    obj.domain = message.domain || '';
    obj.resource = message.resource || '';
    obj.action = message.action || '';
    return obj;
  },
};

export const CreateRoleResponse = {
  encode(message: CreateRoleResponse, writer: Writer = Writer.create()): Writer {
    if (message.role !== undefined && message.role !== undefined) {
      Role.encode(message.role, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): CreateRoleResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseCreateRoleResponse) as CreateRoleResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.role = Role.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): CreateRoleResponse {
    const message = Object.create(baseCreateRoleResponse) as CreateRoleResponse;
    if (object.role !== undefined && object.role !== null) {
      message.role = Role.fromJSON(object.role);
    } else {
      message.role = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<CreateRoleResponse>): CreateRoleResponse {
    const message = Object.create(baseCreateRoleResponse) as CreateRoleResponse;
    if (object.role !== undefined && object.role !== null) {
      message.role = Role.fromPartial(object.role);
    } else {
      message.role = undefined;
    }
    return message;
  },
  toJSON(message: CreateRoleResponse): unknown {
    const obj: any = {};
    obj.role = message.role ? Role.toJSON(message.role) : undefined;
    return obj;
  },
};

export const ReadRoleRequest = {
  encode(message: ReadRoleRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.roleId);
    writer.uint32(18).string(message.domain);
    return writer;
  },
  decode(reader: Reader, length?: number): ReadRoleRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseReadRoleRequest) as ReadRoleRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.roleId = reader.string();
          break;
        case 2:
          message.domain = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ReadRoleRequest {
    const message = Object.create(baseReadRoleRequest) as ReadRoleRequest;
    if (object.roleId !== undefined && object.roleId !== null) {
      message.roleId = String(object.roleId);
    } else {
      message.roleId = '';
    }
    if (object.domain !== undefined && object.domain !== null) {
      message.domain = String(object.domain);
    } else {
      message.domain = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<ReadRoleRequest>): ReadRoleRequest {
    const message = Object.create(baseReadRoleRequest) as ReadRoleRequest;
    if (object.roleId !== undefined && object.roleId !== null) {
      message.roleId = object.roleId;
    } else {
      message.roleId = '';
    }
    if (object.domain !== undefined && object.domain !== null) {
      message.domain = object.domain;
    } else {
      message.domain = '';
    }
    return message;
  },
  toJSON(message: ReadRoleRequest): unknown {
    const obj: any = {};
    obj.roleId = message.roleId || '';
    obj.domain = message.domain || '';
    return obj;
  },
};

export const ReadRoleResponse = {
  encode(message: ReadRoleResponse, writer: Writer = Writer.create()): Writer {
    if (message.role !== undefined && message.role !== undefined) {
      Role.encode(message.role, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): ReadRoleResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseReadRoleResponse) as ReadRoleResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.role = Role.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ReadRoleResponse {
    const message = Object.create(baseReadRoleResponse) as ReadRoleResponse;
    if (object.role !== undefined && object.role !== null) {
      message.role = Role.fromJSON(object.role);
    } else {
      message.role = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<ReadRoleResponse>): ReadRoleResponse {
    const message = Object.create(baseReadRoleResponse) as ReadRoleResponse;
    if (object.role !== undefined && object.role !== null) {
      message.role = Role.fromPartial(object.role);
    } else {
      message.role = undefined;
    }
    return message;
  },
  toJSON(message: ReadRoleResponse): unknown {
    const obj: any = {};
    obj.role = message.role ? Role.toJSON(message.role) : undefined;
    return obj;
  },
};

export const ReadUserRolesResponse = {
  encode(message: ReadUserRolesResponse, writer: Writer = Writer.create()): Writer {
    for (const v of message.roles) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },
  decode(reader: Reader, length?: number): ReadUserRolesResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseReadUserRolesResponse) as ReadUserRolesResponse;
    message.roles = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.roles.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ReadUserRolesResponse {
    const message = Object.create(baseReadUserRolesResponse) as ReadUserRolesResponse;
    message.roles = [];
    if (object.roles !== undefined && object.roles !== null) {
      for (const e of object.roles) {
        message.roles.push(String(e));
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<ReadUserRolesResponse>): ReadUserRolesResponse {
    const message = Object.create(baseReadUserRolesResponse) as ReadUserRolesResponse;
    message.roles = [];
    if (object.roles !== undefined && object.roles !== null) {
      for (const e of object.roles) {
        message.roles.push(e);
      }
    }
    return message;
  },
  toJSON(message: ReadUserRolesResponse): unknown {
    const obj: any = {};
    if (message.roles) {
      obj.roles = message.roles.map(e => e || '');
    } else {
      obj.roles = [];
    }
    return obj;
  },
};

export const HasRightsRequest = {
  encode(message: HasRightsRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.sub);
    writer.uint32(18).string(message.dom);
    writer.uint32(26).string(message.res);
    writer.uint32(34).string(message.act);
    writer.uint32(42).string(message.auth);
    return writer;
  },
  decode(reader: Reader, length?: number): HasRightsRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseHasRightsRequest) as HasRightsRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sub = reader.string();
          break;
        case 2:
          message.dom = reader.string();
          break;
        case 3:
          message.res = reader.string();
          break;
        case 4:
          message.act = reader.string();
          break;
        case 5:
          message.auth = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): HasRightsRequest {
    const message = Object.create(baseHasRightsRequest) as HasRightsRequest;
    if (object.sub !== undefined && object.sub !== null) {
      message.sub = String(object.sub);
    } else {
      message.sub = '';
    }
    if (object.dom !== undefined && object.dom !== null) {
      message.dom = String(object.dom);
    } else {
      message.dom = '';
    }
    if (object.res !== undefined && object.res !== null) {
      message.res = String(object.res);
    } else {
      message.res = '';
    }
    if (object.act !== undefined && object.act !== null) {
      message.act = String(object.act);
    } else {
      message.act = '';
    }
    if (object.auth !== undefined && object.auth !== null) {
      message.auth = String(object.auth);
    } else {
      message.auth = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<HasRightsRequest>): HasRightsRequest {
    const message = Object.create(baseHasRightsRequest) as HasRightsRequest;
    if (object.sub !== undefined && object.sub !== null) {
      message.sub = object.sub;
    } else {
      message.sub = '';
    }
    if (object.dom !== undefined && object.dom !== null) {
      message.dom = object.dom;
    } else {
      message.dom = '';
    }
    if (object.res !== undefined && object.res !== null) {
      message.res = object.res;
    } else {
      message.res = '';
    }
    if (object.act !== undefined && object.act !== null) {
      message.act = object.act;
    } else {
      message.act = '';
    }
    if (object.auth !== undefined && object.auth !== null) {
      message.auth = object.auth;
    } else {
      message.auth = '';
    }
    return message;
  },
  toJSON(message: HasRightsRequest): unknown {
    const obj: any = {};
    obj.sub = message.sub || '';
    obj.dom = message.dom || '';
    obj.res = message.res || '';
    obj.act = message.act || '';
    obj.auth = message.auth || '';
    return obj;
  },
};

export const HasRightsResponse = {
  encode(message: HasRightsResponse, writer: Writer = Writer.create()): Writer {
    writer.uint32(8).bool(message.access);
    return writer;
  },
  decode(reader: Reader, length?: number): HasRightsResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseHasRightsResponse) as HasRightsResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.access = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): HasRightsResponse {
    const message = Object.create(baseHasRightsResponse) as HasRightsResponse;
    if (object.access !== undefined && object.access !== null) {
      message.access = Boolean(object.access);
    } else {
      message.access = false;
    }
    return message;
  },
  fromPartial(object: DeepPartial<HasRightsResponse>): HasRightsResponse {
    const message = Object.create(baseHasRightsResponse) as HasRightsResponse;
    if (object.access !== undefined && object.access !== null) {
      message.access = object.access;
    } else {
      message.access = false;
    }
    return message;
  },
  toJSON(message: HasRightsResponse): unknown {
    const obj: any = {};
    obj.access = message.access || false;
    return obj;
  },
};

export const ReadUserRolesRequest = {
  encode(message: ReadUserRolesRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.userId);
    writer.uint32(18).string(message.tenant);
    return writer;
  },
  decode(reader: Reader, length?: number): ReadUserRolesRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseReadUserRolesRequest) as ReadUserRolesRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userId = reader.string();
          break;
        case 2:
          message.tenant = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ReadUserRolesRequest {
    const message = Object.create(baseReadUserRolesRequest) as ReadUserRolesRequest;
    if (object.userId !== undefined && object.userId !== null) {
      message.userId = String(object.userId);
    } else {
      message.userId = '';
    }
    if (object.tenant !== undefined && object.tenant !== null) {
      message.tenant = String(object.tenant);
    } else {
      message.tenant = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<ReadUserRolesRequest>): ReadUserRolesRequest {
    const message = Object.create(baseReadUserRolesRequest) as ReadUserRolesRequest;
    if (object.userId !== undefined && object.userId !== null) {
      message.userId = object.userId;
    } else {
      message.userId = '';
    }
    if (object.tenant !== undefined && object.tenant !== null) {
      message.tenant = object.tenant;
    } else {
      message.tenant = '';
    }
    return message;
  },
  toJSON(message: ReadUserRolesRequest): unknown {
    const obj: any = {};
    obj.userId = message.userId || '';
    obj.tenant = message.tenant || '';
    return obj;
  },
};

export const FindRolesRequest = {
  encode(message: FindRolesRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.subId);
    return writer;
  },
  decode(reader: Reader, length?: number): FindRolesRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseFindRolesRequest) as FindRolesRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.subId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): FindRolesRequest {
    const message = Object.create(baseFindRolesRequest) as FindRolesRequest;
    if (object.subId !== undefined && object.subId !== null) {
      message.subId = String(object.subId);
    } else {
      message.subId = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<FindRolesRequest>): FindRolesRequest {
    const message = Object.create(baseFindRolesRequest) as FindRolesRequest;
    if (object.subId !== undefined && object.subId !== null) {
      message.subId = object.subId;
    } else {
      message.subId = '';
    }
    return message;
  },
  toJSON(message: FindRolesRequest): unknown {
    const obj: any = {};
    obj.subId = message.subId || '';
    return obj;
  },
};

export const FindRolesResponse = {
  encode(message: FindRolesResponse, writer: Writer = Writer.create()): Writer {
    for (const v of message.roles) {
      Role.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): FindRolesResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseFindRolesResponse) as FindRolesResponse;
    message.roles = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.roles.push(Role.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): FindRolesResponse {
    const message = Object.create(baseFindRolesResponse) as FindRolesResponse;
    message.roles = [];
    if (object.roles !== undefined && object.roles !== null) {
      for (const e of object.roles) {
        message.roles.push(Role.fromJSON(e));
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<FindRolesResponse>): FindRolesResponse {
    const message = Object.create(baseFindRolesResponse) as FindRolesResponse;
    message.roles = [];
    if (object.roles !== undefined && object.roles !== null) {
      for (const e of object.roles) {
        message.roles.push(Role.fromPartial(e));
      }
    }
    return message;
  },
  toJSON(message: FindRolesResponse): unknown {
    const obj: any = {};
    if (message.roles) {
      obj.roles = message.roles.map(e => e ? Role.toJSON(e) : undefined);
    } else {
      obj.roles = [];
    }
    return obj;
  },
};

export const AddUserToRoleRequest = {
  encode(message: AddUserToRoleRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.role);
    writer.uint32(18).string(message.userId);
    writer.uint32(26).string(message.actor);
    writer.uint32(34).string(message.domain);
    return writer;
  },
  decode(reader: Reader, length?: number): AddUserToRoleRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseAddUserToRoleRequest) as AddUserToRoleRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.role = reader.string();
          break;
        case 2:
          message.userId = reader.string();
          break;
        case 3:
          message.actor = reader.string();
          break;
        case 4:
          message.domain = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): AddUserToRoleRequest {
    const message = Object.create(baseAddUserToRoleRequest) as AddUserToRoleRequest;
    if (object.role !== undefined && object.role !== null) {
      message.role = String(object.role);
    } else {
      message.role = '';
    }
    if (object.userId !== undefined && object.userId !== null) {
      message.userId = String(object.userId);
    } else {
      message.userId = '';
    }
    if (object.actor !== undefined && object.actor !== null) {
      message.actor = String(object.actor);
    } else {
      message.actor = '';
    }
    if (object.domain !== undefined && object.domain !== null) {
      message.domain = String(object.domain);
    } else {
      message.domain = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<AddUserToRoleRequest>): AddUserToRoleRequest {
    const message = Object.create(baseAddUserToRoleRequest) as AddUserToRoleRequest;
    if (object.role !== undefined && object.role !== null) {
      message.role = object.role;
    } else {
      message.role = '';
    }
    if (object.userId !== undefined && object.userId !== null) {
      message.userId = object.userId;
    } else {
      message.userId = '';
    }
    if (object.actor !== undefined && object.actor !== null) {
      message.actor = object.actor;
    } else {
      message.actor = '';
    }
    if (object.domain !== undefined && object.domain !== null) {
      message.domain = object.domain;
    } else {
      message.domain = '';
    }
    return message;
  },
  toJSON(message: AddUserToRoleRequest): unknown {
    const obj: any = {};
    obj.role = message.role || '';
    obj.userId = message.userId || '';
    obj.actor = message.actor || '';
    obj.domain = message.domain || '';
    return obj;
  },
};

export const AddUserToRoleResponse = {
  encode(message: AddUserToRoleResponse, writer: Writer = Writer.create()): Writer {
    for (const v of message.roles) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },
  decode(reader: Reader, length?: number): AddUserToRoleResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseAddUserToRoleResponse) as AddUserToRoleResponse;
    message.roles = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.roles.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): AddUserToRoleResponse {
    const message = Object.create(baseAddUserToRoleResponse) as AddUserToRoleResponse;
    message.roles = [];
    if (object.roles !== undefined && object.roles !== null) {
      for (const e of object.roles) {
        message.roles.push(String(e));
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<AddUserToRoleResponse>): AddUserToRoleResponse {
    const message = Object.create(baseAddUserToRoleResponse) as AddUserToRoleResponse;
    message.roles = [];
    if (object.roles !== undefined && object.roles !== null) {
      for (const e of object.roles) {
        message.roles.push(e);
      }
    }
    return message;
  },
  toJSON(message: AddUserToRoleResponse): unknown {
    const obj: any = {};
    if (message.roles) {
      obj.roles = message.roles.map(e => e || '');
    } else {
      obj.roles = [];
    }
    return obj;
  },
};

export const AddTenantRolesRequest = {
  encode(message: AddTenantRolesRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.domain);
    return writer;
  },
  decode(reader: Reader, length?: number): AddTenantRolesRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseAddTenantRolesRequest) as AddTenantRolesRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.domain = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): AddTenantRolesRequest {
    const message = Object.create(baseAddTenantRolesRequest) as AddTenantRolesRequest;
    if (object.domain !== undefined && object.domain !== null) {
      message.domain = String(object.domain);
    } else {
      message.domain = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<AddTenantRolesRequest>): AddTenantRolesRequest {
    const message = Object.create(baseAddTenantRolesRequest) as AddTenantRolesRequest;
    if (object.domain !== undefined && object.domain !== null) {
      message.domain = object.domain;
    } else {
      message.domain = '';
    }
    return message;
  },
  toJSON(message: AddTenantRolesRequest): unknown {
    const obj: any = {};
    obj.domain = message.domain || '';
    return obj;
  },
};

export const AddTenantRolesResponse = {
  encode(message: AddTenantRolesResponse, writer: Writer = Writer.create()): Writer {
    writer.uint32(8).bool(message.success);
    return writer;
  },
  decode(reader: Reader, length?: number): AddTenantRolesResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseAddTenantRolesResponse) as AddTenantRolesResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.success = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): AddTenantRolesResponse {
    const message = Object.create(baseAddTenantRolesResponse) as AddTenantRolesResponse;
    if (object.success !== undefined && object.success !== null) {
      message.success = Boolean(object.success);
    } else {
      message.success = false;
    }
    return message;
  },
  fromPartial(object: DeepPartial<AddTenantRolesResponse>): AddTenantRolesResponse {
    const message = Object.create(baseAddTenantRolesResponse) as AddTenantRolesResponse;
    if (object.success !== undefined && object.success !== null) {
      message.success = object.success;
    } else {
      message.success = false;
    }
    return message;
  },
  toJSON(message: AddTenantRolesResponse): unknown {
    const obj: any = {};
    obj.success = message.success || false;
    return obj;
  },
};

export const RemoveUserFromRoleRequest = {
  encode(message: RemoveUserFromRoleRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.tenantId);
    writer.uint32(18).string(message.userId);
    return writer;
  },
  decode(reader: Reader, length?: number): RemoveUserFromRoleRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseRemoveUserFromRoleRequest) as RemoveUserFromRoleRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.tenantId = reader.string();
          break;
        case 2:
          message.userId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): RemoveUserFromRoleRequest {
    const message = Object.create(baseRemoveUserFromRoleRequest) as RemoveUserFromRoleRequest;
    if (object.tenantId !== undefined && object.tenantId !== null) {
      message.tenantId = String(object.tenantId);
    } else {
      message.tenantId = '';
    }
    if (object.userId !== undefined && object.userId !== null) {
      message.userId = String(object.userId);
    } else {
      message.userId = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<RemoveUserFromRoleRequest>): RemoveUserFromRoleRequest {
    const message = Object.create(baseRemoveUserFromRoleRequest) as RemoveUserFromRoleRequest;
    if (object.tenantId !== undefined && object.tenantId !== null) {
      message.tenantId = object.tenantId;
    } else {
      message.tenantId = '';
    }
    if (object.userId !== undefined && object.userId !== null) {
      message.userId = object.userId;
    } else {
      message.userId = '';
    }
    return message;
  },
  toJSON(message: RemoveUserFromRoleRequest): unknown {
    const obj: any = {};
    obj.tenantId = message.tenantId || '';
    obj.userId = message.userId || '';
    return obj;
  },
};

export const RemoveUserFromRoleResponse = {
  encode(message: RemoveUserFromRoleResponse, writer: Writer = Writer.create()): Writer {
    writer.uint32(8).bool(message.success);
    return writer;
  },
  decode(reader: Reader, length?: number): RemoveUserFromRoleResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseRemoveUserFromRoleResponse) as RemoveUserFromRoleResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.success = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): RemoveUserFromRoleResponse {
    const message = Object.create(baseRemoveUserFromRoleResponse) as RemoveUserFromRoleResponse;
    if (object.success !== undefined && object.success !== null) {
      message.success = Boolean(object.success);
    } else {
      message.success = false;
    }
    return message;
  },
  fromPartial(object: DeepPartial<RemoveUserFromRoleResponse>): RemoveUserFromRoleResponse {
    const message = Object.create(baseRemoveUserFromRoleResponse) as RemoveUserFromRoleResponse;
    if (object.success !== undefined && object.success !== null) {
      message.success = object.success;
    } else {
      message.success = false;
    }
    return message;
  },
  toJSON(message: RemoveUserFromRoleResponse): unknown {
    const obj: any = {};
    obj.success = message.success || false;
    return obj;
  },
};

export const AddPolicyRequest = {
  encode(message: AddPolicyRequest, writer: Writer = Writer.create()): Writer {
    for (const v of message.params) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },
  decode(reader: Reader, length?: number): AddPolicyRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseAddPolicyRequest) as AddPolicyRequest;
    message.params = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.params.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): AddPolicyRequest {
    const message = Object.create(baseAddPolicyRequest) as AddPolicyRequest;
    message.params = [];
    if (object.params !== undefined && object.params !== null) {
      for (const e of object.params) {
        message.params.push(String(e));
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<AddPolicyRequest>): AddPolicyRequest {
    const message = Object.create(baseAddPolicyRequest) as AddPolicyRequest;
    message.params = [];
    if (object.params !== undefined && object.params !== null) {
      for (const e of object.params) {
        message.params.push(e);
      }
    }
    return message;
  },
  toJSON(message: AddPolicyRequest): unknown {
    const obj: any = {};
    if (message.params) {
      obj.params = message.params.map(e => e || '');
    } else {
      obj.params = [];
    }
    return obj;
  },
};

export const AddPolicyResponse = {
  encode(message: AddPolicyResponse, writer: Writer = Writer.create()): Writer {
    writer.uint32(8).bool(message.success);
    return writer;
  },
  decode(reader: Reader, length?: number): AddPolicyResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseAddPolicyResponse) as AddPolicyResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.success = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): AddPolicyResponse {
    const message = Object.create(baseAddPolicyResponse) as AddPolicyResponse;
    if (object.success !== undefined && object.success !== null) {
      message.success = Boolean(object.success);
    } else {
      message.success = false;
    }
    return message;
  },
  fromPartial(object: DeepPartial<AddPolicyResponse>): AddPolicyResponse {
    const message = Object.create(baseAddPolicyResponse) as AddPolicyResponse;
    if (object.success !== undefined && object.success !== null) {
      message.success = object.success;
    } else {
      message.success = false;
    }
    return message;
  },
  toJSON(message: AddPolicyResponse): unknown {
    const obj: any = {};
    obj.success = message.success || false;
    return obj;
  },
};

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T[P] extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T[P] extends Date | Function | Uint8Array | undefined
  ? T[P]
  : T[P] extends infer U | undefined
  ? DeepPartial<U>
  : T[P] extends object
  ? DeepPartial<T[P]>
  : T[P]
};