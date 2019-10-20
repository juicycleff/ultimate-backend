import { MongoClientOptions } from 'mongodb';

export const MONGO_CONNECTIONS_CONTAINER = 'MongoConnectionsContainer';
export const MONGO_CONTAINER_NAME = 'MongoContainerName';
export const MONGO_CONNECTION_NAME = 'MongoConnectionName';
export const MONGO_MODULE_OPTIONS = 'MongoModuleOptions';

export const DEFAULT_MONGO_CONTAINER_NAME = 'DefaultMongo';
export const DEFAULT_MONGO_CONNECTION_NAME = 'DefaultMongo';
export const DEFAULT_MONGO_CLIENT_OPTIONS: MongoClientOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
