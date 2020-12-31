import { DynamicModule, Module } from '@nestjs/common';
import { SwineServiceAsyncOptions, SwineServiceOptions } from './interfaces';

@Module({
  controllers: [],
  providers: [],
  exports: [],
})
export class SwineServiceCoreModule {
  static forRoot(options: SwineServiceOptions): DynamicModule {
    return null;
  }

  static forRootAsync(options: SwineServiceAsyncOptions): DynamicModule {
    return null;
  }
}
