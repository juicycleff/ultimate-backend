/* tslint:disable:ban-types */
import { ClassType } from 'type-graphql';
import { findType } from '@graphqlcqrs/core/metadata/find-type';
import { getMetadataStorage } from '@graphqlcqrs/core/metadata';

export function Filterable(option?: FilterableOption): Function {

  // tslint:disable-next-line:only-arrow-functions
  return function(prototype, propertyKey: string, descriptor) {
// 09112312457
    const { getType } = findType({
      metadataKey: 'design:type',
      prototype,
      propertyKey,
      typeOptions: null,
    });

    getMetadataStorage().collectClassFieldMetadata({
      name: propertyKey,
      fieldType: option ? option.type : propertyKey,
      getType,
      typeOptions: null,
      target: prototype.constructor,
      objectType: prototype.constructor.name,
      methodName: propertyKey,
    });
  };
}

interface FilterableOption {
  type: ClassType;
}
