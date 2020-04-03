import { Injectable } from '@nestjs/common';
import { ConsulConfig, InjectConfig } from '@nestcloud/config';
import { StripeOptions, StripeOptionsFactory } from 'nestjs-stripe';

@Injectable()
export class StripeModuleConfigService implements StripeOptionsFactory{

  constructor(
    @InjectConfig() private readonly config: ConsulConfig,
  ) {}

  createStripeOptions(): Promise<StripeOptions> | StripeOptions {
    const stripeConstants = this.config.get<StripeOptions>('stripe');
    return {
      apiKey: stripeConstants.apiKey,
    };
  }
}
