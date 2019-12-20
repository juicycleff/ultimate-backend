import { createParamDecorator } from '@nestjs/common';

export const CurrentTenant = createParamDecorator(
  (data, [root, args, ctx, info]) => ctx.req.tenant,
);
