import { Args, Resolver, Subscription } from '@nestjs/graphql';
import { Signal, SignalSubscriptionFilterArgs } from './types';
import { pubsub } from '../common/helpers';

@Resolver(() => Signal)
export class SignalsResolver {

  @Subscription(() => Signal, {
    filter: (payload, input: SignalSubscriptionFilterArgs, ctx: any) => {
      let tenantId = ctx.connection.context['x-tenant-id'];
      if (tenantId) {
        if (input && input.where) {
          return payload.pointMac === input.where.pointMac && payload.tenantId === tenantId;
        }
        if (payload.tenantId === tenantId) {
          return payload.tenantId === tenantId;
        }
      }
    },
    resolve(this: SignalsResolver, value) {
      return {
        id: value._id,
        ...value,
        createdAt: new Date(value.createdAt),
        updatedAt: new Date(value.updatedAt),
      };
    },
  })
  signalAdded(@Args() input: SignalSubscriptionFilterArgs) {
    return pubsub.asyncIterator('signal/new');
  }
}
