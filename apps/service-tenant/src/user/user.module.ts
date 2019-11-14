import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserResolver } from './user.resolver';

@Module({
  imports: [CqrsModule],
  providers: [UserResolver],
})
export class UserModule {}
