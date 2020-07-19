/* eslint-disable */
import { Observable } from 'rxjs';
import { Writer, Reader } from 'protobufjs/minimal';


export interface PasswordStruct {
  /**
   *  @inject_tag: bson:"hashed,omitempty"
   */
  hashed: string;
}

export interface AuthServices {
  /**
   *  @inject_tag: bson:"password,omitempty"
   */
  password: PasswordStruct | undefined;
}

export interface EmailObject {
  /**
   *  @inject_tag: bson:"address,omitempty"
   */
  address: string;
  /**
   *  @inject_tag: bson:"verified,omitempty"
   */
  verified: boolean;
  /**
   *  @inject_tag: bson:"primary,omitempty"
   */
  primary: boolean;
  /**
   *  @inject_tag: bson:"verificationCode"
   */
  verificationCode: string;
}

export interface User {
  /**
   *  @inject_tag: bson:"_id,omitempty"
   */
  id: string;
  /**
   *  @inject_tag: bson:"username,omitempty"
   */
  username: string;
  /**
   *  @inject_tag: bson:"primaryEmail,omitempty"
   */
  primaryEmail: string;
  /**
   *  @inject_tag: bson:"firstname,omitempty"
   */
  firstname: string;
  /**
   *  @inject_tag: bson:"lastname,omitempty"
   */
  lastname: string;
  /**
   *  @inject_tag: bson:"createdAt,omitempty"
   */
  createdAt: string;
  /**
   *  @inject_tag: bson:"updatedAt,omitempty"
   */
  updatedAt: string;
  /**
   *  @inject_tag: bson:"emails,omitempty"
   */
  emails: EmailObject[];
  /**
   *  @inject_tag: bson:"services,omitempty"
   */
  services: AuthServices | undefined;
  /**
   *  @inject_tag: bson:"settings,omitempty"
   */
  settings: Settings | undefined;
}

export interface Settings {
  stripeId: string;
}

export interface Session {
  id: string;
  email: string;
  /**
   *  unix
   */
  created: number;
  /**
   *  unix
   */
  expires: number;
}

export interface CreateRequest {
  username: string;
  password: string;
  email: string;
  firstname: string;
  lastname: string;
  service: LoginServiceTypes;
  tokens: { [key: string]: string };
}

export interface CreateRequest_TokensEntry {
  key: string;
  value: string;
}

export interface CreateResponse {
  activationLink: string;
}

export interface DeleteRequest {
  id: string;
}

export interface DeleteResponse {
  success: boolean;
}

export interface ReadRequest {
  query: string;
}

export interface ReadResponse {
  user: User | undefined;
}

export interface UpdateRequest {
  user: User | undefined;
}

export interface UpdateResponse {
  user: User | undefined;
}

export interface UpdatePasswordRequest {
  userId: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdatePasswordResponse {
  success: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
}

export interface SearchRequest {
  username: string;
  email: string;
  limit: number;
  offset: number;
}

export interface SearchResponse {
  users: User[];
}

export interface ReadSessionRequest {
  sessionId: string;
}

export interface ReadSessionResponse {
  session: Session | undefined;
}

export interface LoginTypeParams {
  accessToken: string;
  userId: string;
  password: string;
  email: string;
}

export interface LoginRequest {
  service: LoginServiceTypes;
  params: LoginTypeParams | undefined;
}

export interface LoginResponse {
  session: Session | undefined;
  user: User | undefined;
}

export interface LogoutRequest {
  sessionId: string;
}

export interface LogoutResponse {
  success: boolean;
}

export interface VerifyAccountRequest {
  email: string;
  pincode: string;
}

export interface VerifyAccountResponse {
  success: boolean;
}

export interface VerifyActivationLinkRequest {
  token: string;
}

export interface VerifyActivationLinkResponse {
  email: string;
  pincode: string;
}

export interface ResendVerificationCodeRequest {
  email: string;
}

export interface ResendVerificationCodeResponse {
  success: boolean;
}

const basePasswordStruct: object = {
  hashed: '',
};

const baseAuthServices: object = {
  password: undefined,
};

const baseEmailObject: object = {
  address: '',
  verified: false,
  primary: false,
  verificationCode: '',
};

const baseUser: object = {
  id: '',
  username: '',
  primaryEmail: '',
  firstname: '',
  lastname: '',
  createdAt: '',
  updatedAt: '',
  emails: undefined,
  services: undefined,
  settings: undefined,
};

const baseSettings: object = {
  stripeId: '',
};

const baseSession: object = {
  id: '',
  email: '',
  created: 0,
  expires: 0,
};

const baseCreateRequest: object = {
  username: '',
  password: '',
  email: '',
  firstname: '',
  lastname: '',
  service: 0,
  tokens: undefined,
};

const baseCreateRequest_TokensEntry: object = {
  key: '',
  value: '',
};

const baseCreateResponse: object = {
  activationLink: '',
};

const baseDeleteRequest: object = {
  id: '',
};

const baseDeleteResponse: object = {
  success: false,
};

const baseReadRequest: object = {
  query: '',
};

const baseReadResponse: object = {
  user: undefined,
};

const baseUpdateRequest: object = {
  user: undefined,
};

const baseUpdateResponse: object = {
  user: undefined,
};

const baseUpdatePasswordRequest: object = {
  userId: '',
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
};

const baseUpdatePasswordResponse: object = {
  success: false,
};

const baseForgotPasswordRequest: object = {
  email: '',
};

const baseForgotPasswordResponse: object = {
  success: false,
};

const baseSearchRequest: object = {
  username: '',
  email: '',
  limit: 0,
  offset: 0,
};

const baseSearchResponse: object = {
  users: undefined,
};

const baseReadSessionRequest: object = {
  sessionId: '',
};

const baseReadSessionResponse: object = {
  session: undefined,
};

const baseLoginTypeParams: object = {
  accessToken: '',
  userId: '',
  password: '',
  email: '',
};

const baseLoginRequest: object = {
  service: 0,
  params: undefined,
};

const baseLoginResponse: object = {
  session: undefined,
  user: undefined,
};

const baseLogoutRequest: object = {
  sessionId: '',
};

const baseLogoutResponse: object = {
  success: false,
};

const baseVerifyAccountRequest: object = {
  email: '',
  pincode: '',
};

const baseVerifyAccountResponse: object = {
  success: false,
};

const baseVerifyActivationLinkRequest: object = {
  token: '',
};

const baseVerifyActivationLinkResponse: object = {
  email: '',
  pincode: '',
};

const baseResendVerificationCodeRequest: object = {
  email: '',
};

const baseResendVerificationCodeResponse: object = {
  success: false,
};

export interface AccountService<Context extends DataLoaders> {

  create(request: CreateRequest, ctx: Context): Promise<CreateResponse>;

  read(request: ReadRequest, ctx: Context): Promise<ReadResponse>;

  verifyAccount(request: VerifyAccountRequest, ctx: Context): Promise<VerifyAccountResponse>;

