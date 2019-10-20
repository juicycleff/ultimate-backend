export enum TenantResolverType {
  Domain,
  QueryString,
  Cookie,
  Header,
}

export enum TenantDatabaseStrategy {
  DataIsolation,
  DatabaseIsolation,
  Both,
}
