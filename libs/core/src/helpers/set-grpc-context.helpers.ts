import { Metadata } from 'grpc';
import { GqlContext } from '../';
import { UserEntity } from '@ultimatebackend/repository';

export function setRpcContext(ctx: GqlContext, inApp?: boolean): Metadata {
  const meta = new Metadata();
  meta.set('headers', JSON.stringify(ctx.req.headers));

  if (ctx.isAuthenticated) {
    meta.set('user', JSON.stringify(ctx.getUser()));
  }

  if (inApp) {
    meta.set('inApp', inApp.toString());
  }
  return meta;
}

export function getIdentityFromCtx(meta: Metadata): {user: UserEntity, tenant: any, inApp} {
  const gmap = meta.getMap();
  const tempUser = gmap.user;
  const tempInApp = gmap.inApp;

  let user: UserEntity = null;
  let inApp = false;
  if (tempUser && typeof tempUser === 'string') {
    user = JSON.parse(tempUser);
  }

  if (tempInApp && typeof tempInApp === 'string') {
    inApp = Boolean(inApp);
  }

  return {
    user,
    tenant: null,
    inApp,
  };
}