  verifyActivationLink(request: VerifyActivationLinkRequest, ctx: Context): Promise<VerifyActivationLinkResponse>;

  resendVerificationCode(request: ResendVerificationCodeRequest, ctx: Context): Promise<ResendVerificationCodeResponse>;

  update(request: UpdateRequest, ctx: Context): Promise<UpdateResponse>;

  delete(request: DeleteRequest, ctx: Context): Promise<DeleteResponse>;

  search(request: SearchRequest, ctx: Context): Promise<SearchResponse>;

  forgotPassword(request: ForgotPasswordRequest, ctx: Context): Promise<ForgotPasswordResponse>;

  updatePassword(request: UpdatePasswordRequest, ctx: Context): Promise<UpdatePasswordResponse>;

  login(request: LoginRequest, ctx: Context): Promise<LoginResponse>;

  logout(request: LogoutRequest, ctx: Context): Promise<LogoutResponse>;

  readSession(request: ReadSessionRequest, ctx: Context): Promise<ReadSessionResponse>;

}

export interface AccountServiceClient<Context extends DataLoaders> {

  create(request: CreateRequest, ctx?: Context): Observable<CreateResponse>;

  read(request: ReadRequest, ctx?: Context): Observable<ReadResponse>;

  verifyAccount(request: VerifyAccountRequest, ctx?: Context): Observable<VerifyAccountResponse>;

  verifyActivationLink(request: VerifyActivationLinkRequest, ctx?: Context): Observable<VerifyActivationLinkResponse>;

  resendVerificationCode(request: ResendVerificationCodeRequest, ctx?: Context): Observable<ResendVerificationCodeResponse>;

  update(request: UpdateRequest, ctx?: Context): Observable<UpdateResponse>;

  delete(request: DeleteRequest, ctx?: Context): Observable<DeleteResponse>;

  search(request: SearchRequest, ctx?: Context): Observable<SearchResponse>;

  forgotPassword(request: ForgotPasswordRequest, ctx?: Context): Observable<ForgotPasswordResponse>;

  updatePassword(request: UpdatePasswordRequest, ctx?: Context): Observable<UpdatePasswordResponse>;

  login(request: LoginRequest, ctx?: Context): Observable<LoginResponse>;

  logout(request: LogoutRequest, ctx?: Context): Observable<LogoutResponse>;

  readSession(request: ReadSessionRequest, ctx?: Context): Observable<ReadSessionResponse>;

}

interface DataLoaders {

