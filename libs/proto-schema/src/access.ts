/* eslint-disable */
import { Observable } from 'rxjs';
import { Timestamp } from './google/protobuf/timestamp';
import { Writer, Reader } from 'protobufjs/minimal';


export interface Access {
  id: string;
  token: string;
  tenantId: string;
  scopes: string[];
  name: string;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
  active: boolean;
  createdBy: string;
}

export interface CreateAccessRequest {
  tenantId: string;
  scopes: string[];
  name: string;
}

export interface CreateAccessResponse {
  accessToken: Access | undefined;
}

export interface DeleteAccessRequest {
  id: string;
}

export interface DeleteAccessResponse {
  accessToken: Access | undefined;
}

export interface ReadAccessRequest {
  id: string;
  tenantId: string;
}

export interface ReadAccessResponse {
  accessToken: Access | undefined;
}

export interface FindAccessRequest {
  id: string;
  tenantId: string;
}

export interface FindAccessResponse {
  accessToken: Access[];
}

export interface HasRightsRequest {
  token: string;
  scope: string;
  tenantId: string;
}

export interface HasRightsResponse {
  access: boolean;
}

const baseAccess: object = {
  id: '',
  token: '',
  tenantId: '',
  scopes: '',
  name: '',
  createdAt: undefined,
  updatedAt: undefined,
  active: false,
  createdBy: '',
};

const baseCreateAccessRequest: object = {
  tenantId: '',
  scopes: '',
  name: '',
};

const baseCreateAccessResponse: object = {
  accessToken: undefined,
};

const baseDeleteAccessRequest: object = {
  id: '',
};

const baseDeleteAccessResponse: object = {
  accessToken: undefined,
};

const baseReadAccessRequest: object = {
  id: '',
  tenantId: '',
};

const baseReadAccessResponse: object = {
  accessToken: undefined,
};

const baseFindAccessRequest: object = {
  id: '',
  tenantId: '',
};

const baseFindAccessResponse: object = {
  accessToken: undefined,
};

const baseHasRightsRequest: object = {
  token: '',
  scope: '',
  tenantId: '',
};

const baseHasRightsResponse: object = {
  access: false,
};

export interface AccessService<Context extends DataLoaders> {

  createAccess(request: CreateAccessRequest, ctx: Context): Promise<CreateAccessResponse>;

  deleteAccess(request: DeleteAccessRequest, ctx: Context): Promise<DeleteAccessResponse>;

  readAccess(request: ReadAccessRequest, ctx: Context): Promise<ReadAccessResponse>;

  findAccess(request: FindAccessRequest, ctx: Context): Promise<FindAccessResponse>;

  hasRights(request: HasRightsRequest, ctx: Context): Promise<HasRightsResponse>;

}

export interface AccessServiceClient<Context extends DataLoaders> {

  createAccess(request: CreateAccessRequest, ctx?: Context): Observable<CreateAccessResponse>;

  deleteAccess(request: DeleteAccessRequest, ctx?: Context): Observable<DeleteAccessResponse>;

  readAccess(request: ReadAccessRequest, ctx?: Context): Observable<ReadAccessResponse>;

  findAccess(request: FindAccessRequest, ctx?: Context): Observable<FindAccessResponse>;

  hasRights(request: HasRightsRequest, ctx?: Context): Observable<HasRightsResponse>;

}

interface DataLoaders {

  getDataLoader<T>(identifier: string, constructorFn: () => T): T;

}

function toTimestamp(date: Date): Timestamp {
  const seconds = date.getTime() / 1_000;
  const nanos = (date.getTime() % 1_000) * 1_000_000;
  return { seconds, nanos };
}

function fromTimestamp(t: Timestamp): Date {
  let millis = t.seconds * 1_000;
  millis += t.nanos / 1_000_000;
  return new Date(millis);
}

