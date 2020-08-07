import { GraphQLScalarType } from 'graphql';
import { ValidatorOptions } from 'class-validator';

import { ClassType, TypeResolver } from './interfaces';

export interface RecursiveArray<TValue>
  extends Array<RecursiveArray<TValue> | TValue> {}

// tslint:disable-next-line:ban-types
export type TypeValue =
  | ClassType
  | GraphQLScalarType
  | Function
  | object
  | symbol;
export type ReturnTypeFuncValue = TypeValue | RecursiveArray<TypeValue>;

export type TypeValueThunk = (type?: void) => TypeValue;
export type ClassTypeResolver = (of?: void) => ClassType;

export type ReturnTypeFunc = (returns?: void) => ReturnTypeFuncValue;

export interface DecoratorTypeOptions {
  nullable?: boolean | NullableListOptions;
  defaultValue?: any;
}

export type NullableListOptions = 'items' | 'itemsAndList';

export interface TypeOptions extends DecoratorTypeOptions {
  array?: boolean;
  arrayDepth?: number;
}
export interface DescriptionOptions {
  description?: string;
}

export interface ValidateOptions {
  validate?: boolean | ValidatorOptions;
}

export interface SchemaNameOptions {
  name?: string;
}
export interface AbstractClassOptions {
  isAbstract?: boolean;
}
export interface ResolveTypeOptions<TSource = any, TContext = any> {
  resolveType?: TypeResolver<TSource, TContext>;
}

export interface EnumConfig {
  name: string;
  description?: string;
}

export type MethodAndPropDecorator = PropertyDecorator & MethodDecorator;
