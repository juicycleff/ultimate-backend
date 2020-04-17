import { Module } from '@nestjs/common';
import { BootModule } from '@nestcloud/boot';
import { ConsulModule } from '@nestcloud/consul';
import { NEST_BOOT, NEST_CONSUL } from '@nestcloud/common';
import { ConfigModule } from '@nestcloud/config';
import { ServiceModule } from '@nestcloud/service';
import { LoadbalanceModule } from '@nestcloud/loadbalance';
import { GraphQLModule } from '@nestjs/graphql';
import { CookieSerializer } from '@ultimatebackend/common';
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
import { CoreModule, RolesRpcClientService } from '@ultimatebackend/core';
import { TenantMembersModule } from './tenant-members/tenant-members.module';
import { GqlConfigService } from './gql-config.service';
import { AccessTokenModule } from './access-token/access-token.module';
import { GlobalClientModule } from './common/global-client.module';

@Module({
  imports: [
    BootModule.register(__dirname, `bootstrap.yaml`),
    ConsulModule.register({ dependencies: [NEST_BOOT] }),
    ConfigModule.register({dependencies: [NEST_BOOT, NEST_CONSUL]}),
    ServiceModule.register({ dependencies: [NEST_BOOT, NEST_CONSUL] }),
    LoadbalanceModule.register({ dependencies: [NEST_BOOT] }),
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
