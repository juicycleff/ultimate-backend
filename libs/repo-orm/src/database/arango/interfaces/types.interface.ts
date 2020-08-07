import { CollectionProps, EntityProps } from '../../../interfaces';
import { Database } from 'arangojs';
import { LoadBalancingStrategy } from 'arangojs/lib/async/connection';

export interface ArangoCollectionProps extends CollectionProps {
  indexes?: ArangoIndexDefinition[];
  edgeType?: boolean;
  overwrite?: boolean;
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

export type ArangoIndexDefinition =
  | {
      type: 'hash';
      fields: string[];
      opts: {
        name?: string;
        unique: boolean;
        sparse?: boolean;
        deduplicate?: boolean;
      };
    }
  | {
      type: 'geo';
      fields: string[];
      opts: {
        name?: string;
        geoJson?: boolean;
      };
    }
  | {
      type: 'skiplist';
      fields: string[];
      opts: {
        unique: boolean;
        name?: string;
        sparse?: boolean;
        deduplicate?: boolean;
      };
    }
  | {
      type: 'persistent';
      opts: {
        name?: string;
        unique: boolean;
        sparse?: boolean;
      };
      fields: string[];
    }
  | {
      type: 'ttl';
      expireAfter: number;
      fields: string[];
      opts: {
        name?: string;
      };
    }
  | {
      type: 'fulltext';
      minLength?: number;
      fields: string[];
      opts: {
        name?: string;
      };
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
