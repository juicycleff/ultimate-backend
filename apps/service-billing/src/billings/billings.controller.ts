import { Controller } from '@nestjs/common';
import {
  BillingService,
  CancelSubscriptionRequest,
  CancelSubscriptionResponse,
  ChangeSubscriptionRequest,
  ChangeSubscriptionResponse,
  CreateCardRequest,
  CreateCardResponse,
  CreateCustomerRequest,
  CreateCustomerResponse,
  CreatePlanRequest,
  CreatePlanResponse,
  CreateSubscriptionRequest,
  CreateSubscriptionResponse,
  DeleteCardRequest,
  DeleteCardResponse,
  DeleteCustomerRequest,
  DeleteCustomerResponse,
  FindCardsRequest,
  FindCardsResponse,
  FindInvoicesRequest,
  FindInvoicesResponse,
  FindPlansRequest,
  FindPlansResponse,
  FindStripePlansRequest,
  FindStripePlansResponse,
  FindSubscriptionsRequest,
  FindSubscriptionsResponse,
  ReadCardRequest,
  ReadCardResponse,
  ReadCustomerRequest,
  ReadCustomerResponse,
  ReadInvoiceRequest,
  ReadInvoiceResponse,
  ReadPlanRequest,
  ReadPlanResponse,
  ReadStripePlanRequest,
  ReadStripePlanResponse,
  ReadSubscriptionRequest,
  ReadSubscriptionResponse,
  SetDefaultCardRequest,
  SetDefaultCardResponse,
} from '@ultimatebackend/proto-schema/billing';
import { GrpcMethod } from '@nestjs/microservices';
import { CardsService } from '../cards/cards.service';
import { getIdentityFromCtx } from '@ultimatebackend/core';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateStripeCustomerCommand } from './cqrs/command/impl/customer';
import {
  CancelSubscriptionCommand,
  ChangeSubscriptionCommand,
  CreateSubscriptionCommand,
} from './cqrs/command/impl/subscription';
import { GetPlanQuery, GetPlansQuery } from './cqrs/query/impl/plan';
import { PlansService } from '../plans/plans.service';
import { GetInvoicesQuery } from './cqrs/query/impl/invoice';
import {
  GetSubscriptionQuery,
  GetSubscriptionsQuery,
} from './cqrs/query/impl/subscription';

