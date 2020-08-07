import { Database } from 'arangojs';
import { getCollectionToken } from '../../utils';
import { getArangoDbToken } from './database.util';

export function createArangoProviders(
  connectionName?: string,
  collections: string[] = [],
) {
  return (collections || []).map((collectionName) => ({
    provide: getCollectionToken(collectionName),
    useFactory: (db: Database) => db.collection(collectionName),
    inject: [getArangoDbToken(connectionName)],
  }));
}

export function createArangoEdgeProviders(
  connectionName?: string,
  collections: string[] = [],
) {
  return (collections || []).map((collectionName) => ({
    provide: getCollectionToken(collectionName),
    useFactory: (db: Database) => db.edgeCollection(collectionName),
    inject: [getArangoDbToken(connectionName)],
  }));
}
