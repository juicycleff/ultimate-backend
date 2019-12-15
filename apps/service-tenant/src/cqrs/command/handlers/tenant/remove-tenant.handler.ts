import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ApolloError, UserInputError } from 'apollo-server-express';
import { TenantEntity, TenantRepository } from '@graphqlcqrs/repository';
import { TenantRemovedEvent } from '@graphqlcqrs/core';
import { ConflictError } from '@graphqlcqrs/common';
import { RemoveTenantCommand } from '../../impl';

@CommandHandler(RemoveTenantCommand)
export class RemoveTenantHandler implements ICommandHandler<RemoveTenantCommand> {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RemoveTenantCommand): Promise<TenantEntity> {
    Logger.log('Async RemoveTenantHandler...', 'RemoveTenantCommand');
    const { input } = command;

    try {
      if (input.id === null) { // Check to make sure input is not null
        throw new UserInputError('Tenant id is missing'); // Throw an apollo input error
      }

      const tenantExist = await this.tenantRepository.exist({ _id: input.id }); // Check if tenant exist with normalized name
      if (!tenantExist) {
        throw new ConflictError('Tenant by id does not exist');  // Throw a conflict exception id tenant exist
      }

      const tenant = await this.tenantRepository.findOne({
        _id: input.id,
      });

      await this.tenantRepository.deleteOne({
        _id: input.id,
      });

      await this.eventBus.publish(new TenantRemovedEvent(tenant));
      return tenant;
    } catch (error) {
      Logger.log(error, 'CreateTenantHandler');
      throw new ApolloError(error.message, error);
    }
  }

}
