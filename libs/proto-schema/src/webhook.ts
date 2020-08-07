/* eslint-disable */
import { Observable } from 'rxjs';
import { Writer, Reader } from 'protobufjs/minimal';


export interface Auth {
  type: string;
  identifier: string;
  addTo: string;
  key: string;
  value: string;
  token: string;
  username: string;
  password: string;
}

export interface Paginate {
  skip: number;
  limit: number;
}

export interface Webhook {
  id: string;
  endpoint: string;
  requestType: string;
  createdAt: string;
  updatedAt: string;
  tenantId: string;
  auth: Auth | undefined;
  active: boolean;
  name: string;
  action: string;
}

export interface CreateWebhookRequest {
  name: string;
  endpoint: string;
  requestType: string;
  auth: Auth | undefined;
}

export interface CreateWebhookResponse {
  webhook: Webhook | undefined;
}

export interface UpdateWebhookRequest {
  id: string;
  name: string;
  endpoint: string;
  requestType: string;
  auth: Auth | undefined;
}

export interface UpdateWebhookResponse {
  webhook: Webhook | undefined;
}

export interface DeleteWebhookRequest {
  id: string;
}

export interface DeleteWebhookResponse {
  webhook: Webhook | undefined;
}

export interface ReadWebhookRequest {
  id: string;
}

export interface ReadWebhookResponse {
  webhook: Webhook | undefined;
}

export interface FindWebhookRequest {
  filter: string;
  paginate: Paginate | undefined;
}

export interface FindWebhookResponse {
  webhooks: Webhook[];
}

const baseAuth: object = {
  type: '',
  identifier: '',
  addTo: '',
  key: '',
  value: '',
  token: '',
  username: '',
  password: '',
};

const basePaginate: object = {
  skip: 0,
  limit: 0,
};

const baseWebhook: object = {
  id: '',
  endpoint: '',
  requestType: '',
  createdAt: '',
  updatedAt: '',
  tenantId: '',
  auth: undefined,
  active: false,
  name: '',
  action: '',
};

const baseCreateWebhookRequest: object = {
  name: '',
  endpoint: '',
  requestType: '',
  auth: undefined,
};

const baseCreateWebhookResponse: object = {
  webhook: undefined,
};

const baseUpdateWebhookRequest: object = {
  id: '',
  name: '',
  endpoint: '',
  requestType: '',
  auth: undefined,
};

const baseUpdateWebhookResponse: object = {
  webhook: undefined,
};

const baseDeleteWebhookRequest: object = {
  id: '',
};

const baseDeleteWebhookResponse: object = {
  webhook: undefined,
};

const baseReadWebhookRequest: object = {
  id: '',
};

const baseReadWebhookResponse: object = {
  webhook: undefined,
};

const baseFindWebhookRequest: object = {
  filter: '',
  paginate: undefined,
};

const baseFindWebhookResponse: object = {
  webhooks: undefined,
};

export interface WebhookService<Context extends DataLoaders> {

  createWebhook(request: CreateWebhookRequest, ctx: Context): Promise<CreateWebhookResponse>;

  updateWebhook(request: UpdateWebhookRequest, ctx: Context): Promise<UpdateWebhookResponse>;

  deleteWebhook(request: DeleteWebhookRequest, ctx: Context): Promise<DeleteWebhookResponse>;

  readWebhook(request: ReadWebhookRequest, ctx: Context): Promise<ReadWebhookResponse>;

  findWebhook(request: FindWebhookRequest, ctx: Context): Promise<FindWebhookResponse>;

}

export interface WebhookServiceClient<Context extends DataLoaders> {

  createWebhook(request: CreateWebhookRequest, ctx?: Context): Observable<CreateWebhookResponse>;

  updateWebhook(request: UpdateWebhookRequest, ctx?: Context): Observable<UpdateWebhookResponse>;

  deleteWebhook(request: DeleteWebhookRequest, ctx?: Context): Observable<DeleteWebhookResponse>;

  readWebhook(request: ReadWebhookRequest, ctx?: Context): Observable<ReadWebhookResponse>;

  findWebhook(request: FindWebhookRequest, ctx?: Context): Observable<FindWebhookResponse>;

}

interface DataLoaders {

  getDataLoader<T>(identifier: string, constructorFn: () => T): T;

}