  getDataLoader<T>(identifier: string, constructorFn: () => T): T;

}

export const LoginServiceTypes = {
  Password: 0 as LoginServiceTypes,
  Facebook: 1 as LoginServiceTypes,
  Github: 2 as LoginServiceTypes,
  Google: 3 as LoginServiceTypes,
  fromJSON(object: any): LoginServiceTypes {
    switch (object) {
      case 0:
      case "Password":
        return LoginServiceTypes.Password;
      case 1:
      case "Facebook":
        return LoginServiceTypes.Facebook;
      case 2:
      case "Github":
        return LoginServiceTypes.Github;
      case 3:
      case "Google":
        return LoginServiceTypes.Google;
      default:
        throw new global.Error(`Invalid value ${object}`);
    }
  },
  toJSON(object: LoginServiceTypes): string {
    switch (object) {
      case LoginServiceTypes.Password:
        return "Password";
      case LoginServiceTypes.Facebook:
        return "Facebook";
      case LoginServiceTypes.Github:
        return "Github";
      case LoginServiceTypes.Google:
        return "Google";
      default:
        return "UNKNOWN";
    }
  },
}

export type LoginServiceTypes = 0 | 1 | 2 | 3;

export const PasswordStruct = {
  encode(message: PasswordStruct, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.hashed);
    return writer;
  },
  decode(reader: Reader, length?: number): PasswordStruct {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(basePasswordStruct) as PasswordStruct;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.hashed = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): PasswordStruct {
    const message = Object.create(basePasswordStruct) as PasswordStruct;
    if (object.hashed !== undefined && object.hashed !== null) {
      message.hashed = String(object.hashed);
    } else {
      message.hashed = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<PasswordStruct>): PasswordStruct {
    const message = Object.create(basePasswordStruct) as PasswordStruct;
    if (object.hashed !== undefined && object.hashed !== null) {
      message.hashed = object.hashed;
    } else {
      message.hashed = '';
    }
    return message;
  },
  toJSON(message: PasswordStruct): unknown {
    const obj: any = {};
    obj.hashed = message.hashed || '';
    return obj;
  },
};

export const AuthServices = {
  encode(message: AuthServices, writer: Writer = Writer.create()): Writer {
    if (message.password !== undefined && message.password !== undefined) {
      PasswordStruct.encode(message.password, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): AuthServices {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseAuthServices) as AuthServices;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.password = PasswordStruct.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): AuthServices {
    const message = Object.create(baseAuthServices) as AuthServices;
    if (object.password !== undefined && object.password !== null) {
      message.password = PasswordStruct.fromJSON(object.password);
    } else {
      message.password = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<AuthServices>): AuthServices {
    const message = Object.create(baseAuthServices) as AuthServices;
    if (object.password !== undefined && object.password !== null) {
      message.password = PasswordStruct.fromPartial(object.password);
    } else {
      message.password = undefined;
    }
    return message;
  },
  toJSON(message: AuthServices): unknown {
    const obj: any = {};
    obj.password = message.password ? PasswordStruct.toJSON(message.password) : undefined;
    return obj;
  },
};

export const EmailObject = {
  encode(message: EmailObject, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.address);
    writer.uint32(16).bool(message.verified);
    writer.uint32(24).bool(message.primary);
    writer.uint32(34).string(message.verificationCode);
    return writer;
  },
  decode(reader: Reader, length?: number): EmailObject {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseEmailObject) as EmailObject;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.address = reader.string();
          break;
        case 2:
          message.verified = reader.bool();
          break;
        case 3:
          message.primary = reader.bool();
          break;
        case 4:
          message.verificationCode = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): EmailObject {
    const message = Object.create(baseEmailObject) as EmailObject;
    if (object.address !== undefined && object.address !== null) {
      message.address = String(object.address);
    } else {
      message.address = '';
    }
    if (object.verified !== undefined && object.verified !== null) {
      message.verified = Boolean(object.verified);
    } else {
      message.verified = false;
    }
    if (object.primary !== undefined && object.primary !== null) {
      message.primary = Boolean(object.primary);
    } else {
      message.primary = false;
    }
    if (object.verificationCode !== undefined && object.verificationCode !== null) {
      message.verificationCode = String(object.verificationCode);
    } else {
      message.verificationCode = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<EmailObject>): EmailObject {
    const message = Object.create(baseEmailObject) as EmailObject;
    if (object.address !== undefined && object.address !== null) {
      message.address = object.address;
    } else {
      message.address = '';
    }
    if (object.verified !== undefined && object.verified !== null) {
      message.verified = object.verified;
    } else {
      message.verified = false;
    }
    if (object.primary !== undefined && object.primary !== null) {
      message.primary = object.primary;
    } else {
      message.primary = false;
    }
    if (object.verificationCode !== undefined && object.verificationCode !== null) {
      message.verificationCode = object.verificationCode;
    } else {
      message.verificationCode = '';
    }
    return message;
  },
  toJSON(message: EmailObject): unknown {
    const obj: any = {};
    obj.address = message.address || '';
    obj.verified = message.verified || false;
    obj.primary = message.primary || false;
    obj.verificationCode = message.verificationCode || '';
    return obj;
  },
};

export const User = {
  encode(message: User, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.id);
    writer.uint32(18).string(message.username);
    writer.uint32(26).string(message.primaryEmail);
    writer.uint32(34).string(message.firstname);
    writer.uint32(42).string(message.lastname);
    writer.uint32(50).string(message.createdAt);
    writer.uint32(58).string(message.updatedAt);
    for (const v of message.emails) {
      EmailObject.encode(v!, writer.uint32(66).fork()).ldelim();
    }
    if (message.services !== undefined && message.services !== undefined) {
      AuthServices.encode(message.services, writer.uint32(74).fork()).ldelim();
    }
    if (message.settings !== undefined && message.settings !== undefined) {
      Settings.encode(message.settings, writer.uint32(82).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): User {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseUser) as User;
    message.emails = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.username = reader.string();
          break;
        case 3:
          message.primaryEmail = reader.string();
          break;
        case 4:
          message.firstname = reader.string();
          break;
        case 5:
          message.lastname = reader.string();
          break;
        case 6:
          message.createdAt = reader.string();
          break;
        case 7:
          message.updatedAt = reader.string();
          break;
        case 8:
          message.emails.push(EmailObject.decode(reader, reader.uint32()));
          break;
        case 9:
          message.services = AuthServices.decode(reader, reader.uint32());
          break;
        case 10:
          message.settings = Settings.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): User {
    const message = Object.create(baseUser) as User;
    message.emails = [];
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    } else {
      message.id = '';
    }
    if (object.username !== undefined && object.username !== null) {
      message.username = String(object.username);
    } else {
      message.username = '';
    }
    if (object.primaryEmail !== undefined && object.primaryEmail !== null) {
      message.primaryEmail = String(object.primaryEmail);
    } else {
      message.primaryEmail = '';
    }
    if (object.firstname !== undefined && object.firstname !== null) {
      message.firstname = String(object.firstname);
    } else {
      message.firstname = '';
    }
    if (object.lastname !== undefined && object.lastname !== null) {
      message.lastname = String(object.lastname);
    } else {
      message.lastname = '';
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
    if (object.emails !== undefined && object.emails !== null) {
      for (const e of object.emails) {
        message.emails.push(EmailObject.fromJSON(e));
      }
    }
    if (object.services !== undefined && object.services !== null) {
      message.services = AuthServices.fromJSON(object.services);
    } else {
      message.services = undefined;
    }
    if (object.settings !== undefined && object.settings !== null) {
      message.settings = Settings.fromJSON(object.settings);
    } else {
      message.settings = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<User>): User {
    const message = Object.create(baseUser) as User;
    message.emails = [];
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = '';
    }
    if (object.username !== undefined && object.username !== null) {
      message.username = object.username;
    } else {
      message.username = '';
    }
    if (object.primaryEmail !== undefined && object.primaryEmail !== null) {
      message.primaryEmail = object.primaryEmail;
    } else {
      message.primaryEmail = '';
    }
    if (object.firstname !== undefined && object.firstname !== null) {
      message.firstname = object.firstname;
    } else {
      message.firstname = '';
    }
    if (object.lastname !== undefined && object.lastname !== null) {
      message.lastname = object.lastname;
    } else {
      message.lastname = '';
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
    if (object.emails !== undefined && object.emails !== null) {
      for (const e of object.emails) {
        message.emails.push(EmailObject.fromPartial(e));
      }
    }
    if (object.services !== undefined && object.services !== null) {
      message.services = AuthServices.fromPartial(object.services);
    } else {
      message.services = undefined;
    }
    if (object.settings !== undefined && object.settings !== null) {
      message.settings = Settings.fromPartial(object.settings);
    } else {
      message.settings = undefined;
    }
    return message;
  },
  toJSON(message: User): unknown {
    const obj: any = {};
    obj.id = message.id || '';
    obj.username = message.username || '';
    obj.primaryEmail = message.primaryEmail || '';
    obj.firstname = message.firstname || '';
    obj.lastname = message.lastname || '';
    obj.createdAt = message.createdAt || '';
    obj.updatedAt = message.updatedAt || '';
    if (message.emails) {
      obj.emails = message.emails.map(e => e ? EmailObject.toJSON(e) : undefined);
    } else {
      obj.emails = [];
    }
    obj.services = message.services ? AuthServices.toJSON(message.services) : undefined;
    obj.settings = message.settings ? Settings.toJSON(message.settings) : undefined;
    return obj;
  },
};

export const Settings = {
  encode(message: Settings, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.stripeId);
    return writer;
  },
  decode(reader: Reader, length?: number): Settings {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseSettings) as Settings;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.stripeId = reader.string();
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
    if (object.stripeId !== undefined && object.stripeId !== null) {
      message.stripeId = String(object.stripeId);
    } else {
      message.stripeId = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<Settings>): Settings {
    const message = Object.create(baseSettings) as Settings;
    if (object.stripeId !== undefined && object.stripeId !== null) {
      message.stripeId = object.stripeId;
    } else {
      message.stripeId = '';
    }
    return message;
  },
  toJSON(message: Settings): unknown {
    const obj: any = {};
    obj.stripeId = message.stripeId || '';
    return obj;
  },
};

export const Session = {
  encode(message: Session, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.id);
    writer.uint32(18).string(message.email);
    writer.uint32(24).int32(message.created);
    writer.uint32(32).int32(message.expires);
    return writer;
  },
  decode(reader: Reader, length?: number): Session {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseSession) as Session;
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
          message.created = reader.int32();
          break;
        case 4:
          message.expires = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): Session {
    const message = Object.create(baseSession) as Session;
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
    if (object.created !== undefined && object.created !== null) {
      message.created = Number(object.created);
    } else {
      message.created = 0;
    }
    if (object.expires !== undefined && object.expires !== null) {
      message.expires = Number(object.expires);
    } else {
      message.expires = 0;
    }
    return message;
  },
  fromPartial(object: DeepPartial<Session>): Session {
    const message = Object.create(baseSession) as Session;
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
    if (object.created !== undefined && object.created !== null) {
      message.created = object.created;
    } else {
      message.created = 0;
    }
    if (object.expires !== undefined && object.expires !== null) {
      message.expires = object.expires;
    } else {
      message.expires = 0;
    }
    return message;
  },
  toJSON(message: Session): unknown {
    const obj: any = {};
    obj.id = message.id || '';
    obj.email = message.email || '';
    obj.created = message.created || 0;
    obj.expires = message.expires || 0;
    return obj;
  },
};

