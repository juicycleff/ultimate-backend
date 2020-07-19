/* eslint-disable */
import { Observable } from 'rxjs';
import { Writer, Reader } from 'protobufjs/minimal';


export interface Paginate {
  skip: number;
  limit: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  name: string;
  description: string;
}

export interface CreateProjectResponse {
  project: Project | undefined;
}

export interface UpdateProjectRequest {
  id: string;
  name: string;
  description: string;
}

export interface UpdateProjectResponse {
  project: Project | undefined;
}

export interface DeleteProjectRequest {
  id: string;
}

export interface DeleteProjectResponse {
  project: Project | undefined;
}

export interface ReadProjectRequest {
  filter: string;
}

export interface ReadProjectResponse {
  project: Project | undefined;
}

export interface FindProjectsRequest {
  filter: string;
  paginate: Paginate | undefined;
}

export interface FindProjectsResponse {
  projects: Project[];
}

const basePaginate: object = {
  skip: 0,
  limit: 0,
};

const baseProject: object = {
  id: '',
  name: '',
  description: '',
  createdAt: '',
  updatedAt: '',
};

const baseCreateProjectRequest: object = {
  name: '',
  description: '',
};

const baseCreateProjectResponse: object = {
  project: undefined,
};

const baseUpdateProjectRequest: object = {
  id: '',
  name: '',
  description: '',
};

const baseUpdateProjectResponse: object = {
  project: undefined,
};

const baseDeleteProjectRequest: object = {
  id: '',
};

const baseDeleteProjectResponse: object = {
  project: undefined,
};

const baseReadProjectRequest: object = {
  filter: '',
};

const baseReadProjectResponse: object = {
  project: undefined,
};

const baseFindProjectsRequest: object = {
  filter: '',
  paginate: undefined,
};

const baseFindProjectsResponse: object = {
  projects: undefined,
};

export interface ProjectService<Context extends DataLoaders> {

  createProject(request: CreateProjectRequest, ctx: Context): Promise<CreateProjectResponse>;

  deleteProject(request: DeleteProjectRequest, ctx: Context): Promise<DeleteProjectResponse>;

  updateProject(request: UpdateProjectRequest, ctx: Context): Promise<UpdateProjectResponse>;

  readProject(request: ReadProjectRequest, ctx: Context): Promise<ReadProjectResponse>;

  findProjects(request: FindProjectsRequest, ctx: Context): Promise<FindProjectsResponse>;

}

export interface ProjectServiceClient<Context extends DataLoaders> {

  createProject(request: CreateProjectRequest, ctx?: Context): Observable<CreateProjectResponse>;

  deleteProject(request: DeleteProjectRequest, ctx?: Context): Observable<DeleteProjectResponse>;

  updateProject(request: UpdateProjectRequest, ctx?: Context): Observable<UpdateProjectResponse>;

  readProject(request: ReadProjectRequest, ctx?: Context): Observable<ReadProjectResponse>;

  findProjects(request: FindProjectsRequest, ctx?: Context): Observable<FindProjectsResponse>;

}

interface DataLoaders {

  getDataLoader<T>(identifier: string, constructorFn: () => T): T;

}

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

export const Project = {
  encode(message: Project, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.id);
    writer.uint32(18).string(message.name);
    writer.uint32(26).string(message.description);
    writer.uint32(34).string(message.createdAt);
    writer.uint32(42).string(message.updatedAt);
    return writer;
  },
  decode(reader: Reader, length?: number): Project {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseProject) as Project;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.description = reader.string();
          break;
        case 4:
          message.createdAt = reader.string();
          break;
        case 5:
          message.updatedAt = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): Project {
    const message = Object.create(baseProject) as Project;
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
    if (object.description !== undefined && object.description !== null) {
      message.description = String(object.description);
    } else {
      message.description = '';
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
  fromPartial(object: DeepPartial<Project>): Project {
    const message = Object.create(baseProject) as Project;
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
    if (object.description !== undefined && object.description !== null) {
      message.description = object.description;
    } else {
      message.description = '';
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
  toJSON(message: Project): unknown {
    const obj: any = {};
    obj.id = message.id || '';
    obj.name = message.name || '';
    obj.description = message.description || '';
    obj.createdAt = message.createdAt || '';
    obj.updatedAt = message.updatedAt || '';
    return obj;
  },
};

export const CreateProjectRequest = {
  encode(message: CreateProjectRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.name);
    writer.uint32(18).string(message.description);
    return writer;
  },
  decode(reader: Reader, length?: number): CreateProjectRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseCreateProjectRequest) as CreateProjectRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        case 2:
          message.description = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): CreateProjectRequest {
    const message = Object.create(baseCreateProjectRequest) as CreateProjectRequest;
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    } else {
      message.name = '';
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = String(object.description);
    } else {
      message.description = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<CreateProjectRequest>): CreateProjectRequest {
    const message = Object.create(baseCreateProjectRequest) as CreateProjectRequest;
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    } else {
      message.name = '';
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = object.description;
    } else {
      message.description = '';
    }
    return message;
  },
  toJSON(message: CreateProjectRequest): unknown {
    const obj: any = {};
    obj.name = message.name || '';
    obj.description = message.description || '';
    return obj;
  },
};

