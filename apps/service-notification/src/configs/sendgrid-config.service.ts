import { Injectable } from '@nestjs/common';
import { InjectConfig, ConsulConfig } from '@nestcloud/config';
import { SendGridModuleOptions } from '@anchan828/nest-sendgrid';
import { SendGridModuleOptionsFactory } from '@anchan828/nest-sendgrid/dist/sendgrid.interfaces';

@Injectable()
export class SendgridConfigService implements SendGridModuleOptionsFactory {
  constructor(
    @InjectConfig() private readonly config: ConsulConfig,
  ) {}

  createSendGridModuleOptions(): Promise<SendGridModuleOptions> | SendGridModuleOptions {
    const sendgrid = this.config.get<{apiKey: string, sender: string}>('sendgrid');
    return {
      apikey: sendgrid.apiKey,
      defaultMailData: {
        from: sendgrid.sender,
        trackingSettings: {
          clickTracking: {
            enable: true,
            enableText: true,
          },
          openTracking: {
            enable: true,
          },
        },
      },
    };
  }
}
