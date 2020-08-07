/* tslint:disable:ban-types */
import { TypeOptions } from 'class-transformer';
import { TypeValueThunk } from '../metadata/storage';
import { ReturnTypeFunc } from '@ultimatebackend/contracts/helpers';

export type MetadataKey =
  | 'design:type'
  | 'design:paramtypes'
  | 'design:returntype';
export const allowedTypes: Function[] = [String, Number, Date, Boolean];
export const bannedTypes: Function[] = [Promise, Array, Object, Function];

export interface TypeInfo {
  getType: TypeValueThunk;
  typeOptions: TypeOptions;
}

export interface GetTypeParams {
  metadataKey: MetadataKey;
  prototype: Object;
  propertyKey: string;
  typeOptions?: TypeOptions;
  returnTypeFunc?: ReturnTypeFunc;
  parameterIndex?: number;
}
export function findType({
  metadataKey,
  prototype,
  propertyKey,
  typeOptions = {},
  parameterIndex,
  returnTypeFunc,
}: GetTypeParams): TypeInfo {
  const options: TypeOptions = { ...typeOptions };
  let metadataDesignType: Function | undefined;
  // @ts-ignore
  const reflectedType: Function[] | Function | undefined = Reflect.getMetadata(
    metadataKey,
    prototype,
    propertyKey,
  );
  if (metadataKey === 'design:paramtypes') {
    metadataDesignType = (reflectedType as Function[])[parameterIndex!];
  } else {
    metadataDesignType = reflectedType as Function | undefined;
  }

  if (
    !returnTypeFunc &&
    (!metadataDesignType ||
      (metadataDesignType && bannedTypes.includes(metadataDesignType)))
  ) {
    // throw new NoExplicitTypeError(prototype.constructor.name, propertyKey, parameterIndex);
  }

  if (metadataDesignType) {
    return {
      getType: () => metadataDesignType!,
      typeOptions: options,
    };
  } else {
    throw new CannotDetermineTypeError(
      prototype.constructor.name,
      propertyKey,
      parameterIndex,
    );
  }
}

export class CannotDetermineTypeError extends Error {
  constructor(typeName: string, propertyKey: string, parameterIndex?: number) {
    let errorMessage = `Cannot determine type for ${typeName}#${propertyKey} `;
    if (parameterIndex !== undefined) {
      errorMessage += `parameter #${parameterIndex} `;
    }
    errorMessage += '!';
    super(errorMessage);

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