export const CreateRequest = {
  encode(message: CreateRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.username);
    writer.uint32(18).string(message.password);
    writer.uint32(26).string(message.email);
    writer.uint32(34).string(message.firstname);
    writer.uint32(42).string(message.lastname);
    writer.uint32(48).int32(message.service);
    Object.entries(message.tokens).forEach(([key, value]) => {
      CreateRequest_TokensEntry.encode({ key: key as any, value }, writer.uint32(58).fork()).ldelim();
    })
    return writer;
  },
  decode(reader: Reader, length?: number): CreateRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseCreateRequest) as CreateRequest;
    message.tokens = {};
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.username = reader.string();
          break;
        case 2:
          message.password = reader.string();
          break;
        case 3:
          message.email = reader.string();
          break;
        case 4:
          message.firstname = reader.string();
          break;
        case 5:
          message.lastname = reader.string();
          break;
        case 6:
          message.service = reader.int32() as any;
          break;
        case 7:
          const entry7 = CreateRequest_TokensEntry.decode(reader, reader.uint32());
          if (entry7.value) {
            message.tokens[entry7.key] = entry7.value;
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): CreateRequest {
    const message = Object.create(baseCreateRequest) as CreateRequest;
    message.tokens = {};
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
    if (object.email !== undefined && object.email !== null) {
      message.email = String(object.email);
    } else {
      message.email = '';
    }
    if (object.firstname !== undefined && object.firstname !== null) {
      message.firstname = String(object.firstname);
    } else {
      message.firstname = '';
    }
    if (object.lastname !== undefined && object.lastname !== null) {
      message.lastname = String(object.lastname);
    } else {
      message.lastname = '';
    }
    if (object.service !== undefined && object.service !== null) {
      message.service = LoginServiceTypes.fromJSON(object.service);
    } else {
      message.service = 0;
    }
    if (object.tokens !== undefined && object.tokens !== null) {
      Object.entries(object.tokens).forEach(([key, value]) => {
        message.tokens[key] = String(value);
      })
    }
    return message;
  },
  fromPartial(object: DeepPartial<CreateRequest>): CreateRequest {
    const message = Object.create(baseCreateRequest) as CreateRequest;
    message.tokens = {};
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
    if (object.email !== undefined && object.email !== null) {
      message.email = object.email;
    } else {
      message.email = '';
    }
    if (object.firstname !== undefined && object.firstname !== null) {
      message.firstname = object.firstname;
    } else {
      message.firstname = '';
    }
    if (object.lastname !== undefined && object.lastname !== null) {
      message.lastname = object.lastname;
    } else {
      message.lastname = '';
    }
    if (object.service !== undefined && object.service !== null) {
      message.service = object.service;
    } else {
      message.service = 0;
    }
    if (object.tokens !== undefined && object.tokens !== null) {
      Object.entries(object.tokens).forEach(([key, value]) => {
        if (value) {
          message.tokens[key] = String(value);
        }
      })
    }
    return message;
  },
  toJSON(message: CreateRequest): unknown {
    const obj: any = {};
    obj.username = message.username || '';
    obj.password = message.password || '';
    obj.email = message.email || '';
    obj.firstname = message.firstname || '';
    obj.lastname = message.lastname || '';
    obj.service = LoginServiceTypes.toJSON(message.service);
    obj.tokens = message.tokens || undefined;
    return obj;
  },
};

export const CreateRequest_TokensEntry = {
  encode(message: CreateRequest_TokensEntry, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.key);
    writer.uint32(18).string(message.value);
    return writer;
  },
  decode(reader: Reader, length?: number): CreateRequest_TokensEntry {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseCreateRequest_TokensEntry) as CreateRequest_TokensEntry;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string();
          break;
        case 2:
          message.value = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): CreateRequest_TokensEntry {
    const message = Object.create(baseCreateRequest_TokensEntry) as CreateRequest_TokensEntry;
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
    return message;
  },
  fromPartial(object: DeepPartial<CreateRequest_TokensEntry>): CreateRequest_TokensEntry {
    const message = Object.create(baseCreateRequest_TokensEntry) as CreateRequest_TokensEntry;
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
    return message;
  },
  toJSON(message: CreateRequest_TokensEntry): unknown {
    const obj: any = {};
    obj.key = message.key || '';
    obj.value = message.value || '';
    return obj;
  },
};

export const CreateResponse = {
  encode(message: CreateResponse, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.activationLink);
    return writer;
  },
  decode(reader: Reader, length?: number): CreateResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseCreateResponse) as CreateResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.activationLink = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): CreateResponse {
    const message = Object.create(baseCreateResponse) as CreateResponse;
    if (object.activationLink !== undefined && object.activationLink !== null) {
      message.activationLink = String(object.activationLink);
    } else {
      message.activationLink = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<CreateResponse>): CreateResponse {
    const message = Object.create(baseCreateResponse) as CreateResponse;
    if (object.activationLink !== undefined && object.activationLink !== null) {
      message.activationLink = object.activationLink;
    } else {
      message.activationLink = '';
    }
    return message;
  },
  toJSON(message: CreateResponse): unknown {
    const obj: any = {};
    obj.activationLink = message.activationLink || '';
    return obj;
  },
};

export const DeleteRequest = {
  encode(message: DeleteRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.id);
    return writer;
  },
  decode(reader: Reader, length?: number): DeleteRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseDeleteRequest) as DeleteRequest;
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
  fromJSON(object: any): DeleteRequest {
    const message = Object.create(baseDeleteRequest) as DeleteRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    } else {
      message.id = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<DeleteRequest>): DeleteRequest {
    const message = Object.create(baseDeleteRequest) as DeleteRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = '';
    }
    return message;
  },
  toJSON(message: DeleteRequest): unknown {
    const obj: any = {};
    obj.id = message.id || '';
    return obj;
  },
};

export const DeleteResponse = {
  encode(message: DeleteResponse, writer: Writer = Writer.create()): Writer {
    writer.uint32(8).bool(message.success);
    return writer;
  },
  decode(reader: Reader, length?: number): DeleteResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseDeleteResponse) as DeleteResponse;
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
  fromJSON(object: any): DeleteResponse {
    const message = Object.create(baseDeleteResponse) as DeleteResponse;
    if (object.success !== undefined && object.success !== null) {
      message.success = Boolean(object.success);
    } else {
      message.success = false;
    }
    return message;
  },
  fromPartial(object: DeepPartial<DeleteResponse>): DeleteResponse {
    const message = Object.create(baseDeleteResponse) as DeleteResponse;
    if (object.success !== undefined && object.success !== null) {
      message.success = object.success;
    } else {
      message.success = false;
    }
    return message;
  },
  toJSON(message: DeleteResponse): unknown {
    const obj: any = {};
    obj.success = message.success || false;
    return obj;
  },
};

