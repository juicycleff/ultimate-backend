import { CacheModule, Module } from '@nestjs/common';
import { AuthRepository } from '@graphqlcqrs/repository/repositories/auth.repository';

@Module({
  imports: [CacheModule.register()],
  providers: [AuthRepository],
  exports: [AuthRepository],
})
export class RepositoryModule {}
