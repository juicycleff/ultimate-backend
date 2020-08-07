import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import {
  TenantMemberEmbed,
  TenantRepository,
} from '@ultimatebackend/repository';
import {
  BillingsRpcClientService,
  RolesRpcClientService,
  TenantCreatedEvent,
} from '@ultimatebackend/core';
import * as slugify from '@sindresorhus/slugify';
import { ObjectID } from 'mongodb';
import { DateTime } from 'luxon';
import { CreateTenantCommand } from '../../impl';
import { AppRole, InvitationStatus } from '@ultimatebackend/contracts';
import { RpcException } from '@nestjs/microservices';
import {
  CreateTenantResponse,
  Tenant,
} from '@ultimatebackend/proto-schema/tenant';

/**
 * @class
 */
@CommandHandler(CreateTenantCommand)
export class CreateTenantHandler
  implements ICommandHandler<CreateTenantCommand> {
  logger = new Logger(this.constructor.name);

  /**
   * @constructor
   * @param tenantRepository {TenantRepository}
   * @param eventBus {EventBus}
   * @param billingService {BillingsRpcClientService}
   * @param roleService {RolesRpcClientService}
   */
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly eventBus: EventBus,
    private readonly billingService: BillingsRpcClientService,
    private readonly roleService: RolesRpcClientService,
  ) {}

  async execute(command: CreateTenantCommand): Promise<CreateTenantResponse> {
    this.logger.log(`'Async '${command.constructor.name}...`);
    const { input, user } = command;

    try {
      /*  Check to make sure logged in user is not null */
      if (!user || user.id === null) {
        throw new RpcException('User not logged in');
      }

      /*  Check to make sure input is null and throw an apollo input error */
      if (input.name === null || typeof input.name !== 'string') {
        throw new RpcException('Tenant name is missing');
      }

      /*  Generate a unique slug for tenant */
      /*  Validate if normalize name is a string */
      /*  Throw an apollo input error */
      const normalizedName = slugify(input.name.toLowerCase());
      if (!normalizedName || typeof normalizedName !== 'string') {
        throw new RpcException('Tenant name is missing');
      }

      /*  Check if tenant exist with normalized name */
      const tenantExist = await this.tenantRepository.exist({ normalizedName });
      if (tenantExist) {
        throw new RpcException('Tenant name is unavailable, try another name');
      }

      /*  Check if tenant exist with normalized name */
      const tenantWithFreePlanExist = await this.tenantRepository.exist({
        'billing.currentPlan': 'plan-free-basic',
        members: {
          $elemMatch: {
            userId: new ObjectID(user.id.toString()),
          },
        },
      });

      if (tenantWithFreePlanExist && input.planId === 'plan-free-basic') {
        throw new RpcException(
          'You can only have one free tenant, please upgrade your plan',
        );
      }

      /*  Initialize tenant owner */
      const tenantMember: TenantMemberEmbed = {
        id: new ObjectID(),
        userId: new ObjectID(user.id),
        email: user.emails.reduce(
          (previousValue) => previousValue.primary === true && previousValue,
        ).address,
        role: AppRole.OWNER,
        status: InvitationStatus.ACCEPTED,
        invitedBy: null,
        createdAt: DateTime.local().toBSON(),
        updatedAt: DateTime.local().toBSON(),
      };

      /** Subscribe the tenant but name */
      const subsRes = await this.billingService.svc
        .createSubscription({
          planId: input.planId,
          tenantId: normalizedName,
          customerId: user.settings.stripeId,
          couponId: input.couponId,
          cardId: input.cardId,
        })
        .toPromise();

      /*  Create our new tenant */
      const tenant = await this.tenantRepository.create({
        name: input.name,
        normalizedName,
        createdBy: new ObjectID(user.id),
        members: [tenantMember],
        billing: {
          currentPlan: input.planId,
          currentSubscription: subsRes.subscription.id,
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

      /*  Publish to the event store of our newly created tenant */
      await this.eventBus.publish(new TenantCreatedEvent(tenant));
      return {
        tenant: (tenant as unknown) as Tenant,
      };
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }
}
