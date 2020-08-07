import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RolesModule } from './roles/roles.module';
import { NestCasbinModule } from 'nestjs-casbin';
import { CasbinUserConfigService } from './casbin-config';
import { CoreModule, ServiceRegistryModule } from '@ultimatebackend/core';
import { AdapterProviderModule } from './adapter.provider';

@Module({
  imports: [
    ServiceRegistryModule,
    CoreModule,
    NestCasbinModule.registerAsync({
      imports: [AdapterProviderModule],
      useClass: CasbinUserConfigService,
    }),
    RolesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
