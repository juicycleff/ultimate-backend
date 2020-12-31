import { Endpoint, ServiceNode } from '../../interfaces';

export interface MemoryRecord {
  name: string;
  version: string;
  metadata: Map<string, string>;
  nodes: Map<string, ServiceNode>;
  endpoints: Array<Endpoint>;
}

export interface MemoryRegistry {
  name: string;
  version: string;
  metadata: Map<string, string>;
  nodes: Map<string, ServiceNode>;
  endpoints: Array<Endpoint>;
}

export class MemoryNode extends ServiceNode {
  ttl?: Date;
  lastSeen?: Date;
}

// services is a KV map with service name as the key and a map of records as the value
export type Services = Map<string, Map<string, MemoryRecord>>;
