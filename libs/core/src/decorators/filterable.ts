import { findType } from '../metadata/find-type';
import { getMetadataStorage } from '../metadata';
import { ReturnTypeFunc } from '@nestjs/graphql';
import { ClassType } from '@ultimatebackend/common';

// tslint:disable-next-line:ban-types
export function Filterable(
  returnTypeFunc?: ReturnTypeFunc,
  option?: FilterableOption,
): Function {
  // tslint:disable-next-line:only-arrow-functions
  return function (prototype, propertyKey: string) {
    const { getType } = findType({
      metadataKey: 'design:type',
      prototype,
      propertyKey,
      returnTypeFunc,
      // @ts-ignore
      typeOptions: option,
    });

    getMetadataStorage().collectClassFieldMetadata({
      name: propertyKey,
      fieldType: option?.type ?? propertyKey,
      getType,
      typeOptions: null,
      target: prototype.constructor,
      objectType: prototype.constructor.name,
      methodName: propertyKey,
    });
  };
}

interface FilterableOption {
  type: ClassType | any;
  isEnum: boolean;
}
