/* tslint:disable:ban-types */
import { getMetadataStorage } from '../metadata';

export function InstanceCollector(name): Function {
  return (prototype) => {
    getMetadataStorage().collectInstanceMetadata({
      name,
      fieldType: prototype.constructor.name,
      target: prototype.constructor,
      prototype,
      objectType: prototype.constructor.name,
    });
  };
}
