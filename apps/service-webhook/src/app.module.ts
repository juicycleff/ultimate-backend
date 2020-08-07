import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  CoreModule,
  MongoConfigService,
  ServiceRegistryModule,
} from '@ultimatebackend/core';
import { MongoModule } from '@juicycleff/repo-orm';
import { WebhookModule } from './webhook/webhook.module';

@Module({
  imports: [
    ServiceRegistryModule,
    CoreModule,
    MongoModule.registerAsync({
      useClass: MongoConfigService,
    }),
    WebhookModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
