/**
 * Describes all entity's options.
 */
export interface EntityOptions {
  /**
   * Collection name.
   * If not specified then naming strategy will generate collection name from entity name.
   */
  name?: string;

  /**
   * Database name. Default root db for multi tenancy.
   */
  database?: string;
}