export const CreateProjectResponse = {
  encode(message: CreateProjectResponse, writer: Writer = Writer.create()): Writer {
    if (message.project !== undefined && message.project !== undefined) {
      Project.encode(message.project, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): CreateProjectResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseCreateProjectResponse) as CreateProjectResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.project = Project.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): CreateProjectResponse {
    const message = Object.create(baseCreateProjectResponse) as CreateProjectResponse;
    if (object.project !== undefined && object.project !== null) {
      message.project = Project.fromJSON(object.project);
    } else {
      message.project = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<CreateProjectResponse>): CreateProjectResponse {
    const message = Object.create(baseCreateProjectResponse) as CreateProjectResponse;
    if (object.project !== undefined && object.project !== null) {
      message.project = Project.fromPartial(object.project);
    } else {
      message.project = undefined;
    }
    return message;
  },
  toJSON(message: CreateProjectResponse): unknown {
    const obj: any = {};
    obj.project = message.project ? Project.toJSON(message.project) : undefined;
    return obj;
  },
};

export const UpdateProjectRequest = {
  encode(message: UpdateProjectRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.id);
    writer.uint32(18).string(message.name);
    writer.uint32(26).string(message.description);
    return writer;
  },
  decode(reader: Reader, length?: number): UpdateProjectRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseUpdateProjectRequest) as UpdateProjectRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.description = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): UpdateProjectRequest {
    const message = Object.create(baseUpdateProjectRequest) as UpdateProjectRequest;
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
    if (object.description !== undefined && object.description !== null) {
      message.description = String(object.description);
    } else {
      message.description = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<UpdateProjectRequest>): UpdateProjectRequest {
    const message = Object.create(baseUpdateProjectRequest) as UpdateProjectRequest;
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
    if (object.description !== undefined && object.description !== null) {
      message.description = object.description;
    } else {
      message.description = '';
    }
    return message;
  },
  toJSON(message: UpdateProjectRequest): unknown {
    const obj: any = {};
    obj.id = message.id || '';
    obj.name = message.name || '';
    obj.description = message.description || '';
    return obj;
  },
};

export const UpdateProjectResponse = {
  encode(message: UpdateProjectResponse, writer: Writer = Writer.create()): Writer {
    if (message.project !== undefined && message.project !== undefined) {
      Project.encode(message.project, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): UpdateProjectResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseUpdateProjectResponse) as UpdateProjectResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.project = Project.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): UpdateProjectResponse {
    const message = Object.create(baseUpdateProjectResponse) as UpdateProjectResponse;
    if (object.project !== undefined && object.project !== null) {
      message.project = Project.fromJSON(object.project);
    } else {
      message.project = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<UpdateProjectResponse>): UpdateProjectResponse {
    const message = Object.create(baseUpdateProjectResponse) as UpdateProjectResponse;
    if (object.project !== undefined && object.project !== null) {
      message.project = Project.fromPartial(object.project);
    } else {
      message.project = undefined;
    }
    return message;
  },
  toJSON(message: UpdateProjectResponse): unknown {
    const obj: any = {};
    obj.project = message.project ? Project.toJSON(message.project) : undefined;
    return obj;
  },
};

export const DeleteProjectRequest = {
  encode(message: DeleteProjectRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.id);
    return writer;
  },
  decode(reader: Reader, length?: number): DeleteProjectRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseDeleteProjectRequest) as DeleteProjectRequest;
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
  fromJSON(object: any): DeleteProjectRequest {
    const message = Object.create(baseDeleteProjectRequest) as DeleteProjectRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    } else {
      message.id = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<DeleteProjectRequest>): DeleteProjectRequest {
    const message = Object.create(baseDeleteProjectRequest) as DeleteProjectRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = '';
    }
    return message;
  },
  toJSON(message: DeleteProjectRequest): unknown {
    const obj: any = {};
    obj.id = message.id || '';
    return obj;
  },
};

