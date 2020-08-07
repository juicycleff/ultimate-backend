import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  CoreModule,
  MongoConfigService,
  ServiceRegistryModule,
} from '@ultimatebackend/core';
import { NestCasbinModule } from 'nestjs-casbin';
import { AccessTokenModule } from './access-token/access-token.module';
import { MongoModule } from '@juicycleff/repo-orm';
import { CasbinUserConfigService } from './casbin-config';
import { AdapterProviderModule } from './adapter.provider';

@Module({
  imports: [
    ServiceRegistryModule,
    CoreModule,
    MongoModule.registerAsync({
      useClass: MongoConfigService,
    }),
    NestCasbinModule.registerAsync({
      imports: [AdapterProviderModule],
      useClass: CasbinUserConfigService,
    }),
    AccessTokenModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
