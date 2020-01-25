import { RemoteGraphQLDataSource } from '@apollo/gateway';

const unSafeHeaders = [
  'accept-encoding',
  'accept-language',
  'accept',
  'content-length',
  'connection',
  'host',
  'origin',
];

export class HeadersDatasource extends RemoteGraphQLDataSource {
  willSendRequest({ request, context }) {

    if (context.req) {
      if (context.req.headers) {
        const ctxHeaders = context.req.headers;

        for (const key in ctxHeaders) {
          if (ctxHeaders.hasOwnProperty(key) && unSafeHeaders.indexOf(key) === -1) {
            request.http.headers.set(key, ctxHeaders[key]);
          }
        }
      }

      if (context.req.tenantInfo) {
        request.tenantInfo = context.req.tenantInfo;
        request.http.headers.set('x-tenant-info', JSON.stringify(context.req.tenantInfo));
      }
    }
  }

  async didReceiveResponse(response, request, context) {
    const body = await super.didReceiveResponse(response, request, context);

    if (context.res) {
      if (response.headers.get('set-cookie') !== null && response.headers.get('set-cookie') !== undefined) {
        context.res.cookie(response.headers.get('set-cookie'));
      }
    }
    return body;
  }
}
