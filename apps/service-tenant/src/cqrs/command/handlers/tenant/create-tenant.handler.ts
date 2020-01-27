import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ApolloError, UserInputError } from 'apollo-server-express';
import { TenantEntity, TenantMemberEmbed, TenantRepository, TenantAccessEmbed } from '@graphqlcqrs/repository';
import { TenantCreatedEvent, TenantMemberCreatedEvent } from '@graphqlcqrs/core';
import slugify from '@sindresorhus/slugify';
import { ConflictError } from '@graphqlcqrs/common';
import { AppRole, InvitationStatus } from '@ultimatebackend/contracts';
import * as uuidAPIKey from 'uuid-apikey';
import * as uuidv1 from 'uuid/v1';
import { ObjectID } from 'mongodb';
import { CreateTenantCommand } from '../../impl';

@CommandHandler(CreateTenantCommand)
export class CreateTenantHandler implements ICommandHandler<CreateTenantCommand> {
  logger = new Logger(this.constructor.name);

  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateTenantCommand): Promise<TenantEntity> {
    this.logger.log(`'Async '${command.constructor.name}...`);
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

      const tenantMember: TenantMemberEmbed = {
        id: uuidv1(),
        userId: new ObjectID(user.id),
        email: user.emails.reduce(previousValue => previousValue.primary === true && previousValue).address,
        role: AppRole.OWNER,
        status: InvitationStatus.ACCEPTED,
        invitedBy: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const tenant = await this.tenantRepository.create({
        name: input.name,
        normalizedName,
        tokens: [token],
        ownerId: new ObjectID(user.id),
        members: [tenantMember],
      });

      await this.eventBus.publish(new TenantCreatedEvent(tenant));
      await this.eventBus.publish(new TenantMemberCreatedEvent(tenantMember));
      return tenant;
    } catch (error) {
      this.logger.error(error);
      throw new ApolloError(error.message, error);
    }
  }
}
