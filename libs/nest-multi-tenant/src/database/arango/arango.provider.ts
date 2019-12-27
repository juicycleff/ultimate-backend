import { Database } from 'arangojs';
import { getCollectionToken, getDbToken } from '@juicycleff/nest-multi-tenant/utils';

export function createArangoProviders(connectionName?: string, collections: string[] = []) {
  return (collections || []).map(collectionName => ({
    provide: getCollectionToken(collectionName),
    useFactory: (db: Database) => db.collection(collectionName),
    inject: [getDbToken(connectionName)],
  }));
}

export function createArangoEdgeProviders(connectionName?: string, collections: string[] = []) {
  return (collections || []).map(collectionName => ({
    provide: getCollectionToken(collectionName),
    useFactory: (db: Database) => db.edgeCollection(collectionName),
    inject: [getDbToken(connectionName)],
  }));
}
