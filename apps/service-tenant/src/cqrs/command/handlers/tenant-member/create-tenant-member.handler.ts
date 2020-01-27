import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ApolloError, UserInputError } from 'apollo-server-express';
import { TenantMemberEmbed, TenantRepository } from '@graphqlcqrs/repository';
import { TenantMemberCreatedEvent } from '@graphqlcqrs/core';
import * as uuidv1 from 'uuid/v1';
import { ConflictError, UnauthorizedError } from '@graphqlcqrs/common';
import { AppRole, InvitationStatus } from '@ultimatebackend/contracts';
import { CreateTenantMemberCommand } from '../../impl';

@CommandHandler(CreateTenantMemberCommand)
export class CreateTenantMemberHandler implements ICommandHandler<CreateTenantMemberCommand> {
  logger = new Logger(this.constructor.name);

  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateTenantMemberCommand): Promise<TenantMemberEmbed> {
    this.logger.log(`'Async '${command.constructor.name}...`);
    const { input, user } = command;

    try {
      if (input.email === null || typeof input.email !== 'string' ) { // Check to make sure input is not null
        throw new UserInputError('Email input field missing'); // Throw an apollo input error
      }

      // Check if tenant exist with normalized name
      const memberExist = await this.tenantRepository.exist({
        member: {
          $elemMatch: {
            $or: [
              {
                userId: input.userId,
              },
              {
                email: input.email,
              },
            ],
          },
        },
      });

      if (memberExist) {
        throw new ConflictError('Member already added');  // Throw a conflict exception id tenant exist
      }

      const tenant = await this.tenantRepository.findOne({
        normalizedName: input.tenantId,
      }, false);

      const currentUserRights = tenant.members.reduce(previousValue => previousValue.userId === user.id && previousValue);

      if (
        currentUserRights.role === AppRole.DEVELOPER ||
        currentUserRights.role === AppRole.MEMBER ||
        currentUserRights.status !== InvitationStatus.ACCEPTED
      ) {
        throw new UnauthorizedError('You are not authorized to remove this member');
      }

      const tenantMember: TenantMemberEmbed = {
        id: uuidv1(),
        email: input.email,
        role: AppRole.OWNER,
        status: InvitationStatus.PENDING,
        invitedBy: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await this.tenantRepository.findOneAndUpdate({
        conditions: {
          normalizedName: input.tenantId,
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
      this.logger.error(error);
      throw new ApolloError(error.message, error);
    }
  }

}
