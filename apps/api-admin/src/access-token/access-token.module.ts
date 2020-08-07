import { Module } from '@nestjs/common';
import { AccessTokenResolver } from './access-token.resolver';
import { AccessTokenMutationResolver } from './access-token-mutation.resolver';

@Module({
  providers: [AccessTokenResolver, AccessTokenMutationResolver],
})
export class AccessTokenModule {}
