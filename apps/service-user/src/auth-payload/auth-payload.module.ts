import { Module } from '@nestjs/common';
import { AuthPayloadResolver } from './auth-payload.resolver';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [AuthPayloadResolver],
})
export class AuthPayloadModule {}
