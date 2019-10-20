import {
  DynamicModule,
  Inject,
  Module,
  OnModuleDestroy,
} from '@nestjs/common';
import { NestMultiTenantService } from './nest-multi-tenant.service';
import { MultiTenantModuleOptions } from '@juicycleff/nest-multi-tenant/interfaces/multi-tenant-module.options';
import { ModuleRef } from '@nestjs/core';

@Module({
  providers: [NestMultiTenantService],
  exports: [NestMultiTenantService],
})
export class NestMultiTenantModule {
  public static forRootAsync(options: MultiTenantModuleOptions): DynamicModule {
    const { config } = options;

    return {
      exports: [...exports],
      module: NestMultiTenantModule,
    };
  }
}
