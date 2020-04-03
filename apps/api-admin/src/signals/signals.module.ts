import { Module } from '@nestjs/common';
import { SignalsResolver } from './signals.resolver';

@Module({
  providers: [SignalsResolver]
})
export class SignalsModule {}