function fromJsonTimestamp(o: any): Date {
  if (o instanceof Date) {
    return o;
  } else if (typeof o === 'string') {
    return new Date(o);
  } else {
    return fromTimestamp(Timestamp.fromJSON(o));
  }
}

export const Access = {
  encode(message: Access, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.id);
    writer.uint32(18).string(message.token);
    writer.uint32(26).string(message.tenantId);
    for (const v of message.scopes) {
      writer.uint32(34).string(v!);
    }
    writer.uint32(42).string(message.name);
    if (message.createdAt !== undefined && message.createdAt !== undefined) {
      Timestamp.encode(toTimestamp(message.createdAt), writer.uint32(66).fork()).ldelim();
    }
    if (message.updatedAt !== undefined && message.updatedAt !== undefined) {
      Timestamp.encode(toTimestamp(message.updatedAt), writer.uint32(74).fork()).ldelim();
    }
    writer.uint32(80).bool(message.active);
    writer.uint32(90).string(message.createdBy);
    return writer;
  },
  decode(reader: Reader, length?: number): Access {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseAccess) as Access;
    message.scopes = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.token = reader.string();
          break;
        case 3:
          message.tenantId = reader.string();
          break;
        case 4:
          message.scopes.push(reader.string());
          break;
        case 5:
          message.name = reader.string();
          break;
        case 8:
          message.createdAt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        case 9:
          message.updatedAt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        case 10:
          message.active = reader.bool();
          break;
        case 11:
          message.createdBy = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): Access {
    const message = Object.create(baseAccess) as Access;
    message.scopes = [];
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    } else {
      message.id = '';
    }
    if (object.token !== undefined && object.token !== null) {
      message.token = String(object.token);
    } else {
      message.token = '';
    }
    if (object.tenantId !== undefined && object.tenantId !== null) {
      message.tenantId = String(object.tenantId);
    } else {
      message.tenantId = '';
    }
    if (object.scopes !== undefined && object.scopes !== null) {
      for (const e of object.scopes) {
        message.scopes.push(String(e));
      }
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    } else {
      message.name = '';
    }
    if (object.createdAt !== undefined && object.createdAt !== null) {
      message.createdAt = fromJsonTimestamp(object.createdAt);
    } else {
      message.createdAt = undefined;
    }
    if (object.updatedAt !== undefined && object.updatedAt !== null) {
      message.updatedAt = fromJsonTimestamp(object.updatedAt);
    } else {
      message.updatedAt = undefined;
    }
    if (object.active !== undefined && object.active !== null) {
      message.active = Boolean(object.active);
    } else {
      message.active = false;
    }
    if (object.createdBy !== undefined && object.createdBy !== null) {
      message.createdBy = String(object.createdBy);
    } else {
      message.createdBy = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<Access>): Access {
    const message = Object.create(baseAccess) as Access;
    message.scopes = [];
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = '';
    }
    if (object.token !== undefined && object.token !== null) {
      message.token = object.token;
    } else {
      message.token = '';
    }
    if (object.tenantId !== undefined && object.tenantId !== null) {
      message.tenantId = object.tenantId;
    } else {
      message.tenantId = '';
    }
    if (object.scopes !== undefined && object.scopes !== null) {
      for (const e of object.scopes) {
        message.scopes.push(e);
      }
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    } else {
      message.name = '';
    }
    if (object.createdAt !== undefined && object.createdAt !== null) {
      message.createdAt = object.createdAt;
    } else {
      message.createdAt = undefined;
    }
    if (object.updatedAt !== undefined && object.updatedAt !== null) {
      message.updatedAt = object.updatedAt;
    } else {
      message.updatedAt = undefined;
    }
    if (object.active !== undefined && object.active !== null) {
      message.active = object.active;
    } else {
      message.active = false;
    }
    if (object.createdBy !== undefined && object.createdBy !== null) {
      message.createdBy = object.createdBy;
    } else {
      message.createdBy = '';
    }
    return message;
  },
  toJSON(message: Access): unknown {
    const obj: any = {};
    obj.id = message.id || '';
    obj.token = message.token || '';
    obj.tenantId = message.tenantId || '';
    if (message.scopes) {
      obj.scopes = message.scopes.map(e => e || '');
    } else {
      obj.scopes = [];
    }
    obj.name = message.name || '';
    obj.createdAt = message.createdAt !== undefined ? message.createdAt.toISOString() : null;
    obj.updatedAt = message.updatedAt !== undefined ? message.updatedAt.toISOString() : null;
    obj.active = message.active || false;
    obj.createdBy = message.createdBy || '';
    return obj;
  },
};

