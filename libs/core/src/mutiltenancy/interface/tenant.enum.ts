export enum TenantResolverType {
  Domain,
  Cookie,
  Header,
  Query,
}

export enum TenantDatabaseStrategy {
  DataIsolation,
  DatabaseIsolation,
  Both,
}
