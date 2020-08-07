import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { TenantRepository } from '@ultimatebackend/repository';
import {
  AcceptMemberInvitationResponse,
  Member,
} from '@ultimatebackend/proto-schema/tenant';
import { AcceptInvitationCommand } from '../../impl';
import { RolesRpcClientService } from '@ultimatebackend/core';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { InvitationStatus } from '@ultimatebackend/contracts';
import { Logger } from '@nestjs/common';

@CommandHandler(AcceptInvitationCommand)
export class AcceptInvitationHandler
  implements ICommandHandler<AcceptInvitationCommand> {
  logger = new Logger(this.constructor.name);

  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly eventBus: EventBus,
    private readonly roleService: RolesRpcClientService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(
    command: AcceptInvitationCommand,
  ): Promise<AcceptMemberInvitationResponse> {
    this.logger.log(`'Async '${command.constructor.name}...`);
    const { input, user } = command;

    try {
      // @ts-ignore
      const payload: {
        tenantId: string;
        memberId: string;
      } = await this.jwtService.decode(input.token);
      if (!payload) {
        throw new RpcException('Invalid invitation token');
      }

      const tenant = await this.tenantRepository.findOneAndUpdate({
        conditions: {
          normalizedName: payload.tenantId,
          member: {
            $elemMatch: {
              id: payload.memberId,
              status: InvitationStatus.PENDING,
            },
          },
        },
        updates: {
          $set: {
            'members.$.status': InvitationStatus.ACCEPTED,
          },
        },
      });

      if (!tenant) {
        throw new RpcException('Invitation for tenant not found');
      }
      const member = tenant.members.reduce(
        (previousValue) =>
          previousValue.id === payload.memberId && previousValue,
      );

      await this.roleService.svc
        .addUserToRole({
          role: member.role,
          domain: tenant.normalizedName,
          actor: 'user',
          userId: user.id.toString(),
        })
        .toPromise();

      return {
        member: (member as unknown) as Member,
      };
    } catch (e) {
      this.logger.error(e);
      throw new RpcException(e);
    }
  }
}
