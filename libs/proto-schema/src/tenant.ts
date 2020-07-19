/* eslint-disable */
import { Observable } from 'rxjs';
import { Writer, Reader } from 'protobufjs/minimal';


export interface Tenant {
  /**
   *  @inject_tag: bson:"_id,omitempty"
   */
  id: string;
  /**
   *  @inject_tag: bson:"normalizedName,omitempty"
   */
  normalizedName: string;
  /**
   *  @inject_tag: bson:"name,omitempty"
   */
  name: string;
  /**
   *  @inject_tag: bson:"tokens,omitempty"
   */
  tokens: TenantAccess[];
  /**
   *  @inject_tag: bson:"createdBy,omitempty"
   */
  createdBy: string;
  /**
   *  @inject_tag: bson:"createdAt,omitempty"
   */
  createdAt: string;
  /**
   *  @inject_tag: bson:"updatedAt,omitempty"
   */
  updatedAt: string;
  /**
   *  @inject_tag: bson:"members,omitempty"
   */
  members: Member[];
  /**
   *  @inject_tag: bson:"settings,omitempty"
   */
  settings: Settings | undefined;
  /**
   *  @inject_tag: bson:"payment,omitempty"
   */
  billing: BillingSettings | undefined;
  /**
   *  @inject_tag: bson:"payment,omitempty"
   */
  totalPoints: number;
}

export interface UpdateTenantPayload {
  /**
   *  @inject_tag: bson:"name,omitempty"
   */
  name: string;
  /**
   *  @inject_tag: bson:"settings,omitempty"
   */
  settings: Settings | undefined;
}

export interface TenantAccess {
  /**
   *  @inject_tag: bson:"key,omitempty"
   */
  key: string;
  /**
   *  @inject_tag: bson:"secret,omitempty"
   */
  secret: string;
  /**
   *  @inject_tag: bson:"active,omitempty"
   */
  active: boolean;
  /**
   *  @inject_tag: bson:"createdAt,omitempty"
   */
  createdAt: string;
}

export interface BillingSettings {
  /**
   *  @inject_tag: bson:"currentPlan,omitempty"
   */
  currentPlan: string;
  /**
   *  @inject_tag: bson:"subscriptionPlan,omitempty"
   */
  currentSubscription: string;
}

export interface ConnectionSettings {
  /**
   *  @inject_tag: bson:"host,omitempty"
   */
  host: string;
}

export interface IotSubSettings {
  /**
   *  @inject_tag: bson:"uri,omitempty"
   */
  uri: string;
  /**
   *  @inject_tag: bson:"port,omitempty"
   */
  port: string;
  /**
   *  @inject_tag: bson:"password,omitempty"
   */
  password: string;
  /**
   *  @inject_tag: bson:"username,omitempty"
   */
  username: string;
}

export interface Settings {
  /**
   *  @inject_tag: bson:"connection,omitempty"
   */
  showStatusIcon: boolean;
  /**
   *  @inject_tag: bson:"connection,omitempty"
   */
  connection: ConnectionSettings | undefined;
  /**
   *  @inject_tag: bson:"mqtt,omitempty"
   */
  mqtt: IotSubSettings | undefined;
}

export interface Member {
  /**
   *  @inject_tag: bson:"id,omitempty"
   */
  id: string;
  /**
   *  @inject_tag: bson:"email,omitempty"
   */
  email: string;
  /**
   *  @inject_tag: bson:"userId,omitempty"
   */
  userId: string;
  /**
   *  @inject_tag: bson:"createdAt,omitempty"
   */
  createdAt: string;
  /**
   *  @inject_tag: bson:"status,omitempty"
   */
  status: string;
  /**
   *  @inject_tag: bson:"role,omitempty"
   */
  role: string;
  /**
   *  @inject_tag: bson:"updatedAt,omitempty"
   */
  updatedAt: string;
}

/**
 *  Tenant
 */
export interface CreateTenantRequest {
  name: string;
  planId: string;
  couponId: string;
  cardId: string;
}

export interface CreateTenantResponse {
  tenant: Tenant | undefined;
}

export interface FindTenantRequest {
  filter: string;
}

export interface TenantAvailableRequest {
  identifier: string;
}

export interface TenantAvailableResponse {
  available: boolean;
}

export interface FindTenantResponse {
  tenants: Tenant[];
}

export interface DeleteTenantRequest {
  id: string;
}

export interface DeleteTenantResponse {
  tenant: Tenant | undefined;
}

export interface ReadTenantRequest {
  filter: string;
}

export interface ReadTenantResponse {
  tenant: Tenant | undefined;
}

export interface UpdateTenantRequest {
  /**
   *  @inject_tag: bson:"_id,omitempty"
   */
  id: string;
  data: UpdateTenantPayload | undefined;
}

export interface UpdateTenantResponse {
  tenant: Tenant | undefined;
}

/**
 *  Tenant Members
 */
export interface InviteMemberRequest {
  /**
   *  @inject_tag: bson:"email,omitempty"
   */
  email: string;
  /**
   *  @inject_tag: bson:"userId,omitempty"
   */
  userId: string;
  /**
   *  @inject_tag: bson:"role,omitempty"
   */
  role: string;
}

export interface InviteMemberResponse {
  member: Member | undefined;
}

export interface FindMemberRequest {
  status: string;
  role: string;
  tenantId: string;
}

export interface FindMemberResponse {
  members: Member[];
}

export interface DeleteMemberRequest {
  id: string;
}

export interface DeleteMemberResponse {
  member: Member | undefined;
}

export interface ReadMemberRequest {
  /**
   *  @inject_tag: bson:"id,omitempty"
   */
  id: string;
}

export interface ReadMemberResponse {
  member: Member | undefined;
}

export interface UpdateMemberRequest {
  /**
   *  @inject_tag: bson:"id,omitempty"
   */
  id: string;
  /**
   *  @inject_tag: bson:"status,omitempty"
   */
  status: string;
  /**
   *  @inject_tag: bson:"role,omitempty"
   */
  role: string;
}

export interface UpdateMemberResponse {
  member: Member | undefined;
}

export interface AcceptMemberInvitationRequest {
  /**
   *  @inject_tag: bson:"token,omitempty"
   */
  token: string;
}

export interface AcceptMemberInvitationResponse {
  member: Member | undefined;
}

const baseTenant: object = {
  id: '',
  normalizedName: '',
  name: '',
  tokens: undefined,
  createdBy: '',
  createdAt: '',
  updatedAt: '',
  members: undefined,
  settings: undefined,
  billing: undefined,
  totalPoints: 0,
};

const baseUpdateTenantPayload: object = {
  name: '',
  settings: undefined,
};

const baseTenantAccess: object = {
  key: '',
  secret: '',
  active: false,
  createdAt: '',
};

const baseBillingSettings: object = {
  currentPlan: '',
  currentSubscription: '',
};

const baseConnectionSettings: object = {
  host: '',
};

const baseIotSubSettings: object = {
  uri: '',
  port: '',
  password: '',
  username: '',
};

const baseSettings: object = {
  showStatusIcon: false,
  connection: undefined,
  mqtt: undefined,
};

const baseMember: object = {
  id: '',
  email: '',
  userId: '',
  createdAt: '',
  status: '',
  role: '',
  updatedAt: '',
};

