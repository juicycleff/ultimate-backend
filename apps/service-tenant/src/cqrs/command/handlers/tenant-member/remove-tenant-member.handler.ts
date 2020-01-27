import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ApolloError, UserInputError } from 'apollo-server-express';
import { TenantMemberEmbed, TenantRepository } from '@graphqlcqrs/repository';
import { ConflictError, UnauthorizedError } from '@graphqlcqrs/common';
import { AppRole, InvitationStatus } from '@ultimatebackend/contracts';
import { RemoveTenantMemberCommand } from '../../impl';
import { TenantMemberRemovedEvent } from '@graphqlcqrs/core/cqrs';

@CommandHandler(RemoveTenantMemberCommand)
export class RemoveTenantMemberHandler implements ICommandHandler<RemoveTenantMemberCommand> {
  logger = new Logger(this.constructor.name);

  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RemoveTenantMemberCommand): Promise<TenantMemberEmbed> {
    this.logger.log(`'Async '${command.constructor.name}...`);
    const { input, user } = command;

    try {
      if (input.id === null) { // Check to make sure input is not null
        throw new UserInputError('Tenant member id is missing'); // Throw an apollo input error
      }

      if (user === null) { // Check to make sure input is not null
        throw new UserInputError('Tenant member owner is missing'); // Throw an apollo input error
      }

      // Check if tenant exist with normalized name
      const memberExist = await this.tenantRepository.exist({
        normalizedName: input.tenantId,
        member: {
          $elemMatch: {
            id: input.id,
          },
        },
      });

      if (!memberExist) {
        throw new ConflictError('Tenant member does not exist in this tenant');  // Throw a conflict exception id tenant exist
      }

      let tenant = await this.tenantRepository.findOne({
        normalizedName: input.tenantId,
        member: {
          $elemMatch: {
            id: input.id,
          },
        },
      }, false);

      const currentUserRights = tenant.members.reduce(previousValue => previousValue.userId === user.id && previousValue);

      if (
        currentUserRights.role === AppRole.DEVELOPER ||
        currentUserRights.role === AppRole.MEMBER ||
        currentUserRights.status !== InvitationStatus.ACCEPTED
      ) {
        throw new UnauthorizedError('You are not authorized to remove this member');
      }

      tenant = await this.tenantRepository.findOneAndUpdate({
        conditions: {
          normalizedName: input.tenantId,
        },
        updates: {
          $pull: {
            members: {
              id: input.id,
            },
          },
        },
      });

      const tenantMember = tenant.members.reduce(previousValue => previousValue.id === input.id && previousValue);

      await this.eventBus.publish(new TenantMemberRemovedEvent(tenantMember));
      return tenantMember;
    } catch (error) {
      this.logger.error(error);
      throw new ApolloError(error.message, error);
    }
  }
}
