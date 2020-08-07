import { Db, ObjectID, MongoClient, IndexOptions } from 'mongodb';
import {
  CollectionProps,
  EntityProps,
  IndexDefinition,
} from '../../../interfaces';

export interface MongoCollectionProps extends CollectionProps {
  indexes?: MongoIndexDefinition[];
}

export interface MongoEntityProps extends EntityProps {
  indexes?: MongoIndexDefinition[];
}

export interface MongoIndexDefinition extends IndexDefinition {
  // index options
  options?: IndexOptions;
}

export interface Document {
  id?: string | ObjectID;
  [key: string]: any;
}

export interface MongoDBSource {
  client: Promise<MongoClient> | MongoClient;
  db: Promise<Db> | Db;
}
