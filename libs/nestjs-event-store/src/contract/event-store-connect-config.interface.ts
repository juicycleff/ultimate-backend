export interface IEventStoreConnectConfig {
  tcp: {
    hostname: string;
    port: number;
    protocol?: string;
    gossipSeeds?: IGosipConfig[];
    credentials?: {
      username?: string,
      password?: string,
    };
    poolOptions?: {
      min?: number;
      max?: number;
    };
  };
  http: {
    protocol?: string;
    port?: number;
  };
}

interface IGosipConfig {
  hostname: string;
  port: number;
}
