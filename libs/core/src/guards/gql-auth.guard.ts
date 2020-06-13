import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { AccessTokenRpcClientService, RolesRpcClientService, TenantsRpcClientService } from '../services';
import { IResource } from '../interfaces';
import { RESOURCE_DEFINITION } from '../decorators';
import { UnauthorizedError } from '@ultimatebackend/common';
import { Metadata } from 'grpc';

/**
 * Create new GqlAuthGuard
 * @class
 * @description Auth guard for only logged in user based on session authentication
 * @implements {CanActivate}
 */
@Injectable()
export class GqlAuthGuard  implements CanActivate {
  logger = new Logger(this.constructor.name);
  tenantCache = new Map<string, object>();

  constructor(
    private readonly reflector: Reflector,
    public readonly access: AccessTokenRpcClientService,
    private readonly tenantSvc: TenantsRpcClientService,
    public readonly role: RolesRpcClientService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();
    const { req, connection } = ctx;
    const resource = this.reflector.get<IResource>(RESOURCE_DEFINITION, context.getHandler());

    try {
      if (connection?.context) {
        const tenantId = connection?.context?.req?.headers['x-tenant-id'];
        const tenantKey = connection?.context?.req?.headers['x-tenant-key'];

        if (connection?.context?.user && resource) {
          const user = connection?.context?.user;

          const curTenant = tenantId || '*';
          const resp = await this.role.roleService.hasRights({
            act: resource.action, auth: 'user', dom: curTenant, res: resource.identify, sub: user.id,
          }).toPromise();

          if (resp.access === false) {
            throw new UnauthorizedError('Not authorized to read tenant');
          }

          return resp.access;
        } else if (tenantId && tenantKey && resource && resource.supportsToken) {
          const resp = await this.access.accessToken.hasRights({
            tenantId, scope: `${resource.action}_${resource.identify}`, token: tenantKey,
          }).toPromise();
          if (resp.access === false) {
            throw new UnauthorizedError('Not authorized to read tenant');
          }

          return resp.access;
        }
        return !!connection?.context?.user;
      } else {
        // http
        if (ctx.isAuthenticated() && ctx.getUser() && resource) {
          const user = ctx.getUser();
          const tenantInfo = req.tenantInfo;

          const curTenant = tenantInfo?.tenantId || '*';

          // await this.canAccessTenant(curTenant, user, req);

          const resp = await this.role.roleService.hasRights({
            act: resource.action, auth: 'user', dom: curTenant, res: resource.identify, sub: user.id,
          }).toPromise();

          return resp.access;
        } else if (req.tenantInfo && resource && resource.supportsToken) {

          const tenantInfo = req.tenantInfo;

          const resp = await this.access.accessToken.hasRights({
            tenantId: tenantInfo?.tenantId, scope: `${resource.action}_${resource.identify}`, token: tenantInfo?.accessToken?.key,
          }).toPromise();

          return resp.access;
        }

        return ctx.isAuthenticated();
      }
    } catch (e) {
      this.logger.error(e);
      return false;
    }
  }

  async canAccessTenant(curTenant, user, req) {
    try {
      const meta = new Metadata();
      meta.set('headers', JSON.stringify(req.headers));
      meta.set('inApp', 'true');

      const tenantResp = await this.tenantSvc.tenantService.readTenant({
        filter: JSON.stringify({normalizedName: { _EQ: curTenant}}),
      }, meta).toPromise();
      if (!this.tenantCache.has(curTenant)) {
        this.tenantCache.set(curTenant, tenantResp.tenant);
      }
      this.logger.log(this.tenantCache);

      const canAccessTenant = tenantResp.tenant.members.find(value => value.userId === user.id);
      /* if (!canAccessTenant || !tenantResp) {
        throw new UnauthorizedError('Not authorized to read tenant');
      } */
    } catch (e) {
      this.logger.error('tenant access', e);
    }
  }
}
