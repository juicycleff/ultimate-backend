import { IPermission, IResource } from '../';
import {
  ClassType,
  DecoratorTypeOptions,
  ensureReflectMetadataExists,
} from '@ultimatebackend/common';

export class MetadataStorage {
  fields: FilterableMetadata[] = [];
  resources: ResourceMetadata[] = [];
  permissions: PermissionMetadata[] = [];
  instances: InstanceMetadata[] = [];

  constructor() {
    ensureReflectMetadataExists();
  }

  collectClassFieldMetadata(definition: FilterableMetadata) {
    this.fields.push(definition);
  }

  collectPermissionsMetadata(definition: PermissionMetadata) {
    this.permissions.push(definition);
  }

  collectResourcesMetadata(definition: ResourceMetadata) {
    this.resources.push(definition);
  }

  collectInstanceMetadata(definition: InstanceMetadata) {
    this.instances.push(definition);
  }

  clear() {
    this.fields = [];
    this.resources = [];
    this.permissions = [];
    this.instances = [];
  }
}

export interface FilterableMetadata {
  getType?: TypeValueThunk;
  typeOptions?: TypeOptions;
  getObjectType?: ClassTypeResolver;
  methodName: string;
  fieldType: string | ClassType<any>;
  name: string;
  // tslint:disable-next-line:ban-types
  target: Function;
  objectType: any;
  filterSchema?: any;
}

// tslint:disable-next-line:ban-types
export type TypeValue = ClassType | Function | object | symbol;
export type TypeValueThunk = (type?: void) => TypeValue;
export type ClassTypeResolver = (of?: void) => ClassType;

export interface TypeOptions extends DecoratorTypeOptions {
  array?: boolean;
  isEnum?: boolean;
  arrayDepth?: number;
}

export interface PermissionMetadata {
  getType?: TypeValueThunk;
  typeOptions?: TypeOptions;
  getObjectType?: ClassTypeResolver;
  methodName: string;
  fieldType: string | ClassType<any>;
  name: string;
  // tslint:disable-next-line:ban-types
  target: Function;
  objectType: any;
  filterSchema?: any;
  options?: IPermission;
}

export interface ResourceMetadata {
  prototype?: any;
  fieldType: string | ClassType<any>;
  name: string;
  // tslint:disable-next-line:ban-types
  target: Function;
  objectType: any;
  options?: IResource;
}

export interface InstanceMetadata {
  prototype?: any;
  getObjectType?: ClassTypeResolver;
  fieldType: string | ClassType<any>;
  name: string;
  // tslint:disable-next-line:ban-types
  target: Function;
  objectType: any;
}
