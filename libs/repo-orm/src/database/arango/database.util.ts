import { ARANGO_DEFAULT_DATABASE_CONNECTION_NAME } from '../../constants';

/**
 * Get a token for the Map object for the given container name
 * @param containerName The unique name for the container
 */
export function getArangoContainerToken(
  containerName: string = ARANGO_DEFAULT_DATABASE_CONNECTION_NAME,
) {
  return `${containerName}Container`;
}

/**
 * Get a token for the database object for the given connection name
 * @param containerName The unique name for the container
 */
export function getArangoClientToken(
  containerName: string = ARANGO_DEFAULT_DATABASE_CONNECTION_NAME,
) {
  return `${containerName}Client`;
}

/**
 * Get a token for the Db object for the given connection name
 * @param containerName The unique name for the container
 */
export function getArangoDbToken(
  containerName: string = ARANGO_DEFAULT_DATABASE_CONNECTION_NAME,
) {
  return `${containerName}Db`;
}
