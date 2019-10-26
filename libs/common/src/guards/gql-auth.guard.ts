import { CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * Create a new GqlAuthGuard
 * @class
 * @description Auth guard for only logged in user based on session authentication
 * @implements {CanActivate}
 */
export class GqlAuthGuard  implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context).getContext();

    Logger.log(ctx.isAuthenticated(), 'GqlAuthGuard');
    return ctx.isAuthenticated();
  }
}
