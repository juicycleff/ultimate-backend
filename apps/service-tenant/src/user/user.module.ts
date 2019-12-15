import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';

@Module({
  providers: [UserResolver],
})
export class UserModule {}
