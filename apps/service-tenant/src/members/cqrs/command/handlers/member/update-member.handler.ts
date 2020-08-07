import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { TenantRepository } from '@ultimatebackend/repository';
import { MemberUpdatedEvent } from '@ultimatebackend/core';
import { UpdateMemberCommand } from '../../impl';
import { AppRole, InvitationStatus } from '@ultimatebackend/contracts';
import {
  Member,
  UpdateMemberResponse,
} from '@ultimatebackend/proto-schema/tenant';
import { RpcException } from '@nestjs/microservices';

@CommandHandler(UpdateMemberCommand)
export class UpdateMemberHandler
  implements ICommandHandler<UpdateMemberCommand> {
  logger = new Logger(this.constructor.name);

  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateMemberCommand): Promise<UpdateMemberResponse> {
    this.logger.log(`'Async '${command.constructor.name}...`);
    const { input, user, tenantId } = command;

    try {
      if (!input.role || !input.id || !input.status) {
        // Check to make sure input is not null
        throw new RpcException('Required input fields missing'); // Throw an apollo input error
      }

      if (!user) {
        // Check to make sure input is not null
        throw new RpcException('Current user not found'); // Throw an apollo input error
      }

      if (tenantId === null) {
        // Check to make sure input is not null
        throw new RpcException('Tenant not found');
      }

      const tenant = await this.tenantRepository.findOne({
        normalizeNamed: tenantId,
      });

      if (tenant === null) {
        // Check to make sure input is not null
        throw new RpcException('Tenant not found');
      }

      const memberRights = tenant.members.reduce(
        (previousValue) => previousValue.id === input.id && previousValue,
      );
      const currentUserRights = tenant.members.reduce(
        (previousValue) => previousValue.userId === user.id && previousValue,
      );
      if (!memberRights || !currentUserRights) {
        throw new RpcException('Member not found'); // Throw a conflict exception id tenant exist
      }

      if (
        memberRights.role === AppRole.OWNER &&
        currentUserRights.role === AppRole.OWNER &&
        memberRights.userId === tenant.createdBy.toString()
      ) {
        throw new RpcException('You are not authorized to remove this member');
      } else if (currentUserRights.status !== InvitationStatus.ACCEPTED) {
        throw new RpcException('You are not authorized to remove this member');
      }

      const updatedTenant = await this.tenantRepository.findOneAndUpdate({
        conditions: {
          normalizedName: tenant.normalizedName,
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

      const member = updatedTenant.members.reduce(
        (previousValue) => previousValue.id === input.id && previousValue,
      );

      await this.eventBus.publish(new MemberUpdatedEvent(member));
      return {
        member: (member as unknown) as Member,
      };
    } catch (error) {
      this.logger.log(error);
      throw new RpcException(error);
    }
  }
}
