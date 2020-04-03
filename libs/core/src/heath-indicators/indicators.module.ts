import { Module } from '@nestjs/common';
import { MongoHealthIndicator } from '../';

@Module({
  providers: [MongoHealthIndicator],
  exports: [MongoHealthIndicator],
})
export class IndicatorsModule {}
