import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import {
  TenantMemberEmbed,
  TenantRepository,
} from '@ultimatebackend/repository';
import {
  MemberInvitedEvent,
  RolesRpcClientService,
} from '@ultimatebackend/core';
import { v1 as uuidv1 } from 'uuid';
import { DateTime } from 'luxon';
import { ObjectId } from 'mongodb';
import { InviteMemberCommand } from '../../impl';
import { AppRole, InvitationStatus } from '@ultimatebackend/contracts';
import {
  InviteMemberResponse,
  Member,
} from '@ultimatebackend/proto-schema/tenant';
import { RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';

@CommandHandler(InviteMemberCommand)
export class InviteMemberHandler
  implements ICommandHandler<InviteMemberCommand> {
  logger = new Logger(this.constructor.name);

  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly eventBus: EventBus,
    private readonly roleService: RolesRpcClientService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(command: InviteMemberCommand): Promise<InviteMemberResponse> {
    this.logger.log(`'Async '${command.constructor.name}...`);
    const { input, user, tenantId } = command;

    try {
      if (input.email === null || typeof input.email !== 'string') {
        // Check to make sure input is not null
        throw new RpcException('Email input field missing'); // Throw an apollo input error
      }

      // Check if tenant exist with normalized name
      const tenantExist = await this.tenantRepository.findOne({
        normalizedName: tenantId,
        members: {
          $elemMatch: {
            $or: [
              {
                userId: new ObjectId(user.id),
              },
              {
                email: user.emails.reduce((pv) => pv.primary === true && pv)
                  .address,
              },
            ],
          },
        },
      });

      /** Throw a conflict exception id tenant does not exist */
      if (!tenantExist) {
        throw new RpcException('You are not part of this tenant');
      }

      /** Check if tenant exist with normalized name */
      const tenant = await this.tenantRepository.findOne({
        normalizedName: tenantId,
        members: {
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

      if (tenant) {
        throw new RpcException('Member already invited'); // Throw a conflict exception id tenant exist
      }

      const memberId = uuidv1();
      const member: TenantMemberEmbed & { token?: string } = {
        id: memberId,
        email: input.email,
        role: AppRole[input.role],
        status: InvitationStatus.PENDING,
        invitedBy: user.id,
        createdAt: DateTime.local().toBSON(),
        updatedAt: DateTime.local().toBSON(),
      };

      await this.tenantRepository.findOneAndUpdate({
        conditions: {
          normalizedName: tenantId,
        },
        updates: {
          $push: {
            members: Member,
          },
        },
      });

      await this.roleService.svc
        .addUserToRole({
          role: 'owner',
          domain: tenant.normalizedName,
          actor: 'user',
          userId: user.id.toString(),
        })
        .toPromise();

      member.invitedBy = {
        firstname: user.firstname,
        lastname: user.lastname,
        id: user.id,
      };

      const payload = {
        tenantId,
        memberId,
      };
      member.token = await this.jwtService.sign(payload);

      /** Publish event */
      await this.eventBus.publish(new MemberInvitedEvent(member));

      return {
        member: (member as unknown) as Member,
      };
    } catch (error) {
      this.logger.log(error);
      throw new RpcException(error);
    }
  }
}
