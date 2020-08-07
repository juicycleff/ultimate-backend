import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { CookieSerializer } from '@ultimatebackend/common';
import {
  CoreModule,
  RolesRpcClientService,
  ServiceRegistryModule,
} from '@ultimatebackend/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RolesModule } from './roles/roles.module';
import { AccountsModule } from './accounts/accounts.module';
import { TenantsModule } from './tenants/tenants.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { BillingsModule } from './billings/billings.module';
import { CardsModule } from './cards/cards.module';
import { PlansModule } from './plans/plans.module';
import { NotificationsModule } from './notifications/notifications.module';
import { UsersModule } from './users/users.module';
import { TenantMembersModule } from './tenant-members/tenant-members.module';
import { GqlConfigService } from './gql-config.service';
import { AccessTokenModule } from './access-token/access-token.module';
import { GlobalClientModule } from './common/global-client.module';
import { SeedModule } from './seed.module';

@Module({
  imports: [
    SeedModule,
    ServiceRegistryModule,
    GraphQLModule.forRootAsync({
      useClass: GqlConfigService,
    }),
    GlobalClientModule,
    CoreModule,
    RolesModule,
    AccountsModule,
    TenantsModule,
    WebhooksModule,
    BillingsModule,
    CardsModule,
    PlansModule,
    NotificationsModule,
    UsersModule,
    TenantMembersModule,
    AccessTokenModule,
  ],
  controllers: [AppController],
  providers: [AppService, CookieSerializer, RolesRpcClientService],
})
export class AppModule {}
