import {
  DynamicModule,
  Module,
} from '@nestjs/common';
import { NestMultiTenantService } from './nest-multi-tenant.service';
import { MultiTenantModuleOptions } from '@juicycleff/nest-multi-tenant/interfaces/multi-tenant-module.options';

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