const baseCreateTenantRequest: object = {
  name: '',
  planId: '',
  couponId: '',
  cardId: '',
};

const baseCreateTenantResponse: object = {
  tenant: undefined,
};

const baseFindTenantRequest: object = {
  filter: '',
};

const baseTenantAvailableRequest: object = {
  identifier: '',
};

const baseTenantAvailableResponse: object = {
  available: false,
};

const baseFindTenantResponse: object = {
  tenants: undefined,
};

const baseDeleteTenantRequest: object = {
  id: '',
};

const baseDeleteTenantResponse: object = {
  tenant: undefined,
};

const baseReadTenantRequest: object = {
  filter: '',
};

const baseReadTenantResponse: object = {
  tenant: undefined,
};

const baseUpdateTenantRequest: object = {
  id: '',
  data: undefined,
};

const baseUpdateTenantResponse: object = {
  tenant: undefined,
};

const baseInviteMemberRequest: object = {
  email: '',
  userId: '',
  role: '',
};

const baseInviteMemberResponse: object = {
  member: undefined,
};

const baseFindMemberRequest: object = {
  status: '',
  role: '',
  tenantId: '',
};

const baseFindMemberResponse: object = {
  members: undefined,
};

const baseDeleteMemberRequest: object = {
  id: '',
};

const baseDeleteMemberResponse: object = {
  member: undefined,
};

const baseReadMemberRequest: object = {
  id: '',
};

const baseReadMemberResponse: object = {
  member: undefined,
};

const baseUpdateMemberRequest: object = {
  id: '',
  status: '',
  role: '',
};

const baseUpdateMemberResponse: object = {
  member: undefined,
};

const baseAcceptMemberInvitationRequest: object = {
  token: '',
};

const baseAcceptMemberInvitationResponse: object = {
  member: undefined,
};

export interface TenantService<Context extends DataLoaders> {

  /**
   *  Tenants
   */
  createTenant(request: CreateTenantRequest, ctx: Context): Promise<CreateTenantResponse>;

  readTenant(request: ReadTenantRequest, ctx: Context): Promise<ReadTenantResponse>;

  findTenant(request: FindTenantRequest, ctx: Context): Promise<FindTenantResponse>;

  updateTenant(request: UpdateTenantRequest, ctx: Context): Promise<UpdateTenantResponse>;

  deleteTenant(request: DeleteTenantRequest, ctx: Context): Promise<DeleteTenantResponse>;

  tenantAvailable(request: TenantAvailableRequest, ctx: Context): Promise<TenantAvailableResponse>;

  /**
   *  Members
   */
  inviteMember(request: InviteMemberRequest, ctx: Context): Promise<InviteMemberResponse>;

  acceptMemberInvitation(request: AcceptMemberInvitationRequest, ctx: Context): Promise<AcceptMemberInvitationResponse>;

  updateMember(request: UpdateMemberRequest, ctx: Context): Promise<UpdateMemberResponse>;

  deleteMember(request: DeleteMemberRequest, ctx: Context): Promise<DeleteMemberResponse>;

  readMember(request: ReadMemberRequest, ctx: Context): Promise<ReadMemberResponse>;

  findMembers(request: FindMemberRequest, ctx: Context): Promise<FindMemberResponse>;

}

export interface TenantServiceClient<Context extends DataLoaders> {

  /**
   *  Tenants
   */
  createTenant(request: CreateTenantRequest, ctx?: Context): Observable<CreateTenantResponse>;

  readTenant(request: ReadTenantRequest, ctx?: Context): Observable<ReadTenantResponse>;

  findTenant(request: FindTenantRequest, ctx?: Context): Observable<FindTenantResponse>;

  updateTenant(request: UpdateTenantRequest, ctx?: Context): Observable<UpdateTenantResponse>;

  deleteTenant(request: DeleteTenantRequest, ctx?: Context): Observable<DeleteTenantResponse>;

  tenantAvailable(request: TenantAvailableRequest, ctx?: Context): Observable<TenantAvailableResponse>;

  /**
   *  Members
   */
  inviteMember(request: InviteMemberRequest, ctx?: Context): Observable<InviteMemberResponse>;

  acceptMemberInvitation(request: AcceptMemberInvitationRequest, ctx?: Context): Observable<AcceptMemberInvitationResponse>;

  updateMember(request: UpdateMemberRequest, ctx?: Context): Observable<UpdateMemberResponse>;

  deleteMember(request: DeleteMemberRequest, ctx?: Context): Observable<DeleteMemberResponse>;

  readMember(request: ReadMemberRequest, ctx?: Context): Observable<ReadMemberResponse>;

  findMembers(request: FindMemberRequest, ctx?: Context): Observable<FindMemberResponse>;

}

interface DataLoaders {

  getDataLoader<T>(identifier: string, constructorFn: () => T): T;

}

export const InvitationStatus = {
  /** PENDING -  option allow_alias = true;
   */
  PENDING: 0 as InvitationStatus,
  ACCEPTED: 1 as InvitationStatus,
  REJECTED: 2 as InvitationStatus,
  fromJSON(object: any): InvitationStatus {
    switch (object) {
      case 0:
      case "PENDING":
        return InvitationStatus.PENDING;
      case 1:
      case "ACCEPTED":
        return InvitationStatus.ACCEPTED;
      case 2:
      case "REJECTED":
        return InvitationStatus.REJECTED;
      default:
        throw new global.Error(`Invalid value ${object}`);
    }
  },
  toJSON(object: InvitationStatus): string {
    switch (object) {
      case InvitationStatus.PENDING:
        return "PENDING";
      case InvitationStatus.ACCEPTED:
        return "ACCEPTED";
      case InvitationStatus.REJECTED:
        return "REJECTED";
      default:
        return "UNKNOWN";
    }
  },
}

export type InvitationStatus = 0 | 1 | 2;