export const CreateAccessRequest = {
  encode(message: CreateAccessRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.tenantId);
    for (const v of message.scopes) {
      writer.uint32(18).string(v!);
    }
    writer.uint32(26).string(message.name);
    return writer;
  },
  decode(reader: Reader, length?: number): CreateAccessRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseCreateAccessRequest) as CreateAccessRequest;
    message.scopes = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.tenantId = reader.string();
          break;
        case 2:
          message.scopes.push(reader.string());
          break;
        case 3:
          message.name = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): CreateAccessRequest {
    const message = Object.create(baseCreateAccessRequest) as CreateAccessRequest;
    message.scopes = [];
    if (object.tenantId !== undefined && object.tenantId !== null) {
      message.tenantId = String(object.tenantId);
    } else {
      message.tenantId = '';
    }
    if (object.scopes !== undefined && object.scopes !== null) {
      for (const e of object.scopes) {
        message.scopes.push(String(e));
      }
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    } else {
      message.name = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<CreateAccessRequest>): CreateAccessRequest {
    const message = Object.create(baseCreateAccessRequest) as CreateAccessRequest;
    message.scopes = [];
    if (object.tenantId !== undefined && object.tenantId !== null) {
      message.tenantId = object.tenantId;
    } else {
      message.tenantId = '';
    }
    if (object.scopes !== undefined && object.scopes !== null) {
      for (const e of object.scopes) {
        message.scopes.push(e);
      }
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    } else {
      message.name = '';
    }
    return message;
  },
  toJSON(message: CreateAccessRequest): unknown {
    const obj: any = {};
    obj.tenantId = message.tenantId || '';
    if (message.scopes) {
      obj.scopes = message.scopes.map(e => e || '');
    } else {
      obj.scopes = [];
    }
    obj.name = message.name || '';
    return obj;
  },
};

export const CreateAccessResponse = {
  encode(message: CreateAccessResponse, writer: Writer = Writer.create()): Writer {
    if (message.accessToken !== undefined && message.accessToken !== undefined) {
      Access.encode(message.accessToken, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): CreateAccessResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseCreateAccessResponse) as CreateAccessResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.accessToken = Access.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): CreateAccessResponse {
    const message = Object.create(baseCreateAccessResponse) as CreateAccessResponse;
    if (object.accessToken !== undefined && object.accessToken !== null) {
      message.accessToken = Access.fromJSON(object.accessToken);
    } else {
      message.accessToken = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<CreateAccessResponse>): CreateAccessResponse {
    const message = Object.create(baseCreateAccessResponse) as CreateAccessResponse;
    if (object.accessToken !== undefined && object.accessToken !== null) {
      message.accessToken = Access.fromPartial(object.accessToken);
    } else {
      message.accessToken = undefined;
    }
    return message;
  },
  toJSON(message: CreateAccessResponse): unknown {
    const obj: any = {};
    obj.accessToken = message.accessToken ? Access.toJSON(message.accessToken) : undefined;
    return obj;
  },
};

export const DeleteAccessRequest = {
  encode(message: DeleteAccessRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.id);
    return writer;
  },
  decode(reader: Reader, length?: number): DeleteAccessRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseDeleteAccessRequest) as DeleteAccessRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): DeleteAccessRequest {
    const message = Object.create(baseDeleteAccessRequest) as DeleteAccessRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    } else {
      message.id = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<DeleteAccessRequest>): DeleteAccessRequest {
    const message = Object.create(baseDeleteAccessRequest) as DeleteAccessRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = '';
    }
    return message;
  },
  toJSON(message: DeleteAccessRequest): unknown {
    const obj: any = {};
    obj.id = message.id || '';
    return obj;
  },
};

