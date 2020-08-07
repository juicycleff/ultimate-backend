import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ApolloError, UserInputError } from 'apollo-server-express';
import { TenantRepository } from '@ultimatebackend/repository';
import { TenantRemovedEvent } from '@ultimatebackend/core';
import { ConflictError } from '@ultimatebackend/common';
import { RemoveTenantCommand } from '../../impl';
import {
  DeleteTenantResponse,
  Tenant,
} from '@ultimatebackend/proto-schema/tenant';

/**
 * @class
 */
@CommandHandler(RemoveTenantCommand)
export class RemoveTenantHandler
  implements ICommandHandler<RemoveTenantCommand> {
  logger = new Logger(this.constructor.name);

  /**
   * @constructor
   * @param tenantRepository {TenantRepository}
   * @param eventBus {EventBus}
   */
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RemoveTenantCommand): Promise<DeleteTenantResponse> {
    this.logger.log(`'Async '${command.constructor.name}...`);
    const { input } = command;

    // TODO implement tenant delete correctly
    try {
      if (input.id === null) {
        // Check to make sure input is not null
        throw new UserInputError('Tenant id is missing'); // Throw an apollo input error
      }

      const tenantExist = await this.tenantRepository.exist({ id: input.id }); // Check if tenant exist with normalized name
      if (!tenantExist) {
        throw new ConflictError('Tenant by id does not exist'); // Throw a conflict exception id tenant exist
      }

      const tenant = await this.tenantRepository.findOne({
        id: input.id,
      });

      await this.tenantRepository.deleteOne({
        id: input.id,
      });

      await this.eventBus.publish(new TenantRemovedEvent(tenant));
      return {
        tenant: (tenant as unknown) as Tenant,
      };
    } catch (error) {
      this.logger.error(error);
      throw new ApolloError(error.message, error);
    }
  }
}
