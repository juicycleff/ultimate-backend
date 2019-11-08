import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { CommandBus } from '@nestjs/cqrs';
import { CreateTenantInput } from '@ultimatebackend/contracts/services/tenant-contract';
import { TenantEntity } from '@graphqlcqrs/repository/entities';
import { CreateTenantCommand } from '../cqrs/command/impl/tenant';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@graphqlcqrs/common/guards';

@UseGuards(GqlAuthGuard)
@Resolver('Tenant')
export class TenantResolver {
  constructor(
    private readonly commandBus: CommandBus,
  ) {}

  @Mutation()
  async createTenant(@Args('input') input: CreateTenantInput, @Context() ctx: any): Promise<TenantEntity> {
    return null;
    // return await this.commandBus.execute(new CreateTenantCommand(null, input));
  }

  @Mutation()
  async removeTenant(@Args('id') id: string): Promise<TenantEntity> {
    return null;
  }
}
