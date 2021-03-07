import { DynamicModule, Module } from '@nestjs/common';
import { LoadbalanceService } from './loadbalance.service';

@Module({})
export class LoadbalancerModule {

  static forRoot(): DynamicModule {
    return {
      module: LoadbalancerModule,
      providers: [LoadbalanceService]
    }
  }

  static forRootAsync(): DynamicModule {
    return {
      module: LoadbalancerModule,
    }
  }
}
