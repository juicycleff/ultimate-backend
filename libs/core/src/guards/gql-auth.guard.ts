import { CanActivate, ExecutionContext, Injectable, OnModuleInit } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { IPermission, IResource, IRoleService, PERMISSION_DEFINITION, RESOURCE_DEFINITION } from '..';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { UserEntity } from '@graphqlcqrs/repository';
import { ForbiddenError } from '@graphqlcqrs/common';
import { AppConfig } from '@graphqlcqrs/common/services/yaml.service';

/**
 * Create a new GqlAuthGuard
 * @class
 * @description Auth guard for only logged in user based on session authentication
 * @implements {CanActivate}
 */
@Injectable()
export class GqlAuthGuard  implements CanActivate, OnModuleInit {
  @Client({
    transport: Transport.GRPC,
    options: {
      package: 'role',
      url: `localhost:${AppConfig.services?.auth?.grpcPort || 7900}`,
      protoPath: join('proto/role.proto'),
    },
  })
  client: ClientGrpc;
  roleService: IRoleService;

  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();

    if (ctx.isAuthenticated && ctx.getUser()) {
      const resource = this.reflector.get<IResource>(RESOURCE_DEFINITION, context.getClass());
      const permission = this.reflector.get<IPermission>(PERMISSION_DEFINITION, context.getHandler());

      if (!permission || !resource) {
        return await ctx.isAuthenticated();
      }

      const user = ctx.getUser() as UserEntity;
      const roleVals = [];

      for (const role of user.roles) {
        const params = [role, '*', `${resource.identify}-${permission.identify}`, permission.action];
        try {
          const result = await this.roleService.checkPermission({ params }).toPromise();
          if (result && result.success) {
            roleVals.push(result.success);
          }
        } catch (e) {
          throw new ForbiddenError(e);
        }
      }

      if (roleVals.includes(true)) {
        return await ctx.isAuthenticated();
      } else {
        throw new ForbiddenError('Not permitted to write/read this resource');
      }
    }

    return await ctx.isAuthenticated();
  }

  onModuleInit(): any {
    this.roleService = this.client.getService<IRoleService>('RoleService');
  }
}
