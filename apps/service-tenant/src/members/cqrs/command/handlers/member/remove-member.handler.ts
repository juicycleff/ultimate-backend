import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { TenantRepository } from '@ultimatebackend/repository';
import {
  MemberRemovedEvent,
  RolesRpcClientService,
} from '@ultimatebackend/core';
import { AppRole, InvitationStatus } from '@ultimatebackend/contracts';
import { RemoveMemberCommand } from '../../impl';
import { RpcException } from '@nestjs/microservices';
import {
  DeleteMemberResponse,
  Member,
} from '@ultimatebackend/proto-schema/tenant';

@CommandHandler(RemoveMemberCommand)
export class RemoveMemberHandler
  implements ICommandHandler<RemoveMemberCommand> {
  logger = new Logger(this.constructor.name);

  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly eventBus: EventBus,
    private readonly roleService: RolesRpcClientService,
  ) {}

  async execute(command: RemoveMemberCommand): Promise<DeleteMemberResponse> {
    this.logger.log(`'Async '${command.constructor.name}...`);
    const { input, user, tenantId } = command;

    try {
      if (input.id === null) {
        // Check to make sure input is not null
        throw new RpcException('Member id is missing');
      }

      if (user === null) {
        // Check to make sure input is not null
        throw new RpcException('Member owner or admin is missing');
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
        },
        updates: {
          $pull: {
            members: {
              id: input.id,
            },
          },
        },
      });

      const member = updatedTenant.members.reduce(
        (previousValue) => previousValue.id === input.id && previousValue,
      );

      await this.roleService.svc
        .removeUserFromRole({ tenantId, userId: member.userId.toString() })
        .toPromise();

      await this.eventBus.publish(new MemberRemovedEvent(member));
      return {
        member: (member as unknown) as Member,
      };
    } catch (error) {
      this.logger.log(error);
      throw new RpcException(error);
    }
  }
}
