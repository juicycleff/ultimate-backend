import 'reflect-metadata';
import { getMetadataStorage } from '@graphqlcqrs/core/metadata';

export function Resource(options: { name: string, identify: string }) {
  return (prototype) => {

    getMetadataStorage().collectResourcesMetadata({
      name: options.name,
      fieldType: options.name,
      target: prototype.constructor,
      prototype,
      objectType: prototype.constructor.name,
      options: {
        ...options,
      },
    });
  };
}
