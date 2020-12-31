import { DynamicModule, Global, Module } from '@nestjs/common';
import { SwineServiceAsyncOptions, SwineServiceOptions } from './interfaces';
import { SwineServiceCoreModule } from './swine-service-core.module';

@Global()
@Module({
  controllers: [],
  providers: [],
  exports: [],
})
export class SwineServiceModule {
  static forRoot(option: SwineServiceOptions): DynamicModule {
    return {
      module: SwineServiceModule,
      imports: [SwineServiceCoreModule.forRoot(option)],
    };
  }

  static forRootAsync(options: SwineServiceAsyncOptions): DynamicModule {
    return {
      module: SwineServiceModule,
      imports: [SwineServiceCoreModule.forRootAsync(options)],
    };
  }
}
