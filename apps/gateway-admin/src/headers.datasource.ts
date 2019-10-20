import { RemoteGraphQLDataSource } from '@apollo/gateway';

export class HeadersDatasource extends RemoteGraphQLDataSource {
  willSendRequest({ request, context }) {

    if (context.req && context.req.headers) {
      const ctxHeaders = context.req.headers;

      for (const key in ctxHeaders) {
        if (ctxHeaders.hasOwnProperty(key)) {
          request.http.headers.set(key, ctxHeaders[key]);
        }
      }
    }
  }
}
