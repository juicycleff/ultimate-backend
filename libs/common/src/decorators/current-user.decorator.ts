import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context).getContext();
    return ctx.req.user;
  },
);

export const GrpcCurrentUser = createParamDecorator((data, { args }) => {
  return args?.currentUser;
});
