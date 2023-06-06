import * as requestContext from 'request-context';

export const contextMiddleware = requestContext.middleware('request');
