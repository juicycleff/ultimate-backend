import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Get all roles for current gql handler
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    // If there's no acceptable roles passed, pass test
    if (!roles) {
      return true;
    }

    try {
      const ctx = GqlExecutionContext.create(context).getContext();
      const user = ctx.getUser();
      const hasRole = () => user.roles.some((role) => roles.includes(role));
      return user && user.roles && hasRole();
    } catch (e) {
      Logger.error(e, PermissionGuard.constructor.name);
    }

    return true;
  }
}