export const WebhookRequestType = {
  POST: 0 as WebhookRequestType,
  GET: 1 as WebhookRequestType,
  PUT: 2 as WebhookRequestType,
  DELETE: 3 as WebhookRequestType,
  PATCH: 4 as WebhookRequestType,
  fromJSON(object: any): WebhookRequestType {
    switch (object) {
      case 0:
      case "POST":
        return WebhookRequestType.POST;
      case 1:
      case "GET":
        return WebhookRequestType.GET;
      case 2:
      case "PUT":
        return WebhookRequestType.PUT;
      case 3:
      case "DELETE":
        return WebhookRequestType.DELETE;
      case 4:
      case "PATCH":
        return WebhookRequestType.PATCH;
      default:
        throw new global.Error(`Invalid value ${object}`);
    }
  },
  toJSON(object: WebhookRequestType): string {
    switch (object) {
      case WebhookRequestType.POST:
        return "POST";
      case WebhookRequestType.GET:
        return "GET";
      case WebhookRequestType.PUT:
        return "PUT";
      case WebhookRequestType.DELETE:
        return "DELETE";
      case WebhookRequestType.PATCH:
        return "PATCH";
      default:
        return "UNKNOWN";
    }
  },
}

export type WebhookRequestType = 0 | 1 | 2 | 3 | 4;

export const WebhookAuthType = {
  NONE: 0 as WebhookAuthType,
  BASIC: 1 as WebhookAuthType,
  API_KEY: 2 as WebhookAuthType,
  TOKEN: 3 as WebhookAuthType,
  OAUTH_2: 4 as WebhookAuthType,
  fromJSON(object: any): WebhookAuthType {
    switch (object) {
      case 0:
      case "NONE":
        return WebhookAuthType.NONE;
      case 1:
      case "BASIC":
        return WebhookAuthType.BASIC;
      case 2:
      case "API_KEY":
        return WebhookAuthType.API_KEY;
      case 3:
      case "TOKEN":
        return WebhookAuthType.TOKEN;
      case 4:
      case "OAUTH_2":
        return WebhookAuthType.OAUTH_2;
      default:
        throw new global.Error(`Invalid value ${object}`);
    }
  },
  toJSON(object: WebhookAuthType): string {
    switch (object) {
      case WebhookAuthType.NONE:
        return "NONE";
      case WebhookAuthType.BASIC:
        return "BASIC";
      case WebhookAuthType.API_KEY:
        return "API_KEY";
      case WebhookAuthType.TOKEN:
        return "TOKEN";
      case WebhookAuthType.OAUTH_2:
        return "OAUTH_2";
      default:
        return "UNKNOWN";
    }
  },
}

export type WebhookAuthType = 0 | 1 | 2 | 3 | 4;

export const ApiKeyField = {
  HEADER: 0 as ApiKeyField,
  PARAMS: 1 as ApiKeyField,
  fromJSON(object: any): ApiKeyField {
    switch (object) {
      case 0:
      case "HEADER":
        return ApiKeyField.HEADER;
      case 1:
      case "PARAMS":
        return ApiKeyField.PARAMS;
      default:
        throw new global.Error(`Invalid value ${object}`);
    }
  },
  toJSON(object: ApiKeyField): string {
    switch (object) {
      case ApiKeyField.HEADER:
        return "HEADER";
      case ApiKeyField.PARAMS:
        return "PARAMS";
      default:
        return "UNKNOWN";
    }
  },
}

export type ApiKeyField = 0 | 1;

