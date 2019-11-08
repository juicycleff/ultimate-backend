import { Module } from '@nestjs/common';
import { AuthPayloadResolver } from './auth-payload.resolver';
import { UserModule } from '../user/user.module';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule, UserModule],
  providers: [AuthPayloadResolver],
})
export class AuthPayloadModule {}
