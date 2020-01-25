import { CanActivate, ExecutionContext, HttpService, Injectable, Logger } from '@nestjs/common';
import { AuthenticationError } from 'apollo-server-express';
import { GqlExecutionContext } from '@nestjs/graphql';
import { TenantInfo } from '@juicycleff/nest-multi-tenant';
import { AppConfig } from '@graphqlcqrs/common/services/yaml.service';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(
    private readonly httpService: HttpService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();

    const rawTenantInfo = ctx.req.headers['x-tenant-info'];
    if (!rawTenantInfo) { throw new AuthenticationError('Missing tenant credentials'); }

    const tenantInfo = JSON.parse(rawTenantInfo) as TenantInfo;
    if (!tenantInfo) { throw new AuthenticationError('Missing tenant credentials'); }

    try {
      const tenant = (await this.httpService.get(
        (process.env.TENANT_ENDPOINT_REST || (`http://localhost:${AppConfig.services?.tenant.port || '9200'}`)) + '/tenant/find', {
        data: {
          normalizedName: tenantInfo.tenant,
          secret: tenantInfo.accessToken.secret,
          key: tenantInfo.accessToken.key,
        },
      }).toPromise()).data;

      if (!tenant) { return false; }
      ctx.req.tenant = tenant;

      return !!tenant;
    } catch (e) {
      Logger.error(e, this.constructor.name);
      throw new AuthenticationError('Invalid tenant credentials');
    }
  }
}
