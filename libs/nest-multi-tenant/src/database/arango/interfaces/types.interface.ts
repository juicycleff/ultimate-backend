import { CollectionProps, EntityProps } from '@juicycleff/nest-multi-tenant/interfaces';
import { Database } from 'arangojs';
import { LoadBalancingStrategy } from 'arangojs/lib/async/connection';

export interface ArangoCollectionProps extends CollectionProps {
  indexes?: ArangoIndexDefinition[];
}

export interface ArangoEntityProps extends EntityProps {
  indexes?: ArangoIndexDefinition[];
}

export interface ArangoDocument {
  // id?: string | ObjectID;
  [key: string]: any;
}

export interface ArangoDBSource {
  db: Promise<Database> | Database;
}

export type ArangoIndexDefinition = {
  type: 'hash',
  unique: boolean,
  sparse?: boolean,
  deduplicate?: boolean,
  fields: string[],
} | {
  type: 'geo',
  fields: string[],
} | {
  type: 'skiplist',
  unique: boolean,
  sparse?: boolean,
  deduplicate?: boolean,
  fields: string[],
} | {
  type: 'persistent',
  unique: boolean,
  sparse?: boolean,
  fields: string[],
} | {
  type: 'ttl',
  expireAfter: number,
  fields: string[],
} | {
  type: 'fulltext',
  minLength?: number,
  fields: string[],
};

export interface ArangoClientOption {
  url: string | string[];
  username: string;
  password: string;
  isAbsolute?: boolean;
  arangoVersion?: number;
  loadBalancingStrategy?: LoadBalancingStrategy;
  maxRetries?: false | number;
  agent?: any;
  agentOptions?: {
    [key: string]: any;
  };
  headers?: {
    [key: string]: string;
  };
}
