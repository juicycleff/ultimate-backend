import 'reflect-metadata';
import { getMetadataStorage } from '@graphqlcqrs/core/metadata';
import { findType } from '@graphqlcqrs/core/metadata/find-type';

export function Permission(options: {
  name: string, identify: string, action: 'create' | 'read' | 'update' | 'delete' | 'write', tenant?: string,
}) {
  // tslint:disable-next-line:only-arrow-functions
  return function(prototype, propertyKey: string, descriptor) {

    const { getType } = findType({
      metadataKey: 'design:type',
      prototype,
      propertyKey,
      typeOptions: null,
    });

    getMetadataStorage().collectPermissionsMetadata({
      name: propertyKey,
      fieldType: propertyKey,
      getType,
      typeOptions: null,
      target: prototype.constructor,
      objectType: prototype.constructor.name,
      methodName: propertyKey,
      options,
    });
  };
}
