import { DEFAULT_DATABASE_CONNECTION_NAME } from '../constants';

/**
 * Get a token for the Map object for the given container name
 * @param containerName The unique name for the container
 */
export function getContainerToken(
  containerName: string = DEFAULT_DATABASE_CONNECTION_NAME,
) {
  return `${containerName}Container`;
}

/**
 * Get a token for the Map object for the given container name
 * @param containerName The unique name for the container
 */
export function getContainerTenantConfig(
  containerName: string = DEFAULT_DATABASE_CONNECTION_NAME,
) {
  return `${containerName}TenantConfig`;
}

/**
 * Get a token for the database object for the given connection name
 * @param containerName The unique name for the container
 */
export function getClientToken(
  containerName: string = DEFAULT_DATABASE_CONNECTION_NAME,
) {
  return `${containerName}Client`;
}

/**
 * Get a token for the MongoClient object for the given connection name
 * @param containerName The unique name for the container
 */
export function getReactiveClientToken(
  containerName: string = DEFAULT_DATABASE_CONNECTION_NAME,
) {
  return `${containerName}ReactiveClient`;
}

/**
 * @description Get a token for the current tenant name for the given connection name
 * @param containerName The unique name for the container
 */
export function getCurrentTenantToken(
  containerName: string = DEFAULT_DATABASE_CONNECTION_NAME,
) {
  return `${containerName}CurrentTenant`;
}

/**
 * Get a token for the Db object for the given connection name
 * @param containerName The unique name for the container
 */
export function getDbToken(
  containerName: string = DEFAULT_DATABASE_CONNECTION_NAME,
) {
  return `${containerName}Db`;
}

/**
 * Get a token for the Db object for the given connection name
 * @param containerName The unique name for the container
 */
export function getCollectionToken(containerName: string) {
  return `${containerName}Collection`;
}

/**
 * Get a token for the Db object for the given connection name
 * @param containerName The unique name for the container
 */
export function getEdgeCollectionToken(containerName: string) {
  return `${containerName}EdgeCollection`;
}