export const ReadRequest = {
  encode(message: ReadRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(42).string(message.query);
    return writer;
  },
  decode(reader: Reader, length?: number): ReadRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseReadRequest) as ReadRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 5:
          message.query = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ReadRequest {
    const message = Object.create(baseReadRequest) as ReadRequest;
    if (object.query !== undefined && object.query !== null) {
      message.query = String(object.query);
    } else {
      message.query = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<ReadRequest>): ReadRequest {
    const message = Object.create(baseReadRequest) as ReadRequest;
    if (object.query !== undefined && object.query !== null) {
      message.query = object.query;
    } else {
      message.query = '';
    }
    return message;
  },
  toJSON(message: ReadRequest): unknown {
    const obj: any = {};
    obj.query = message.query || '';
    return obj;
  },
};

export const ReadResponse = {
  encode(message: ReadResponse, writer: Writer = Writer.create()): Writer {
    if (message.user !== undefined && message.user !== undefined) {
      User.encode(message.user, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): ReadResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseReadResponse) as ReadResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.user = User.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ReadResponse {
    const message = Object.create(baseReadResponse) as ReadResponse;
    if (object.user !== undefined && object.user !== null) {
      message.user = User.fromJSON(object.user);
    } else {
      message.user = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<ReadResponse>): ReadResponse {
    const message = Object.create(baseReadResponse) as ReadResponse;
    if (object.user !== undefined && object.user !== null) {
      message.user = User.fromPartial(object.user);
    } else {
      message.user = undefined;
    }
    return message;
  },
  toJSON(message: ReadResponse): unknown {
    const obj: any = {};
    obj.user = message.user ? User.toJSON(message.user) : undefined;
    return obj;
  },
};

export const UpdateRequest = {
  encode(message: UpdateRequest, writer: Writer = Writer.create()): Writer {
    if (message.user !== undefined && message.user !== undefined) {
      User.encode(message.user, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): UpdateRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseUpdateRequest) as UpdateRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.user = User.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): UpdateRequest {
    const message = Object.create(baseUpdateRequest) as UpdateRequest;
    if (object.user !== undefined && object.user !== null) {
      message.user = User.fromJSON(object.user);
    } else {
      message.user = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<UpdateRequest>): UpdateRequest {
    const message = Object.create(baseUpdateRequest) as UpdateRequest;
    if (object.user !== undefined && object.user !== null) {
      message.user = User.fromPartial(object.user);
    } else {
      message.user = undefined;
    }
    return message;
  },
  toJSON(message: UpdateRequest): unknown {
    const obj: any = {};
    obj.user = message.user ? User.toJSON(message.user) : undefined;
    return obj;
  },
};

export const UpdateResponse = {
  encode(message: UpdateResponse, writer: Writer = Writer.create()): Writer {
    if (message.user !== undefined && message.user !== undefined) {
      User.encode(message.user, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): UpdateResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseUpdateResponse) as UpdateResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.user = User.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): UpdateResponse {
    const message = Object.create(baseUpdateResponse) as UpdateResponse;
    if (object.user !== undefined && object.user !== null) {
      message.user = User.fromJSON(object.user);
    } else {
      message.user = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<UpdateResponse>): UpdateResponse {
    const message = Object.create(baseUpdateResponse) as UpdateResponse;
    if (object.user !== undefined && object.user !== null) {
      message.user = User.fromPartial(object.user);
    } else {
      message.user = undefined;
    }
    return message;
  },
  toJSON(message: UpdateResponse): unknown {
    const obj: any = {};
    obj.user = message.user ? User.toJSON(message.user) : undefined;
    return obj;
  },
};

export const UpdatePasswordRequest = {
  encode(message: UpdatePasswordRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.userId);
    writer.uint32(18).string(message.oldPassword);
    writer.uint32(26).string(message.newPassword);
    writer.uint32(34).string(message.confirmPassword);
    return writer;
  },
  decode(reader: Reader, length?: number): UpdatePasswordRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseUpdatePasswordRequest) as UpdatePasswordRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userId = reader.string();
          break;
        case 2:
          message.oldPassword = reader.string();
          break;
        case 3:
          message.newPassword = reader.string();
          break;
        case 4:
          message.confirmPassword = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): UpdatePasswordRequest {
    const message = Object.create(baseUpdatePasswordRequest) as UpdatePasswordRequest;
    if (object.userId !== undefined && object.userId !== null) {
      message.userId = String(object.userId);
    } else {
      message.userId = '';
    }
    if (object.oldPassword !== undefined && object.oldPassword !== null) {
      message.oldPassword = String(object.oldPassword);
    } else {
      message.oldPassword = '';
    }
    if (object.newPassword !== undefined && object.newPassword !== null) {
      message.newPassword = String(object.newPassword);
    } else {
      message.newPassword = '';
    }
    if (object.confirmPassword !== undefined && object.confirmPassword !== null) {
      message.confirmPassword = String(object.confirmPassword);
    } else {
      message.confirmPassword = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<UpdatePasswordRequest>): UpdatePasswordRequest {
    const message = Object.create(baseUpdatePasswordRequest) as UpdatePasswordRequest;
    if (object.userId !== undefined && object.userId !== null) {
      message.userId = object.userId;
    } else {
      message.userId = '';
    }
    if (object.oldPassword !== undefined && object.oldPassword !== null) {
      message.oldPassword = object.oldPassword;
    } else {
      message.oldPassword = '';
    }
    if (object.newPassword !== undefined && object.newPassword !== null) {
      message.newPassword = object.newPassword;
    } else {
      message.newPassword = '';
    }
    if (object.confirmPassword !== undefined && object.confirmPassword !== null) {
      message.confirmPassword = object.confirmPassword;
    } else {
      message.confirmPassword = '';
    }
    return message;
  },
  toJSON(message: UpdatePasswordRequest): unknown {
    const obj: any = {};
    obj.userId = message.userId || '';
    obj.oldPassword = message.oldPassword || '';
    obj.newPassword = message.newPassword || '';
    obj.confirmPassword = message.confirmPassword || '';
    return obj;
  },
};

export const UpdatePasswordResponse = {
  encode(message: UpdatePasswordResponse, writer: Writer = Writer.create()): Writer {
    writer.uint32(8).bool(message.success);
    return writer;
  },
  decode(reader: Reader, length?: number): UpdatePasswordResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseUpdatePasswordResponse) as UpdatePasswordResponse;
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
  fromJSON(object: any): UpdatePasswordResponse {
    const message = Object.create(baseUpdatePasswordResponse) as UpdatePasswordResponse;
    if (object.success !== undefined && object.success !== null) {
      message.success = Boolean(object.success);
    } else {
      message.success = false;
    }
    return message;
  },
  fromPartial(object: DeepPartial<UpdatePasswordResponse>): UpdatePasswordResponse {
    const message = Object.create(baseUpdatePasswordResponse) as UpdatePasswordResponse;
    if (object.success !== undefined && object.success !== null) {
      message.success = object.success;
    } else {
      message.success = false;
    }
    return message;
  },
  toJSON(message: UpdatePasswordResponse): unknown {
    const obj: any = {};
    obj.success = message.success || false;
    return obj;
  },
};

export const ForgotPasswordRequest = {
  encode(message: ForgotPasswordRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.email);
    return writer;
  },
  decode(reader: Reader, length?: number): ForgotPasswordRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseForgotPasswordRequest) as ForgotPasswordRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.email = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ForgotPasswordRequest {
    const message = Object.create(baseForgotPasswordRequest) as ForgotPasswordRequest;
    if (object.email !== undefined && object.email !== null) {
      message.email = String(object.email);
    } else {
      message.email = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<ForgotPasswordRequest>): ForgotPasswordRequest {
    const message = Object.create(baseForgotPasswordRequest) as ForgotPasswordRequest;
    if (object.email !== undefined && object.email !== null) {
      message.email = object.email;
    } else {
      message.email = '';
    }
    return message;
  },
  toJSON(message: ForgotPasswordRequest): unknown {
    const obj: any = {};
    obj.email = message.email || '';
    return obj;
  },
};