export const Auth = {
  encode(message: Auth, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.type);
    writer.uint32(18).string(message.identifier);
    writer.uint32(26).string(message.addTo);
    writer.uint32(34).string(message.key);
    writer.uint32(42).string(message.value);
    writer.uint32(50).string(message.token);
    writer.uint32(58).string(message.username);
    writer.uint32(66).string(message.password);
    return writer;
  },
  decode(reader: Reader, length?: number): Auth {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseAuth) as Auth;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.type = reader.string();
          break;
        case 2:
          message.identifier = reader.string();
          break;
        case 3:
          message.addTo = reader.string();
          break;
        case 4:
          message.key = reader.string();
          break;
        case 5:
          message.value = reader.string();
          break;
        case 6:
          message.token = reader.string();
          break;
        case 7:
          message.username = reader.string();
          break;
        case 8:
          message.password = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): Auth {
    const message = Object.create(baseAuth) as Auth;
    if (object.type !== undefined && object.type !== null) {
      message.type = String(object.type);
    } else {
      message.type = '';
    }
    if (object.identifier !== undefined && object.identifier !== null) {
      message.identifier = String(object.identifier);
    } else {
      message.identifier = '';
    }
    if (object.addTo !== undefined && object.addTo !== null) {
      message.addTo = String(object.addTo);
    } else {
      message.addTo = '';
    }
    if (object.key !== undefined && object.key !== null) {
      message.key = String(object.key);
    } else {
      message.key = '';
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = String(object.value);
    } else {
      message.value = '';
    }
    if (object.token !== undefined && object.token !== null) {
      message.token = String(object.token);
    } else {
      message.token = '';
    }
    if (object.username !== undefined && object.username !== null) {
      message.username = String(object.username);
    } else {
      message.username = '';
    }
    if (object.password !== undefined && object.password !== null) {
      message.password = String(object.password);
    } else {
      message.password = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<Auth>): Auth {
    const message = Object.create(baseAuth) as Auth;
    if (object.type !== undefined && object.type !== null) {
      message.type = object.type;
    } else {
      message.type = '';
    }
    if (object.identifier !== undefined && object.identifier !== null) {
      message.identifier = object.identifier;
    } else {
      message.identifier = '';
    }
    if (object.addTo !== undefined && object.addTo !== null) {
      message.addTo = object.addTo;
    } else {
      message.addTo = '';
    }
    if (object.key !== undefined && object.key !== null) {
      message.key = object.key;
    } else {
      message.key = '';
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = object.value;
    } else {
      message.value = '';
    }
    if (object.token !== undefined && object.token !== null) {
      message.token = object.token;
    } else {
      message.token = '';
    }
    if (object.username !== undefined && object.username !== null) {
      message.username = object.username;
    } else {
      message.username = '';
    }
    if (object.password !== undefined && object.password !== null) {
      message.password = object.password;
    } else {
      message.password = '';
    }
    return message;
  },
  toJSON(message: Auth): unknown {
    const obj: any = {};
    obj.type = message.type || '';
    obj.identifier = message.identifier || '';
    obj.addTo = message.addTo || '';
    obj.key = message.key || '';
    obj.value = message.value || '';
    obj.token = message.token || '';
    obj.username = message.username || '';
    obj.password = message.password || '';
    return obj;
  },
};

export const Paginate = {
  encode(message: Paginate, writer: Writer = Writer.create()): Writer {
    writer.uint32(8).int32(message.skip);
    writer.uint32(16).int32(message.limit);
    return writer;
  },
  decode(reader: Reader, length?: number): Paginate {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(basePaginate) as Paginate;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.skip = reader.int32();
          break;
        case 2:
          message.limit = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): Paginate {
    const message = Object.create(basePaginate) as Paginate;
    if (object.skip !== undefined && object.skip !== null) {
      message.skip = Number(object.skip);
    } else {
      message.skip = 0;
    }
    if (object.limit !== undefined && object.limit !== null) {
      message.limit = Number(object.limit);
    } else {
      message.limit = 0;
    }
    return message;
  },
  fromPartial(object: DeepPartial<Paginate>): Paginate {
    const message = Object.create(basePaginate) as Paginate;
    if (object.skip !== undefined && object.skip !== null) {
      message.skip = object.skip;
    } else {
      message.skip = 0;
    }
    if (object.limit !== undefined && object.limit !== null) {
      message.limit = object.limit;
    } else {
      message.limit = 0;
    }
    return message;
  },
  toJSON(message: Paginate): unknown {
    const obj: any = {};
    obj.skip = message.skip || 0;
    obj.limit = message.limit || 0;
    return obj;
  },
};

