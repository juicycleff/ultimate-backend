import { Database } from 'arangojs';
import { getArangoDbToken } from './database.util';
import { getCollectionToken } from '@juicycleff/nest-multi-tenant/utils';

export function createArangoProviders(connectionName?: string, collections: string[] = []) {
  return (collections || []).map(collectionName => ({
    provide: getCollectionToken(collectionName),
    useFactory: (db: Database) => db.collection(collectionName),
    inject: [getArangoDbToken(connectionName)],
  }));
}

export function createArangoEdgeProviders(connectionName?: string, collections: string[] = []) {
  return (collections || []).map(collectionName => ({
    provide: getCollectionToken(collectionName),
    useFactory: (db: Database) => db.edgeCollection(collectionName),
    inject: [getArangoDbToken(connectionName)],
  }));
}
