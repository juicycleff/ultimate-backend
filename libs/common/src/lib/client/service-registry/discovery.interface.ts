export interface SharedHealthCheckOptions {
  serviceId?: string;
  serviceName?: string;
  interval?: number | undefined;
  failFast?: boolean;
  scheme?: string,
}

export interface ScriptDiscoveryOptions extends SharedHealthCheckOptions {
  type: 'script';
  args: string[];
  timeout?: number | undefined;
  script?: string;
}

export interface HTTPDiscoveryOptions extends SharedHealthCheckOptions {
  type: 'http';
  timeout?: number | undefined;
  body?: string;
  header?: Map<string, any>;
  http: string;
  skipVerifyTLS?: boolean;
  method?: 'POST' | 'GET' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD' | 'PUT';
}

export interface TCPDiscoveryOptions extends SharedHealthCheckOptions {
  type: 'tcp';
  timeout?: string | number | undefined;
  tcp: string;
}

export interface DockerDiscoveryOptions extends SharedHealthCheckOptions {
  type: 'docker';
  timeout?: number | undefined;
  shell: string;
  args: string[];
  dockerContainerId: string;
}

export interface GRPCDiscoveryOptions extends SharedHealthCheckOptions {
  type: 'grpc';
  grpc: string;
  useTLS: boolean;
}

export interface TTLDiscoveryOptions extends SharedHealthCheckOptions {
  type: 'ttl';
  ttl?: string | number;
}

export interface AliasServiceDiscoveryOptions extends SharedHealthCheckOptions {
  type: 'alias';
  aliasService: string;
  aliasNode?: string;
}

export type DiscoveryOptions =
  | AliasServiceDiscoveryOptions
  | GRPCDiscoveryOptions
  | TTLDiscoveryOptions
  | DockerDiscoveryOptions
  | TCPDiscoveryOptions
  | HTTPDiscoveryOptions
  | ScriptDiscoveryOptions;