export const Webhook = {
  encode(message: Webhook, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.id);
    writer.uint32(18).string(message.endpoint);
    writer.uint32(26).string(message.requestType);
    writer.uint32(50).string(message.createdAt);
    writer.uint32(58).string(message.updatedAt);
    writer.uint32(66).string(message.tenantId);
    if (message.auth !== undefined && message.auth !== undefined) {
      Auth.encode(message.auth, writer.uint32(74).fork()).ldelim();
    }
    writer.uint32(80).bool(message.active);
    writer.uint32(90).string(message.name);
    writer.uint32(98).string(message.action);
    return writer;
  },
  decode(reader: Reader, length?: number): Webhook {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseWebhook) as Webhook;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.endpoint = reader.string();
          break;
        case 3:
          message.requestType = reader.string();
          break;
        case 6:
          message.createdAt = reader.string();
          break;
        case 7:
          message.updatedAt = reader.string();
          break;
        case 8:
          message.tenantId = reader.string();
          break;
        case 9:
          message.auth = Auth.decode(reader, reader.uint32());
          break;
        case 10:
          message.active = reader.bool();
          break;
        case 11:
          message.name = reader.string();
          break;
        case 12:
          message.action = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): Webhook {
    const message = Object.create(baseWebhook) as Webhook;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    } else {
      message.id = '';
    }
    if (object.endpoint !== undefined && object.endpoint !== null) {
      message.endpoint = String(object.endpoint);
    } else {
      message.endpoint = '';
    }
    if (object.requestType !== undefined && object.requestType !== null) {
      message.requestType = String(object.requestType);
    } else {
      message.requestType = '';
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
    if (object.tenantId !== undefined && object.tenantId !== null) {
      message.tenantId = String(object.tenantId);
    } else {
      message.tenantId = '';
    }
    if (object.auth !== undefined && object.auth !== null) {
      message.auth = Auth.fromJSON(object.auth);
    } else {
      message.auth = undefined;
    }
    if (object.active !== undefined && object.active !== null) {
      message.active = Boolean(object.active);
    } else {
      message.active = false;
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    } else {
      message.name = '';
    }
    if (object.action !== undefined && object.action !== null) {
      message.action = String(object.action);
    } else {
      message.action = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<Webhook>): Webhook {
    const message = Object.create(baseWebhook) as Webhook;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = '';
    }
    if (object.endpoint !== undefined && object.endpoint !== null) {
      message.endpoint = object.endpoint;
    } else {
      message.endpoint = '';
    }
    if (object.requestType !== undefined && object.requestType !== null) {
      message.requestType = object.requestType;
    } else {
      message.requestType = '';
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
    if (object.tenantId !== undefined && object.tenantId !== null) {
      message.tenantId = object.tenantId;
    } else {
      message.tenantId = '';
    }
    if (object.auth !== undefined && object.auth !== null) {
      message.auth = Auth.fromPartial(object.auth);
    } else {
      message.auth = undefined;
    }
    if (object.active !== undefined && object.active !== null) {
      message.active = object.active;
    } else {
      message.active = false;
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    } else {
      message.name = '';
    }
    if (object.action !== undefined && object.action !== null) {
      message.action = object.action;
    } else {
      message.action = '';
    }
    return message;
  },
  toJSON(message: Webhook): unknown {
    const obj: any = {};
    obj.id = message.id || '';
    obj.endpoint = message.endpoint || '';
    obj.requestType = message.requestType || '';
    obj.createdAt = message.createdAt || '';
    obj.updatedAt = message.updatedAt || '';
    obj.tenantId = message.tenantId || '';
    obj.auth = message.auth ? Auth.toJSON(message.auth) : undefined;
    obj.active = message.active || false;
    obj.name = message.name || '';
    obj.action = message.action || '';
    return obj;
  },
};

