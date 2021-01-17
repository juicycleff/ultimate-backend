import { TypeMetadataStorage } from '../storages';

export interface ResourceMetadataOptions {
  name?: string
}

/**
 * @Resource decorator is used to mark a class as a Oso actor class.
 * Only properties decorated with this decorator will be registered in the Oso.
 */
export function Resource(options: ResourceMetadataOptions): ClassDecorator {
  return (target: Function) => {
    TypeMetadataStorage.addOsoMetadata({
      target,
      options,
    });
  };
}
