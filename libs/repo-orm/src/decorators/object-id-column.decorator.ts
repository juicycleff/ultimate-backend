/* tslint:disable */
import { COLUMN_KEY, ColumnOptions } from '../interfaces';

/**
 * Special type of column that is available only for MongoDB database.
 * Marks your entities's column to be an object id.
 */

export function ObjectIdColumn(options?: ColumnOptions): Function {
  return function (object: Object, propertyName: string) {
    // if column options are not given then create a new empty options
    if (!options) {
      options = {} as ColumnOptions;
    }
    options.primary = true;
    if (!options.name) {
      options.name = '_id';
    }

    // create and register a new column metadata
    const metadataValue = {
      target: object.constructor,
      propertyName,
      mode: 'objectId',
      options,
    };
    Reflect.defineMetadata(COLUMN_KEY, metadataValue, object.constructor);
  };
}
