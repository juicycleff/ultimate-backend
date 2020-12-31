import { Endpoint, Service, ServiceNode, Value } from '../../interfaces';
import { MemoryNode, MemoryRecord } from './types.interface';

export function serviceToRecord(s: Service, ttl: Date | number): MemoryRecord {
  const metadata = s.metadata;

  const nodes = new Map<string, MemoryNode>();
  for (const n of s.nodes) {
    nodes[n.id] = {
      ...n,
      ttl,
      lastSeen: new Date(),
    };
  }

  const endpoints: Array<Endpoint> = [];

  for (let i = 0; i < s.endpoints.length; i++) {
    endpoints[i] = s.endpoints[i];
  }

  return {
    version: s.version,
    endpoints,
    metadata,
    name: s.name,
    nodes: nodes,
  }
}

export function recordToService(r: MemoryRecord, domain: string): Service {
  let metadata = new Map<string, string>();
  if (r.metadata) {
    metadata = r.metadata;
  }

  // set the domain in metadata so it can be determined when a wildcard query is performed
  metadata["domain"] = domain
  const endpoints: Array<Endpoint> = [];

  for (let i = 0; i < r.endpoints.length; i++) {
    const e = r.endpoints[i];
    let request = new Value();
    if (e.request) {
      request = e.request
    }

    let response = new Value();
    if (e.response) {
      response = e.response;
    }

    endpoints[i] = {
      metadata: e.metadata,
      name: e.name,
      request,
      response,
    }
  }

  const nodes: Array<ServiceNode> = [];
  for (let i = 0; i < r.endpoints.length; i++) {
    const n = r.nodes[i];
    nodes[i] = {
      address: n.Address,
      id: n.Id,
      metadata: n.Metadata,
    }
  }

  return {
    endpoints,
    metadata,
    name: r.name,
    nodes,
    version: r.version,
  }
}
