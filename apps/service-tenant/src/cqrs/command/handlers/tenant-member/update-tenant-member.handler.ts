import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ApolloError, UserInputError } from 'apollo-server-express';
import { TenantMemberEmbed, TenantRepository } from '@graphqlcqrs/repository';
import { NotFoundError, UnauthorizedError } from '@graphqlcqrs/common';
import { AppRole, InvitationStatus } from '@ultimatebackend/contracts';
import { UpdateTenantMemberCommand } from '../../impl';
import { TenantMemberInvitedEvent } from '@graphqlcqrs/core/cqrs';

@CommandHandler(UpdateTenantMemberCommand)
export class UpdateTenantMemberHandler implements ICommandHandler<UpdateTenantMemberCommand> {
  logger = new Logger(this.constructor.name);

  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateTenantMemberCommand): Promise<TenantMemberEmbed> {
    this.logger.log(`'Async '${command.constructor.name}...`);
    const { input, user } = command;

    try {
      if (!input.tenantId || !input.id || !input.role) { // Check to make sure input is not null
        throw new UserInputError('Required input fields missing'); // Throw an apollo input error
      }

      if (!user) { // Check to make sure input is not null
        throw new UserInputError('Current user not found'); // Throw an apollo input error
      }

      // Check if tenant exist with normalized name
      const memberExist = await this.tenantRepository.exist({
        normalizedName: input.tenantId,
        member: {
          $elemMatch: {
            $or: [
              {
                id: input.id,
              },
            ],
          },
        },
      });
      if (!memberExist) {
        throw new NotFoundError('Member not found');  // Throw a conflict exception id tenant exist
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
          member: {
            $elemMatch: {
              id: input.id,
            },
          },
        },
        updates: {
          $set: {
            'members.$.role': input.role,
          },
        },
      });

      const tenantMember = tenant.members.reduce(previousValue => previousValue.id === input.id && previousValue);

      tenantMember.invitedBy = {
        firstname: user.firstname,
        lastname: user.lastname,
        id: user.id,
      };

      await this.eventBus.publish(new TenantMemberInvitedEvent(tenantMember));
      return tenantMember;
    } catch (error) {
      this.logger.error(error);
      throw new ApolloError(error.message, error);
    }
  }

}
