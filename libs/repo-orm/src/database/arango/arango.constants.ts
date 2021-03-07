import { ArangoClientOption } from './interfaces';

export const ARANGO_MODULE_OPTIONS = 'ArangoModuleOptions';

export const DEFAULT_ARANGO_DATABASE_OPTIONS: Partial<ArangoClientOption> = {
  loadBalancingStrategy: 'ROUND_ROBIN',
};

export const ARANGO_DEFAULTS = {
  DATABASE: '_system',
  URL: 'http://localhost:8529',
  USERNAME: 'root',
  PASSWORD: '',
};
