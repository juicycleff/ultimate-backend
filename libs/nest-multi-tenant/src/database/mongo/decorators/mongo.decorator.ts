import { Inject } from '@nestjs/common';
import { getClientToken, getDbToken, getCollectionToken, getReactiveClientToken } from '../mongo.util';

/**
 * Inject the MongoClient object associated with a connection
 * @param connectionName The unique name associated with the connection
 */
export const InjectClient = (connectionName?: string) => Inject(getClientToken(connectionName));

/**
 * Inject the MongoClient object associated with a connection
 * @param connectionName The unique name associated with the connection
 */
export const InjectReactiveClient = (connectionName?: string) => Inject(getReactiveClientToken(connectionName));

/**
 * Inject the Mongo Db object associated with a connection
 * @param connectionName The unique name associated with the connection
 */
export const InjectDb = (connectionName?: string) => Inject(getDbToken(connectionName));

/**
 * Inject the Mongo Collection object associated with a Db
 * @param collectionName The unique name associated with the collection
 */
export const InjectCollection = (collectionName: string) =>
  Inject(getCollectionToken(collectionName));
