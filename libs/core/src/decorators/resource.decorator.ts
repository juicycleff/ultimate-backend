import 'reflect-metadata';
import { getMetadataStorage } from '@graphqlcqrs/core/metadata';

export const RESOURCE_DEFINITION = '__resource_definition__';

export function Resource(options: { name: string, identify: string }) {
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
