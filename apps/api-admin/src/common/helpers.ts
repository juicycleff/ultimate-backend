import { Response } from 'express';

type MiddlewareFns = (
  req: any['upgradeReq'],
  res: Response,
  resolve: (r: { req: WebSocket }) => unknown,
) => void;
interface ReturnOnConnect {
  req: any['upgradeReq'];
}

export const getWebsocketAuth = (
  middlewares: MiddlewareFns[],
  webSocket: any,
  resolve: (value: ReturnOnConnect | PromiseLike<ReturnOnConnect>) => void,
) => {
  if (middlewares.length === 0) {
    const { upgradeReq } = webSocket;
    resolve({ req: upgradeReq });
  } else {
    const nextMiddleware = middlewares[0];
    const remainingMiddlewares = middlewares.slice(1);
    const response = {} as Response;
    nextMiddleware(webSocket.upgradeReq, response, () =>
      getWebsocketAuth(remainingMiddlewares, webSocket, resolve),
    );
  }
};
