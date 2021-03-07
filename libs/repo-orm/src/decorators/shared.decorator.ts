import { Inject } from '@nestjs/common';
import {
  getClientToken,
  getDbToken,
  getCollectionToken,
  getReactiveClientToken,
  getCurrentTenantToken,
  getEdgeCollectionToken,
} from '../utils';
import { getArangoDbToken } from '@juicycleff/repo-orm/database/arango/database.util';

/**
 * Inject the MongoClient object associated with a connection
 * @param connectionName The unique name associated with the connection
 */
export const InjectClient = (connectionName?: string) =>
  Inject(getClientToken(connectionName));

/**
 * Inject the MongoClient object associated with a connection
 * @param connectionName The unique name associated with the connection
 */
export const InjectReactiveClient = (connectionName?: string) =>
  Inject(getReactiveClientToken(connectionName));

/**
 * Inject the current tenant name associated with a connection
 * @param connectionName The unique name associated with the connection
 */
export const InjectCurrentTenant = (connectionName?: string) =>
  Inject(getCurrentTenantToken(connectionName));

/**
 * Inject the Db object associated with a connection
 * @param connectionName The unique name associated with the connection
 */
export const InjectMongoDb = (connectionName?: string) =>
  Inject(getDbToken(connectionName));
/**
 * Inject the Db object associated with a connection
 * @param connectionName The unique name associated with the connection
 */
export const InjectArangoDb = (connectionName?: string) =>
  Inject(getArangoDbToken(connectionName));

/**
 * Inject the DB Collection object associated with a Db
 * @param collectionName The unique name associated with the collection
 */
export const InjectCollection = (collectionName: string) =>
  Inject(getCollectionToken(collectionName));

/**
 * Inject the Arango Edge Collection object associated with a Db
 * @param collectionName The unique name associated with the collection
 */
export const InjectEdgeCollection = (collectionName: string) =>
  Inject(getEdgeCollectionToken(collectionName));