export const Tenant = {
  encode(message: Tenant, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.id);
    writer.uint32(18).string(message.normalizedName);
    writer.uint32(26).string(message.name);
    for (const v of message.tokens) {
      TenantAccess.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    writer.uint32(42).string(message.createdBy);
    writer.uint32(50).string(message.createdAt);
    writer.uint32(58).string(message.updatedAt);
    for (const v of message.members) {
      Member.encode(v!, writer.uint32(66).fork()).ldelim();
    }
    if (message.settings !== undefined && message.settings !== undefined) {
      Settings.encode(message.settings, writer.uint32(74).fork()).ldelim();
    }
    if (message.billing !== undefined && message.billing !== undefined) {
      BillingSettings.encode(message.billing, writer.uint32(82).fork()).ldelim();
    }
    writer.uint32(88).int32(message.totalPoints);
    return writer;
  },
  decode(reader: Reader, length?: number): Tenant {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseTenant) as Tenant;
    message.tokens = [];
    message.members = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.normalizedName = reader.string();
          break;
        case 3:
          message.name = reader.string();
          break;
        case 4:
          message.tokens.push(TenantAccess.decode(reader, reader.uint32()));
          break;
        case 5:
          message.createdBy = reader.string();
          break;
        case 6:
          message.createdAt = reader.string();
          break;
        case 7:
          message.updatedAt = reader.string();
          break;
        case 8:
          message.members.push(Member.decode(reader, reader.uint32()));
          break;
        case 9:
          message.settings = Settings.decode(reader, reader.uint32());
          break;
        case 10:
          message.billing = BillingSettings.decode(reader, reader.uint32());
          break;
        case 11:
          message.totalPoints = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): Tenant {
    const message = Object.create(baseTenant) as Tenant;
    message.tokens = [];
    message.members = [];
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    } else {
      message.id = '';
    }
    if (object.normalizedName !== undefined && object.normalizedName !== null) {
      message.normalizedName = String(object.normalizedName);
    } else {
      message.normalizedName = '';
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    } else {
      message.name = '';
    }
    if (object.tokens !== undefined && object.tokens !== null) {
      for (const e of object.tokens) {
        message.tokens.push(TenantAccess.fromJSON(e));
      }
    }
    if (object.createdBy !== undefined && object.createdBy !== null) {
      message.createdBy = String(object.createdBy);
    } else {
      message.createdBy = '';
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
    if (object.members !== undefined && object.members !== null) {
      for (const e of object.members) {
        message.members.push(Member.fromJSON(e));
      }
    }
    if (object.settings !== undefined && object.settings !== null) {
      message.settings = Settings.fromJSON(object.settings);
    } else {
      message.settings = undefined;
    }
    if (object.billing !== undefined && object.billing !== null) {
      message.billing = BillingSettings.fromJSON(object.billing);
    } else {
      message.billing = undefined;
    }
    if (object.totalPoints !== undefined && object.totalPoints !== null) {
      message.totalPoints = Number(object.totalPoints);
    } else {
      message.totalPoints = 0;
    }
    return message;
  },
  fromPartial(object: DeepPartial<Tenant>): Tenant {
    const message = Object.create(baseTenant) as Tenant;
    message.tokens = [];
    message.members = [];
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = '';
    }
    if (object.normalizedName !== undefined && object.normalizedName !== null) {
      message.normalizedName = object.normalizedName;
    } else {
      message.normalizedName = '';
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    } else {
      message.name = '';
    }
    if (object.tokens !== undefined && object.tokens !== null) {
      for (const e of object.tokens) {
        message.tokens.push(TenantAccess.fromPartial(e));
      }
    }
    if (object.createdBy !== undefined && object.createdBy !== null) {
      message.createdBy = object.createdBy;
    } else {
      message.createdBy = '';
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
    if (object.members !== undefined && object.members !== null) {
      for (const e of object.members) {
        message.members.push(Member.fromPartial(e));
      }
    }
    if (object.settings !== undefined && object.settings !== null) {
      message.settings = Settings.fromPartial(object.settings);
    } else {
      message.settings = undefined;
    }
    if (object.billing !== undefined && object.billing !== null) {
      message.billing = BillingSettings.fromPartial(object.billing);
    } else {
      message.billing = undefined;
    }
    if (object.totalPoints !== undefined && object.totalPoints !== null) {
      message.totalPoints = object.totalPoints;
    } else {
      message.totalPoints = 0;
    }
    return message;
  },
  toJSON(message: Tenant): unknown {
    const obj: any = {};
    obj.id = message.id || '';
    obj.normalizedName = message.normalizedName || '';
    obj.name = message.name || '';
    if (message.tokens) {
      obj.tokens = message.tokens.map(e => e ? TenantAccess.toJSON(e) : undefined);
    } else {
      obj.tokens = [];
    }
    obj.createdBy = message.createdBy || '';
    obj.createdAt = message.createdAt || '';
    obj.updatedAt = message.updatedAt || '';
    if (message.members) {
      obj.members = message.members.map(e => e ? Member.toJSON(e) : undefined);
    } else {
      obj.members = [];
    }
    obj.settings = message.settings ? Settings.toJSON(message.settings) : undefined;
    obj.billing = message.billing ? BillingSettings.toJSON(message.billing) : undefined;
    obj.totalPoints = message.totalPoints || 0;
    return obj;
  },
};

export const UpdateTenantPayload = {
  encode(message: UpdateTenantPayload, writer: Writer = Writer.create()): Writer {
    writer.uint32(26).string(message.name);
    if (message.settings !== undefined && message.settings !== undefined) {
      Settings.encode(message.settings, writer.uint32(74).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): UpdateTenantPayload {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseUpdateTenantPayload) as UpdateTenantPayload;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 3:
          message.name = reader.string();
          break;
        case 9:
          message.settings = Settings.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): UpdateTenantPayload {
    const message = Object.create(baseUpdateTenantPayload) as UpdateTenantPayload;
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    } else {
      message.name = '';
    }
    if (object.settings !== undefined && object.settings !== null) {
      message.settings = Settings.fromJSON(object.settings);
    } else {
      message.settings = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<UpdateTenantPayload>): UpdateTenantPayload {
    const message = Object.create(baseUpdateTenantPayload) as UpdateTenantPayload;
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    } else {
      message.name = '';
    }
    if (object.settings !== undefined && object.settings !== null) {
      message.settings = Settings.fromPartial(object.settings);
    } else {
      message.settings = undefined;
    }
    return message;
  },
  toJSON(message: UpdateTenantPayload): unknown {
    const obj: any = {};
    obj.name = message.name || '';
    obj.settings = message.settings ? Settings.toJSON(message.settings) : undefined;
    return obj;
  },
};

export const TenantAccess = {
  encode(message: TenantAccess, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.key);
    writer.uint32(18).string(message.secret);
    writer.uint32(24).bool(message.active);
    writer.uint32(34).string(message.createdAt);
    return writer;
  },
  decode(reader: Reader, length?: number): TenantAccess {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseTenantAccess) as TenantAccess;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string();
          break;
        case 2:
          message.secret = reader.string();
          break;
        case 3:
          message.active = reader.bool();
          break;
        case 4:
          message.createdAt = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): TenantAccess {
    const message = Object.create(baseTenantAccess) as TenantAccess;
    if (object.key !== undefined && object.key !== null) {
      message.key = String(object.key);
    } else {
      message.key = '';
    }
    if (object.secret !== undefined && object.secret !== null) {
      message.secret = String(object.secret);
    } else {
      message.secret = '';
    }
    if (object.active !== undefined && object.active !== null) {
      message.active = Boolean(object.active);
    } else {
      message.active = false;
    }
    if (object.createdAt !== undefined && object.createdAt !== null) {
      message.createdAt = String(object.createdAt);
    } else {
      message.createdAt = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<TenantAccess>): TenantAccess {
    const message = Object.create(baseTenantAccess) as TenantAccess;
    if (object.key !== undefined && object.key !== null) {
      message.key = object.key;
    } else {
      message.key = '';
    }
    if (object.secret !== undefined && object.secret !== null) {
      message.secret = object.secret;
    } else {
      message.secret = '';
    }
    if (object.active !== undefined && object.active !== null) {
      message.active = object.active;
    } else {
      message.active = false;
    }
    if (object.createdAt !== undefined && object.createdAt !== null) {
      message.createdAt = object.createdAt;
    } else {
      message.createdAt = '';
    }
    return message;
  },
  toJSON(message: TenantAccess): unknown {
    const obj: any = {};
    obj.key = message.key || '';
    obj.secret = message.secret || '';
    obj.active = message.active || false;
    obj.createdAt = message.createdAt || '';
    return obj;
  },
};

