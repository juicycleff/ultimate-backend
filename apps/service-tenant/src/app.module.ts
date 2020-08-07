import { Module } from '@nestjs/common';
import { MongoModule } from '@juicycleff/repo-orm';
import {
  CoreModule,
  MongoConfigService,
  ServiceRegistryModule,
} from '@ultimatebackend/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TenantsModule } from './tenants/tenants.module';
import { MembersModule } from './members/members.module';

@Module({
  imports: [
    ServiceRegistryModule,
    CoreModule,
    MongoModule.registerAsync({
      useClass: MongoConfigService,
    }),
    TenantsModule,
    MembersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
