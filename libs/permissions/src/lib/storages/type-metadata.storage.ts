import { Type } from '@nestjs/common';
import { OsoMetadata } from '../metadata';

export class TypeMetadataStorageHost {
  private osoClasses = new Array<OsoMetadata>();

  addOsoMetadata(metadata: OsoMetadata) {
    this.osoClasses.push(metadata);
  }

  getOsoMetadata() {
    return this.osoClasses;
  }

  getSchemaMetadataByTarget(target: Type<unknown>): OsoMetadata | undefined {
    return this.osoClasses.find((item) => item.target === target);
  }

}

const globalRef = global as any;
export const TypeMetadataStorage: TypeMetadataStorageHost =
  globalRef.PermissionTypeMetadataStorage ||
  (globalRef.PermissionTypeMetadataStorage = new TypeMetadataStorageHost());
