import { RemoteGraphQLDataSource } from '@apollo/gateway';
import * as setCookie from 'set-cookie-parser';

export class HeadersDatasource extends RemoteGraphQLDataSource {
  willSendRequest({ request, context }) {

    if (context.req) {
      if (context.req.headers) {
        const ctxHeaders = context.req.headers;

        for (const key in ctxHeaders) {
          if (ctxHeaders.hasOwnProperty(key)) {
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
      const cookies = setCookie.parse(response.headers.get('Set-Cookie'), {
        decodeValues: false,
        map: true,
      });
      context.res.cookie('session.app', cookies['session.app']);
    }
    return body;
  }
}
