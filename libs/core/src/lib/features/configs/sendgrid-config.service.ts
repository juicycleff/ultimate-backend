import { Injectable } from '@nestjs/common';
import { InjectConfig } from '@nestcloud/config';
import { KubernetesConfig } from '@nestcloud/config/config.kubernetes';
import {
  SendGridModuleOptions,
  SendGridModuleOptionsFactory,
} from '@anchan828/nest-sendgrid/dist/sendgrid.interfaces';

@Injectable()
export class SendgridConfigService implements SendGridModuleOptionsFactory {
  constructor(@InjectConfig() private readonly config: KubernetesConfig) {}

  createSendGridModuleOptions():
    | Promise<SendGridModuleOptions>
    | SendGridModuleOptions {
    const sendgrid = this.config.get<SendGridModuleOptions>('app.sendgrid');

    return {
      apikey: sendgrid.apikey,
    };
  }
}
