import { DEFAULT_MONGO_CONTAINER_NAME } from './mongo.constants';

/**
 * Get a token for the Map object for the given container name
 * @param containerName The unique name for the container
 */
export function getContainerToken(containerName: string = DEFAULT_MONGO_CONTAINER_NAME) {
  return `${containerName}Container`;
}

/**
 * Get a token for the MongoClient object for the given connection name
 * @param containerName The unique name for the container
 */
export function getClientToken(containerName: string = DEFAULT_MONGO_CONTAINER_NAME) {
  return `${containerName}Client`;
}

/**
 * Get a token for the MongoClient object for the given connection name
 * @param containerName The unique name for the container
 */
export function getReactiveClientToken(containerName: string = DEFAULT_MONGO_CONTAINER_NAME) {
  return `${containerName}ReactiveClient`;
}

/**
 * Get a token for the Mongo Db object for the given connection name
 * @param containerName The unique name for the container
 */
export function getDbToken(containerName: string = DEFAULT_MONGO_CONTAINER_NAME) {
  return `${containerName}Db`;
}

/**
 * Get a token for the Mongo Db object for the given connection name
 * @param containerName The unique name for the container
 */
export function getCollectionToken(containerName: string) {
  return `${containerName}Collection`;
}
