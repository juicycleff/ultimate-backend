import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { TenantEntity, UserEntity } from '@graphqlcqrs/repository/entities';
import { CurrentUser } from '@graphqlcqrs/common';
import { UserInputError } from 'apollo-server-express';
import { GqlAuthGuard, ISubscriptionService, Permission, Resource } from '@graphqlcqrs/core';
import { GetTenantQuery, GetTenantsQuery } from '../cqrs/query/impl/tenant';
import { Tenant, TenantFilterArgs, TenantMutationArgs } from '../types';
import { OnModuleInit, UseGuards } from '@nestjs/common';
import { Client, ClientGrpcProxy, Transport } from '@nestjs/microservices';
import { AppConfig } from '@graphqlcqrs/common/services/yaml.service';
import { join } from 'path';
import { CreateTenantCommand, RemoveTenantCommand } from '../cqrs/command/impl';

@UseGuards(GqlAuthGuard)
@Resource({ name: 'tenant_manage', identify: 'tenant:manage' })
@Resolver(() => Tenant)
export class TenantResolver implements OnModuleInit {
  @Client({
    transport: Transport.GRPC,
    options: {
      package: 'payment',
      url: (process.env.PAYMENT_GRPC_ENDPOINT && process.env.PAYMENT_GRPC_ENDPOINT.replace('http://', ''))
        || `localhost:${AppConfig.services?.payment?.grpcPort || 7500}`,
      protoPath: join('proto/payment.proto'),
    },
  })
  client: ClientGrpcProxy;
  private subscriptionService: ISubscriptionService;

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Permission({ name: 'tenant_mutations', identify: 'tenant:tenantMutations', action: 'create' })
  @Mutation(() => Tenant, { name: 'tenant' })
  async tenantMutations(@Args() input: TenantMutationArgs, @Context() ctx: any, @CurrentUser() user: UserEntity): Promise<TenantEntity> {
    const { create, remove, update, updateAccessToken, removeAccessToken } = input;
    if (create === null && remove === null ) { // Check to make sure input is not null
      throw new UserInputError('Mutation inputs missing'); // Throw an apollo input error
    }

    if (create) {
      const tenant = await this.commandBus.execute(new CreateTenantCommand(user, create)) as TenantEntity;
      await this.subscriptionService.create({
        tenantId: typeof tenant.id === 'string' ? tenant.id : tenant.id.toHexString(),
        userId: typeof user.id === 'string' ? user.id : user.id.toHexString(),
        customerId: user.payment?.stripeId,
        planId: create.planId,
        couponId: create.couponId,
      }).toPromise();

      return tenant;
    } else if (update) {
      return await this.commandBus.execute(new RemoveTenantCommand(user, remove));
    } else if (updateAccessToken) {
      return await this.commandBus.execute(new RemoveTenantCommand(user, remove));
    } else if (removeAccessToken) {
      return await this.commandBus.execute(new RemoveTenantCommand(user, remove));
    } else if (remove) {
      return await this.commandBus.execute(new RemoveTenantCommand(user, remove));
    } else {
      throw new UserInputError('Mutation inputs missing'); // Throw an apollo input error
    }
  }

  @Permission({ name: 'generate_access_token', identify: 'tenant:generateAccessToken', action: 'update' })
  @Mutation(() => Tenant)
  async generateAccessToken(@Args('id') id: string): Promise<TenantEntity> {
    return null;
  }

  @Permission({ name: 'tenant', identify: 'tenant:tenant', action: 'read' })
  @Query(() => Tenant)
  async tenant(@Args() {where}: TenantFilterArgs, @CurrentUser() user: UserEntity): Promise<TenantEntity> {
    return await this.queryBus.execute(new GetTenantQuery(where, user)) as TenantEntity;
  }

  @Permission({ name: 'tenants', identify: 'tenant:tenants', action: 'read' })
  @Query(() => [Tenant!])
  async tenants(@Args() {where}: TenantFilterArgs, @CurrentUser() user: UserEntity): Promise<TenantEntity[]> {
    return await this.queryBus.execute(new GetTenantsQuery(where, user)) as TenantEntity[];
  }

  onModuleInit(): any {
    this.subscriptionService = this.client.getService<ISubscriptionService>('SubscriptionService');
  }
}
