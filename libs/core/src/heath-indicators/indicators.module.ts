import { Module } from '@nestjs/common';
import { MongoHealthIndicator } from '@graphqlcqrs/core';

@Module({
  providers: [MongoHealthIndicator],
  exports: [MongoHealthIndicator],
})
export class IndicatorsModule {}