export const BillingSettings = {
  encode(message: BillingSettings, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.currentPlan);
    writer.uint32(18).string(message.currentSubscription);
    return writer;
  },
  decode(reader: Reader, length?: number): BillingSettings {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseBillingSettings) as BillingSettings;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.currentPlan = reader.string();
          break;
        case 2:
          message.currentSubscription = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): BillingSettings {
    const message = Object.create(baseBillingSettings) as BillingSettings;
    if (object.currentPlan !== undefined && object.currentPlan !== null) {
      message.currentPlan = String(object.currentPlan);
    } else {
      message.currentPlan = '';
    }
    if (object.currentSubscription !== undefined && object.currentSubscription !== null) {
      message.currentSubscription = String(object.currentSubscription);
    } else {
      message.currentSubscription = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<BillingSettings>): BillingSettings {
    const message = Object.create(baseBillingSettings) as BillingSettings;
    if (object.currentPlan !== undefined && object.currentPlan !== null) {
      message.currentPlan = object.currentPlan;
    } else {
      message.currentPlan = '';
    }
    if (object.currentSubscription !== undefined && object.currentSubscription !== null) {
      message.currentSubscription = object.currentSubscription;
    } else {
      message.currentSubscription = '';
    }
    return message;
  },
  toJSON(message: BillingSettings): unknown {
    const obj: any = {};
    obj.currentPlan = message.currentPlan || '';
    obj.currentSubscription = message.currentSubscription || '';
    return obj;
  },
};

export const ConnectionSettings = {
  encode(message: ConnectionSettings, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.host);
    return writer;
  },
  decode(reader: Reader, length?: number): ConnectionSettings {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseConnectionSettings) as ConnectionSettings;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.host = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ConnectionSettings {
    const message = Object.create(baseConnectionSettings) as ConnectionSettings;
    if (object.host !== undefined && object.host !== null) {
      message.host = String(object.host);
    } else {
      message.host = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<ConnectionSettings>): ConnectionSettings {
    const message = Object.create(baseConnectionSettings) as ConnectionSettings;
    if (object.host !== undefined && object.host !== null) {
      message.host = object.host;
    } else {
      message.host = '';
    }
    return message;
  },
  toJSON(message: ConnectionSettings): unknown {
    const obj: any = {};
    obj.host = message.host || '';
    return obj;
  },
};

export const IotSubSettings = {
  encode(message: IotSubSettings, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.uri);
    writer.uint32(18).string(message.port);
    writer.uint32(26).string(message.password);
    writer.uint32(34).string(message.username);
    return writer;
  },
  decode(reader: Reader, length?: number): IotSubSettings {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseIotSubSettings) as IotSubSettings;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.uri = reader.string();
          break;
        case 2:
          message.port = reader.string();
          break;
        case 3:
          message.password = reader.string();
          break;
        case 4:
          message.username = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): IotSubSettings {
    const message = Object.create(baseIotSubSettings) as IotSubSettings;
    if (object.uri !== undefined && object.uri !== null) {
      message.uri = String(object.uri);
    } else {
      message.uri = '';
    }
    if (object.port !== undefined && object.port !== null) {
      message.port = String(object.port);
    } else {
      message.port = '';
    }
    if (object.password !== undefined && object.password !== null) {
      message.password = String(object.password);
    } else {
      message.password = '';
    }
    if (object.username !== undefined && object.username !== null) {
      message.username = String(object.username);
    } else {
      message.username = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<IotSubSettings>): IotSubSettings {
    const message = Object.create(baseIotSubSettings) as IotSubSettings;
    if (object.uri !== undefined && object.uri !== null) {
      message.uri = object.uri;
    } else {
      message.uri = '';
    }
    if (object.port !== undefined && object.port !== null) {
      message.port = object.port;
    } else {
      message.port = '';
    }
    if (object.password !== undefined && object.password !== null) {
      message.password = object.password;
    } else {
      message.password = '';
    }
    if (object.username !== undefined && object.username !== null) {
      message.username = object.username;
    } else {
      message.username = '';
    }
    return message;
  },
  toJSON(message: IotSubSettings): unknown {
    const obj: any = {};
    obj.uri = message.uri || '';
    obj.port = message.port || '';
    obj.password = message.password || '';
    obj.username = message.username || '';
    return obj;
  },
};

export const Settings = {
  encode(message: Settings, writer: Writer = Writer.create()): Writer {
    writer.uint32(8).bool(message.showStatusIcon);
    if (message.connection !== undefined && message.connection !== undefined) {
      ConnectionSettings.encode(message.connection, writer.uint32(18).fork()).ldelim();
    }
    if (message.mqtt !== undefined && message.mqtt !== undefined) {
      IotSubSettings.encode(message.mqtt, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): Settings {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseSettings) as Settings;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.showStatusIcon = reader.bool();
          break;
        case 2:
          message.connection = ConnectionSettings.decode(reader, reader.uint32());
          break;
        case 3:
          message.mqtt = IotSubSettings.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): Settings {
    const message = Object.create(baseSettings) as Settings;
    if (object.showStatusIcon !== undefined && object.showStatusIcon !== null) {
      message.showStatusIcon = Boolean(object.showStatusIcon);
    } else {
      message.showStatusIcon = false;
    }
    if (object.connection !== undefined && object.connection !== null) {
      message.connection = ConnectionSettings.fromJSON(object.connection);
    } else {
      message.connection = undefined;
    }
    if (object.mqtt !== undefined && object.mqtt !== null) {
      message.mqtt = IotSubSettings.fromJSON(object.mqtt);
    } else {
      message.mqtt = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<Settings>): Settings {
    const message = Object.create(baseSettings) as Settings;
    if (object.showStatusIcon !== undefined && object.showStatusIcon !== null) {
      message.showStatusIcon = object.showStatusIcon;
    } else {
      message.showStatusIcon = false;
    }
    if (object.connection !== undefined && object.connection !== null) {
      message.connection = ConnectionSettings.fromPartial(object.connection);
    } else {
      message.connection = undefined;
    }
    if (object.mqtt !== undefined && object.mqtt !== null) {
      message.mqtt = IotSubSettings.fromPartial(object.mqtt);
    } else {
      message.mqtt = undefined;
    }
    return message;
  },
  toJSON(message: Settings): unknown {
    const obj: any = {};
    obj.showStatusIcon = message.showStatusIcon || false;
    obj.connection = message.connection ? ConnectionSettings.toJSON(message.connection) : undefined;
    obj.mqtt = message.mqtt ? IotSubSettings.toJSON(message.mqtt) : undefined;
    return obj;
  },
};

export const Member = {
  encode(message: Member, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.id);
    writer.uint32(18).string(message.email);
    writer.uint32(26).string(message.userId);
    writer.uint32(34).string(message.createdAt);
    writer.uint32(42).string(message.status);
    writer.uint32(50).string(message.role);
    writer.uint32(58).string(message.updatedAt);
    return writer;
  },
  decode(reader: Reader, length?: number): Member {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseMember) as Member;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.email = reader.string();
          break;
        case 3:
          message.userId = reader.string();
          break;
        case 4:
          message.createdAt = reader.string();
          break;
        case 5:
          message.status = reader.string();
          break;
        case 6:
          message.role = reader.string();
          break;
        case 7:
          message.updatedAt = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): Member {
    const message = Object.create(baseMember) as Member;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    } else {
      message.id = '';
    }
    if (object.email !== undefined && object.email !== null) {
      message.email = String(object.email);
    } else {
      message.email = '';
    }
    if (object.userId !== undefined && object.userId !== null) {
      message.userId = String(object.userId);
    } else {
      message.userId = '';
    }
    if (object.createdAt !== undefined && object.createdAt !== null) {
      message.createdAt = String(object.createdAt);
    } else {
      message.createdAt = '';
    }
    if (object.status !== undefined && object.status !== null) {
      message.status = String(object.status);
    } else {
      message.status = '';
    }
    if (object.role !== undefined && object.role !== null) {
      message.role = String(object.role);
    } else {
      message.role = '';
    }
    if (object.updatedAt !== undefined && object.updatedAt !== null) {
      message.updatedAt = String(object.updatedAt);
    } else {
      message.updatedAt = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<Member>): Member {
    const message = Object.create(baseMember) as Member;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = '';
    }
    if (object.email !== undefined && object.email !== null) {
      message.email = object.email;
    } else {
      message.email = '';
    }
    if (object.userId !== undefined && object.userId !== null) {
      message.userId = object.userId;
    } else {
      message.userId = '';
    }
    if (object.createdAt !== undefined && object.createdAt !== null) {
      message.createdAt = object.createdAt;
    } else {
      message.createdAt = '';
    }
    if (object.status !== undefined && object.status !== null) {
      message.status = object.status;
    } else {
      message.status = '';
    }
    if (object.role !== undefined && object.role !== null) {
      message.role = object.role;
    } else {
      message.role = '';
    }
    if (object.updatedAt !== undefined && object.updatedAt !== null) {
      message.updatedAt = object.updatedAt;
    } else {
      message.updatedAt = '';
    }
    return message;
  },
  toJSON(message: Member): unknown {
    const obj: any = {};
    obj.id = message.id || '';
    obj.email = message.email || '';
    obj.userId = message.userId || '';
    obj.createdAt = message.createdAt || '';
    obj.status = message.status || '';
    obj.role = message.role || '';
    obj.updatedAt = message.updatedAt || '';
    return obj;
  },
};