export const ForgotPasswordResponse = {
  encode(message: ForgotPasswordResponse, writer: Writer = Writer.create()): Writer {
    writer.uint32(8).bool(message.success);
    return writer;
  },
  decode(reader: Reader, length?: number): ForgotPasswordResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseForgotPasswordResponse) as ForgotPasswordResponse;
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
  fromJSON(object: any): ForgotPasswordResponse {
    const message = Object.create(baseForgotPasswordResponse) as ForgotPasswordResponse;
    if (object.success !== undefined && object.success !== null) {
      message.success = Boolean(object.success);
    } else {
      message.success = false;
    }
    return message;
  },
  fromPartial(object: DeepPartial<ForgotPasswordResponse>): ForgotPasswordResponse {
    const message = Object.create(baseForgotPasswordResponse) as ForgotPasswordResponse;
    if (object.success !== undefined && object.success !== null) {
      message.success = object.success;
    } else {
      message.success = false;
    }
    return message;
  },
  toJSON(message: ForgotPasswordResponse): unknown {
    const obj: any = {};
    obj.success = message.success || false;
    return obj;
  },
};

export const SearchRequest = {
  encode(message: SearchRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.username);
    writer.uint32(18).string(message.email);
    writer.uint32(24).int32(message.limit);
    writer.uint32(32).int32(message.offset);
    return writer;
  },
  decode(reader: Reader, length?: number): SearchRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseSearchRequest) as SearchRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.username = reader.string();
          break;
        case 2:
          message.email = reader.string();
          break;
        case 3:
          message.limit = reader.int32();
          break;
        case 4:
          message.offset = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): SearchRequest {
    const message = Object.create(baseSearchRequest) as SearchRequest;
    if (object.username !== undefined && object.username !== null) {
      message.username = String(object.username);
    } else {
      message.username = '';
    }
    if (object.email !== undefined && object.email !== null) {
      message.email = String(object.email);
    } else {
      message.email = '';
    }
    if (object.limit !== undefined && object.limit !== null) {
      message.limit = Number(object.limit);
    } else {
      message.limit = 0;
    }
    if (object.offset !== undefined && object.offset !== null) {
      message.offset = Number(object.offset);
    } else {
      message.offset = 0;
    }
    return message;
  },
  fromPartial(object: DeepPartial<SearchRequest>): SearchRequest {
    const message = Object.create(baseSearchRequest) as SearchRequest;
    if (object.username !== undefined && object.username !== null) {
      message.username = object.username;
    } else {
      message.username = '';
    }
    if (object.email !== undefined && object.email !== null) {
      message.email = object.email;
    } else {
      message.email = '';
    }
    if (object.limit !== undefined && object.limit !== null) {
      message.limit = object.limit;
    } else {
      message.limit = 0;
    }
    if (object.offset !== undefined && object.offset !== null) {
      message.offset = object.offset;
    } else {
      message.offset = 0;
    }
    return message;
  },
  toJSON(message: SearchRequest): unknown {
    const obj: any = {};
    obj.username = message.username || '';
    obj.email = message.email || '';
    obj.limit = message.limit || 0;
    obj.offset = message.offset || 0;
    return obj;
  },
};