@Controller('billings')
export class BillingsController implements BillingService<any> {
  constructor(
    private readonly cardsService: CardsService,
    private readonly plansService: PlansService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @GrpcMethod('BillingService')
  async cancelSubscription(
    request: CancelSubscriptionRequest,
    ctx: any,
  ): Promise<CancelSubscriptionResponse> {
    return await this.commandBus.execute(
      new CancelSubscriptionCommand(request),
    );
  }

  @GrpcMethod('BillingService')
  async changeSubscription(
    request: ChangeSubscriptionRequest,
    ctx: any,
  ): Promise<ChangeSubscriptionResponse> {
    return await this.commandBus.execute(
      new ChangeSubscriptionCommand(request),
    );
  }

  @GrpcMethod('BillingService')
  async createCard(
    request: CreateCardRequest,
    ctx: any,
  ): Promise<CreateCardResponse> {
    const { user } = getIdentityFromCtx(ctx);
    return await this.cardsService.create(request, user?.settings?.stripeId);
  }

  @GrpcMethod('BillingService')
  async createCustomer(
    request: CreateCustomerRequest,
    ctx: any,
  ): Promise<CreateCustomerResponse> {
    return await this.commandBus.execute(
      new CreateStripeCustomerCommand(request),
    );
  }

  @GrpcMethod('BillingService')
  createPlan(
    request: CreatePlanRequest,
    ctx: any,
  ): Promise<CreatePlanResponse> {
    return undefined;
  }

  @GrpcMethod('BillingService')
  async createSubscription(
    request: CreateSubscriptionRequest,
    ctx: any,
  ): Promise<CreateSubscriptionResponse> {
    return await this.commandBus.execute(
      new CreateSubscriptionCommand(request),
    );
  }

  @GrpcMethod('BillingService')
  async deleteCard(
    request: DeleteCardRequest,
    ctx: any,
  ): Promise<DeleteCardResponse> {
    const { user } = getIdentityFromCtx(ctx);
    return await this.cardsService.delete(request, user?.settings?.stripeId);
  }

  @GrpcMethod('BillingService')
  deleteCustomer(
    request: DeleteCustomerRequest,
    ctx: any,
  ): Promise<DeleteCustomerResponse> {
    return undefined;
  }

  @GrpcMethod('BillingService')
  async findCards(
    request: FindCardsRequest,
    ctx: any,
  ): Promise<FindCardsResponse> {
    const { user } = getIdentityFromCtx(ctx);
    return await this.cardsService.list(request, user?.settings?.stripeId);
  }

  @GrpcMethod('BillingService')
  async findInvoices(
    request: FindInvoicesRequest,
    ctx: any,
  ): Promise<FindInvoicesResponse> {
    const { user } = getIdentityFromCtx(ctx);
    return await this.queryBus.execute(
      new GetInvoicesQuery(request, user?.settings?.stripeId),
    );
  }

  @GrpcMethod('BillingService')
  async findPlans(
    request: FindPlansRequest,
    ctx: any,
  ): Promise<FindPlansResponse> {
    return await this.queryBus.execute(new GetPlansQuery(request));
  }

  @GrpcMethod('BillingService')
  async findStripePlans(
    request: FindStripePlansRequest,
    ctx: any,
  ): Promise<FindStripePlansResponse> {
    return await this.plansService.listStripePlan(request);
  }

  @GrpcMethod('BillingService')
  async findSubscriptions(
    request: FindSubscriptionsRequest,
    ctx: any,
  ): Promise<FindSubscriptionsResponse> {
    const { user, tenant } = getIdentityFromCtx(ctx);
    return await this.queryBus.execute(
      new GetSubscriptionsQuery(request, {
        customerId: user?.settings?.stripeId,
        tenantId: request?.tenantId ?? tenant?.id.toString(),
      }),
    );
  }

  @GrpcMethod('BillingService')
  async readCard(
    request: ReadCardRequest,
    ctx: any,
  ): Promise<ReadCardResponse> {
    const { user } = getIdentityFromCtx(ctx);
    return await this.cardsService.read(request, user?.settings?.stripeId);
  }

  @GrpcMethod('BillingService')
  readCustomer(
    request: ReadCustomerRequest,
    ctx: any,
  ): Promise<ReadCustomerResponse> {
    return undefined;
  }

  @GrpcMethod('BillingService')
  async readInvoice(
    request: ReadInvoiceRequest,
    ctx: any,
  ): Promise<ReadInvoiceResponse> {
    const { user } = getIdentityFromCtx(ctx);
    return await this.queryBus.execute(
      new GetInvoicesQuery(request, user?.settings?.stripeId),
    );
  }

  @GrpcMethod('BillingService')
  async readPlan(
    request: ReadPlanRequest,
    ctx: any,
  ): Promise<ReadPlanResponse> {
    return await this.queryBus.execute(new GetPlanQuery(request));
  }

  @GrpcMethod('BillingService')
  async readStripePlan(
    request: ReadStripePlanRequest,
    ctx: any,
  ): Promise<ReadStripePlanResponse> {
    return await this.plansService.readStripePlan(request);
  }

  @GrpcMethod('BillingService')
  async readSubscription(
    request: ReadSubscriptionRequest,
    ctx: any,
  ): Promise<ReadSubscriptionResponse> {
    return await this.queryBus.execute(new GetSubscriptionQuery(request));
  }

  @GrpcMethod('BillingService')
  async setDefaultCard(
    request: SetDefaultCardRequest,
    ctx: any,
  ): Promise<SetDefaultCardResponse> {
    const { user } = getIdentityFromCtx(ctx);
    return await this.cardsService.setDefaultCard(
      request,
      user?.settings?.stripeId,
    );
  }
}
