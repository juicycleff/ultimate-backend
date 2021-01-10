import { DynamicModule, Global, Module } from '@nestjs/common';
import { UBCloudAsyncOptions, UBCloudOptions } from './interfaces';
import { UBCloudCoreModule } from './ub-cloud-core.module';

@Global()
@Module({
  controllers: [],
  providers: [],
  exports: [],
})
export class UbCloudModule {
  static forRoot(option: UBCloudOptions): DynamicModule {
    return {
      module: UbCloudModule,
      imports: [UBCloudCoreModule.forRoot(option)],
    };
  }

  static forRootAsync(options: UBCloudAsyncOptions): DynamicModule {
    return {
      module: UbCloudModule,
      imports: [UBCloudCoreModule.forRootAsync(options)],
    };
  }
}
