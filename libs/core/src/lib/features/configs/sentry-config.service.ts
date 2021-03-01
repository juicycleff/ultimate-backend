import { Injectable } from '@nestjs/common';
import { InjectConfig } from '@nestcloud/config';
import { KubernetesConfig } from '@nestcloud/config/config.kubernetes';
import {
  SentryModuleOptions,
  SentryOptionsFactory,
} from '@ntegral/nestjs-sentry';
import { LogLevel } from '@sentry/types';

@Injectable()
export class SentryConfigService implements SentryOptionsFactory {
  constructor(@InjectConfig() private readonly config: KubernetesConfig) {}

  createSentryModuleOptions():
    | Promise<SentryModuleOptions>
    | SentryModuleOptions {
    const sentry = this.config.get<SentryModuleOptions>('app.sentry');
    return {
      ...sentry,
      logLevel: LogLevel.Verbose,
      debug: true,
    };
  }
}
