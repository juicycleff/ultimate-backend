import { Module } from '@nestjs/common';
import { buildContext } from 'graphql-passport';
import { GraphqlDistributedModule } from 'nestjs-graphql-gateway';
import { StripeModule } from 'nestjs-stripe';
import { BaseModule, CoreModule, MongoHealthIndicator } from '@graphqlcqrs/core';
import { AppConfig } from '@graphqlcqrs/common/services/yaml.service';
import { TerminusModule } from '@nestjs/terminus';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlanModule } from './plan/plan.module';
import { Plan } from './types';
import { HealthOptionsService } from './health-options.service';
import { CardModule } from './card/card.module';
import { BillingModule } from './billing/billing.module';
import { InvoiceModule } from './invoice/invoice.module';
import { SubscriptionModule } from './subscription/subscription.module';

@Module({
  imports: [
    GraphqlDistributedModule.forRoot({
      autoSchemaFile: 'graphs/plan.gql',
      introspection: true,
      buildSchemaOptions: {
        orphanedTypes: [Plan],
      },
      playground: {
        workspaceName: 'GRAPHQL SERVICE PLAN',
        settings: {
          'editor.theme': 'light',
        },
      },
      context: ({ req, res }) => buildContext({ req, res }),
    }),
    CoreModule,
    StripeModule.forRoot({
      apiKey: AppConfig.payment?.stripe?.secretKey,
    }),
    TerminusModule.forRootAsync({
      imports: [AppModule],
      useClass: HealthOptionsService,
    }),
    BillingModule,
    PlanModule,
    CardModule,
    InvoiceModule,
    SubscriptionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    MongoHealthIndicator,
  ],
  exports: [MongoHealthIndicator],
})
export class AppModule extends BaseModule {}