export const DeleteAccessResponse = {
  encode(message: DeleteAccessResponse, writer: Writer = Writer.create()): Writer {
    if (message.accessToken !== undefined && message.accessToken !== undefined) {
      Access.encode(message.accessToken, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): DeleteAccessResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseDeleteAccessResponse) as DeleteAccessResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.accessToken = Access.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): DeleteAccessResponse {
    const message = Object.create(baseDeleteAccessResponse) as DeleteAccessResponse;
    if (object.accessToken !== undefined && object.accessToken !== null) {
      message.accessToken = Access.fromJSON(object.accessToken);
    } else {
      message.accessToken = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<DeleteAccessResponse>): DeleteAccessResponse {
    const message = Object.create(baseDeleteAccessResponse) as DeleteAccessResponse;
    if (object.accessToken !== undefined && object.accessToken !== null) {
      message.accessToken = Access.fromPartial(object.accessToken);
    } else {
      message.accessToken = undefined;
    }
    return message;
  },
  toJSON(message: DeleteAccessResponse): unknown {
    const obj: any = {};
    obj.accessToken = message.accessToken ? Access.toJSON(message.accessToken) : undefined;
    return obj;
  },
};

export const ReadAccessRequest = {
  encode(message: ReadAccessRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.id);
    writer.uint32(18).string(message.tenantId);
    return writer;
  },
  decode(reader: Reader, length?: number): ReadAccessRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseReadAccessRequest) as ReadAccessRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.tenantId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ReadAccessRequest {
    const message = Object.create(baseReadAccessRequest) as ReadAccessRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    } else {
      message.id = '';
    }
    if (object.tenantId !== undefined && object.tenantId !== null) {
      message.tenantId = String(object.tenantId);
    } else {
      message.tenantId = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<ReadAccessRequest>): ReadAccessRequest {
    const message = Object.create(baseReadAccessRequest) as ReadAccessRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = '';
    }
    if (object.tenantId !== undefined && object.tenantId !== null) {
      message.tenantId = object.tenantId;
    } else {
      message.tenantId = '';
    }
    return message;
  },
  toJSON(message: ReadAccessRequest): unknown {
    const obj: any = {};
    obj.id = message.id || '';
    obj.tenantId = message.tenantId || '';
    return obj;
  },
};

export const ReadAccessResponse = {
  encode(message: ReadAccessResponse, writer: Writer = Writer.create()): Writer {
    if (message.accessToken !== undefined && message.accessToken !== undefined) {
      Access.encode(message.accessToken, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): ReadAccessResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseReadAccessResponse) as ReadAccessResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.accessToken = Access.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ReadAccessResponse {
    const message = Object.create(baseReadAccessResponse) as ReadAccessResponse;
    if (object.accessToken !== undefined && object.accessToken !== null) {
      message.accessToken = Access.fromJSON(object.accessToken);
    } else {
      message.accessToken = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<ReadAccessResponse>): ReadAccessResponse {
    const message = Object.create(baseReadAccessResponse) as ReadAccessResponse;
    if (object.accessToken !== undefined && object.accessToken !== null) {
      message.accessToken = Access.fromPartial(object.accessToken);
    } else {
      message.accessToken = undefined;
    }
    return message;
  },
  toJSON(message: ReadAccessResponse): unknown {
    const obj: any = {};
    obj.accessToken = message.accessToken ? Access.toJSON(message.accessToken) : undefined;
    return obj;
  },
};

export const FindAccessRequest = {
  encode(message: FindAccessRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.id);
    writer.uint32(18).string(message.tenantId);
    return writer;
  },
  decode(reader: Reader, length?: number): FindAccessRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseFindAccessRequest) as FindAccessRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.tenantId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): FindAccessRequest {
    const message = Object.create(baseFindAccessRequest) as FindAccessRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    } else {
      message.id = '';
    }
    if (object.tenantId !== undefined && object.tenantId !== null) {
      message.tenantId = String(object.tenantId);
    } else {
      message.tenantId = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<FindAccessRequest>): FindAccessRequest {
    const message = Object.create(baseFindAccessRequest) as FindAccessRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = '';
    }
    if (object.tenantId !== undefined && object.tenantId !== null) {
      message.tenantId = object.tenantId;
    } else {
      message.tenantId = '';
    }
    return message;
  },
  toJSON(message: FindAccessRequest): unknown {
    const obj: any = {};
    obj.id = message.id || '';
    obj.tenantId = message.tenantId || '';
    return obj;
  },
};

