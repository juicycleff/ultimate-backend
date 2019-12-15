import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { planSeedData } from '../seed/plan';
import { InjectStripe } from 'nestjs-stripe';
import * as Stripe from 'stripe';
import { reduceByPercent } from '@graphqlcqrs/common';

@Injectable()
export class PlanSeed implements OnModuleInit {
  public constructor(@InjectStripe() private readonly stripeClient: Stripe) {}

  onModuleInit(): any {
    this.populatePlan();
  }

  async populatePlan() {
    for (const p of planSeedData) {
      const metadata: Stripe.IOptionsMetadata = {};
      p.features.forEach(value => {
        metadata[value.name] =  value.description;
      });

      try {

        if (await this.stripeClient.products.retrieve(`product-${p.normalizedName}`)) {
          continue;
        }

        const product = await this.stripeClient.products.create({
          description: p.name,
          id: `product-${p.normalizedName}`,
          type: 'service',
          name: p.name,
          metadata,
        });

        if (p.currentPrice.price !== 0) {
          await this.stripeClient.plans.create({
            product: product.id,
            id: `plan-monthly-${p.normalizedName}`,
            currency: p.currentPrice.currency,
            nickname: 'Monthly Plan',
            amount: p.currentPrice.price,
            trial_period_days: 7,
            interval: 'month',
            usage_type: 'licensed',
          });

          await this.stripeClient.plans.create({
            product: product.id,
            currency: p.currentPrice.currency,
            nickname: 'Quarterly Plan',
            id: `plan-quarterly-${p.normalizedName}`,
            amount: reduceByPercent(p.currentPrice.price * 3, 0.3),
            trial_period_days: 30,
            interval: 'month',
            interval_count: 3,
            usage_type: 'licensed',
          });

          await this.stripeClient.plans.create({
            product: product.id,
            currency: p.currentPrice.currency,
            id: `plan-annually-${p.normalizedName}`,
            nickname: 'Annual Plan',
            amount: reduceByPercent(p.currentPrice.price * 12, 0.6),
            trial_period_days: 30,
            interval: 'year',
            usage_type: 'licensed',
          });
        }
      } catch (e) {
        Logger.error(e, this.constructor.name);
      }
    }
  }
}
