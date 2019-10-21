import { Db, ObjectID, MongoClient, IndexOptions } from 'mongodb';

export const COLLECTION_KEY = 'collection';
export const ENTITY_KEY = 'entity';
export const COLUMN_KEY = 'column';
export const PRE_KEY = 'pre';
export const POST_KEY = 'post';

export interface UpdateByIdRequest {
  updates: any;
  upsert?: boolean;
}

export interface UpdateRequest extends UpdateByIdRequest {
  conditions: any;
}

export interface FindRequest {
  conditions: any;
  limit?: number;
  projection?: any;
  sort?: any;
  skip?: number;
}

export interface CollectionProps {
  name: string;
  capped?: boolean;
  size?: number;
  max?: number;
  supportTenant?: boolean;
  indexes?: IndexDefinition[];
}

export interface IndexDefinition {
  // The fields to index on
  fields: { [fieldName: string]: string | any };

  // index options
  options?: IndexOptions;

  // overwrite the index if it exists and isn't the same
  overwrite?: boolean;
}

export interface Document {
  id?: string | ObjectID;
  [key: string]: any;
}

export interface DBSource {
  client: Promise<MongoClient> | MongoClient;
  db: Promise<Db> | Db;
}