export const CreateWebhookRequest = {
  encode(message: CreateWebhookRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.name);
    writer.uint32(18).string(message.endpoint);
    writer.uint32(26).string(message.requestType);
    if (message.auth !== undefined && message.auth !== undefined) {
      Auth.encode(message.auth, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): CreateWebhookRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseCreateWebhookRequest) as CreateWebhookRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        case 2:
          message.endpoint = reader.string();
          break;
        case 3:
          message.requestType = reader.string();
          break;
        case 4:
          message.auth = Auth.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): CreateWebhookRequest {
    const message = Object.create(baseCreateWebhookRequest) as CreateWebhookRequest;
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    } else {
      message.name = '';
    }
    if (object.endpoint !== undefined && object.endpoint !== null) {
      message.endpoint = String(object.endpoint);
    } else {
      message.endpoint = '';
    }
    if (object.requestType !== undefined && object.requestType !== null) {
      message.requestType = String(object.requestType);
    } else {
      message.requestType = '';
    }
    if (object.auth !== undefined && object.auth !== null) {
      message.auth = Auth.fromJSON(object.auth);
    } else {
      message.auth = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<CreateWebhookRequest>): CreateWebhookRequest {
    const message = Object.create(baseCreateWebhookRequest) as CreateWebhookRequest;
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    } else {
      message.name = '';
    }
    if (object.endpoint !== undefined && object.endpoint !== null) {
      message.endpoint = object.endpoint;
    } else {
      message.endpoint = '';
    }
    if (object.requestType !== undefined && object.requestType !== null) {
      message.requestType = object.requestType;
    } else {
      message.requestType = '';
    }
    if (object.auth !== undefined && object.auth !== null) {
      message.auth = Auth.fromPartial(object.auth);
    } else {
      message.auth = undefined;
    }
    return message;
  },
  toJSON(message: CreateWebhookRequest): unknown {
    const obj: any = {};
    obj.name = message.name || '';
    obj.endpoint = message.endpoint || '';
    obj.requestType = message.requestType || '';
    obj.auth = message.auth ? Auth.toJSON(message.auth) : undefined;
    return obj;
  },
};

export const CreateWebhookResponse = {
  encode(message: CreateWebhookResponse, writer: Writer = Writer.create()): Writer {
    if (message.webhook !== undefined && message.webhook !== undefined) {
      Webhook.encode(message.webhook, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): CreateWebhookResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseCreateWebhookResponse) as CreateWebhookResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.webhook = Webhook.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): CreateWebhookResponse {
    const message = Object.create(baseCreateWebhookResponse) as CreateWebhookResponse;
    if (object.webhook !== undefined && object.webhook !== null) {
      message.webhook = Webhook.fromJSON(object.webhook);
    } else {
      message.webhook = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<CreateWebhookResponse>): CreateWebhookResponse {
    const message = Object.create(baseCreateWebhookResponse) as CreateWebhookResponse;
    if (object.webhook !== undefined && object.webhook !== null) {
      message.webhook = Webhook.fromPartial(object.webhook);
    } else {
      message.webhook = undefined;
    }
    return message;
  },
  toJSON(message: CreateWebhookResponse): unknown {
    const obj: any = {};
    obj.webhook = message.webhook ? Webhook.toJSON(message.webhook) : undefined;
    return obj;
  },
};

export const UpdateWebhookRequest = {
  encode(message: UpdateWebhookRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(42).string(message.id);
    writer.uint32(10).string(message.name);
    writer.uint32(18).string(message.endpoint);
    writer.uint32(26).string(message.requestType);
    if (message.auth !== undefined && message.auth !== undefined) {
      Auth.encode(message.auth, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): UpdateWebhookRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseUpdateWebhookRequest) as UpdateWebhookRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 5:
          message.id = reader.string();
          break;
        case 1:
          message.name = reader.string();
          break;
        case 2:
          message.endpoint = reader.string();
          break;
        case 3:
          message.requestType = reader.string();
          break;
        case 4:
          message.auth = Auth.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): UpdateWebhookRequest {
    const message = Object.create(baseUpdateWebhookRequest) as UpdateWebhookRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    } else {
      message.id = '';
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    } else {
      message.name = '';
    }
    if (object.endpoint !== undefined && object.endpoint !== null) {
      message.endpoint = String(object.endpoint);
    } else {
      message.endpoint = '';
    }
    if (object.requestType !== undefined && object.requestType !== null) {
      message.requestType = String(object.requestType);
    } else {
      message.requestType = '';
    }
    if (object.auth !== undefined && object.auth !== null) {
      message.auth = Auth.fromJSON(object.auth);
    } else {
      message.auth = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<UpdateWebhookRequest>): UpdateWebhookRequest {
    const message = Object.create(baseUpdateWebhookRequest) as UpdateWebhookRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = '';
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    } else {
      message.name = '';
    }
    if (object.endpoint !== undefined && object.endpoint !== null) {
      message.endpoint = object.endpoint;
    } else {
      message.endpoint = '';
    }
    if (object.requestType !== undefined && object.requestType !== null) {
      message.requestType = object.requestType;
    } else {
      message.requestType = '';
    }
    if (object.auth !== undefined && object.auth !== null) {
      message.auth = Auth.fromPartial(object.auth);
    } else {
      message.auth = undefined;
    }
    return message;
  },
  toJSON(message: UpdateWebhookRequest): unknown {
    const obj: any = {};
    obj.id = message.id || '';
    obj.name = message.name || '';
    obj.endpoint = message.endpoint || '';
    obj.requestType = message.requestType || '';
    obj.auth = message.auth ? Auth.toJSON(message.auth) : undefined;
    return obj;
  },
};

