import { Args, Context, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { TenantEntity, UserEntity } from '@graphqlcqrs/repository/entities';
import { CreateTenantCommand, RemoveTenantCommand } from '../cqrs/command/impl';
import { CurrentUser } from '@graphqlcqrs/common';
import { UserInputError } from 'apollo-server-express';
import { Permission, Resource } from '@graphqlcqrs/core';
import { GetTenantQuery, GetTenantsQuery } from '../cqrs/query/impl/tenant';
import { Tenant, TenantMutationArgs, TenantFilterArgs } from '../types';

@Resource({ name: 'tenant_manage', identify: 'tenant:manage' })
@Resolver(() => Tenant)
export class TenantResolver {
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
      return  await this.commandBus.execute(new CreateTenantCommand(user, create)) as TenantEntity;
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

  @Permission({ name: 'generate_access_token', identify: 'tenant:generateAccessToken', action: 'write' })
  @Mutation(() => Tenant)
  async generateAccessToken(@Args('id') id: string): Promise<TenantEntity> {
    return null;
  }

  @Permission({ name: 'tenant', identify: 'tenant:tenant', action: 'read' })
  @Query(() => Tenant)
  async tenant(@Args() {where}: TenantFilterArgs, @CurrentUser() user: UserEntity): Promise<TenantEntity> {
    return await this.queryBus.execute(new GetTenantQuery(where, user));
  }

  @Permission({ name: 'tenants', identify: 'tenant:tenants', action: 'read' })
  @Query(() => [Tenant!])
  async tenants(@Args() {where}: TenantFilterArgs, @CurrentUser() user: UserEntity): Promise<TenantEntity[]> {
    return await this.queryBus.execute(new GetTenantsQuery(where, user)) as TenantEntity[];
  }
}
