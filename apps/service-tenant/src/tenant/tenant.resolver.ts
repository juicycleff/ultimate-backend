import { Args, Context, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { TenantEntity, UserEntity } from '@graphqlcqrs/repository/entities';
import { CreateTenantCommand, RemoveTenantCommand } from '../cqrs/command/impl';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@graphqlcqrs/common/guards';
import { CurrentUser } from '@graphqlcqrs/common';
import { GetTenantQuery, GetTenantsQuery } from '../cqrs/query/impl/tenant';
import { Tenant, TenantMutationArgs } from '../types';
import { TenantFilterArgs } from '../types';
import { UserInputError } from 'apollo-server-express';
import { NestCasbinService } from 'nestjs-casbin-mongodb';

@UseGuards(GqlAuthGuard)
@Resolver(() => Tenant)
export class TenantResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly casbinService: NestCasbinService,
  ) {}

  @Mutation(() => Tenant, { name: 'tenant' })
  async tenantMutations(@Args() input: TenantMutationArgs, @Context() ctx: any, @CurrentUser() user: UserEntity): Promise<TenantEntity> {
    const { create, remove, update, updateAccessToken, removeAccessToken } = input;
    if (create === null && remove === null ) { // Check to make sure input is not null
      throw new UserInputError('Mutation inputs missing'); // Throw an apollo input error
    }

    if (create) {
      const tenant = await this.commandBus.execute(new CreateTenantCommand(user, create)) as TenantEntity;
      await this.casbinService.addPolicy(`user/${user.id.toString()}`, '*', `tenant/${tenant.normalizedName}`, 'read');
      await this.casbinService.addPolicy(`user/${user.id.toString()}`, '*', `tenant/${tenant.normalizedName}`, 'write');
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

  @Mutation(() => Tenant)
  async generateAccessToken(@Args('id') id: string): Promise<TenantEntity> {
    return null;
  }

  @Query(() => Tenant)
  async tenant(@Args() {where}: TenantFilterArgs, @CurrentUser() user: UserEntity): Promise<TenantEntity> {
    return await this.queryBus.execute(new GetTenantQuery(where, user));
  }

  @Query(() => [Tenant!])
  async tenants(@Args() {where}: TenantFilterArgs, @CurrentUser() user: UserEntity): Promise<TenantEntity[]> {
    return await this.queryBus.execute(new GetTenantsQuery(where, user)) as TenantEntity[];
  }
}