export const CreateTenantRequest = {
  encode(message: CreateTenantRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.name);
    writer.uint32(18).string(message.planId);
    writer.uint32(26).string(message.couponId);
    writer.uint32(34).string(message.cardId);
    return writer;
  },
  decode(reader: Reader, length?: number): CreateTenantRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseCreateTenantRequest) as CreateTenantRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        case 2:
          message.planId = reader.string();
          break;
        case 3:
          message.couponId = reader.string();
          break;
        case 4:
          message.cardId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): CreateTenantRequest {
    const message = Object.create(baseCreateTenantRequest) as CreateTenantRequest;
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    } else {
      message.name = '';
    }
    if (object.planId !== undefined && object.planId !== null) {
      message.planId = String(object.planId);
    } else {
      message.planId = '';
    }
    if (object.couponId !== undefined && object.couponId !== null) {
      message.couponId = String(object.couponId);
    } else {
      message.couponId = '';
    }
    if (object.cardId !== undefined && object.cardId !== null) {
      message.cardId = String(object.cardId);
    } else {
      message.cardId = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<CreateTenantRequest>): CreateTenantRequest {
    const message = Object.create(baseCreateTenantRequest) as CreateTenantRequest;
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    } else {
      message.name = '';
    }
    if (object.planId !== undefined && object.planId !== null) {
      message.planId = object.planId;
    } else {
      message.planId = '';
    }
    if (object.couponId !== undefined && object.couponId !== null) {
      message.couponId = object.couponId;
    } else {
      message.couponId = '';
    }
    if (object.cardId !== undefined && object.cardId !== null) {
      message.cardId = object.cardId;
    } else {
      message.cardId = '';
    }
    return message;
  },
  toJSON(message: CreateTenantRequest): unknown {
    const obj: any = {};
    obj.name = message.name || '';
    obj.planId = message.planId || '';
    obj.couponId = message.couponId || '';
    obj.cardId = message.cardId || '';
    return obj;
  },
};

export const CreateTenantResponse = {
  encode(message: CreateTenantResponse, writer: Writer = Writer.create()): Writer {
    if (message.tenant !== undefined && message.tenant !== undefined) {
      Tenant.encode(message.tenant, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): CreateTenantResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseCreateTenantResponse) as CreateTenantResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.tenant = Tenant.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): CreateTenantResponse {
    const message = Object.create(baseCreateTenantResponse) as CreateTenantResponse;
    if (object.tenant !== undefined && object.tenant !== null) {
      message.tenant = Tenant.fromJSON(object.tenant);
    } else {
      message.tenant = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<CreateTenantResponse>): CreateTenantResponse {
    const message = Object.create(baseCreateTenantResponse) as CreateTenantResponse;
    if (object.tenant !== undefined && object.tenant !== null) {
      message.tenant = Tenant.fromPartial(object.tenant);
    } else {
      message.tenant = undefined;
    }
    return message;
  },
  toJSON(message: CreateTenantResponse): unknown {
    const obj: any = {};
    obj.tenant = message.tenant ? Tenant.toJSON(message.tenant) : undefined;
    return obj;
  },
};

export const FindTenantRequest = {
  encode(message: FindTenantRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.filter);
    return writer;
  },
  decode(reader: Reader, length?: number): FindTenantRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseFindTenantRequest) as FindTenantRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.filter = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): FindTenantRequest {
    const message = Object.create(baseFindTenantRequest) as FindTenantRequest;
    if (object.filter !== undefined && object.filter !== null) {
      message.filter = String(object.filter);
    } else {
      message.filter = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<FindTenantRequest>): FindTenantRequest {
    const message = Object.create(baseFindTenantRequest) as FindTenantRequest;
    if (object.filter !== undefined && object.filter !== null) {
      message.filter = object.filter;
    } else {
      message.filter = '';
    }
    return message;
  },
  toJSON(message: FindTenantRequest): unknown {
    const obj: any = {};
    obj.filter = message.filter || '';
    return obj;
  },
};

export const TenantAvailableRequest = {
  encode(message: TenantAvailableRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.identifier);
    return writer;
  },
  decode(reader: Reader, length?: number): TenantAvailableRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseTenantAvailableRequest) as TenantAvailableRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.identifier = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): TenantAvailableRequest {
    const message = Object.create(baseTenantAvailableRequest) as TenantAvailableRequest;
    if (object.identifier !== undefined && object.identifier !== null) {
      message.identifier = String(object.identifier);
    } else {
      message.identifier = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<TenantAvailableRequest>): TenantAvailableRequest {
    const message = Object.create(baseTenantAvailableRequest) as TenantAvailableRequest;
    if (object.identifier !== undefined && object.identifier !== null) {
      message.identifier = object.identifier;
    } else {
      message.identifier = '';
    }
    return message;
  },
  toJSON(message: TenantAvailableRequest): unknown {
    const obj: any = {};
    obj.identifier = message.identifier || '';
    return obj;
  },
};