export const UpdateWebhookResponse = {
  encode(message: UpdateWebhookResponse, writer: Writer = Writer.create()): Writer {
    if (message.webhook !== undefined && message.webhook !== undefined) {
      Webhook.encode(message.webhook, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): UpdateWebhookResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseUpdateWebhookResponse) as UpdateWebhookResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.webhook = Webhook.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): UpdateWebhookResponse {
    const message = Object.create(baseUpdateWebhookResponse) as UpdateWebhookResponse;
    if (object.webhook !== undefined && object.webhook !== null) {
      message.webhook = Webhook.fromJSON(object.webhook);
    } else {
      message.webhook = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<UpdateWebhookResponse>): UpdateWebhookResponse {
    const message = Object.create(baseUpdateWebhookResponse) as UpdateWebhookResponse;
    if (object.webhook !== undefined && object.webhook !== null) {
      message.webhook = Webhook.fromPartial(object.webhook);
    } else {
      message.webhook = undefined;
    }
    return message;
  },
  toJSON(message: UpdateWebhookResponse): unknown {
    const obj: any = {};
    obj.webhook = message.webhook ? Webhook.toJSON(message.webhook) : undefined;
    return obj;
  },
};

export const DeleteWebhookRequest = {
  encode(message: DeleteWebhookRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.id);
    return writer;
  },
  decode(reader: Reader, length?: number): DeleteWebhookRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseDeleteWebhookRequest) as DeleteWebhookRequest;
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
  fromJSON(object: any): DeleteWebhookRequest {
    const message = Object.create(baseDeleteWebhookRequest) as DeleteWebhookRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    } else {
      message.id = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<DeleteWebhookRequest>): DeleteWebhookRequest {
    const message = Object.create(baseDeleteWebhookRequest) as DeleteWebhookRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = '';
    }
    return message;
  },
  toJSON(message: DeleteWebhookRequest): unknown {
    const obj: any = {};
    obj.id = message.id || '';
    return obj;
  },
};

export const DeleteWebhookResponse = {
  encode(message: DeleteWebhookResponse, writer: Writer = Writer.create()): Writer {
    if (message.webhook !== undefined && message.webhook !== undefined) {
      Webhook.encode(message.webhook, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): DeleteWebhookResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseDeleteWebhookResponse) as DeleteWebhookResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.webhook = Webhook.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): DeleteWebhookResponse {
    const message = Object.create(baseDeleteWebhookResponse) as DeleteWebhookResponse;
    if (object.webhook !== undefined && object.webhook !== null) {
      message.webhook = Webhook.fromJSON(object.webhook);
    } else {
      message.webhook = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<DeleteWebhookResponse>): DeleteWebhookResponse {
    const message = Object.create(baseDeleteWebhookResponse) as DeleteWebhookResponse;
    if (object.webhook !== undefined && object.webhook !== null) {
      message.webhook = Webhook.fromPartial(object.webhook);
    } else {
      message.webhook = undefined;
    }
    return message;
  },
  toJSON(message: DeleteWebhookResponse): unknown {
    const obj: any = {};
    obj.webhook = message.webhook ? Webhook.toJSON(message.webhook) : undefined;
    return obj;
  },
};

export const ReadWebhookRequest = {
  encode(message: ReadWebhookRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.id);
    return writer;
  },
  decode(reader: Reader, length?: number): ReadWebhookRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseReadWebhookRequest) as ReadWebhookRequest;
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
  fromJSON(object: any): ReadWebhookRequest {
    const message = Object.create(baseReadWebhookRequest) as ReadWebhookRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    } else {
      message.id = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<ReadWebhookRequest>): ReadWebhookRequest {
    const message = Object.create(baseReadWebhookRequest) as ReadWebhookRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = '';
    }
    return message;
  },
  toJSON(message: ReadWebhookRequest): unknown {
    const obj: any = {};
    obj.id = message.id || '';
    return obj;
  },
};

