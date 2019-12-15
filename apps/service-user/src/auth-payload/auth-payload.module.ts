import { Module } from '@nestjs/common';
import { AuthPayloadResolver } from './auth-payload.resolver';

@Module({
  providers: [AuthPayloadResolver],
})
export class AuthPayloadModule {}
