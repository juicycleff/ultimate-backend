/* tslint:disable */
import { ENTITY_KEY, EntityOptions } from '../interfaces';

/**
 * This decorator is used to mark classes that will be an entities (table or document depend on database type).
 * Database schema will be created for all classes decorated with it, and Repository can be retrieved and used for it.
 */
export function Entity(options?: EntityOptions): Function;

/**
 * This decorator is used to mark classes that will be an entities (table or document depend on database type).
 * Database schema will be created for all classes decorated with it, and Repository can be retrieved and used for it.
 */
export function Entity(name?: string, options?: EntityOptions): Function;

/**
 * This decorator is used to mark classes that will be an entities (table or document depend on database type).
 * Database schema will be created for all classes decorated with it, and Repository can be retrieved and used for it.
 */
export function Entity(
  nameOrOptions?: string | EntityOptions,
  maybeOptions?: EntityOptions,
): Function {
  const options =
    (typeof nameOrOptions === 'object'
      ? (nameOrOptions as EntityOptions)
      : maybeOptions) || {};
  const name = typeof nameOrOptions === 'string' ? nameOrOptions : options.name;

  return function (target: Function) {
    const metadataValue = {
      target,
      name,
      type: 'regular',
      database: options.database ? options.database : undefined,
    };
    Reflect.defineMetadata(ENTITY_KEY, metadataValue, target);
  };
}
