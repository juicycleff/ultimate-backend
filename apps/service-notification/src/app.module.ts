import { Module } from '@nestjs/common';
import { SendGridModule } from '@anchan828/nest-sendgrid';
import { CoreModule, ServiceRegistryModule } from '@ultimatebackend/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailModule } from './email/email.module';
import { SendgridConfigService } from './configs/sendgrid-config.service';

@Module({
  imports: [
    ServiceRegistryModule,
    CoreModule,
    SendGridModule.forRootAsync({
      useClass: SendgridConfigService,
    }),
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
