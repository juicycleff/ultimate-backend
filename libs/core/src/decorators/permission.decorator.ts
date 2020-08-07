import 'reflect-metadata';
import { getMetadataStorage } from '../metadata';
import { findType } from '../metadata/find-type';

export const PERMISSION_DEFINITION = '__permission_definition__';

export function Permission(options: {
  name: string;
  identify: string;
  action: 'create' | 'read' | 'update' | 'delete';
  superUser?: boolean;
}) {
  // tslint:disable-next-line:only-arrow-functions
  return function (target, propertyKey: string, descriptor) {
    const { getType } = findType({
      metadataKey: 'design:type',
      prototype: target,
      propertyKey,
      typeOptions: null,
    });

    getMetadataStorage().collectPermissionsMetadata({
      name: propertyKey,
      fieldType: propertyKey,
      getType,
      typeOptions: null,
      target: target.constructor,
      objectType: target.constructor.name,
      methodName: propertyKey,
      options,
    });

    if (descriptor) {
      Reflect.defineMetadata(PERMISSION_DEFINITION, options, descriptor.value);
      return descriptor;
    }
    Reflect.defineMetadata(PERMISSION_DEFINITION, options, target);
    return target;
  };
}
