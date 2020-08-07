import { Module } from '@nestjs/common';
import { MongoModule } from '@juicycleff/repo-orm';
import {
  CoreModule,
  MongoConfigService,
  ServiceRegistryModule,
} from '@ultimatebackend/core';
import { StripeModule } from 'nestjs-stripe';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CardsModule } from './cards/cards.module';
import { CommonModule } from './common/common.module';
import { StripeModuleConfigService } from './common';
import { BillingsModule } from './billings/billings.module';
import { PlansModule } from './plans/plans.module';

@Module({
  imports: [
    ServiceRegistryModule,
    CommonModule,
    CoreModule,
    MongoModule.registerAsync({
      useClass: MongoConfigService,
    }),
    StripeModule.forRootAsync({
      useClass: StripeModuleConfigService,
    }),
    CardsModule,
    BillingsModule,
    PlansModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