export const DeleteProjectResponse = {
  encode(message: DeleteProjectResponse, writer: Writer = Writer.create()): Writer {
    if (message.project !== undefined && message.project !== undefined) {
      Project.encode(message.project, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): DeleteProjectResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseDeleteProjectResponse) as DeleteProjectResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.project = Project.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): DeleteProjectResponse {
    const message = Object.create(baseDeleteProjectResponse) as DeleteProjectResponse;
    if (object.project !== undefined && object.project !== null) {
      message.project = Project.fromJSON(object.project);
    } else {
      message.project = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<DeleteProjectResponse>): DeleteProjectResponse {
    const message = Object.create(baseDeleteProjectResponse) as DeleteProjectResponse;
    if (object.project !== undefined && object.project !== null) {
      message.project = Project.fromPartial(object.project);
    } else {
      message.project = undefined;
    }
    return message;
  },
  toJSON(message: DeleteProjectResponse): unknown {
    const obj: any = {};
    obj.project = message.project ? Project.toJSON(message.project) : undefined;
    return obj;
  },
};

export const ReadProjectRequest = {
  encode(message: ReadProjectRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.filter);
    return writer;
  },
  decode(reader: Reader, length?: number): ReadProjectRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseReadProjectRequest) as ReadProjectRequest;
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
  fromJSON(object: any): ReadProjectRequest {
    const message = Object.create(baseReadProjectRequest) as ReadProjectRequest;
    if (object.filter !== undefined && object.filter !== null) {
      message.filter = String(object.filter);
    } else {
      message.filter = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<ReadProjectRequest>): ReadProjectRequest {
    const message = Object.create(baseReadProjectRequest) as ReadProjectRequest;
    if (object.filter !== undefined && object.filter !== null) {
      message.filter = object.filter;
    } else {
      message.filter = '';
    }
    return message;
  },
  toJSON(message: ReadProjectRequest): unknown {
    const obj: any = {};
    obj.filter = message.filter || '';
    return obj;
  },
};

export const ReadProjectResponse = {
  encode(message: ReadProjectResponse, writer: Writer = Writer.create()): Writer {
    if (message.project !== undefined && message.project !== undefined) {
      Project.encode(message.project, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): ReadProjectResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseReadProjectResponse) as ReadProjectResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.project = Project.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ReadProjectResponse {
    const message = Object.create(baseReadProjectResponse) as ReadProjectResponse;
    if (object.project !== undefined && object.project !== null) {
      message.project = Project.fromJSON(object.project);
    } else {
      message.project = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<ReadProjectResponse>): ReadProjectResponse {
    const message = Object.create(baseReadProjectResponse) as ReadProjectResponse;
    if (object.project !== undefined && object.project !== null) {
      message.project = Project.fromPartial(object.project);
    } else {
      message.project = undefined;
    }
    return message;
  },
  toJSON(message: ReadProjectResponse): unknown {
    const obj: any = {};
    obj.project = message.project ? Project.toJSON(message.project) : undefined;
    return obj;
  },
};

export const FindProjectsRequest = {
  encode(message: FindProjectsRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.filter);
    if (message.paginate !== undefined && message.paginate !== undefined) {
      Paginate.encode(message.paginate, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): FindProjectsRequest {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseFindProjectsRequest) as FindProjectsRequest;
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
  fromJSON(object: any): FindProjectsRequest {
    const message = Object.create(baseFindProjectsRequest) as FindProjectsRequest;
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
  fromPartial(object: DeepPartial<FindProjectsRequest>): FindProjectsRequest {
    const message = Object.create(baseFindProjectsRequest) as FindProjectsRequest;
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
  toJSON(message: FindProjectsRequest): unknown {
    const obj: any = {};
    obj.filter = message.filter || '';
    obj.paginate = message.paginate ? Paginate.toJSON(message.paginate) : undefined;
    return obj;
  },
};

export const FindProjectsResponse = {
  encode(message: FindProjectsResponse, writer: Writer = Writer.create()): Writer {
    for (const v of message.projects) {
      Project.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(reader: Reader, length?: number): FindProjectsResponse {
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(baseFindProjectsResponse) as FindProjectsResponse;
    message.projects = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.projects.push(Project.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): FindProjectsResponse {
    const message = Object.create(baseFindProjectsResponse) as FindProjectsResponse;
    message.projects = [];
    if (object.projects !== undefined && object.projects !== null) {
      for (const e of object.projects) {
        message.projects.push(Project.fromJSON(e));
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<FindProjectsResponse>): FindProjectsResponse {
    const message = Object.create(baseFindProjectsResponse) as FindProjectsResponse;
    message.projects = [];
    if (object.projects !== undefined && object.projects !== null) {
      for (const e of object.projects) {
        message.projects.push(Project.fromPartial(e));
      }
    }
    return message;
  },
  toJSON(message: FindProjectsResponse): unknown {
    const obj: any = {};
    if (message.projects) {
      obj.projects = message.projects.map(e => e ? Project.toJSON(e) : undefined);
    } else {
      obj.projects = [];
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