import {Logger} from '@nestjs/common';
import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { ApolloError, UserInputError } from 'apollo-server-express';
import { TenantEntity, TenantRepository } from '@graphqlcqrs/repository';
import { TenantCreatedEvent } from '@graphqlcqrs/core';
import slugify from '@sindresorhus/slugify';
import { ConflictError } from '@graphqlcqrs/common';
import * as uuidAPIKey from 'uuid-apikey';
import { ObjectID } from 'mongodb';
import { TenantAccessEmbed } from '@graphqlcqrs/repository/entities/embeded';
import { CreateTenantCommand } from '../../impl';

@CommandHandler(CreateTenantCommand)
export class CreateTenantHandler implements ICommandHandler<CreateTenantCommand> {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateTenantCommand): Promise<TenantEntity> {
    Logger.log('Async CreateTenantHandler...', 'CreateTenantCommand');
    const { input, user } = command;

    try {
      if (input.name === null || typeof input.name !== 'string' ) { // Check to make sure input is not null
        throw new UserInputError('Tenant name is is missing'); // Throw an apollo input error
      }

      const normalizedName = slugify(input.name.toLowerCase()); // Generate a unique slug for tenant
      if (!normalizedName || typeof normalizedName !== 'string') {  // Validate if normalize name is a string
        throw new UserInputError('Tenant name is is missing');  // Throw an apollo input error
      }

      const tenantExist = await this.tenantRepository.exist({ normalizedName }); // Check if tenant exist with normalized name
      if (tenantExist) {
        throw new ConflictError('Tenant name unavailable');  // Throw a conflict exception id tenant exist
      }

      const apiKeys: {
        uuid: string,
        apiKey: string,
      } = uuidAPIKey.create();

      const token: TenantAccessEmbed = {
        secret: apiKeys.uuid,
        key: apiKeys.apiKey,
        active: true,
        createdAt: new Date().toISOString(),
      };

      const result = await this.tenantRepository.create({
        name: input.name,
        normalizedName,
        tokens: [token],
        ownerId: new ObjectID(user.id),
      });

      this.eventBus.publish(new TenantCreatedEvent(result));
      return result;
    } catch (error) {
      Logger.log(error, 'CreateAuthHandler');
      throw new ApolloError(error.message, error);
    }
  }

}