export const FindAccessResponse = {
  encode(message: FindAccessResponse, writer: Writer = Writer.create()): Writer {
    for (const v of message.accessToken) {
      Access.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): FindAccessResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseFindAccessResponse) as FindAccessResponse;
    message.accessToken = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.accessToken.push(Access.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): FindAccessResponse {
    const message = Object.create(baseFindAccessResponse) as FindAccessResponse;
    message.accessToken = [];
    if (object.accessToken !== undefined && object.accessToken !== null) {
      for (const e of object.accessToken) {
        message.accessToken.push(Access.fromJSON(e));
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<FindAccessResponse>): FindAccessResponse {
    const message = Object.create(baseFindAccessResponse) as FindAccessResponse;
    message.accessToken = [];
    if (object.accessToken !== undefined && object.accessToken !== null) {
      for (const e of object.accessToken) {
        message.accessToken.push(Access.fromPartial(e));
      }
    }
    return message;
  },
  toJSON(message: FindAccessResponse): unknown {
    const obj: any = {};
    if (message.accessToken) {
      obj.accessToken = message.accessToken.map(e => e ? Access.toJSON(e) : undefined);
    } else {
      obj.accessToken = [];
    }
    return obj;
  },
};

export const HasRightsRequest = {
  encode(message: HasRightsRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.token);
    writer.uint32(18).string(message.scope);
    writer.uint32(26).string(message.tenantId);
    return writer;
  },
  decode(reader: Reader, length?: number): HasRightsRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseHasRightsRequest) as HasRightsRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.token = reader.string();
          break;
        case 2:
          message.scope = reader.string();
          break;
        case 3:
          message.tenantId = reader.string();
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
    if (object.token !== undefined && object.token !== null) {
      message.token = String(object.token);
    } else {
      message.token = '';
    }
    if (object.scope !== undefined && object.scope !== null) {
      message.scope = String(object.scope);
    } else {
      message.scope = '';
    }
    if (object.tenantId !== undefined && object.tenantId !== null) {
      message.tenantId = String(object.tenantId);
    } else {
      message.tenantId = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<HasRightsRequest>): HasRightsRequest {
    const message = Object.create(baseHasRightsRequest) as HasRightsRequest;
    if (object.token !== undefined && object.token !== null) {
      message.token = object.token;
    } else {
      message.token = '';
    }
    if (object.scope !== undefined && object.scope !== null) {
      message.scope = object.scope;
    } else {
      message.scope = '';
    }
    if (object.tenantId !== undefined && object.tenantId !== null) {
      message.tenantId = object.tenantId;
    } else {
      message.tenantId = '';
    }
    return message;
  },
  toJSON(message: HasRightsRequest): unknown {
    const obj: any = {};
    obj.token = message.token || '';
    obj.scope = message.scope || '';
    obj.tenantId = message.tenantId || '';
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
