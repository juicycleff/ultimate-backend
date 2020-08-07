import 'reflect-metadata';
import { getMetadataStorage } from '../metadata';
import { InAppRole } from '../interfaces';

export const RESOURCE_DEFINITION = '__resource_definition__';

export function Resource(options: {
  name: string;
  identify: string;
  roles: InAppRole[];
  supportsToken?: boolean;
  action: 'create' | 'read' | 'update' | 'delete';
}) {
  return (target, key?: any, descriptor?: any) => {
    getMetadataStorage().collectResourcesMetadata({
      name: options.name,
      fieldType: options.name,
      target: target.constructor,
      prototype: target,
      objectType: target.constructor.name,
      options: {
        ...options,
      },
    });

    if (descriptor) {
      Reflect.defineMetadata(RESOURCE_DEFINITION, options, descriptor.value);
      return descriptor;
    }
    Reflect.defineMetadata(RESOURCE_DEFINITION, options, target);
    return target;
  };
}