export const TenantAvailableResponse = {
  encode(message: TenantAvailableResponse, writer: Writer = Writer.create()): Writer {
    writer.uint32(8).bool(message.available);
    return writer;
  },
  decode(reader: Reader, length?: number): TenantAvailableResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseTenantAvailableResponse) as TenantAvailableResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.available = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): TenantAvailableResponse {
    const message = Object.create(baseTenantAvailableResponse) as TenantAvailableResponse;
    if (object.available !== undefined && object.available !== null) {
      message.available = Boolean(object.available);
    } else {
      message.available = false;
    }
    return message;
  },
  fromPartial(object: DeepPartial<TenantAvailableResponse>): TenantAvailableResponse {
    const message = Object.create(baseTenantAvailableResponse) as TenantAvailableResponse;
    if (object.available !== undefined && object.available !== null) {
      message.available = object.available;
    } else {
      message.available = false;
    }
    return message;
  },
  toJSON(message: TenantAvailableResponse): unknown {
    const obj: any = {};
    obj.available = message.available || false;
    return obj;
  },
};

export const FindTenantResponse = {
  encode(message: FindTenantResponse, writer: Writer = Writer.create()): Writer {
    for (const v of message.tenants) {
      Tenant.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): FindTenantResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseFindTenantResponse) as FindTenantResponse;
    message.tenants = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.tenants.push(Tenant.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): FindTenantResponse {
    const message = Object.create(baseFindTenantResponse) as FindTenantResponse;
    message.tenants = [];
    if (object.tenants !== undefined && object.tenants !== null) {
      for (const e of object.tenants) {
        message.tenants.push(Tenant.fromJSON(e));
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<FindTenantResponse>): FindTenantResponse {
    const message = Object.create(baseFindTenantResponse) as FindTenantResponse;
    message.tenants = [];
    if (object.tenants !== undefined && object.tenants !== null) {
      for (const e of object.tenants) {
        message.tenants.push(Tenant.fromPartial(e));
      }
    }
    return message;
  },
  toJSON(message: FindTenantResponse): unknown {
    const obj: any = {};
    if (message.tenants) {
      obj.tenants = message.tenants.map(e => e ? Tenant.toJSON(e) : undefined);
    } else {
      obj.tenants = [];
    }
    return obj;
  },
};

export const DeleteTenantRequest = {
  encode(message: DeleteTenantRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.id);
    return writer;
  },
  decode(reader: Reader, length?: number): DeleteTenantRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseDeleteTenantRequest) as DeleteTenantRequest;
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
  fromJSON(object: any): DeleteTenantRequest {
    const message = Object.create(baseDeleteTenantRequest) as DeleteTenantRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    } else {
      message.id = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<DeleteTenantRequest>): DeleteTenantRequest {
    const message = Object.create(baseDeleteTenantRequest) as DeleteTenantRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = '';
    }
    return message;
  },
  toJSON(message: DeleteTenantRequest): unknown {
    const obj: any = {};
    obj.id = message.id || '';
    return obj;
  },
};

export const DeleteTenantResponse = {
  encode(message: DeleteTenantResponse, writer: Writer = Writer.create()): Writer {
    if (message.tenant !== undefined && message.tenant !== undefined) {
      Tenant.encode(message.tenant, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): DeleteTenantResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseDeleteTenantResponse) as DeleteTenantResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.tenant = Tenant.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): DeleteTenantResponse {
    const message = Object.create(baseDeleteTenantResponse) as DeleteTenantResponse;
    if (object.tenant !== undefined && object.tenant !== null) {
      message.tenant = Tenant.fromJSON(object.tenant);
    } else {
      message.tenant = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<DeleteTenantResponse>): DeleteTenantResponse {
    const message = Object.create(baseDeleteTenantResponse) as DeleteTenantResponse;
    if (object.tenant !== undefined && object.tenant !== null) {
      message.tenant = Tenant.fromPartial(object.tenant);
    } else {
      message.tenant = undefined;
    }
    return message;
  },
  toJSON(message: DeleteTenantResponse): unknown {
    const obj: any = {};
    obj.tenant = message.tenant ? Tenant.toJSON(message.tenant) : undefined;
    return obj;
  },
};

export const ReadTenantRequest = {
  encode(message: ReadTenantRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.filter);
    return writer;
  },
  decode(reader: Reader, length?: number): ReadTenantRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseReadTenantRequest) as ReadTenantRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.filter = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ReadTenantRequest {
    const message = Object.create(baseReadTenantRequest) as ReadTenantRequest;
    if (object.filter !== undefined && object.filter !== null) {
      message.filter = String(object.filter);
    } else {
      message.filter = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<ReadTenantRequest>): ReadTenantRequest {
    const message = Object.create(baseReadTenantRequest) as ReadTenantRequest;
    if (object.filter !== undefined && object.filter !== null) {
      message.filter = object.filter;
    } else {
      message.filter = '';
    }
    return message;
  },
  toJSON(message: ReadTenantRequest): unknown {
    const obj: any = {};
    obj.filter = message.filter || '';
    return obj;
  },
};

export const ReadTenantResponse = {
  encode(message: ReadTenantResponse, writer: Writer = Writer.create()): Writer {
    if (message.tenant !== undefined && message.tenant !== undefined) {
      Tenant.encode(message.tenant, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): ReadTenantResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseReadTenantResponse) as ReadTenantResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.tenant = Tenant.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ReadTenantResponse {
    const message = Object.create(baseReadTenantResponse) as ReadTenantResponse;
    if (object.tenant !== undefined && object.tenant !== null) {
      message.tenant = Tenant.fromJSON(object.tenant);
    } else {
      message.tenant = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<ReadTenantResponse>): ReadTenantResponse {
    const message = Object.create(baseReadTenantResponse) as ReadTenantResponse;
    if (object.tenant !== undefined && object.tenant !== null) {
      message.tenant = Tenant.fromPartial(object.tenant);
    } else {
      message.tenant = undefined;
    }
    return message;
  },
  toJSON(message: ReadTenantResponse): unknown {
    const obj: any = {};
    obj.tenant = message.tenant ? Tenant.toJSON(message.tenant) : undefined;
    return obj;
  },
};

export const UpdateTenantRequest = {
  encode(message: UpdateTenantRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.id);
    if (message.data !== undefined && message.data !== undefined) {
      UpdateTenantPayload.encode(message.data, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): UpdateTenantRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseUpdateTenantRequest) as UpdateTenantRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.data = UpdateTenantPayload.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): UpdateTenantRequest {
    const message = Object.create(baseUpdateTenantRequest) as UpdateTenantRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    } else {
      message.id = '';
    }
    if (object.data !== undefined && object.data !== null) {
      message.data = UpdateTenantPayload.fromJSON(object.data);
    } else {
      message.data = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<UpdateTenantRequest>): UpdateTenantRequest {
    const message = Object.create(baseUpdateTenantRequest) as UpdateTenantRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = '';
    }
    if (object.data !== undefined && object.data !== null) {
      message.data = UpdateTenantPayload.fromPartial(object.data);
    } else {
      message.data = undefined;
    }
    return message;
  },
  toJSON(message: UpdateTenantRequest): unknown {
    const obj: any = {};
    obj.id = message.id || '';
    obj.data = message.data ? UpdateTenantPayload.toJSON(message.data) : undefined;
    return obj;
  },
};

