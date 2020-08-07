import {
  CACHE_MANAGER,
  CacheStore,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { InjectStripe } from 'nestjs-stripe';
import * as Stripe from 'stripe';
import {
  FindStripePlansRequest,
  FindStripePlansResponse,
  ReadStripePlanRequest,
  ReadStripePlanResponse,
  StripePlan,
} from '@ultimatebackend/proto-schema/billing';
import { RpcException } from '@nestjs/microservices';
import {
  planSliceToProtoStripePlanSlice,
  planToProtoStripePlan,
} from '../common';
import { PlanSeed } from './plan.seed';
import { reduceByPercent } from '@ultimatebackend/common';
import { PlanRepository } from '@ultimatebackend/repository';

@Injectable()
export class PlansService implements OnModuleInit {
  logger = new Logger(this.constructor.name);

  public constructor(
    @InjectStripe() private readonly stripeClient: Stripe,
    @Inject(CACHE_MANAGER) private readonly cacheStore: CacheStore,
    private readonly planRepository: PlanRepository,
  ) {}

  async readStripePlan(
    query: ReadStripePlanRequest,
  ): Promise<ReadStripePlanResponse> {
    const { id } = query;

    if (!id) {
      throw new RpcException('Missing plan id input');
    }

    try {
      // Check cache to see if data exist
      const cacheKey = 'service-billing/stripe-plan/';
      const cacheData = await this.cacheStore.get<StripePlan>(cacheKey + id);
      if (cacheData !== undefined && typeof cacheData !== 'undefined') {
        return {
          plan: cacheData,
        };
      }

      const plans = await this.stripeClient.plans.retrieve(id);
      const result = planToProtoStripePlan(plans);

      await this.cacheStore.set(cacheKey + id, result, { ttl: 500000 });
      return {
        plan: result,
      };
    } catch (e) {
      this.logger.error(e);
      throw new RpcException(e);
    }
  }

  async listStripePlan(
    request: FindStripePlansRequest,
  ): Promise<FindStripePlansResponse> {
    const { productId } = request;

    if (!productId) {
      throw new RpcException('Missing plan id input');
    }

    try {
      // Check cache to see if data exist
      const cacheKey = 'service-billing/stripe-plan/' + productId;
      const cacheData = await this.cacheStore.get<StripePlan[]>(cacheKey);
      if (cacheData !== undefined && typeof cacheData !== 'undefined') {
        return {
          plans: cacheData,
        };
      }

      const plans = await this.stripeClient.plans.list({
        product: productId,
        active: true,
      });
      const result = planSliceToProtoStripePlanSlice(plans.data);

      await this.cacheStore.set(cacheKey, result, { ttl: 500000 });
      return {
        plans: result,
      };
    } catch (e) {
      this.logger.error(e);
      throw new RpcException(e);
    }
  }

  async seedStripePlan() {
    const seeds = new PlanSeed();
    for (const plan of seeds.getSeedData) {
      try {
        const id = 'product-' + plan.normalizedName;
        // let product = await this.stripeClient.products.retrieve(id);
        // if (product) {
        // continue;
        // }
        const product = await this.stripeClient.products.create({
          active: true,
          description: plan.name,
          name: plan.name,
          id,
        });

        if (plan.price.amount > 0) {
          // Annual plan
          let amount = reduceByPercent(plan.price.amount * 12, 0.6);
          let planId = 'plan-annually-' + plan.normalizedName;
          const trialPeriodDays = 7;
          let nickname = 'Annual Plan';
          const usageType = 'licensed';

          await this.stripeClient.plans.create({
            active: true,
            amount_decimal: amount,
            currency: plan.price.currency,
            id: planId,
            interval: 'year',
            nickname,
            product: product.id,
            trial_period_days: trialPeriodDays,
            usage_type: usageType,
          });

          // Month plan
          amount = plan.price.amount;
          planId = 'plan-monthly-' + plan.normalizedName;
          nickname = 'Monthly Plan';

          await this.stripeClient.plans.create({
            active: true,
            amount_decimal: amount,
            currency: plan.price.currency,
            id: planId,
            interval: 'month',
            nickname,
            product: product.id,
            usage_type: usageType,
          });
        } else {
          const amount = plan.price.amount;
          const planId = 'plan-free-' + plan.normalizedName;
          const nickname = 'Free Plan';
          const usageType = 'licensed';

          await this.stripeClient.plans.create({
            active: true,
            amount_decimal: amount,
            currency: plan.price.currency,
            id: planId,
            interval: 'month',
            nickname,
            product: product.id,
            usage_type: usageType,
          });
        }
      } catch (e) {
        this.logger.error(e);
      }
    }
  }

  async seedDatabasePlan() {
    const hasPlan = await this.planRepository.find({
      limit: 4,
      conditions: {},
    });
    if (hasPlan && hasPlan.length > 0) {
      return;
    }

    const seeds = new PlanSeed();

    await this.seedStripePlan();
    for (const plan of seeds.getSeedData) {
      try {
        const id = 'product-' + plan.normalizedName;
        const product = await this.planRepository.findOne({
          normalizedName: id,
        });
        if (product) {
          continue;
        }

        // @ts-ignore
        await this.planRepository.create({ ...plan, normalizedName: id });
      } catch (e) {
        this.logger.error(e);
      }
    }
  }

  onModuleInit(): any {
    this.seedDatabasePlan();
  }
}
