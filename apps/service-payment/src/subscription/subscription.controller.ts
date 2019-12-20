import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { BooleanPayload } from '@ultimatebackend/contracts';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { TenantSubscription } from '../types';
import { CreateSubscriptionCommand } from '../cqrs/command/impl/subscription';
import { GetSubscriptionsQuery } from '../cqrs/query/impl/subscription';

@Controller('subscription')
export class SubscriptionController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @GrpcMethod('SubscriptionService', 'Create')
  async create(
    data: { tenantId: string, userId: string, customerId: string, planId: string, couponId?: string },
  ): Promise<BooleanPayload> {
    const subs = await this.commandBus.execute(new CreateSubscriptionCommand({
      tenantId: data.tenantId, userId: data.userId, customerId: data.customerId,
    }, {
      planId: data.planId, couponId: data.couponId,
    }));

    return {
      success: !!subs,
    };
  }

  @GrpcMethod('SubscriptionService', 'FindOne')
  async findOne(data: { tenantId: string, userId: string, customerId: string }): Promise<TenantSubscription> {
    const subs = await this.queryBus.execute(new GetSubscriptionsQuery({
      tenantId: data.tenantId, userId: data.userId, customerId: data.customerId,
    })) as TenantSubscription[];

    return subs.reduce(value => value.tenantId === data.tenantId && value);
  }
}