export const SearchResponse = {
  encode(message: SearchResponse, writer: Writer = Writer.create()): Writer {
    for (const v of message.users) {
      User.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): SearchResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseSearchResponse) as SearchResponse;
    message.users = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.users.push(User.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): SearchResponse {
    const message = Object.create(baseSearchResponse) as SearchResponse;
    message.users = [];
    if (object.users !== undefined && object.users !== null) {
      for (const e of object.users) {
        message.users.push(User.fromJSON(e));
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<SearchResponse>): SearchResponse {
    const message = Object.create(baseSearchResponse) as SearchResponse;
    message.users = [];
    if (object.users !== undefined && object.users !== null) {
      for (const e of object.users) {
        message.users.push(User.fromPartial(e));
      }
    }
    return message;
  },
  toJSON(message: SearchResponse): unknown {
    const obj: any = {};
    if (message.users) {
      obj.users = message.users.map(e => e ? User.toJSON(e) : undefined);
    } else {
      obj.users = [];
    }
    return obj;
  },
};

export const ReadSessionRequest = {
  encode(message: ReadSessionRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.sessionId);
    return writer;
  },
  decode(reader: Reader, length?: number): ReadSessionRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseReadSessionRequest) as ReadSessionRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sessionId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ReadSessionRequest {
    const message = Object.create(baseReadSessionRequest) as ReadSessionRequest;
    if (object.sessionId !== undefined && object.sessionId !== null) {
      message.sessionId = String(object.sessionId);
    } else {
      message.sessionId = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<ReadSessionRequest>): ReadSessionRequest {
    const message = Object.create(baseReadSessionRequest) as ReadSessionRequest;
    if (object.sessionId !== undefined && object.sessionId !== null) {
      message.sessionId = object.sessionId;
    } else {
      message.sessionId = '';
    }
    return message;
  },
  toJSON(message: ReadSessionRequest): unknown {
    const obj: any = {};
    obj.sessionId = message.sessionId || '';
    return obj;
  },
};

export const ReadSessionResponse = {
  encode(message: ReadSessionResponse, writer: Writer = Writer.create()): Writer {
    if (message.session !== undefined && message.session !== undefined) {
      Session.encode(message.session, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): ReadSessionResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseReadSessionResponse) as ReadSessionResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.session = Session.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ReadSessionResponse {
    const message = Object.create(baseReadSessionResponse) as ReadSessionResponse;
    if (object.session !== undefined && object.session !== null) {
      message.session = Session.fromJSON(object.session);
    } else {
      message.session = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<ReadSessionResponse>): ReadSessionResponse {
    const message = Object.create(baseReadSessionResponse) as ReadSessionResponse;
    if (object.session !== undefined && object.session !== null) {
      message.session = Session.fromPartial(object.session);
    } else {
      message.session = undefined;
    }
    return message;
  },
  toJSON(message: ReadSessionResponse): unknown {
    const obj: any = {};
    obj.session = message.session ? Session.toJSON(message.session) : undefined;
    return obj;
  },
};

export const LoginTypeParams = {
  encode(message: LoginTypeParams, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.accessToken);
    writer.uint32(18).string(message.userId);
    writer.uint32(26).string(message.password);
    writer.uint32(34).string(message.email);
    return writer;
  },
  decode(reader: Reader, length?: number): LoginTypeParams {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseLoginTypeParams) as LoginTypeParams;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.accessToken = reader.string();
          break;
        case 2:
          message.userId = reader.string();
          break;
        case 3:
          message.password = reader.string();
          break;
        case 4:
          message.email = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): LoginTypeParams {
    const message = Object.create(baseLoginTypeParams) as LoginTypeParams;
    if (object.accessToken !== undefined && object.accessToken !== null) {
      message.accessToken = String(object.accessToken);
    } else {
      message.accessToken = '';
    }
    if (object.userId !== undefined && object.userId !== null) {
      message.userId = String(object.userId);
    } else {
      message.userId = '';
    }
    if (object.password !== undefined && object.password !== null) {
      message.password = String(object.password);
    } else {
      message.password = '';
    }
    if (object.email !== undefined && object.email !== null) {
      message.email = String(object.email);
    } else {
      message.email = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<LoginTypeParams>): LoginTypeParams {
    const message = Object.create(baseLoginTypeParams) as LoginTypeParams;
    if (object.accessToken !== undefined && object.accessToken !== null) {
      message.accessToken = object.accessToken;
    } else {
      message.accessToken = '';
    }
    if (object.userId !== undefined && object.userId !== null) {
      message.userId = object.userId;
    } else {
      message.userId = '';
    }
    if (object.password !== undefined && object.password !== null) {
      message.password = object.password;
    } else {
      message.password = '';
    }
    if (object.email !== undefined && object.email !== null) {
      message.email = object.email;
    } else {
      message.email = '';
    }
    return message;
  },
  toJSON(message: LoginTypeParams): unknown {
    const obj: any = {};
    obj.accessToken = message.accessToken || '';
    obj.userId = message.userId || '';
    obj.password = message.password || '';
    obj.email = message.email || '';
    return obj;
  },
};

export const LoginRequest = {
  encode(message: LoginRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(8).int32(message.service);
    if (message.params !== undefined && message.params !== undefined) {
      LoginTypeParams.encode(message.params, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): LoginRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseLoginRequest) as LoginRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.service = reader.int32() as any;
          break;
        case 2:
          message.params = LoginTypeParams.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): LoginRequest {
    const message = Object.create(baseLoginRequest) as LoginRequest;
    if (object.service !== undefined && object.service !== null) {
      message.service = LoginServiceTypes.fromJSON(object.service);
    } else {
      message.service = 0;
    }
    if (object.params !== undefined && object.params !== null) {
      message.params = LoginTypeParams.fromJSON(object.params);
    } else {
      message.params = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<LoginRequest>): LoginRequest {
    const message = Object.create(baseLoginRequest) as LoginRequest;
    if (object.service !== undefined && object.service !== null) {
      message.service = object.service;
    } else {
      message.service = 0;
    }
    if (object.params !== undefined && object.params !== null) {
      message.params = LoginTypeParams.fromPartial(object.params);
    } else {
      message.params = undefined;
    }
    return message;
  },
  toJSON(message: LoginRequest): unknown {
    const obj: any = {};
    obj.service = LoginServiceTypes.toJSON(message.service);
    obj.params = message.params ? LoginTypeParams.toJSON(message.params) : undefined;
    return obj;
  },
};

export const LoginResponse = {
  encode(message: LoginResponse, writer: Writer = Writer.create()): Writer {
    if (message.session !== undefined && message.session !== undefined) {
      Session.encode(message.session, writer.uint32(10).fork()).ldelim();
    }
    if (message.user !== undefined && message.user !== undefined) {
      User.encode(message.user, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): LoginResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseLoginResponse) as LoginResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.session = Session.decode(reader, reader.uint32());
          break;
        case 2:
          message.user = User.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): LoginResponse {
    const message = Object.create(baseLoginResponse) as LoginResponse;
    if (object.session !== undefined && object.session !== null) {
      message.session = Session.fromJSON(object.session);
    } else {
      message.session = undefined;
    }
    if (object.user !== undefined && object.user !== null) {
      message.user = User.fromJSON(object.user);
    } else {
      message.user = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<LoginResponse>): LoginResponse {
    const message = Object.create(baseLoginResponse) as LoginResponse;
    if (object.session !== undefined && object.session !== null) {
      message.session = Session.fromPartial(object.session);
    } else {
      message.session = undefined;
    }
    if (object.user !== undefined && object.user !== null) {
      message.user = User.fromPartial(object.user);
    } else {
      message.user = undefined;
    }
    return message;
  },
  toJSON(message: LoginResponse): unknown {
    const obj: any = {};
    obj.session = message.session ? Session.toJSON(message.session) : undefined;
    obj.user = message.user ? User.toJSON(message.user) : undefined;
    return obj;
  },
};

export const LogoutRequest = {
  encode(message: LogoutRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.sessionId);
    return writer;
  },
  decode(reader: Reader, length?: number): LogoutRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseLogoutRequest) as LogoutRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sessionId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): LogoutRequest {
    const message = Object.create(baseLogoutRequest) as LogoutRequest;
    if (object.sessionId !== undefined && object.sessionId !== null) {
      message.sessionId = String(object.sessionId);
    } else {
      message.sessionId = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<LogoutRequest>): LogoutRequest {
    const message = Object.create(baseLogoutRequest) as LogoutRequest;
    if (object.sessionId !== undefined && object.sessionId !== null) {
      message.sessionId = object.sessionId;
    } else {
      message.sessionId = '';
    }
    return message;
  },
  toJSON(message: LogoutRequest): unknown {
    const obj: any = {};
    obj.sessionId = message.sessionId || '';
    return obj;
  },
};

export const LogoutResponse = {
  encode(message: LogoutResponse, writer: Writer = Writer.create()): Writer {
    writer.uint32(8).bool(message.success);
    return writer;
  },
  decode(reader: Reader, length?: number): LogoutResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseLogoutResponse) as LogoutResponse;
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
  fromJSON(object: any): LogoutResponse {
    const message = Object.create(baseLogoutResponse) as LogoutResponse;
    if (object.success !== undefined && object.success !== null) {
      message.success = Boolean(object.success);
    } else {
      message.success = false;
    }
    return message;
  },
  fromPartial(object: DeepPartial<LogoutResponse>): LogoutResponse {
    const message = Object.create(baseLogoutResponse) as LogoutResponse;
    if (object.success !== undefined && object.success !== null) {
      message.success = object.success;
    } else {
      message.success = false;
    }
    return message;
  },
  toJSON(message: LogoutResponse): unknown {
    const obj: any = {};
    obj.success = message.success || false;
    return obj;
  },
};

export const VerifyAccountRequest = {
  encode(message: VerifyAccountRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.email);
    writer.uint32(18).string(message.pincode);
    return writer;
  },
  decode(reader: Reader, length?: number): VerifyAccountRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseVerifyAccountRequest) as VerifyAccountRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.email = reader.string();
          break;
        case 2:
          message.pincode = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): VerifyAccountRequest {
    const message = Object.create(baseVerifyAccountRequest) as VerifyAccountRequest;
    if (object.email !== undefined && object.email !== null) {
      message.email = String(object.email);
    } else {
      message.email = '';
    }
    if (object.pincode !== undefined && object.pincode !== null) {
      message.pincode = String(object.pincode);
    } else {
      message.pincode = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<VerifyAccountRequest>): VerifyAccountRequest {
    const message = Object.create(baseVerifyAccountRequest) as VerifyAccountRequest;
    if (object.email !== undefined && object.email !== null) {
      message.email = object.email;
    } else {
      message.email = '';
    }
    if (object.pincode !== undefined && object.pincode !== null) {
      message.pincode = object.pincode;
    } else {
      message.pincode = '';
    }
    return message;
  },
  toJSON(message: VerifyAccountRequest): unknown {
    const obj: any = {};
    obj.email = message.email || '';
    obj.pincode = message.pincode || '';
    return obj;
  },
};

