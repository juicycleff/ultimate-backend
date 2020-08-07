import { Injectable } from '@nestjs/common';
import { InjectConfig, ConfigValue } from '@nestcloud/config';
import { EtcdConfig } from '@nestcloud/config/etcd-config';
import { StripeOptions, StripeOptionsFactory } from 'nestjs-stripe';
import { Boot, InjectBoot } from '@nestcloud/boot';

@Injectable()
export class StripeModuleConfigService implements StripeOptionsFactory {
  @ConfigValue('stripe', { api: 'ffdfd' })
  private readonly dummy;

  constructor(
    @InjectConfig() private readonly config: EtcdConfig,
    @InjectBoot() private readonly boot: Boot,
  ) {}

  createStripeOptions(): Promise<StripeOptions> | StripeOptions {
    const stripeConstants = this.config.get<StripeOptions>('stripe');

    return {
      apiKey: stripeConstants?.apiKey,
    };
  }
}
