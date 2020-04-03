export interface ConsulServiceConfig {
  app: ConsulAppConfig;
  database: ConsulDatabaseConfig;
}

export interface ConsulAppConfig {
  port: number;
  grpcPort: number;
}

export interface ConsulDatabaseConfig {
  mongodb: ConsulMongodbConfig;
  eventstore: ConsulEventstoreConfig;
  redis: ConsulRedisConfig;
}

export interface ConsulMongodbConfig {
  uri: string;
  name: string;
  options: string;
}

export interface ConsulEventstoreConfig {
  poolMax: any;
  poolMin: any;
  streamProtocol: string;
  hostname: string;
  httpPort: number;
  httpPotocol: string;
  tcpPassword: string;
  tcpUsername: string;
  tcpPort: number;
  tcpProtocol: string;
}

export interface ConsulRedisConfig {
  host: string;
  port: string;
  password: string;
}
