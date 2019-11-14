import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ApolloError, UserInputError } from 'apollo-server-express';
import { TenantMemberEmbed, TenantRepository } from '@graphqlcqrs/repository';
import { TenantMemberCreatedEvent } from '@graphqlcqrs/core';
import * as uuidv1 from 'uuid/v1';
import { AppRole, ConflictError, InvitationStatus } from '@graphqlcqrs/common';
import { CreateTenantMemberCommand } from '../../impl';

@CommandHandler(CreateTenantMemberCommand)
export class CreateTenantMemberHandler implements ICommandHandler<CreateTenantMemberCommand> {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateTenantMemberCommand): Promise<TenantMemberEmbed> {
    Logger.log('Async CreateTenantMemberHandler...', 'CreateTenantMemberCommand');
    const { input, tenantId } = command;

    try {
      if (input.email === null || typeof input.email !== 'string' ) { // Check to make sure input is not null
        throw new UserInputError('Email input field missing'); // Throw an apollo input error
      }

      // Check if tenant exist with normalized name
      const memberExist = await this.tenantRepository.exist({
        member: {
          $elemMatch: { id: input.id },
        },
      });

      if (memberExist) {
        throw new ConflictError('Member already added');  // Throw a conflict exception id tenant exist
      }

      const tenantMember: TenantMemberEmbed = {
        id: uuidv1(),
        email: input.email,
        role: AppRole.OWNER,
        status: InvitationStatus.PENDING,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await this.tenantRepository.findOneAndUpdate({
        conditions: {
          normalizedName: tenantId,
        },
        updates: {
          $push: {
            members: tenantMember,
          },
        },
      });

      this.eventBus.publish(new TenantMemberCreatedEvent(tenantMember));
      return tenantMember;
    } catch (error) {
      Logger.log(error, 'CreateTenantMemberHandler');
      throw new ApolloError(error.message, error);
    }
  }

}
