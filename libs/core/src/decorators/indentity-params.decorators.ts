import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { TenantEntity, UserEntity } from '@ultimatebackend/repository';
import { GqlContext } from '../';

export const CurrentIdentity = createParamDecorator(
  (
    data: unknown,
    context: ExecutionContext,
  ): { user?: UserEntity; tenant?: TenantEntity } => {
    const ctx: GqlContext = GqlExecutionContext.create(context).getContext();
    return {
      user: ctx.getUser(),
      tenant: null, // ctx.req.tenant,
    };
  },
);

export const HttpCurrentIdentity = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user && user[data] : user;
  },
);

export const RpcCurrentIdentity = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToRpc().getContext();
    console.log('***************');
    console.log(data, request);
    console.log('***************');
    return null;
  },
);