export const UpdateTenantResponse = {
  encode(message: UpdateTenantResponse, writer: Writer = Writer.create()): Writer {
    if (message.tenant !== undefined && message.tenant !== undefined) {
      Tenant.encode(message.tenant, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): UpdateTenantResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseUpdateTenantResponse) as UpdateTenantResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.tenant = Tenant.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): UpdateTenantResponse {
    const message = Object.create(baseUpdateTenantResponse) as UpdateTenantResponse;
    if (object.tenant !== undefined && object.tenant !== null) {
      message.tenant = Tenant.fromJSON(object.tenant);
    } else {
      message.tenant = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<UpdateTenantResponse>): UpdateTenantResponse {
    const message = Object.create(baseUpdateTenantResponse) as UpdateTenantResponse;
    if (object.tenant !== undefined && object.tenant !== null) {
      message.tenant = Tenant.fromPartial(object.tenant);
    } else {
      message.tenant = undefined;
    }
    return message;
  },
  toJSON(message: UpdateTenantResponse): unknown {
    const obj: any = {};
    obj.tenant = message.tenant ? Tenant.toJSON(message.tenant) : undefined;
    return obj;
  },
};

export const InviteMemberRequest = {
  encode(message: InviteMemberRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(18).string(message.email);
    writer.uint32(26).string(message.userId);
    writer.uint32(50).string(message.role);
    return writer;
  },
  decode(reader: Reader, length?: number): InviteMemberRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseInviteMemberRequest) as InviteMemberRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 2:
          message.email = reader.string();
          break;
        case 3:
          message.userId = reader.string();
          break;
        case 6:
          message.role = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): InviteMemberRequest {
    const message = Object.create(baseInviteMemberRequest) as InviteMemberRequest;
    if (object.email !== undefined && object.email !== null) {
      message.email = String(object.email);
    } else {
      message.email = '';
    }
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
    return message;
  },
  fromPartial(object: DeepPartial<InviteMemberRequest>): InviteMemberRequest {
    const message = Object.create(baseInviteMemberRequest) as InviteMemberRequest;
    if (object.email !== undefined && object.email !== null) {
      message.email = object.email;
    } else {
      message.email = '';
    }
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
    return message;
  },
  toJSON(message: InviteMemberRequest): unknown {
    const obj: any = {};
    obj.email = message.email || '';
    obj.userId = message.userId || '';
    obj.role = message.role || '';
    return obj;
  },
};

export const InviteMemberResponse = {
  encode(message: InviteMemberResponse, writer: Writer = Writer.create()): Writer {
    if (message.member !== undefined && message.member !== undefined) {
      Member.encode(message.member, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): InviteMemberResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseInviteMemberResponse) as InviteMemberResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.member = Member.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): InviteMemberResponse {
    const message = Object.create(baseInviteMemberResponse) as InviteMemberResponse;
    if (object.member !== undefined && object.member !== null) {
      message.member = Member.fromJSON(object.member);
    } else {
      message.member = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<InviteMemberResponse>): InviteMemberResponse {
    const message = Object.create(baseInviteMemberResponse) as InviteMemberResponse;
    if (object.member !== undefined && object.member !== null) {
      message.member = Member.fromPartial(object.member);
    } else {
      message.member = undefined;
    }
    return message;
  },
  toJSON(message: InviteMemberResponse): unknown {
    const obj: any = {};
    obj.member = message.member ? Member.toJSON(message.member) : undefined;
    return obj;
  },
};

export const FindMemberRequest = {
  encode(message: FindMemberRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.status);
    writer.uint32(18).string(message.role);
    writer.uint32(26).string(message.tenantId);
    return writer;
  },
  decode(reader: Reader, length?: number): FindMemberRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseFindMemberRequest) as FindMemberRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.status = reader.string();
          break;
        case 2:
          message.role = reader.string();
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
  fromJSON(object: any): FindMemberRequest {
    const message = Object.create(baseFindMemberRequest) as FindMemberRequest;
    if (object.status !== undefined && object.status !== null) {
      message.status = String(object.status);
    } else {
      message.status = '';
    }
    if (object.role !== undefined && object.role !== null) {
      message.role = String(object.role);
    } else {
      message.role = '';
    }
    if (object.tenantId !== undefined && object.tenantId !== null) {
      message.tenantId = String(object.tenantId);
    } else {
      message.tenantId = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<FindMemberRequest>): FindMemberRequest {
    const message = Object.create(baseFindMemberRequest) as FindMemberRequest;
    if (object.status !== undefined && object.status !== null) {
      message.status = object.status;
    } else {
      message.status = '';
    }
    if (object.role !== undefined && object.role !== null) {
      message.role = object.role;
    } else {
      message.role = '';
    }
    if (object.tenantId !== undefined && object.tenantId !== null) {
      message.tenantId = object.tenantId;
    } else {
      message.tenantId = '';
    }
    return message;
  },
  toJSON(message: FindMemberRequest): unknown {
    const obj: any = {};
    obj.status = message.status || '';
    obj.role = message.role || '';
    obj.tenantId = message.tenantId || '';
    return obj;
  },
};

export const FindMemberResponse = {
  encode(message: FindMemberResponse, writer: Writer = Writer.create()): Writer {
    for (const v of message.members) {
      Member.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): FindMemberResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseFindMemberResponse) as FindMemberResponse;
    message.members = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.members.push(Member.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): FindMemberResponse {
    const message = Object.create(baseFindMemberResponse) as FindMemberResponse;
    message.members = [];
    if (object.members !== undefined && object.members !== null) {
      for (const e of object.members) {
        message.members.push(Member.fromJSON(e));
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<FindMemberResponse>): FindMemberResponse {
    const message = Object.create(baseFindMemberResponse) as FindMemberResponse;
    message.members = [];
    if (object.members !== undefined && object.members !== null) {
      for (const e of object.members) {
        message.members.push(Member.fromPartial(e));
      }
    }
    return message;
  },
  toJSON(message: FindMemberResponse): unknown {
    const obj: any = {};
    if (message.members) {
      obj.members = message.members.map(e => e ? Member.toJSON(e) : undefined);
    } else {
      obj.members = [];
    }
    return obj;
  },
};

export const DeleteMemberRequest = {
  encode(message: DeleteMemberRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.id);
    return writer;
  },
  decode(reader: Reader, length?: number): DeleteMemberRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseDeleteMemberRequest) as DeleteMemberRequest;
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
  fromJSON(object: any): DeleteMemberRequest {
    const message = Object.create(baseDeleteMemberRequest) as DeleteMemberRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    } else {
      message.id = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<DeleteMemberRequest>): DeleteMemberRequest {
    const message = Object.create(baseDeleteMemberRequest) as DeleteMemberRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = '';
    }
    return message;
  },
  toJSON(message: DeleteMemberRequest): unknown {
    const obj: any = {};
    obj.id = message.id || '';
    return obj;
  },
};