export const ReadWebhookResponse = {
  encode(message: ReadWebhookResponse, writer: Writer = Writer.create()): Writer {
    if (message.webhook !== undefined && message.webhook !== undefined) {
      Webhook.encode(message.webhook, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): ReadWebhookResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseReadWebhookResponse) as ReadWebhookResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.webhook = Webhook.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ReadWebhookResponse {
    const message = Object.create(baseReadWebhookResponse) as ReadWebhookResponse;
    if (object.webhook !== undefined && object.webhook !== null) {
      message.webhook = Webhook.fromJSON(object.webhook);
    } else {
      message.webhook = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<ReadWebhookResponse>): ReadWebhookResponse {
    const message = Object.create(baseReadWebhookResponse) as ReadWebhookResponse;
    if (object.webhook !== undefined && object.webhook !== null) {
      message.webhook = Webhook.fromPartial(object.webhook);
    } else {
      message.webhook = undefined;
    }
    return message;
  },
  toJSON(message: ReadWebhookResponse): unknown {
    const obj: any = {};
    obj.webhook = message.webhook ? Webhook.toJSON(message.webhook) : undefined;
    return obj;
  },
};

export const FindWebhookRequest = {
  encode(message: FindWebhookRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.filter);
    if (message.paginate !== undefined && message.paginate !== undefined) {
      Paginate.encode(message.paginate, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): FindWebhookRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseFindWebhookRequest) as FindWebhookRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.filter = reader.string();
          break;
        case 2:
          message.paginate = Paginate.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): FindWebhookRequest {
    const message = Object.create(baseFindWebhookRequest) as FindWebhookRequest;
    if (object.filter !== undefined && object.filter !== null) {
      message.filter = String(object.filter);
    } else {
      message.filter = '';
    }
    if (object.paginate !== undefined && object.paginate !== null) {
      message.paginate = Paginate.fromJSON(object.paginate);
    } else {
      message.paginate = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<FindWebhookRequest>): FindWebhookRequest {
    const message = Object.create(baseFindWebhookRequest) as FindWebhookRequest;
    if (object.filter !== undefined && object.filter !== null) {
      message.filter = object.filter;
    } else {
      message.filter = '';
    }
    if (object.paginate !== undefined && object.paginate !== null) {
      message.paginate = Paginate.fromPartial(object.paginate);
    } else {
      message.paginate = undefined;
    }
    return message;
  },
  toJSON(message: FindWebhookRequest): unknown {
    const obj: any = {};
    obj.filter = message.filter || '';
    obj.paginate = message.paginate ? Paginate.toJSON(message.paginate) : undefined;
    return obj;
  },
};

export const FindWebhookResponse = {
  encode(message: FindWebhookResponse, writer: Writer = Writer.create()): Writer {
    for (const v of message.webhooks) {
      Webhook.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): FindWebhookResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseFindWebhookResponse) as FindWebhookResponse;
    message.webhooks = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.webhooks.push(Webhook.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): FindWebhookResponse {
    const message = Object.create(baseFindWebhookResponse) as FindWebhookResponse;
    message.webhooks = [];
    if (object.webhooks !== undefined && object.webhooks !== null) {
      for (const e of object.webhooks) {
        message.webhooks.push(Webhook.fromJSON(e));
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<FindWebhookResponse>): FindWebhookResponse {
    const message = Object.create(baseFindWebhookResponse) as FindWebhookResponse;
    message.webhooks = [];
    if (object.webhooks !== undefined && object.webhooks !== null) {
      for (const e of object.webhooks) {
        message.webhooks.push(Webhook.fromPartial(e));
      }
    }
    return message;
  },
  toJSON(message: FindWebhookResponse): unknown {
    const obj: any = {};
    if (message.webhooks) {
      obj.webhooks = message.webhooks.map(e => e ? Webhook.toJSON(e) : undefined);
    } else {
      obj.webhooks = [];
    }
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