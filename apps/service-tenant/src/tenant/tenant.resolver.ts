import { Args, Context, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { TenantEntity, UserEntity } from '@graphqlcqrs/repository/entities';
import { CreateTenantCommand } from '../cqrs/command/impl';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@graphqlcqrs/common/guards';
import { CurrentUser, NotImplementedError } from '@graphqlcqrs/common';
import { GetTenantQuery } from '../cqrs/query/impl/tenant';
import { Tenant } from '../types';
import { CreateTenantInput, TenantFilterArgs } from '../types';

@UseGuards(GqlAuthGuard)
@Resolver(() => Tenant)
export class TenantResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Mutation(() => Tenant)
  async createTenant(@Args('input') input: CreateTenantInput, @Context() ctx: any, @CurrentUser() user: UserEntity): Promise<TenantEntity> {
    return await this.commandBus.execute(new CreateTenantCommand(user, input));
  }

  @Mutation(() => Tenant)
  async removeTenant(@Args('id') id: string): Promise<TenantEntity> {
    return null;
  }

  @Mutation(() => Tenant)
  async updateTenant(@Args('id') id: string): Promise<TenantEntity> {
    return null;
  }

  @Mutation(() => Tenant)
  async generateAccessToken(@Args('id') id: string): Promise<TenantEntity> {
    return null;
  }

  @Mutation(() => Tenant)
  async retireAccessToken(@Args('id') id: string): Promise<TenantEntity> {
    return null;
  }

  @Query(() => Tenant)
  async tenant(@Args() filter: TenantFilterArgs, @CurrentUser() user: UserEntity): Promise<TenantEntity> {
    return await this.queryBus.execute(new GetTenantQuery({
      id: filter.name,
    }));
  }

  @Query(() => Tenant)
  async tenants(): Promise<TenantEntity[]> {
    throw new NotImplementedError('Not implemented');
  }
}
