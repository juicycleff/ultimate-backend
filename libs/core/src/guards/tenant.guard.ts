import { CanActivate, ExecutionContext, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { AuthenticationError } from 'apollo-server-express';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ITenantService } from '@graphqlcqrs/core';
import { AppConfig } from '@graphqlcqrs/common/services/yaml.service';
import { TenantInfo } from '@juicycleff/nest-multi-tenant';

@Injectable()
export class TenantGuard implements CanActivate, OnModuleInit {
  @Client({
    transport: Transport.GRPC,
    options: {
      package: 'tenant',
      url: `localhost:${AppConfig.services?.tenant?.grpcPort || 7200}`,
      protoPath: join('proto/tenant.proto'),
    },
  })
  client: ClientGrpc;
  tenantService: ITenantService;

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();

    const rawTenantInfo = ctx.req.headers['x-tenant-info'];
    if (!rawTenantInfo) { throw new AuthenticationError('Missing tenant credentials'); }

    const tenantInfo = JSON.parse(rawTenantInfo) as TenantInfo;
    if (!tenantInfo) { throw new AuthenticationError('Missing tenant credentials'); }

    try {
      const tenant = await this.tenantService.findOneTenant({
        normalizedName: tenantInfo.tenant,
        secret: tenantInfo.accessToken.secret,
        key: tenantInfo.accessToken.key,
      }).subscribe();

      if (!tenant) { return false; }
      ctx.req.tenant = tenant;

      return !!tenant;
    } catch (e) {
      Logger.error(e, this.constructor.name);
      throw new AuthenticationError('Invalid tenant credentials');
    }
  }

  onModuleInit(): any {
    this.tenantService = this.client.getService<ITenantService>('TenantService');
  }
}
