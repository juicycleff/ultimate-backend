import { Module } from '@nestjs/common';
import { AuthPayloadResolver } from './auth-payload.resolver';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule],
  providers: [AuthPayloadResolver],
})
export class AuthPayloadModule {}
