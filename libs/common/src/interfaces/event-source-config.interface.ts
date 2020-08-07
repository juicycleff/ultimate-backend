export interface IEventSourceConfig {
  hostname: string;
  port: number;
  protocol?: string;
  gossipSeeds?: IGosipConfig[];
  credentials?: {
    username?: string;
    password?: string;
  };
  poolOptions?: {
    min?: number;
    max?: number;
  };
}

interface IGosipConfig {
  hostname: string;
  port: number;
}
