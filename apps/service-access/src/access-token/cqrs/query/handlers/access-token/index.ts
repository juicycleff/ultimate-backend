import { HasRightsHandler } from './has-rights.handler';
import { ReadAccessHandler } from './read-access.handler';
import { FindAccessHandler } from './find-access.handler';

export const AccessTokenQueryHandlers = [
  HasRightsHandler,
  ReadAccessHandler,
  FindAccessHandler,
];