export const VerifyAccountResponse = {
  encode(message: VerifyAccountResponse, writer: Writer = Writer.create()): Writer {
    writer.uint32(8).bool(message.success);
    return writer;
  },
  decode(reader: Reader, length?: number): VerifyAccountResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseVerifyAccountResponse) as VerifyAccountResponse;
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
  fromJSON(object: any): VerifyAccountResponse {
    const message = Object.create(baseVerifyAccountResponse) as VerifyAccountResponse;
    if (object.success !== undefined && object.success !== null) {
      message.success = Boolean(object.success);
    } else {
      message.success = false;
    }
    return message;
  },
  fromPartial(object: DeepPartial<VerifyAccountResponse>): VerifyAccountResponse {
    const message = Object.create(baseVerifyAccountResponse) as VerifyAccountResponse;
    if (object.success !== undefined && object.success !== null) {
      message.success = object.success;
    } else {
      message.success = false;
    }
    return message;
  },
  toJSON(message: VerifyAccountResponse): unknown {
    const obj: any = {};
    obj.success = message.success || false;
    return obj;
  },
};

export const VerifyActivationLinkRequest = {
  encode(message: VerifyActivationLinkRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.token);
    return writer;
  },
  decode(reader: Reader, length?: number): VerifyActivationLinkRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseVerifyActivationLinkRequest) as VerifyActivationLinkRequest;
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
  fromJSON(object: any): VerifyActivationLinkRequest {
    const message = Object.create(baseVerifyActivationLinkRequest) as VerifyActivationLinkRequest;
    if (object.token !== undefined && object.token !== null) {
      message.token = String(object.token);
    } else {
      message.token = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<VerifyActivationLinkRequest>): VerifyActivationLinkRequest {
    const message = Object.create(baseVerifyActivationLinkRequest) as VerifyActivationLinkRequest;
    if (object.token !== undefined && object.token !== null) {
      message.token = object.token;
    } else {
      message.token = '';
    }
    return message;
  },
  toJSON(message: VerifyActivationLinkRequest): unknown {
    const obj: any = {};
    obj.token = message.token || '';
    return obj;
  },
};

export const VerifyActivationLinkResponse = {
  encode(message: VerifyActivationLinkResponse, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.email);
    writer.uint32(18).string(message.pincode);
    return writer;
  },
  decode(reader: Reader, length?: number): VerifyActivationLinkResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseVerifyActivationLinkResponse) as VerifyActivationLinkResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.email = reader.string();
          break;
        case 2:
          message.pincode = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): VerifyActivationLinkResponse {
    const message = Object.create(baseVerifyActivationLinkResponse) as VerifyActivationLinkResponse;
    if (object.email !== undefined && object.email !== null) {
      message.email = String(object.email);
    } else {
      message.email = '';
    }
    if (object.pincode !== undefined && object.pincode !== null) {
      message.pincode = String(object.pincode);
    } else {
      message.pincode = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<VerifyActivationLinkResponse>): VerifyActivationLinkResponse {
    const message = Object.create(baseVerifyActivationLinkResponse) as VerifyActivationLinkResponse;
    if (object.email !== undefined && object.email !== null) {
      message.email = object.email;
    } else {
      message.email = '';
    }
    if (object.pincode !== undefined && object.pincode !== null) {
      message.pincode = object.pincode;
    } else {
      message.pincode = '';
    }
    return message;
  },
  toJSON(message: VerifyActivationLinkResponse): unknown {
    const obj: any = {};
    obj.email = message.email || '';
    obj.pincode = message.pincode || '';
    return obj;
  },
};

export const ResendVerificationCodeRequest = {
  encode(message: ResendVerificationCodeRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.email);
    return writer;
  },
  decode(reader: Reader, length?: number): ResendVerificationCodeRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseResendVerificationCodeRequest) as ResendVerificationCodeRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.email = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ResendVerificationCodeRequest {
    const message = Object.create(baseResendVerificationCodeRequest) as ResendVerificationCodeRequest;
    if (object.email !== undefined && object.email !== null) {
      message.email = String(object.email);
    } else {
      message.email = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<ResendVerificationCodeRequest>): ResendVerificationCodeRequest {
    const message = Object.create(baseResendVerificationCodeRequest) as ResendVerificationCodeRequest;
    if (object.email !== undefined && object.email !== null) {
      message.email = object.email;
    } else {
      message.email = '';
    }
    return message;
  },
  toJSON(message: ResendVerificationCodeRequest): unknown {
    const obj: any = {};
    obj.email = message.email || '';
    return obj;
  },
};

export const ResendVerificationCodeResponse = {
  encode(message: ResendVerificationCodeResponse, writer: Writer = Writer.create()): Writer {
    writer.uint32(8).bool(message.success);
    return writer;
  },
  decode(reader: Reader, length?: number): ResendVerificationCodeResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseResendVerificationCodeResponse) as ResendVerificationCodeResponse;
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
  fromJSON(object: any): ResendVerificationCodeResponse {
    const message = Object.create(baseResendVerificationCodeResponse) as ResendVerificationCodeResponse;
    if (object.success !== undefined && object.success !== null) {
      message.success = Boolean(object.success);
    } else {
      message.success = false;
    }
    return message;
  },
  fromPartial(object: DeepPartial<ResendVerificationCodeResponse>): ResendVerificationCodeResponse {
    const message = Object.create(baseResendVerificationCodeResponse) as ResendVerificationCodeResponse;
    if (object.success !== undefined && object.success !== null) {
      message.success = object.success;
    } else {
      message.success = false;
    }
    return message;
  },
  toJSON(message: ResendVerificationCodeResponse): unknown {
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