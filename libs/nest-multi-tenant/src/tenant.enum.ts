export enum TenantResolverType {
  Domain,
  QueryString,
  Cookie,
  Header,
  Query,
}

export enum TenantDatabaseStrategy {
  DataIsolation,
  DatabaseIsolation,
  Both,
}
