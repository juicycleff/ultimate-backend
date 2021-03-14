import { DynamicModule, Global, Module } from '@nestjs/common';
import { CloudModuleAsyncOptions, CloudModuleOptions } from './interfaces';
import { CloudCoreModule } from './cloud-core.module';

@Global()
@Module({})
export class CloudModule {
  static forRoot(option: CloudModuleOptions): DynamicModule {
    return {
      module: CloudModule,
      imports: [CloudCoreModule.forRoot(option)],
    };
  }

  static forRootAsync(options: CloudModuleAsyncOptions): DynamicModule {
    return {
      module: CloudModule,
      imports: [CloudCoreModule.forRootAsync(options)],
    };
  }
}
