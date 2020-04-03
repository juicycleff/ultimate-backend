import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { AccessTokenRpcClientService, RolesRpcClientService } from '../services';
import { IResource } from '../interfaces';
import { RESOURCE_DEFINITION } from '../decorators';

/**
 * Create new GqlAuthGuard
 * @class
 * @description Auth guard for only logged in user based on session authentication
 * @implements {CanActivate}
 */
@Injectable()
export class GqlAuthGuard  implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    public readonly access: AccessTokenRpcClientService,
    public readonly role: RolesRpcClientService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();
    const resource = this.reflector.get<IResource>(RESOURCE_DEFINITION, context.getHandler());

    if (ctx.isAuthenticated() && ctx.getUser() && resource !== null) {
      const user = ctx.getUser();
      const tenantInfo = ctx.req.tenantInfo;

      const curTenant = tenantInfo?.tenantId || '*';
      const resp = await this.role.roleService.hasRights({
        act: resource.action, auth: 'user', dom: curTenant, res: resource.identify, sub: user.id,
      }).toPromise();

      return resp.access;
    } else if (ctx.req.tenantInfo && resource !== null && resource.supportsToken) {
      const tenantInfo = ctx.req.tenantInfo;
      const resp = await this.access.accessToken.hasRights({
        tenantId: tenantInfo?.tenantId, scope: `${resource.action}_${resource.identify}`, token: tenantInfo?.accessToken?.key,
      }).toPromise();

      return resp.access;
    }

    return ctx.isAuthenticated();
  }
}