export const DeleteMemberResponse = {
  encode(message: DeleteMemberResponse, writer: Writer = Writer.create()): Writer {
    if (message.member !== undefined && message.member !== undefined) {
      Member.encode(message.member, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): DeleteMemberResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseDeleteMemberResponse) as DeleteMemberResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.member = Member.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): DeleteMemberResponse {
    const message = Object.create(baseDeleteMemberResponse) as DeleteMemberResponse;
    if (object.member !== undefined && object.member !== null) {
      message.member = Member.fromJSON(object.member);
    } else {
      message.member = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<DeleteMemberResponse>): DeleteMemberResponse {
    const message = Object.create(baseDeleteMemberResponse) as DeleteMemberResponse;
    if (object.member !== undefined && object.member !== null) {
      message.member = Member.fromPartial(object.member);
    } else {
      message.member = undefined;
    }
    return message;
  },
  toJSON(message: DeleteMemberResponse): unknown {
    const obj: any = {};
    obj.member = message.member ? Member.toJSON(message.member) : undefined;
    return obj;
  },
};

export const ReadMemberRequest = {
  encode(message: ReadMemberRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.id);
    return writer;
  },
  decode(reader: Reader, length?: number): ReadMemberRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseReadMemberRequest) as ReadMemberRequest;
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
  fromJSON(object: any): ReadMemberRequest {
    const message = Object.create(baseReadMemberRequest) as ReadMemberRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    } else {
      message.id = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<ReadMemberRequest>): ReadMemberRequest {
    const message = Object.create(baseReadMemberRequest) as ReadMemberRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = '';
    }
    return message;
  },
  toJSON(message: ReadMemberRequest): unknown {
    const obj: any = {};
    obj.id = message.id || '';
    return obj;
  },
};

export const ReadMemberResponse = {
  encode(message: ReadMemberResponse, writer: Writer = Writer.create()): Writer {
    if (message.member !== undefined && message.member !== undefined) {
      Member.encode(message.member, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): ReadMemberResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseReadMemberResponse) as ReadMemberResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.member = Member.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ReadMemberResponse {
    const message = Object.create(baseReadMemberResponse) as ReadMemberResponse;
    if (object.member !== undefined && object.member !== null) {
      message.member = Member.fromJSON(object.member);
    } else {
      message.member = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<ReadMemberResponse>): ReadMemberResponse {
    const message = Object.create(baseReadMemberResponse) as ReadMemberResponse;
    if (object.member !== undefined && object.member !== null) {
      message.member = Member.fromPartial(object.member);
    } else {
      message.member = undefined;
    }
    return message;
  },
  toJSON(message: ReadMemberResponse): unknown {
    const obj: any = {};
    obj.member = message.member ? Member.toJSON(message.member) : undefined;
    return obj;
  },
};

export const UpdateMemberRequest = {
  encode(message: UpdateMemberRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.id);
    writer.uint32(18).string(message.status);
    writer.uint32(26).string(message.role);
    return writer;
  },
  decode(reader: Reader, length?: number): UpdateMemberRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseUpdateMemberRequest) as UpdateMemberRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.status = reader.string();
          break;
        case 3:
          message.role = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): UpdateMemberRequest {
    const message = Object.create(baseUpdateMemberRequest) as UpdateMemberRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    } else {
      message.id = '';
    }
    if (object.status !== undefined && object.status !== null) {
      message.status = String(object.status);
    } else {
      message.status = '';
    }
    if (object.role !== undefined && object.role !== null) {
      message.role = String(object.role);
    } else {
      message.role = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<UpdateMemberRequest>): UpdateMemberRequest {
    const message = Object.create(baseUpdateMemberRequest) as UpdateMemberRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = '';
    }
    if (object.status !== undefined && object.status !== null) {
      message.status = object.status;
    } else {
      message.status = '';
    }
    if (object.role !== undefined && object.role !== null) {
      message.role = object.role;
    } else {
      message.role = '';
    }
    return message;
  },
  toJSON(message: UpdateMemberRequest): unknown {
    const obj: any = {};
    obj.id = message.id || '';
    obj.status = message.status || '';
    obj.role = message.role || '';
    return obj;
  },
};

export const UpdateMemberResponse = {
  encode(message: UpdateMemberResponse, writer: Writer = Writer.create()): Writer {
    if (message.member !== undefined && message.member !== undefined) {
      Member.encode(message.member, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): UpdateMemberResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseUpdateMemberResponse) as UpdateMemberResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.member = Member.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): UpdateMemberResponse {
    const message = Object.create(baseUpdateMemberResponse) as UpdateMemberResponse;
    if (object.member !== undefined && object.member !== null) {
      message.member = Member.fromJSON(object.member);
    } else {
      message.member = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<UpdateMemberResponse>): UpdateMemberResponse {
    const message = Object.create(baseUpdateMemberResponse) as UpdateMemberResponse;
    if (object.member !== undefined && object.member !== null) {
      message.member = Member.fromPartial(object.member);
    } else {
      message.member = undefined;
    }
    return message;
  },
  toJSON(message: UpdateMemberResponse): unknown {
    const obj: any = {};
    obj.member = message.member ? Member.toJSON(message.member) : undefined;
    return obj;
  },
};

export const AcceptMemberInvitationRequest = {
  encode(message: AcceptMemberInvitationRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.token);
    return writer;
  },
  decode(reader: Reader, length?: number): AcceptMemberInvitationRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseAcceptMemberInvitationRequest) as AcceptMemberInvitationRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.token = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): AcceptMemberInvitationRequest {
    const message = Object.create(baseAcceptMemberInvitationRequest) as AcceptMemberInvitationRequest;
    if (object.token !== undefined && object.token !== null) {
      message.token = String(object.token);
    } else {
      message.token = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<AcceptMemberInvitationRequest>): AcceptMemberInvitationRequest {
    const message = Object.create(baseAcceptMemberInvitationRequest) as AcceptMemberInvitationRequest;
    if (object.token !== undefined && object.token !== null) {
      message.token = object.token;
    } else {
      message.token = '';
    }
    return message;
  },
  toJSON(message: AcceptMemberInvitationRequest): unknown {
    const obj: any = {};
    obj.token = message.token || '';
    return obj;
  },
};

export const AcceptMemberInvitationResponse = {
  encode(message: AcceptMemberInvitationResponse, writer: Writer = Writer.create()): Writer {
    if (message.member !== undefined && message.member !== undefined) {
      Member.encode(message.member, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): AcceptMemberInvitationResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseAcceptMemberInvitationResponse) as AcceptMemberInvitationResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.member = Member.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): AcceptMemberInvitationResponse {
    const message = Object.create(baseAcceptMemberInvitationResponse) as AcceptMemberInvitationResponse;
    if (object.member !== undefined && object.member !== null) {
      message.member = Member.fromJSON(object.member);
    } else {
      message.member = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<AcceptMemberInvitationResponse>): AcceptMemberInvitationResponse {
    const message = Object.create(baseAcceptMemberInvitationResponse) as AcceptMemberInvitationResponse;
    if (object.member !== undefined && object.member !== null) {
      message.member = Member.fromPartial(object.member);
    } else {
      message.member = undefined;
    }
    return message;
  },
  toJSON(message: AcceptMemberInvitationResponse): unknown {
    const obj: any = {};
    obj.member = message.member ? Member.toJSON(message.member) : undefined;
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