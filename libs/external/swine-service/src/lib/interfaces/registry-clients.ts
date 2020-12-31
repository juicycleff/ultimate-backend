/**
 * Supported service registry clients
 */
export enum RegistryClients {
  Memory,
  Consul,
  Etcd,
  Kubernetes,
}

export enum RegistryEventType {
  // Create is emitted when a new service is registered
  Create,
  // Delete is emitted when an existing service is deregistered
  Delete,
  // Update is emitted when an existing service is updated
  Update,
}
