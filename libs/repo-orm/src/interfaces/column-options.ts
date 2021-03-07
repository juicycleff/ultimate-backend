/**
 * Describes all column's options.
 */
export interface ColumnOptions extends ColumnCommonOptions {
  /**
   * Column type. Must be one of the value from the ColumnTypes class.
   */
  type?: any;

  /**
   * Column name in the database.
   */
  name?: string;

  /**
   * Column type's length. Used only on some column types.
   * For example type = "string" and length = "100" means that ORM will create a column with type varchar(100).
   */
  length?: string | number;

  /**
   * Indicates if column's value can be set to NULL.
   */
  nullable?: boolean;

  /**
   * Default database value.
   */
  default?: any;

  /**
   * Specifies if column's value must be unique or not.
   */
  unique?: boolean;

  /**
   * Array of possible enumerated values.
   */
  // tslint:disable-next-line:ban-types
  enum?: Array<string | number> | Object;

  /**
   * Indicates if this column is an array.
   * Can be simply set to true or array length can be specified.
   * Supported only by postgres.
   */
  array?: boolean;

  /**
   * Spatial Feature Type (Geometry, Point, Polygon, etc.)
   */
  spatialFeatureType?: string;
}

/**
 * Column options specific to all column types.
 */
export interface ColumnCommonOptions {
  /**
   * Indicates if column is always selected by QueryBuilder and find operations.
   * Default value is "true".
   */
  select?: boolean;

  /**
   * Column name in the database.
   */
  name?: string;

  /**
   * Indicates if this column is a primary key.
   * Same can be achieved when @PrimaryColumn decorator is used.
   */
  primary?: boolean;

  /**
   * Specifies if this column will use auto increment (sequence, generated identity).
   * Note that in some databases only one column in entities can be marked as generated, and it must be a primary column.
   */
  generated?: boolean | 'increment' | 'uuid';

  /**
   * Specifies if column's value must be unique or not.
   */
  unique?: boolean;

  /**
   * Indicates if column's value can be set to NULL.
   */
  nullable?: boolean;

  /**
   * Default database value.
   * Note that default value is not supported when column type is 'json' of mysql.
   */
  default?: any;
}
